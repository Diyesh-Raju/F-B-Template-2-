import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";
import { CafeHeroScrub } from "@/components/cafe/CafeHeroScrub";
import { ImagesScrollingAnimation } from "@/components/cafe/ImagesScrollingAnimation";
import { CoffeeBanner } from "@/components/cafe/CoffeeBanner";
import { MenuShowcase } from "@/components/cafe/MenuShowcase";
import { CafeFeatureRows } from "@/components/cafe/CafeFeatureRows";
import { CafeMachinesShowcase } from "@/components/cafe/CafeMachinesShowcase";

export const metadata = {
  title: "Cafe",
};

export default function CafePage() {
  return (
    <div>
      <CafeHeroScrub />

      <Section
        eyebrow="Bakery"
        title={<span style={{ color: "#000000" }}>Soft + warm</span>}
        description="A few staples that pair well with espresso. ☕"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal preset="fadeUp">
            <Card
              title="Croissant"
              description="Butter layers, crisp edge."
              meta={
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/cafe/dish-croissant.png"
                  alt=""
                  aria-hidden="true"
                  className="h-24 w-24 shrink-0 object-contain"
                 loading="lazy" decoding="async"/>
              }
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card
              title="Tiramisu"
              description="Cocoa-dusted mascarpone, espresso-soaked layers."
              meta={
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/cafe/dish-tiramisu.png"
                  alt=""
                  aria-hidden="true"
                  className="h-24 w-24 shrink-0 object-contain"
                 loading="lazy" decoding="async"/>
              }
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
            <Card
              title="Dark Choco Waffles"
              description="Crisp cocoa squares, berries, and vanilla cream."
              meta={
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/cafe/dish-dark-choco-waffles.png"
                  alt=""
                  aria-hidden="true"
                  className="h-24 w-24 shrink-0 object-contain"
                 loading="lazy" decoding="async"/>
              }
            />
          </Reveal>
        </div>
      </Section>

      <ImagesScrollingAnimation />

      <CafeMachinesShowcase />

      <CoffeeBanner />

      <MenuShowcase />

      <Section
        eyebrow="Work mode"
        title={
          <span
            className="font-normal"
            style={{ fontFamily: "var(--font-cherry-bomb)" }}
          >
            Your Perfect Work Environment
          </span>
        }
      >
        <div className="grid gap-4 lg:grid-cols-12">
          <Reveal preset="scaleIn" className="lg:col-span-4">
            <div className="aspect-[736/1185] w-full max-w-[260px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cafe/work-environment.png"
                alt="A laptop, candle, and coffee mug on a marble table in a softly lit cafe lounge"
                className="block h-full w-full object-cover"
               loading="lazy" decoding="async"/>
            </div>
          </Reveal>
          <div className="grid gap-2 lg:col-span-6 lg:pt-16">
            <Reveal preset="fadeUp">
              <Card
                title="Wi‑Fi"
                description="Fast and stable (placeholder)."
                meta={<span className="text-4xl leading-none">🛜</span>}
              />
            </Reveal>
            <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
              <Card
                title="Power"
                description="Plenty of outlets (placeholder)."
                meta={<span className="text-4xl leading-none">🔌</span>}
              />
            </Reveal>
            <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
              <Card
                title="Sound"
                description="Low, clean, non-distracting."
                meta={<span className="text-4xl leading-none">☕📖</span>}
              />
            </Reveal>
          </div>
        </div>
      </Section>

      <CafeFeatureRows />
    </div>
  );
}

