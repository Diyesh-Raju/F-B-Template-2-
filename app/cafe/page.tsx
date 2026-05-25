import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollScrubVideoHero } from "@/components/hero/ScrollScrubVideoHero";
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
      <ScrollScrubVideoHero
        src="/hero/cafe-scroll-hero.mp4"
        scrollDistanceVh={300}
        overlayClassName="bg-transparent opacity-0"
      />

      <Section
        eyebrow="Bakery"
        title="Soft + warm"
        description="A few staples that pair well with espresso."
      >
        <div className="grid gap-4 md:grid-cols-4">
          <Reveal preset="fadeUp">
            <Card title="Croissant" description="Butter layers, crisp edge." />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card title="Olive oil cake" description="Citrus peel, soft crumb." />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
            <Card title="Chocolate tart" description="Dark cocoa + sea salt." />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.18 }}>
            <Card title="Seasonal bun" description="Rotates weekly." />
          </Reveal>
        </div>
      </Section>

      <ImagesScrollingAnimation />

      <CafeMachinesShowcase />

      <CoffeeBanner />

      <MenuShowcase />

      <Section
        eyebrow="Work mode"
        title="Your Perfect Work Environment"
      >
        <div className="grid gap-4 lg:grid-cols-12">
          <Reveal preset="scaleIn" className="lg:col-span-6">
            <div className="aspect-[736/1185] w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cafe/work-environment.png"
                alt="A laptop, candle, and coffee mug on a marble table in a softly lit cafe lounge"
                className="block h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <div className="grid gap-2 lg:col-span-6 lg:pt-16">
            <Reveal preset="fadeUp">
              <Card title="Wi‑Fi" description="Fast and stable (placeholder)." />
            </Reveal>
            <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
              <Card title="Power" description="Plenty of outlets (placeholder)." />
            </Reveal>
            <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
              <Card title="Sound" description="Low, clean, non-distracting." />
            </Reveal>
          </div>
        </div>
      </Section>

      <CafeFeatureRows />
    </div>
  );
}

