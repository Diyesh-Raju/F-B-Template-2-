"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Site-wide contact call-to-action that sits above the global footer. Heading
 * + a single rose-gold button that routes to /contact. Rose gold is applied
 * via inline style/arbitrary classes so the cream theme's `text-white → brown`
 * and `bg-white → fg` overrides don't repaint it.
 *
 * Suppressed on the FMCG route only — that page has its own contact path and
 * the CTA was unwanted there. Every other page still gets it.
 */
export function ContactCTA() {
  const pathname = usePathname();
  if (pathname === "/fmcg" || pathname.startsWith("/fmcg/")) return null;

  return (
    <section className="w-full border-t border-white/10 bg-[color:var(--bg)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-24">
        <Reveal preset="fadeUp">
          <h2 className="font-[var(--font-serif)] text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Contact us
          </h2>
        </Reveal>
        <Reveal preset="fadeUp" transition={{ delay: 0.08 }}>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full px-9 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#ffffff] shadow-[0_10px_30px_rgba(183,110,121,0.35)] transition hover:brightness-110 focus-visible:outline-offset-4"
            style={{
              background:
                "linear-gradient(135deg, #C9889A 0%, #B76E79 50%, #9E5B68 100%)",
            }}
          >
            Reserve a table
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
