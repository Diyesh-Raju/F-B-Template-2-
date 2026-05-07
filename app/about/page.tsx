import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";

export const metadata = {
  title: "About",
};

const timeline = [
  {
    year: "2019",
    title: "A tiny late-night counter",
    desc: "We started with five stools, one skillet, and a stubborn focus on balance.",
  },
  {
    year: "2022",
    title: "Seasonal menus, steady craft",
    desc: "We built a rhythm: reliable staples, rotating specials, and a bar program that evolves monthly.",
  },
  {
    year: "2026",
    title: "Nocturne, refined",
    desc: "A premium, dark aesthetic designed for glow, depth, and motion—ready to be customized.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <div className="mx-auto w-full max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
        <Reveal preset="fadeUp">
          <h1 className="font-[var(--font-serif)] text-4xl tracking-tight text-white sm:text-5xl">
            About
          </h1>
        </Reveal>
        <Reveal preset="fadeUp" transition={{ delay: 0.08 }}>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
            A short story, a few values, and a timeline built for scroll reveals.
          </p>
        </Reveal>
      </div>

      <Section
        eyebrow="Story"
        title="A timeline worth lingering on"
        description="Each step uses the same reveal system so future animations stay cohesive."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {timeline.map((t, idx) => (
            <Reveal key={t.year} preset="fadeUp" transition={{ delay: idx * 0.06 }}>
              <Card
                title={
                  <div className="flex items-baseline justify-between gap-4">
                    <span>{t.title}</span>
                    <span className="text-xs font-medium tracking-[0.22em] text-white/45">
                      {t.year}
                    </span>
                  </div>
                }
                description={t.desc}
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Values"
        title="What we optimize for"
        description="Good ingredients, careful pacing, and a room that feels intentional."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal preset="fadeUp">
            <Card
              title="Sourcing"
              description="Local when possible, high-integrity always. Menus change to match the market."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card
              title="Craft"
              description="Every element is tested for balance: acid, salt, texture, temperature."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
            <Card
              title="Hospitality"
              description="A calm, confident service style—present when you need it, invisible when you don’t."
            />
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="Process"
        title="From idea to plate"
        description="Extra sections so the About page reads fuller."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal preset="fadeUp">
            <Card
              title="R&amp;D nights"
              description="New drinks start as quick sketches, then get tested for balance and temperature over a few sessions."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card
              title="Service rehearsal"
              description="We practice pacing: what lands first, what waits, and how the table should feel at each step."
            />
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="Space"
        title="Designed for glow"
        description="A few details to make the world feel real."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal preset="fadeUp">
            <Card
              title="Lighting"
              description="Warm, directional light that keeps faces soft and drinks bright."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card
              title="Sound"
              description="Low, clean, and steady—enough energy without fighting conversation."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
            <Card
              title="Materials"
              description="Matte blacks, subtle texture, and metal details that catch highlights."
            />
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="Team"
        title="People behind the pass"
        description="Placeholder profiles—swap names/photos later."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal preset="fadeUp">
            <Card title="Head chef" description="Seasonal intuition + disciplined technique." />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card title="Bar lead" description="Bitter, bright, and clean finishes—built for pacing." />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
            <Card title="Hospitality" description="Calm service that reads the table and adapts." />
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="Press"
        title="A few kind words"
        description="Replace with real mentions when you have them."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal preset="fadeUp">
            <Card
              title="“A room that feels like midnight.”"
              description="A tight menu, confident bar program, and a space designed to linger."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card
              title="“Polished without trying too hard.”"
              description="The kind of place you discover once, then bring everyone to."
            />
          </Reveal>
        </div>
      </Section>
    </div>
  );
}

