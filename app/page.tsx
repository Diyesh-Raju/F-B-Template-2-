import { ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";

export default function Home() {
  return (
    <div>
      <section className="relative bg-[color:var(--bg)]">
        <div className="relative h-[92svh] w-full overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[color:var(--bg)]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 20%, rgba(255,179,71,0.22), transparent 55%), radial-gradient(circle at 70% 30%, rgba(197,255,211,0.14), transparent 60%), radial-gradient(circle at 50% 85%, rgba(255,255,255,0.06), transparent 55%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[color:var(--bg)]/55" />
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20">
            <Reveal preset="fadeUp">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                New seasonal tasting menu
              </div>
            </Reveal>

            <Reveal preset="fadeUp" transition={{ delay: 0.06, duration: 0.7 }}>
              <h1 className="mt-6 max-w-3xl font-[var(--font-serif)] text-5xl leading-[1.02] tracking-tight text-white sm:text-6xl">
                A dark, modern bar &amp; kitchen—crafted for late hours.
              </h1>
            </Reveal>

            <Reveal preset="fadeUp" transition={{ delay: 0.12, duration: 0.7 }}>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                Signature pours, small plates, and a menu built for curiosity.
                Late-night comfort, dialed in.
              </p>
            </Reveal>

            <Reveal preset="fadeUp" transition={{ delay: 0.18, duration: 0.7 }}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/menu" variant="primary">
                  View menu
                </ButtonLink>
                <ButtonLink href="/contact" variant="secondary">
                  Book a table
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Signature"
        title="Highlights that set the tone"
        description="Stagger-friendly cards for categories, features, or signature items. Motion is wired so it’s easy to add more later."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal preset="fadeUp">
            <Card
              title="Charred Citrus Spritz"
              description="Bright, bitter, and smoky—built on a house citrus cordial."
              meta="₹480"
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card
              title="Miso Butter Mushrooms"
              description="Umami-forward with a crisp edge and herb oil finish."
              meta="₹420"
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
            <Card
              title="Midnight Chocolate Tart"
              description="Dark cocoa, sea salt, and a mint-cold cream."
              meta="₹360"
            />
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="How it works"
        title="A simple rhythm for your night"
        description="Extra content blocks so the homepage feels complete."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal preset="fadeUp">
            <Card
              title="Start light"
              description="A crisp spritz, a bright bite, and a quick reset from the day."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card
              title="Go deep"
              description="Umami plates and darker pours—built for slow conversation."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
            <Card
              title="Finish clean"
              description="Dessert with edge: salt, smoke, citrus, and a cold finish."
            />
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="Atmosphere"
        title="Designed for glow, depth, and motion"
        description="Parallax-ready blocks and section reveals. Swap these placeholders for real photography when ready."
      >
        <div className="grid gap-4 lg:grid-cols-12">
          <Reveal preset="scaleIn" className="lg:col-span-7">
            <div className="h-64 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-[var(--shadow-glow)] sm:h-80" />
          </Reveal>
          <div className="grid gap-4 lg:col-span-5">
            <Reveal preset="fadeIn">
              <div className="h-32 rounded-2xl border border-white/10 bg-white/5 sm:h-36" />
            </Reveal>
            <Reveal preset="fadeIn" transition={{ delay: 0.06 }}>
              <div className="h-32 rounded-2xl border border-white/10 bg-white/5 sm:h-36" />
            </Reveal>
            <Reveal preset="fadeIn" transition={{ delay: 0.12 }}>
              <div className="h-32 rounded-2xl border border-white/10 bg-white/5 sm:h-36" />
            </Reveal>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Words"
        title="A few notes from regulars"
        description="Placeholder testimonials with stagger-ready cards."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal preset="fadeUp">
            <Card
              title="“The lighting feels like a soundtrack.”"
              description="Every detail is considered. Drinks are balanced, food is bold."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card
              title="“Quiet luxury, zero pretension.”"
              description="Perfect pacing, friendly service, and a menu that surprises."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
            <Card
              title="“A new favorite for late dinners.”"
              description="The tart is unreal. The spritz is mandatory."
            />
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="FAQ"
        title="Quick answers"
        description="Small details help the page feel finished."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal preset="fadeUp">
            <Card
              title="Do you take walk-ins?"
              description="Yes—bar seating is first come, first served. For groups, booking is best."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card
              title="What’s the vibe?"
              description="Low light, clean sound, and a menu designed for pacing—fast if you want, slow if you can."
            />
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="Gallery"
        title="A few frames"
        description="Placeholders for photography—swap for real images anytime."
      >
        <div className="grid gap-4 md:grid-cols-12">
          <Reveal preset="scaleIn" className="md:col-span-7">
            <div className="h-72 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 sm:h-96" />
          </Reveal>
          <div className="grid gap-4 md:col-span-5">
            <Reveal preset="fadeIn">
              <div className="h-36 rounded-2xl border border-white/10 bg-white/5" />
            </Reveal>
            <Reveal preset="fadeIn" transition={{ delay: 0.06 }}>
              <div className="h-36 rounded-2xl border border-white/10 bg-white/5" />
            </Reveal>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Neighborhood"
        title="Made for late hours"
        description="A little story helps the homepage feel less short."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal preset="fadeUp">
            <Card
              title="Walk in"
              description="Slip in for one drink, or settle in for the full arc."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card
              title="Stay awhile"
              description="Small plates built to share—easy pacing, no rush."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
            <Card
              title="Leave lighter"
              description="Clean finishes, balanced sweetness, and a calm last note."
            />
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="Updates"
        title="Get the seasonal drop"
        description="A simple newsletter UI (placeholder)."
      >
        <Reveal preset="fadeUp">
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-medium text-white">
              Monthly menu notes
            </div>
            <p className="mt-2 text-sm leading-6 text-white/60">
              One email a month—new specials, collabs, and late-night events.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                className="h-11 flex-1 rounded-xl border border-white/12 bg-black/20 px-4 text-white placeholder:text-white/35 focus-visible:outline-offset-4"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
              />
              <button
                type="button"
                className="h-11 rounded-xl bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90 focus-visible:outline-offset-4"
              >
                Subscribe
              </button>
            </div>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}
