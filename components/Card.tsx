"use client";

import type { ReactNode } from "react";

export function Card({
  title,
  description,
  meta,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_1px_0_rgba(255,255,255,0.06)] transition hover:border-white/15 hover:bg-white/10"
      onPointerMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        el.style.setProperty("--x", `${x}%`);
        el.style.setProperty("--y", `${y}%`);
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(800px circle at var(--x, 50%) var(--y, 50%), rgba(255,179,71,0.10), transparent 55%)",
        }}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="font-medium text-white">{title}</div>
            {description ? (
              <div className="mt-2 text-sm leading-6 text-white/60">
                {description}
              </div>
            ) : null}
          </div>
          {meta ? (
            <div className="shrink-0 text-sm font-medium text-white/75">
              {meta}
            </div>
          ) : null}
        </div>
        {children ? <div className="mt-5">{children}</div> : null}
      </div>
    </div>
  );
}

