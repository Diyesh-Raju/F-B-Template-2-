"use client";

import { usePathname } from "next/navigation";
import { ScrollLink } from "@/components/ScrollLink";
import { Reveal } from "@/components/motion/Reveal";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

// Internal pages reachable from the footer "Menu" column.
const MENU_LINKS = [
  { label: "Home", href: "/" },
  { label: "FMCG", href: "/fmcg" },
  { label: "Cafe", href: "/cafe" },
  { label: "Brewery", href: "/brewery" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com/" },
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "Twitter", href: "https://x.com/" },
];

export function SiteFooter() {
  const pathname = usePathname();
  // On the cafe page the footer text is rendered at full white instead of the
  // muted white/opacity tones used on every other page.
  const isCafe = pathname === "/cafe";
  const bodyText = isCafe ? "text-white" : "text-white/70";
  const listText = isCafe ? "text-white" : "text-white/75";
  const copyrightText = isCafe ? "text-white" : "text-white/60";

  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10">
      {/* Full-bleed terrace photo behind the whole footer. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/footer/terrace.png')",
          backgroundPosition: "center 80%",
        }}
      />
      {/* Dark scrim so every column reads cleanly over the bright photo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-b from-black/65 via-black/50 to-black/75"
      />

      <div
        className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        style={{ fontFamily: "var(--font-elms-sans)" }}
      >
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-16 lg:grid-cols-4 lg:gap-x-24">
          {/* Brand */}
          <Reveal preset="fadeUp" className="sm:col-span-2 lg:col-span-1 lg:pr-12">
            <div>
              <div className="h-20 w-full max-w-[280px]">
                <TextHoverEffect text="NOCTURNE F&B" />
              </div>
              <p className={`mt-2 max-w-xs text-sm leading-6 ${bodyText}`}>
                Crafting unforgettable food &amp; beverage experiences — from
                everyday FMCG essentials to our cafe and brewery.
              </p>
            </div>
          </Reveal>

          {/* Menu */}
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }} className="lg:pt-7">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Menu
              </h3>
              <ul className={`mt-4 flex flex-col gap-3 text-sm ${listText}`}>
                {MENU_LINKS.map((link) => (
                  <li key={link.href}>
                    <ScrollLink
                      className="cursor-pointer transition hover:text-white"
                      href={link.href}
                    >
                      {link.label}
                    </ScrollLink>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Contact us */}
          <Reveal preset="fadeUp" transition={{ delay: 0.12 }} className="lg:pt-7">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Contact us
              </h3>
              <ul className={`mt-4 flex flex-col gap-3 text-sm ${listText}`}>
                <li>
                  <a
                    className="transition hover:text-white"
                    href="tel:+919000000000"
                  >
                    +91 90000 00000
                  </a>
                </li>
                <li>
                  <a
                    className="transition hover:text-white"
                    href="mailto:hello@nocturnefnb.com"
                  >
                    hello@nocturnefnb.com
                  </a>
                </li>
                <li className="leading-6">
                  14 Midnight Lane,
                  <br />
                  Bandra West, Mumbai,
                  <br />
                  Maharashtra 400050
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Socials */}
          <Reveal preset="fadeUp" transition={{ delay: 0.18 }} className="lg:pt-7">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Socials
              </h3>
              <ul className={`mt-4 flex flex-col gap-3 text-sm ${listText}`}>
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.label}>
                    <a
                      className="transition hover:text-white"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal preset="fadeIn" transition={{ delay: 0.24 }}>
          <div className={`mt-12 border-t border-white/15 pt-6 text-sm ${copyrightText}`}>
            © {new Date().getFullYear()} Nocturne F&amp;B. All rights reserved.
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
