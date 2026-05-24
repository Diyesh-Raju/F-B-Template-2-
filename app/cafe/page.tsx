import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/Button";
import { ScrollScrubVideoHero } from "@/components/hero/ScrollScrubVideoHero";
import { ImagesScrollingAnimation } from "@/components/cafe/ImagesScrollingAnimation";
import { CoffeeBanner } from "@/components/cafe/CoffeeBanner";
import { MenuShowcase } from "@/components/cafe/MenuShowcase";
import { CafeFeatureRows } from "@/components/cafe/CafeFeatureRows";

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

      <Section
        eyebrow="Coffee"
        title="Built for clarity"
        description="Placeholders—swap for your actual beans and roasts later."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal preset="fadeUp">
            <Card title="Espresso" description="Chocolate + cherry notes." meta="₹180" />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card title="Flat white" description="Silky milk, clean finish." meta="₹220" />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
            <Card title="Cold brew" description="Bright, low bitterness." meta="₹240" />
          </Reveal>
        </div>
      </Section>

      <CoffeeBanner />

      <div className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6 sm:pt-12">
        <Reveal preset="fadeUpLg">
          <h1 className="font-[var(--font-serif)] text-4xl tracking-tight text-white sm:text-5xl">
            Cafe
          </h1>
        </Reveal>
        <Reveal preset="fadeUp" transition={{ delay: 0.08 }}>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
            Daylight hours: clean espresso, soft pastry, and a calm room to read
            or work.
          </p>
        </Reveal>
        <Reveal preset="fadeUp" transition={{ delay: 0.14 }}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/menu" variant="primary">
              View cafe menu
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Catering inquiry
            </ButtonLink>
          </div>
        </Reveal>
      </div>

      <MenuShowcase />

      <Section
        eyebrow="Work mode"
        title="A room that holds focus"
        description="Extra content so the page feels complete."
      >
        <div className="grid gap-4 lg:grid-cols-12">
          <Reveal preset="scaleIn" className="lg:col-span-7">
            <div className="h-72 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 sm:h-96" />
          </Reveal>
          <div className="grid gap-4 lg:col-span-5">
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

      <Section
        eyebrow="Coffee class"
        title="Learn the basics"
        description="More content so the page doesn’t feel short."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal preset="fadeUp">
            <Card
              title="Espresso fundamentals"
              description="Dial-in, extraction, and milk texture—hands-on and practical."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card
              title="Pour-over tasting"
              description="Acidity, sweetness, and body—learn to taste cleanly."
            />
          </Reveal>
        </div>
      </Section>

      <CafeFeatureRows />
    </div>
  );
}

