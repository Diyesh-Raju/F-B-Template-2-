"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;
        const focusables = Array.from(
          panel.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (e.shiftKey) {
          if (!active || active === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      const panel = panelRef.current;
      const first = panel?.querySelector<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
      return;
    }
    triggerRef.current?.focus();
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[color:var(--bg)]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-baseline gap-2 focus-visible:outline-offset-4"
        >
          <span className="font-[var(--font-serif)] text-lg tracking-wide">
            Nocturne
          </span>
          <span className="text-xs text-white/60">F&amp;B</span>
          <span className="ml-2 h-px w-8 bg-gradient-to-r from-[var(--accent)]/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "relative rounded-full px-3 py-2 text-sm transition",
                  "text-white/70 hover:text-white",
                  "focus-visible:outline-offset-4",
                  active ? "text-white" : "",
                ].join(" ")}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute inset-x-3 -bottom-[1px] h-px",
                    "bg-gradient-to-r from-transparent via-[var(--accent)]/70 to-transparent",
                    "transition-opacity",
                    active ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                />
              </Link>
            );
          })}
        </nav>

        <div className="sm:hidden">
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 focus-visible:outline-offset-4"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(true)}
            ref={triggerRef}
          >
            Menu
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 sm:hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 h-full w-full bg-[color:var(--bg)]"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="absolute right-3 top-3 w-[min(92vw,360px)] overflow-hidden rounded-2xl border border-white/12 bg-[var(--surface)] shadow-[var(--shadow-glow)]"
              initial={{ x: 18, opacity: 0, filter: "blur(10px)" }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ x: 18, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              ref={panelRef}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div id={titleId} className="font-[var(--font-serif)] text-base">
                  Nocturne
                </div>
                <button
                  type="button"
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 focus-visible:outline-offset-4"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>

              <div className="p-2">
                {nav.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "flex items-center justify-between rounded-xl px-4 py-3 text-sm transition",
                        "text-white/80 hover:bg-white/10 hover:text-white",
                        "focus-visible:outline-offset-4",
                        active ? "bg-white/10 text-white" : "",
                      ].join(" ")}
                      onClick={() => setOpen(false)}
                    >
                      <span>{item.label}</span>
                      {active ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

