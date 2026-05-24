"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

export function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal preset="fadeUp" className="max-w-3xl">
          <div>
            {eyebrow ? (
              <div className="text-xs font-medium tracking-[0.22em] text-white/55">
                {eyebrow.toUpperCase()}
              </div>
            ) : null}
            <h2 className="mt-4 font-[var(--font-serif)] text-3xl leading-tight tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-4 text-base leading-7 text-white/65 sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>
        </Reveal>
        {children ? (
          <Reveal preset="fadeUp" className="mt-10">
            {children}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
