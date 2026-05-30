"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";
import { useLenisScroll } from "@/components/providers/lenis-scroll-context";
import { ScrollToExplore } from "@/components/hero/ScrollToExplore";
import { dlog } from "@/lib/debug";

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

// Decides whether the device can comfortably scroll-scrub a full-screen video.
// Macs with hardware H.264 decode handle it; many mid/low Windows + Linux
// laptops do not, and the per-scroll seeks dominate the frame budget. When
// this returns a non-null reason we skip seeking entirely and let the video
// sit at frame 0 — the overlay text fades still work because they're driven
// by the same scrollYProgress MotionValue, which we keep updating on every
// scroll tick.
//
// Returns the DECIDING REASON (or null for "run the live scrub"). The reason
// is logged so the live `?debug=1` console shows exactly which signal sent a
// given visitor down the static path — the #1 dev-vs-public divergence (devs
// rarely have reduced-motion on, a weak device, or a metered connection).
function detectStaticFallbackReason(): string | null {
  if (typeof window === "undefined") return null;
  // Respect OS-level preference unconditionally. Note: phone "battery saver" /
  // Low Power Mode frequently turns this on for the public, almost never for
  // a developer testing on a plugged-in machine.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "prefers-reduced-motion";
  }
  // NOTE: we intentionally do NOT bail on touch / narrow viewports anymore.
  // Phones were previously forced into the static path, which on iOS left
  // the <video> showing nothing (a paused, metadata-only video paints no
  // frame). Users want the scrub to run on phones too; the hero MP4s are
  // now small enough (≈0.4–3.5 MB) that mid-range phones handle the scrub.
  // The genuinely-weak-hardware and metered-connection guards below still
  // apply on every device, mobile included.
  const cores = navigator.hardwareConcurrency ?? 8;
  const memNav = navigator as Navigator & { deviceMemory?: number };
  const mem = memNav.deviceMemory ?? 8;
  if (cores <= 2) return `hardwareConcurrency=${cores} (<=2)`;
  if (mem <= 2) return `deviceMemory=${mem} (<=2)`;
  // Slow / metered connection. Even on a strong CPU, fetching a multi-MB
  // video for scrub is wasteful on 2G/slow-3G.
  const connNav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const conn = connNav.connection;
  if (conn?.saveData) return "connection.saveData";
  if (
    conn?.effectiveType &&
    (conn.effectiveType === "2g" || conn.effectiveType === "slow-2g")
  ) {
    return `connection.effectiveType=${conn.effectiveType}`;
  }
  return null;
}

type ScrollScrubVideoHeroProps = {
  src: string;
  /**
   * Poster image shown until the video can paint a frame. Critical for public
   * users: when autoplay/decoding is blocked (iOS Low Power Mode, autoplay
   * policy) or the clip hasn't buffered on a cold first visit, the <video>
   * would otherwise render BLACK. The poster guarantees a real image is always
   * visible. Should match frame 0 (where the scrub sits at scroll-top).
   */
  poster?: string;
  /** How much scroll space to allocate for the scrub (in vh). */
  scrollDistanceVh?: number;
  /** Extra poster-like overlay tint to keep text readable. */
  overlayClassName?: string;
  /** When true, shows a "Scroll to explore" cue at the bottom of the hero
   *  (all viewports) that fades out as the scrub progresses. */
  scrollHint?: boolean;
  /** Either static node(s), or a render-prop that receives a 0→1 scroll
   *  progress MotionValue tied to the hero's own scroll runway. */
  children?:
    | React.ReactNode
    | ((progress: MotionValue<number>) => React.ReactNode);
};

