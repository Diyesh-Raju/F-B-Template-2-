import { Section } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MenuClient } from "./MenuClient";
import { Card } from "@/components/Card";

export const metadata = {
  title: "Menu",
};

export default function MenuPage() {
  return (
    <div>
      <div className="mx-auto w-full max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
        <Reveal preset="fadeUp">
          <h1 className="font-[var(--font-serif)] text-4xl tracking-tight text-white sm:text-5xl">
            Menu
          </h1>
        </Reveal>
        <Reveal preset="fadeUp" transition={{ delay: 0.08 }}>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
            A curated set of staples and seasonal specials. Use these sections as
            high-quality placeholders—wire in real data whenever you’re ready.
          </p>
        </Reveal>
      </div>

      <Section
        eyebrow="Explore"
        title="Find your lane"
        description="Filterable categories with subtle micro-interactions."
      >
        <MenuClient />
      </Section>

      <Section
        eyebrow="Notes"
        title="Built for pacing"
        description="A few extra details that make the menu page feel complete."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal preset="fadeUp">
            <Card
              title="Seasonal swaps"
              description="We rotate garnishes and sides weekly based on what’s best at market."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card
              title="Spice level"
              description="Most dishes are balanced and mild; we’ll happily push heat if you ask."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
            <Card
              title="Pairing help"
              description="Tell us your mood—bright, bitter, smoky, clean—and we’ll match it."
            />
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="Chef’s picks"
        title="Good starting points"
        description="If you’re not sure where to begin, try these combinations."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal preset="fadeUp">
            <Card
              title="Bright + crisp"
              description="Citrus spritz + fritters + olive oil cake."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card
              title="Smoky + rich"
              description="Roasted chicken + mushrooms + cold brew."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
            <Card
              title="Clean + coastal"
              description="Seared salmon + spritz + tart."
            />
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="Allergens"
        title="Quick guide"
        description="Placeholder info—swap for your actual allergen matrix later."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal preset="fadeUp">
            <Card
              title="Common ingredients"
              description="Nuts, dairy, and gluten appear in some items. Ask for swaps where possible."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card
              title="Cross-contact"
              description="We’ll do our best, but the kitchen handles multiple allergens."
            />
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="Late hours"
        title="Happy-hour energy"
        description="Extra detail so the page feels fuller."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal preset="fadeUp">
            <Card title="Weeknights" description="6–8 pm: lighter pours, brighter plates." />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card title="Weekends" description="8 pm onward: deeper menu, slower pacing." />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
            <Card title="Last call" description="Final round before close—ask what’s best right now." />
          </Reveal>
        </div>
      </Section>
    </div>
  );
}

