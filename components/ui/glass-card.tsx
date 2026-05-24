"use client";

import * as React from "react";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Brand mark rendered inside the floating white badge. */
  icon: React.ReactNode;
  /** Optional link target. When provided the whole card becomes an anchor. */
  href?: string;
  /** Accessible label for the link / card. */
  label?: string;
}

/**
 * Logo-only glass card with a 3D tilt-on-hover effect.
 *
 * Stripped-down variant of the original Monochrome card — text content and
 * the secondary action row are removed; the floating circle cluster + the
 * centered brand badge remain to carry the 3D illusion.
 *
 * Animations use only `transform` / `box-shadow`, so the global
 * `prefers-reduced-motion` reset in `globals.css` cleanly neutralises them.
 */
const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className = "", icon, href, label, ...props }, ref) => {
    const inner = (
      <div className="relative h-full rounded-[42px] bg-gradient-to-br from-zinc-900 to-black shadow-2xl transition-all duration-500 ease-in-out [transform-style:preserve-3d] group-hover:[box-shadow:rgba(0,0,0,0.3)_22px_40px_22px_-32px,rgba(0,0,0,0.1)_0px_20px_24px_0px] group-hover:[transform:rotate3d(1,1,0,30deg)]">
        {/* Frosted-glass overlay first — keeps the signature look but sits
            BEHIND the logo, so its backdrop-blur cannot smear the brand mark. */}
        <div className="pointer-events-none absolute inset-2 rounded-[46px] border-b border-l border-white/20 bg-gradient-to-b from-white/12 to-white/[0.04] backdrop-blur-[2px] [transform-style:preserve-3d] [transform:translate3d(0,0,22px)]" />

        {/* Brand mark — in front of the glass for crisp edges, but still
            behind the entire floating-circle cluster so it reads as the
            "back of the box" focal point in the 3D depth stack. */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center [transform-style:preserve-3d]">
          <span
            aria-hidden="true"
            className="grid place-items-center drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)] transition-all duration-500 ease-in-out [transform:translate3d(0,0,30px)] group-hover:[transform:translate3d(0,0,38px)] [&_svg]:h-[100px] [&_svg]:w-[100px]"
          >
            {icon}
          </span>
        </div>

        {/* Floating decorative circle cluster — kept top-right so it doesn't
            cover the brand mark while still selling the 3D parallax. */}
        <div className="pointer-events-none absolute top-0 right-0 [transform-style:preserve-3d]">
          {[
            { size: "130px", pos: "6px", z: "44px", delay: "0s" },
            { size: "108px", pos: "8px", z: "64px", delay: "0.4s" },
            { size: "84px", pos: "13px", z: "84px", delay: "0.8s" },
            { size: "60px", pos: "17px", z: "104px", delay: "1.2s" },
          ].map((circle, index) => (
            <div
              key={index}
              className="absolute aspect-square rounded-full bg-white/10 shadow-[rgba(100,100,111,0.2)_-10px_10px_20px_0px] transition-all duration-500 ease-in-out"
              style={{
                width: circle.size,
                top: circle.pos,
                right: circle.pos,
                transform: `translate3d(0, 0, ${circle.z})`,
                transitionDelay: circle.delay,
              }}
            />
          ))}
        </div>
      </div>
    );

    const wrapperClass =
      `group block h-[220px] w-[210px] [perspective:1000px] ${className}`.trim();

    if (href) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={wrapperClass}
        >
          {inner}
        </a>
      );
    }

    return (
      <div
        ref={ref}
        role={label ? "img" : undefined}
        aria-label={label}
        className={wrapperClass}
        {...props}
      >
        {inner}
      </div>
    );
  },
);

GlassCard.displayName = "GlassCard";

export default GlassCard;