export function ScrollScrubVideoHero({
  src,
  poster,
  scrollDistanceVh = 240,
  overlayClassName = "bg-[color:var(--bg)] opacity-45",
  scrollHint = false,
  children,
}: ScrollScrubVideoHeroProps) {
  const { lenisActive, subscribeScroll } = useLenisScroll();
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Static-fallback gate. Computed client-side after hydration so SSR output
  // is identical for every viewer (no hydration mismatch). When true, we
  // suppress per-scroll seeks; the video stays at frame 0, but the overlay
  // text fades still play because we keep publishing scrollYProgress.
  const [staticFallback, setStaticFallback] = useState(false);

  // 0 → 1 across the hero's own scroll runway. Driven from the same rAF tick
  // that seeks the video so overlay text and video frame stay in lockstep
  // (no framer-motion/Lenis interop drift).
  const scrollYProgress = useMotionValue(0);

  // Slow-device detection runs once on mount after hydration so the SSR
  // markup is identical for every viewer. setState-in-effect is deliberate
  // here — the cascading render is the whole point (we want to re-run the
  // main effect with the chosen path).
  useEffect(() => {
    const reason = detectStaticFallbackReason();
    const navWithExtras = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    dlog("scrub", src, "device gate →", reason ? `STATIC (${reason})` : "LIVE scrub", {
      cores: navigator.hardwareConcurrency,
      deviceMemory: navWithExtras.deviceMemory,
      effectiveType: navWithExtras.connection?.effectiveType,
      saveData: navWithExtras.connection?.saveData,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStaticFallback(reason !== null);
  }, [src]);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    // Slow-device path: subscribe to scroll only to update scrollYProgress
    // for the overlay text fades. Do NOT touch video.currentTime — that's
    // the expensive part that was making the page lag on non-Mac laptops.
    if (staticFallback) {
      dlog("scrub", src, "init (STATIC fallback — slow device / reduced motion)");
      let cleanupSF: Array<() => void> = [];
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
      const publish = () => {
        const maxTravel = Math.max(1, sectionHeight - viewportHeight);
        scrollYProgress.set(
          clamp01((window.scrollY - sectionTop) / maxTravel)
        );
      };
      publish();
      window.addEventListener("scroll", publish, { passive: true });
      cleanupSF.push(() => window.removeEventListener("scroll", publish));
      const onResize = () => {
        measure();
        publish();
      };
      window.addEventListener("resize", onResize, { passive: true });
      cleanupSF.push(() => window.removeEventListener("resize", onResize));
      // Re-measure after all assets load (not DOMContentLoaded) so a first
      // visitor's trigger points are computed against the final layout.
      const onLoad = () => {
        measure();
        publish();
      };
      if (document.readyState === "complete") {
        onLoad();
      } else {
        window.addEventListener("load", onLoad);
        cleanupSF.push(() => window.removeEventListener("load", onLoad));
      }
      if (lenisActive) cleanupSF.push(subscribeScroll(publish));
      // Pause the video for good measure — even with no seeks the browser
      // can still spin the decoder for an autoplaying element.
      try {
        video.pause();
      } catch {
        /* ignore */
      }
      return () => {
        for (const fn of cleanupSF) fn();
        cleanupSF = [];
      };
    }

    // ── Self-correcting rAF scrub ──────────────────────────────────────────
    // The previous implementation drove seeking from Lenis *scroll events* and
    // gated every seek behind a stack of latches (`wakingPlayback`,
    // `pendingHardResetSeek`, `isVisible`, `rafId`). Any one of them getting
    // stranded froze the hero until a refresh. The worst offender:
    // `wakePlayback()` set `wakingPlayback = true` and awaited `video.play()`;
    // when the decoder was parked after a tab switch that promise never
    // settled, so the flag stuck `true` forever, every `flush()` refused to
    // seek, and every later `wake()` early-returned. That is the exact
    // "scroll back after switching tabs and the video is frozen, only a
    // refresh fixes it" bug.
    //
    // This version owns a SINGLE rAF loop that runs only while the section is
    // in view and the document is visible. Every frame it re-reads the current
    // scroll position from scratch, publishes `scrollYProgress`, and seeks the
    // video toward the matching frame. There is no latch that can get stuck —
    // a missed event, a throttled-while-hidden frame, or a parked decoder just
    // means the next frame recomputes from ground truth. Crucially, the
    // overlay-text progress is published BEFORE (and independently of) the
    // video seek, so even if the decoder stalls the text animation never
    // freezes. The decoder paint-nudge (play→pause) is fire-and-forget and can
    // never block the loop.
    dlog("scrub", src, "init (scrub path)", {
      scrollDistanceVh,
      readyState: video.readyState,
    });
    let mounted = true;
    let inView = false;
    let docVisible =
      typeof document === "undefined" || document.visibilityState !== "hidden";
    let rafId = 0;
    let duration = 0;

    // Seek throttling — the Chrome fix. Writing video.currentTime every frame
    // floods Chrome's seek pipeline: each write interrupts the in-flight seek,
    // so the decoder thrashes and the picture stutters or freezes while the
    // page keeps scrolling. (Safari's seek path is fast enough to absorb this,
    // which is exactly why it looked perfect there.) Instead we keep only ONE
    // seek in flight: the rAF loop updates `desiredTarget` every frame, and we
    // issue the next currentTime write only once the previous one's `seeked`
    // event lands — always jumping straight to the latest scroll position and
    // skipping the intermediate frames Chrome couldn't keep up with.
    let desiredTarget = -1;
    let appliedTarget = -1;
    let seeking = false;
    let seekWatchdog = 0;

    const VIEW_MARGIN = 200; // matches the IntersectionObserver rootMargin

    // Layout cache — re-measured on resize / IO / wake transitions, not every
    // frame, so the per-frame cost is just two cheap reads (scrollY + compare).
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
    // essentially identical to the last (well below one video frame). We do
    // NOT snap targets to frame boundaries: on slow scrolls many ticks would
    // round to the same snapped target, every seek in that window would be
    // suppressed, and the video would visibly freeze until enough scroll
    // accumulated. Raw precision lets the browser pick the nearest decoded
    // frame each rAF and update fluidly.
    const SEEK_EPSILON = 0.001; // 1ms

    const computeTarget = () => {
      const maxTravel = Math.max(1, sectionHeight - viewportHeight);
      const traveled = clamp01((window.scrollY - sectionTop) / maxTravel);
      // Publish progress FIRST and unconditionally — overlay text fades must
      // keep moving even if the video decoder is lagging behind.
      scrollYProgress.set(traveled);
      if (duration <= 0) return -1;
      const t = traveled * duration;
      if (t <= 0) return 0;
      if (t >= duration) return Math.max(0, duration - SEEK_EPSILON);
      return t;
    };

    // Always use `currentTime` rather than `fastSeek`. fastSeek snaps to the
    // nearest keyframe, which is a problem with sparsely-keyframed sources
    // when scrubbing backwards — the request rounds to the same keyframe the
    // forward scrub just hit, so upward scrolls visually freeze. `currentTime`
    // is frame-accurate and honors both directions.
    const seek = (t: number) => {
      if (!Number.isFinite(t)) return;
      try {
        video.currentTime = t;
      } catch {
        // Some browsers throw if metadata isn't ready yet — ignore and retry
        // on the next frame.
      }
    };

    // Issue at most one seek at a time; always coalesce to the newest target.
    const pumpSeek = () => {
      if (seeking || desiredTarget < 0) return;
      if (Math.abs(desiredTarget - appliedTarget) < SEEK_EPSILON) return;
      appliedTarget = desiredTarget;
      seeking = true;
      seek(appliedTarget);
      // Chrome doesn't always emit `seeked` (target rounds to the current
      // frame, or the range isn't buffered yet). Without a fallback that would
      // strand `seeking = true` and freeze the scrub, so release after a short
      // grace period and try to catch up to wherever the user is now.
      if (seekWatchdog) window.clearTimeout(seekWatchdog);
      seekWatchdog = window.setTimeout(() => {
        seekWatchdog = 0;
        seeking = false;
        pumpSeek();
      }, 180);
    };

    const onSeeked = () => {
      seeking = false;
      if (seekWatchdog) {
        window.clearTimeout(seekWatchdog);
        seekWatchdog = 0;
      }
      pumpSeek();
    };
    video.addEventListener("seeked", onSeeked);

    const tick = () => {
      if (!mounted || !inView || !docVisible) {
        rafId = 0;
        return;
      }
      // computeTarget also publishes scrollYProgress (overlay text) every
      // frame, so the text stays smooth at 60fps even while the video seeks
      // are throttled to whatever rate the decoder can actually sustain.
      const target = computeTarget();
      if (target >= 0) {
        desiredTarget = target;
        pumpSeek();
      }
      rafId = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (rafId || !mounted || !inView || !docVisible) return;
      rafId = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    // Derive visibility straight from layout — never trust a stale IO state,
    // which is the whole bug class we're eliminating.
    const deriveInView = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      return rect.bottom > -VIEW_MARGIN && rect.top < vh + VIEW_MARGIN;
    };

    // Fire-and-forget decoder paint nudge. A paused <video> on some engines
    // (iOS/Safari especially, and any tab whose decoder the OS parked) won't
    // repaint after a `currentTime=` write until the decoder is reactivated.
    // One play()→pause() round-trip forces a decode + composite of the current
    // frame. This NEVER gates the scrub loop: if the play() promise hangs or
    // rejects, seeking keeps happening every frame regardless, so the hero can
    // never end up permanently frozen waiting on playback.
    const nudgePaint = () => {
      let p: Promise<void> | undefined;
      try {
        p = video.play() as Promise<void> | undefined;
      } catch (err) {
        dlog("scrub", src, "play() threw — autoplay blocked; poster stays up", err);
        return;
      }
      if (p && typeof p.then === "function") {
        p.then(() => {
          dlog("scrub", src, "play() ok — decoder awake");
          try {
            video.pause();
          } catch {
            /* ignore */
          }
        }).catch((err: unknown) => {
          // The single most common public-vs-dev difference: iOS Low Power
          // Mode and autoplay policy reject this. Caught here so it never
          // blocks scrubbing; the poster guarantees the hero isn't blank.
          dlog(
            "scrub",
            src,
            "play() rejected — autoplay blocked (low-power?); poster stays up",
            (err as { name?: string })?.name ?? err
          );
          try {
            video.pause();
          } catch {
            /* ignore */
          }
        });
      } else {
        try {
          video.pause();
        } catch {
          /* ignore */
        }
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        inView = entry.isIntersecting;
        dlog("scrub", src, "IntersectionObserver inView:", inView);
        if (inView) {
          measure();
          appliedTarget = -1;
          start();
          // Re-entering view after being scrolled past (the decoder may have
          // been parked) — refresh the frame.
          nudgePaint();
        } else {
          stop();
        }
      },
      { rootMargin: `${VIEW_MARGIN}px 0px` }
    );
    io.observe(section);

    video.pause();

    // Read duration directly — don't rely on React's onLoadedMetadata, which
    // races with the browser's metadata load when the video is cached.
    const adoptDuration = () => {
      const d = video.duration;
      if (Number.isFinite(d) && d > 0 && d !== duration) {
        duration = d;
        appliedTarget = -1; // force a fresh write next frame
        dlog("scrub", src, "duration adopted", d.toFixed(2) + "s");
        start();
      }
    };
    adoptDuration();
    const onMeta = () => adoptDuration();
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("durationchange", onMeta);
    video.addEventListener("loadeddata", onMeta);

    const onResize = () => {
      measure();
      appliedTarget = -1; // viewport changed, frame mapping may have moved
      start();
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Re-measure once EVERYTHING has loaded. This React effect runs after
    // hydration but typically BEFORE the window `load` event, so for a
    // first-time (uncached) visitor any late layout shift from images/fonts/
    // video above the hero could have moved its scroll trigger points. We wait
    // for `load` — not DOMContentLoaded, which fires before media — and
    // recompute so the very first scrub is accurate without a refresh. On a
    // client-side navigation the page is already `complete`, so measure now.
    const onLoad = () => {
      measure();
      appliedTarget = -1;
      start();
    };
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }

    // Tab/app switch, bfcache restore, window refocus: re-derive everything
    // from layout (IO may not fire while hidden), re-measure, force a reseek,
    // nudge the decoder, and restart the loop. This is what guarantees the
    // scrub — forward AND reverse — always resumes without a refresh.
    const wake = () => {
      if (!mounted) return;
      docVisible =
        typeof document === "undefined" ||
        document.visibilityState !== "hidden";
      dlog("scrub", src, "wake (visibility/focus/pageshow)", { docVisible });
      if (!docVisible) {
        stop();
        return;
      }
      inView = deriveInView();
      measure();
      // A seek may have been in flight when the tab was hidden; its `seeked`
      // event can be dropped, which would leave `seeking` stuck. Clear it so
      // the scrub always resumes after returning to the tab.
      appliedTarget = -1;
      seeking = false;
      if (seekWatchdog) {
        window.clearTimeout(seekWatchdog);
        seekWatchdog = 0;
      }
      if (inView) {
        const target = computeTarget();
        if (target >= 0) {
          desiredTarget = target;
          pumpSeek();
        }
        start();
        nudgePaint();
      }
    };
    document.addEventListener("visibilitychange", wake);
    window.addEventListener("pageshow", wake);
    window.addEventListener("focus", wake);

    // Force the FIRST frame to actually paint on initial load. A paused,
    // metadata-only <video> renders nothing on iOS/Safari (and sometimes
    // Chrome): seeking to frame 0 sets currentTime but doesn't guarantee a
    // decoded frame is composited, so a brand-new visitor who hasn't scrolled
    // yet just sees a black hero. One play()→pause() once data is available
    // forces that first frame to decode and paint. Idempotent and one-shot.
    let firstFramePainted = false;
    const ensureFirstFrame = () => {
      if (firstFramePainted || !mounted) return;
      if (video.readyState < 2 /* HAVE_CURRENT_DATA */) return;
      firstFramePainted = true;
      dlog("scrub", src, "first frame ready (readyState", video.readyState + ")");
      const target = computeTarget();
      if (target >= 0) {
        desiredTarget = target;
        appliedTarget = -1;
        pumpSeek();
      }
      nudgePaint();
    };
    video.addEventListener("loadeddata", ensureFirstFrame);
    video.addEventListener("canplay", ensureFirstFrame);
    // Cover the cached case where data is already available before listeners
    // attached.
    ensureFirstFrame();

    // Initial sync.
    inView = deriveInView();
    start();

    return () => {
      mounted = false;
      stop();
      if (seekWatchdog) window.clearTimeout(seekWatchdog);
      io.disconnect();
      window.removeEventListener("load", onLoad);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("durationchange", onMeta);
      video.removeEventListener("loadeddata", onMeta);
      video.removeEventListener("loadeddata", ensureFirstFrame);
      video.removeEventListener("canplay", ensureFirstFrame);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pageshow", wake);
      window.removeEventListener("focus", wake);
    };
  }, [src, scrollDistanceVh, lenisActive, subscribeScroll, staticFallback, scrollYProgress]);

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
          poster={poster}
          muted
          playsInline
          // `auto` asks the browser to buffer the whole clip. This is the
          // other half of the Chrome fix: with `metadata`, scrubbing forward
          // seeks into UN-buffered ranges, so Chrome has to fetch+decode that
          // segment on the fly — the source of the lag/freeze. Buffering up
          // front lets every seek land in already-downloaded data. Slow /
          // metered connections never reach this path (they fall back to the
          // static, no-seek hero), so the extra download only happens on
          // devices that can comfortably handle the scrub. `preload` downloads
          // in the background and does not block the page from being
          // interactive.
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
          // NOTE: deliberately NOT using mix-blend-mode here. A blended layer
          // spanning the hero forces the browser to re-composite the entire
          // hero against the video on every scrub frame — a documented cause
          // of scroll-sequence stalls/hangs on Safari, Firefox and integrated
          // GPUs (the "works on some machines, freezes on others" symptom). A
          // plain low-opacity tint renders the same vignette with zero
          // per-frame blend cost.
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(255,179,71,0.55), transparent 55%), radial-gradient(circle at 70% 30%, rgba(197,255,211,0.30), transparent 60%)",
          }}
        />

        {/* Content layer */}
        <div className="absolute inset-0">
          {typeof children === "function" ? children(scrollYProgress) : children}
        </div>

        {scrollHint && <ScrollToExplore progress={scrollYProgress} />}
      </div>
    </section>
  );
}
