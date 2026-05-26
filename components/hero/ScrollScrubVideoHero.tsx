"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";
import { useLenisScroll } from "@/components/providers/lenis-scroll-context";

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

type ScrollScrubVideoHeroProps = {
  src: string;
  /** How much scroll space to allocate for the scrub (in vh). */
  scrollDistanceVh?: number;
  /** Extra poster-like overlay tint to keep text readable. */
  overlayClassName?: string;
  /** Either static node(s), or a render-prop that receives a 0→1 scroll
   *  progress MotionValue tied to the hero's own scroll runway. */
  children?:
    | React.ReactNode
    | ((progress: MotionValue<number>) => React.ReactNode);
};

export function ScrollScrubVideoHero({
  src,
  scrollDistanceVh = 240,
  overlayClassName = "bg-[color:var(--bg)] opacity-45",
  children,
}: ScrollScrubVideoHeroProps) {
  const { lenisActive, subscribeScroll } = useLenisScroll();
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 0 → 1 across the hero's own scroll runway. Driven from the same flush
  // tick that seeks the video so overlay text and video frame stay in
  // perfect lockstep (no framer-motion/Lenis interop drift).
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let mounted = true;
    let isVisible = true;
    let rafId = 0;
    let duration = 0;

    // Timestamp of the last scroll we serviced. If the gap to the next
    // scroll exceeds IDLE_WAKE_MS, the media decoder may have been parked
    // by the OS (macOS/Safari is especially aggressive about pausing video
    // decoding for tabs that are visible but inactive). When that happens
    // currentTime= writes succeed but the renderer stays on a stale frame
    // — exactly the "freeze when scrolling back after a long idle" symptom.
    // Treat the next scroll after such a gap as a full wake() instead of
    // a plain seek so the play()→pause() round-trip refreshes the pipeline.
    const IDLE_WAKE_MS = 4000;
    let lastScrollTs = performance.now();

    // Layout cache — re-measured only on resize / IO transitions.
    let sectionTop = 0;
    let sectionHeight = 0;
    let viewportHeight = 0;
    const measure = () => {
      const rect = section.getBoundingClientRect();
      sectionTop = rect.top + window.scrollY;
      sectionHeight = section.offsetHeight;
      viewportHeight = window.innerHeight || 1;
    };
    measure();

    // Tiny dedupe threshold — only skip the seek if the next target is
    // essentially identical to the last (well below one video frame).
    // We intentionally do NOT snap targets to 30fps boundaries here: on
    // very slow scrolls many consecutive scroll ticks would round to the
    // same snapped target, the skip-guard would suppress every seek in
    // that window, and the video would visibly freeze until enough scroll
    // accumulated to cross a frame boundary — perceived as bad stutter.
    // Keeping raw precision lets the browser pick the nearest decoded
    // frame on every rAF and updates fluidly.
    const SEEK_EPSILON = 0.001; // 1ms

    let lastTarget = -1;

    const computeTarget = () => {
      const maxTravel = Math.max(1, sectionHeight - viewportHeight);
      const traveled = clamp01((window.scrollY - sectionTop) / maxTravel);
      // Publish progress on every compute tick so overlay text fades match
      // the video scrub frame-for-frame, even when scrolling fast or back.
      scrollYProgress.set(traveled);
      if (duration <= 0) return -1;
      const t = traveled * duration;
      if (t <= 0) return 0;
      if (t >= duration) return Math.max(0, duration - SEEK_EPSILON);
      return t;
    };

    // Always use `currentTime` rather than `fastSeek`. fastSeek snaps to the
    // nearest keyframe, which is a problem with sparsely-keyframed sources
    // (e.g. videos exported from WhatsApp) when scrubbing backwards — the
    // request rounds to the same keyframe the forward scrub just hit, so
    // upward scrolls visually freeze. `currentTime` is frame-accurate and
    // honors both directions.
    const seek = (t: number) => {
      if (!Number.isFinite(t)) return;
      try {
        video.currentTime = t;
      } catch {
        // Some browsers throw if metadata isn't ready yet — ignore and retry
        // on next scroll tick.
      }
    };

    const flush = () => {
      rafId = 0;
      if (!mounted || !isVisible) return;
      const target = computeTarget();
      if (target < 0) return;
      if (Math.abs(target - lastTarget) < SEEK_EPSILON) return;
      lastTarget = target;
      seek(target);
    };

    const schedule = () => {
      if (!mounted || !isVisible) return;

      // Idle-wake guard. If the user has been parked on the page without
      // scrolling for IDLE_WAKE_MS, the decoder may have gone to sleep —
      // force a full wake (play→pause + re-measure + seek) on this first
      // post-idle scroll instead of just queuing a normal seek. Subsequent
      // scrolls fall through to the regular rAF flush path.
      const now = performance.now();
      const idleGap = now - lastScrollTs;
      lastScrollTs = now;
      if (idleGap > IDLE_WAKE_MS) {
        wake();
        return;
      }

      if (rafId) return;
      rafId = window.requestAnimationFrame(flush);
    };

    // Forward declaration so the IO handler can call wake() on re-entry.
    // The actual implementation is defined below with the rest of the
    // wake-related listeners.
    let wake: () => void = () => {};

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const nowVisible = entry.isIntersecting;
        if (nowVisible && !isVisible) {
          // Re-entering viewport after being out — could have been parked
          // for a long time, the media pipeline may be idle. Force a hard
          // resync so the next user scroll never sees a stale frame.
          isVisible = true;
          wake();
        } else if (nowVisible) {
          isVisible = true;
          measure();
          schedule();
        } else {
          isVisible = false;
          if (rafId) {
            window.cancelAnimationFrame(rafId);
            rafId = 0;
          }
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(section);

    video.pause();

    // Read duration directly — don't rely on React's onLoadedMetadata, which
    // races with the browser's metadata load when the video is cached.
    const adoptDuration = () => {
      const d = video.duration;
      if (Number.isFinite(d) && d > 0 && d !== duration) {
        duration = d;
        // Force a fresh write next flush (lastTarget cleared).
        lastTarget = -1;
        schedule();
      }
    };
    adoptDuration();
    // If metadata wasn't ready yet, listen for both common events.
    const onMeta = () => adoptDuration();
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("durationchange", onMeta);
    video.addEventListener("loadeddata", onMeta);

    const unsubs: Array<() => void> = [];
    unsubs.push(() => video.removeEventListener("loadedmetadata", onMeta));
    unsubs.push(() => video.removeEventListener("durationchange", onMeta));
    unsubs.push(() => video.removeEventListener("loadeddata", onMeta));

    // Subscribe to BOTH Lenis (smooth ticks) and native scroll. Native scroll
    // is the safety net — direct scrollTo, anchor jumps, and any non-Lenis
    // scroll source still fire it. schedule() rAF-coalesces, so duplicate
    // firing is free.
    if (lenisActive) {
      unsubs.push(subscribeScroll(schedule));
    }
    window.addEventListener("scroll", schedule, { passive: true });
    unsubs.push(() => window.removeEventListener("scroll", schedule));

    const onResize = () => {
      measure();
      lastTarget = -1; // viewport changed, frame mapping may have moved
      schedule();
    };
    window.addEventListener("resize", onResize, { passive: true });
    unsubs.push(() => window.removeEventListener("resize", onResize));

    // Wake handling: when the tab/window regains focus, BFCache restores
    // the page, or the section re-enters the viewport after a long idle,
    // browsers may have stranded a queued rAF, paused the media pipeline,
    // or not re-fired layout. Force a clean re-sync so the next user
    // scroll never sees a stale frame.
    wake = () => {
      if (!mounted) return;
      // Reset the idle clock at the *start* of wake so the trailing
      // schedule() call below doesn't see a stale gap and re-trigger another
      // wake — which would otherwise infinite-loop on the first wake fired
      // by visibilitychange/pageshow/focus after a long parked tab.
      lastScrollTs = performance.now();
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      // Manual visibility check — IO callbacks during a hidden tab may not
      // fire reliably. Re-derive from layout so we don't strand isVisible.
      const r = section.getBoundingClientRect();
      const margin = 200;
      const vh = window.innerHeight || 1;
      isVisible = r.bottom > -margin && r.top < vh + margin;

      measure();
      lastTarget = -1;
      // Synchronous best-effort seek so the right frame is ready before the
      // next paint, instead of waiting an extra rAF.
      const target = computeTarget();
      if (target >= 0) {
        seek(target);
        lastTarget = target;
        // Force the media pipeline to actually paint a fresh frame. When the
        // tab was hidden / minimized / behind fullscreen, the browser parks
        // the video decoder; the next currentTime= write fires a "seeking"
        // event but the renderer can stay on a stale frame until the page
        // gets a paint trigger. A muted play()→pause() round-trip wakes the
        // decoder and guarantees the seeked frame reaches the canvas.
        const wakePlayback = () => {
          const p = video.play();
          if (p && typeof p.then === "function") {
            p.then(() => video.pause()).catch(() => {
              /* autoplay blocked or interrupted by another seek — fine */
            });
          } else {
            try {
              video.pause();
            } catch {
              /* ignore */
            }
          }
        };
        wakePlayback();
      }
      // Schedule one more rAF so any scroll movement between the wake and
      // the next user input doesn't leave us on a slightly-stale frame.
      schedule();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") wake();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", wake);
    window.addEventListener("focus", wake);
    unsubs.push(() => document.removeEventListener("visibilitychange", onVisibility));
    unsubs.push(() => window.removeEventListener("pageshow", wake));
    unsubs.push(() => window.removeEventListener("focus", wake));

    schedule();

    return () => {
      mounted = false;
      if (rafId) window.cancelAnimationFrame(rafId);
      io.disconnect();
      for (const u of unsubs) u();
    };
  }, [lenisActive, subscribeScroll]);

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
          disablePictureInPicture
          // GPU layer hint on the video element itself (NOT the sticky
          // container — applying transform to the sticky element can confuse
          // some browsers' sticky resolution). Promotes the video to its own
          // compositor layer so each scroll-driven `currentTime` write only
          // re-rasterizes the video plane, not the whole sticky area. Big win
          // on non-Mac laptops where full-screen video paint dominates.
          style={{
            willChange: "transform",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
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
        <div className="absolute inset-0">
          {typeof children === "function" ? children(scrollYProgress) : children}
        </div>
      </div>
    </section>
  );
}
