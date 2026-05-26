import { ScrollLink } from "@/components/ScrollLink";
import { Reveal } from "@/components/motion/Reveal";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[color:var(--bg)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Reveal preset="fadeUp">
            <div>
              <div className="font-[var(--font-serif)] text-lg">Nocturne</div>
              <div className="mt-1 text-sm text-white/60">
                Dark, modern, and animation-ready.
              </div>
            </div>
          </Reveal>

          <Reveal preset="fadeUp" transition={{ delay: 0.1 }}>
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
              <ScrollLink className="cursor-pointer hover:text-white" href="/fmcg">
                FMCG
              </ScrollLink>
              <span className="text-white/25">·</span>
              <ScrollLink className="cursor-pointer hover:text-white" href="/brewery">
                Brewery
              </ScrollLink>
              <span className="text-white/25">·</span>
              <ScrollLink className="cursor-pointer hover:text-white" href="/cafe">
                Cafe
              </ScrollLink>
              <span className="text-white/25">·</span>
              <ScrollLink className="cursor-pointer hover:text-white" href="/contact">
                Contact us
              </ScrollLink>
            </div>
          </Reveal>
        </div>

        <Reveal preset="fadeIn" transition={{ delay: 0.18 }}>
          <div className="flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/55 sm:flex-row">
            <div>© {new Date().getFullYear()} Nocturne. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a className="hover:text-white" href="#" aria-label="Instagram">
                Instagram
              </a>
              <a className="hover:text-white" href="#" aria-label="X">
                X
              </a>
              <a className="hover:text-white" href="#" aria-label="TikTok">
                TikTok
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
