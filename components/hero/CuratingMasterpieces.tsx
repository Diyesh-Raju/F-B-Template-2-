"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/**
 * Intro band that sits directly below the homepage hero slider: a small
 * vertical (portrait) auto-playing video on the left, with a heading and
 * supporting copy on the right. The video loops silently and inline so it
 * behaves on mobile.
 */
export function CuratingMasterpieces({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Some browsers (notably Safari) pause an autoplaying video when its tab is
  // backgrounded and don't reliably resume it — leaving a black/frozen frame
  // until a manual refresh. Re-trigger playback whenever the tab becomes
  // visible again or the page is restored from the back/forward cache.
  useEffect(() => {
    const resume = () => {
      const v = videoRef.current;
      if (!v || document.hidden) return;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pageshow", resume);
    window.addEventListener("focus", resume);
    return () => {
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pageshow", resume);
      window.removeEventListener("focus", resume);
    };
  }, []);

  return (
    <section className={cn("py-14 sm:py-20", className)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center gap-10 sm:gap-12 md:flex-row md:gap-16">
          {/* Vertical video box — centered. */}
          <Reveal preset="fadeUp" className="shrink-0">
            <div className="relative aspect-[9/16] w-64 overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-[var(--shadow-glow)] sm:w-72 lg:w-80">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src="/hero/matcha.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
            </div>
          </Reveal>

          {/* Heading + description — centered. */}
          <Reveal preset="fadeUp" transition={{ delay: 0.08 }}>
            <div className="max-w-xl text-center">
              <h2 className="font-[var(--font-serif)] text-3xl leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Our Job, Curating Masterpieces ✨
              </h2>
              <p className="mt-5 text-base leading-7 text-white/65 sm:text-lg">
                We handpick every detail to create exceptional food and beverage
                experiences that feel refined, memorable, and beautifully
                crafted.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
