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
    // After this much idle the play→pause wake is no longer reliable — the
    // decoder may have dropped its buffer entirely. Do a full video.load()
    // instead, which fully re-initializes the decoder, then re-seek once
    // loadeddata fires.
    const HARD_RESET_IDLE_MS = 15_000;
    let lastScrollTs = performance.now();
    let lastWakeTs = performance.now();
    // Set while a play()→pause() round-trip is in flight. flush() refuses to
    // seek during this window — if it didn't, our own subsequent seek would
    // cancel the in-flight play() with an AbortError, leaving the decoder
    // un-woken on its stale frame. This is the precise mechanism that produces
    // the "frozen on end frame, scrolling does nothing" symptom after long
    // idles: wake fires, wake schedules, the scheduled flush seeks before
    // play resolves, the play promise rejects, the frame never repaints.
    let wakingPlayback = false;
    // Pending seek that should run once the loadeddata event fires after a
    // hardReset(). The user may have scrolled during the reload, so we
    // recompute the target at the moment of seeking rather than at the moment
    // of triggering load().
    let pendingHardResetSeek = false;

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
      // Don't fight an in-flight wake-playback. If we seek now, the pending
      // play() promise rejects with AbortError and the decoder never wakes.
      // Re-arm a rAF so we pick up the latest scroll position once the wake
      // settles (wakingPlayback clears in resolveWakingPlayback() below).
      if (wakingPlayback) {
        rafId = window.requestAnimationFrame(flush);
        return;
      }
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

    // Plays the video for one micro-tick then pauses it. Forces the browser
    // to actually decode + paint a frame at the current `currentTime`. Without
    // this, after a parked-decoder wake the renderer stays on its stale frame
    // even though seeking has happened. We hold the wakingPlayback flag for
    // the entire play→pause round-trip so flush() doesn't issue a competing
    // seek that would reject the play promise.
    const wakePlayback = () => {
      wakingPlayback = true;
      const resolveWake = () => {
        wakingPlayback = false;
        // The user may have scrolled during the wake — re-flush so they see
        // the frame for their CURRENT position, not the one we wake-seeked to.
        schedule();
      };
      let pPromise: Promise<void> | undefined;
      try {
        pPromise = video.play() as Promise<void> | undefined;
      } catch {
        resolveWake();
        return;
      }
      if (pPromise && typeof pPromise.then === "function") {
        pPromise
          .then(() => {
            try {
              video.pause();
            } catch {
              /* ignore */
            }
            resolveWake();
          })
          .catch(() => {
            // Autoplay blocked, AbortError from a later seek, etc. — make sure
            // we still release the gate so flush() can resume.
            try {
              video.pause();
            } catch {
              /* ignore */
            }
            resolveWake();
          });
      } else {
        try {
          video.pause();
        } catch {
          /* ignore */
        }
        resolveWake();
      }
    };

    // Safety timer: if loadeddata doesn't fire within this window after a
    // hardReset(), assume the reload failed and release the gate so the user
    // isn't permanently locked out of scrolling the hero.
    const HARD_RESET_TIMEOUT_MS = 4000;
    let hardResetTimer: number | null = null;

    // Hard reset for severely parked decoders. After ~15s+ idle the decoder
    // may have dropped its buffer entirely; a play→pause wake at that point
    // sometimes just plays a single frame of the wrong content. video.load()
    // fully re-initializes the element — we then seek to the right position
    // once loadeddata fires (handled via pendingHardResetSeek + onMeta path).
    const hardReset = () => {
      pendingHardResetSeek = true;
      wakingPlayback = true; // gate flushes until reload settles
      try {
        video.load();
      } catch {
        // load() is documented to never throw, but be defensive against
        // browsers that disagree.
        wakingPlayback = false;
        pendingHardResetSeek = false;
        return;
      }
      if (hardResetTimer) window.clearTimeout(hardResetTimer);
      hardResetTimer = window.setTimeout(() => {
        // loadeddata never fired — release the gate, surface the current scroll
        // position to the renderer however we can.
        hardResetTimer = null;
        if (!pendingHardResetSeek) return;
        pendingHardResetSeek = false;
        wakingPlayback = false;
        lastTarget = -1;
        schedule();
      }, HARD_RESET_TIMEOUT_MS);
    };

    const onLoadedAfterReset = () => {
      if (!pendingHardResetSeek) return;
      pendingHardResetSeek = false;
      if (hardResetTimer) {
        window.clearTimeout(hardResetTimer);
        hardResetTimer = null;
      }
      const target = computeTarget();
      if (target >= 0) {
        seek(target);
        lastTarget = target;
        wakePlayback(); // also releases the gate via resolveWake
      } else {
        wakingPlayback = false;
        schedule();
      }
    };
    video.addEventListener("loadeddata", onLoadedAfterReset);
    unsubs.push(() =>
      video.removeEventListener("loadeddata", onLoadedAfterReset)
    );

    // Wake handling: when the tab/window regains focus, BFCache restores
    // the page, or the section re-enters the viewport after a long idle,
    // browsers may have stranded a queued rAF, paused the media pipeline,
    // or not re-fired layout. Force a clean re-sync so the next user
    // scroll never sees a stale frame.
    wake = () => {
      if (!mounted) return;
      // Reentrancy guard: visibilitychange + pageshow + focus + IO can all
      // fire within the same tick when returning from a background tab. Let
      // the first wake finish before starting another one. The first wake's
      // resolveWake() → schedule() will pick up whatever scroll position the
      // user is at by then, so dropping these later events loses nothing.
      if (wakingPlayback || pendingHardResetSeek) {
        // Still refresh layout in case the viewport changed during the gap.
        measure();
        return;
      }
      const now = performance.now();
      const idleSinceLastWake = now - lastWakeTs;
      lastWakeTs = now;
      // Reset the idle clock at the *start* of wake so the trailing
      // schedule() call below doesn't see a stale gap and re-trigger another
      // wake — which would otherwise infinite-loop on the first wake fired
      // by visibilitychange/pageshow/focus after a long parked tab.
      lastScrollTs = now;
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

      // Long idle → fully reload the video element. play→pause alone won't
      // recover a decoder whose buffer was reaped by the OS.
      if (idleSinceLastWake > HARD_RESET_IDLE_MS) {
        hardReset();
        return;
      }

      // Short idle → seek + play→pause is enough.
      const target = computeTarget();
      if (target >= 0) {
        seek(target);
        lastTarget = target;
        // wakePlayback() schedules its own follow-up flush via resolveWake,
        // so we do NOT call schedule() here — that earlier schedule() was
        // what cancelled the play promise mid-flight on slow machines.
        wakePlayback();
      } else {
        schedule();
      }
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
      if (hardResetTimer) window.clearTimeout(hardResetTimer);
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
