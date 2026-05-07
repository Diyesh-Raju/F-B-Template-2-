"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
};

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: Variant;
};

function styles(variant: Variant) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition will-change-transform focus-visible:outline-offset-4";
  const hover = "hover:-translate-y-0.5 active:translate-y-0";

  switch (variant) {
    case "primary":
      return [
        base,
        hover,
        "bg-white text-black hover:bg-white/90",
        "shadow-[var(--shadow-glow)]",
      ].join(" ");
    case "secondary":
      return [
        base,
        hover,
        "border border-white/15 bg-white/5 text-white hover:bg-white/10",
      ].join(" ");
    case "ghost":
      return [base, "text-white/80 hover:text-white"].join(" ");
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button className={`${styles(variant)} ${className}`} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return <Link className={`${styles(variant)} ${className}`} {...props} />;
}

