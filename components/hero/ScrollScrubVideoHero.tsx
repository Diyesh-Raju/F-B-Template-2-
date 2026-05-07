"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

type ScrollScrubVideoHeroProps = {
  src: string;
  /** How much scroll space to allocate for the scrub (in vh). */
  scrollDistanceVh?: number;
  /** Extra poster-like overlay tint to keep text readable. */
  overlayClassName?: string;
  children?: React.ReactNode;
};

export function ScrollScrubVideoHero({
  src,
  scrollDistanceVh = 240,
  overlayClassName = "bg-[color:var(--bg)] opacity-45",
  children,
}: ScrollScrubVideoHeroProps) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [duration, setDuration] = useState(0);
  const durationSafe = Math.max(0.001, duration);

  // Balance: visible scrub + still smooth (too low feels like "no animation").
  // If the OS requests reduced motion, we still scrub (user intent: scroll-driven),
  // but remove smoothing so it tracks scroll directly.
  const eased = useMemo(
    () => (reduce ? { lerp: 1, minStep: 0 } : { lerp: 0.11, minStep: 1 / 900 }),
    [reduce]
  );

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let mounted = true;
    let rafId = 0;
    let currentTime = 0;
    let targetTime = 0;
    const scrubFactor = 0.65; // < 1 = slower video per same scroll distance

    const updateTargetFromScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // Progress from when the section top hits the viewport top (0)
      // until the bottom reaches the bottom of the viewport (1).
      const maxTravel = Math.max(1, rect.height - vh);
      const traveled = clamp01((-rect.top) / maxTravel);
      targetTime = traveled * durationSafe * scrubFactor;
    };

    const tick = () => {
      if (!mounted) return;

      updateTargetFromScroll();

      // Smooth the scrub itself so it feels silky even on high-res wheels.
      const diff = targetTime - currentTime;
      currentTime += diff * eased.lerp;

      // Avoid thrashing the media pipeline for micro diffs.
      if (Math.abs(diff) > eased.minStep) {
        const next = Math.min(durationSafe, Math.max(0, currentTime));
        if (Number.isFinite(next)) video.currentTime = next;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    // Ensure we scrub instead of playing.
    video.pause();

    // Start at a tiny offset so Safari paints a frame reliably.
    try {
      video.currentTime = 0.0001;
    } catch {
      // ignore
    }

    rafId = window.requestAnimationFrame(tick);
    window.addEventListener("resize", updateTargetFromScroll, { passive: true });

    return () => {
      mounted = false;
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateTargetFromScroll);
    };
  }, [durationSafe, reduce, eased.lerp, eased.minStep]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${scrollDistanceVh}vh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[color:var(--bg)]">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={src}
          muted
          playsInline
          preload="auto"
          // eslint-disable-next-line jsx-a11y/media-has-caption
          onLoadedMetadata={(e) => {
            const d = e.currentTarget.duration;
            if (Number.isFinite(d) && d > 0) setDuration(d);
          }}
        />

        {/* Readability overlay + subtle film grain vibe */}
        <div className={`pointer-events-none absolute inset-0 ${overlayClassName}`} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(255,179,71,0.55), transparent 55%), radial-gradient(circle at 70% 30%, rgba(197,255,211,0.30), transparent 60%)",
          }}
        />

        {/* Content layer */}
        <div className="absolute inset-0">{children}</div>
      </div>
    </section>
  );
}

