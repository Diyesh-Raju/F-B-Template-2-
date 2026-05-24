import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Component as ClipMenuShowcase } from "@/components/hero/ClipMenuShowcase";
import { ChefPerspectiveBook } from "@/components/hero/ChefPerspectiveBook";
import {
  CircularGallery,
  type GalleryItem,
} from "@/components/hero/CircularGallery";
import { FloatingFoodHero } from "@/components/hero/FloatingFoodHero";
import { ScrollScrubVideoHero } from "@/components/hero/ScrollScrubVideoHero";

const floatingFoodImages = [
  {
    src: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80",
    alt: "Dessert plate",
    className:
      "top-[8%] left-[6%] w-28 h-28 sm:w-40 sm:h-40 rounded-full ring-1 ring-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.55)] animate-float",
  },
  {
    src: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
    alt: "Layered cocktail",
    className:
      "top-[14%] right-[8%] w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-1 ring-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.55)] animate-float",
  },
  {
    src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    alt: "Charred plate",
    className:
      "bottom-[12%] left-[12%] w-32 h-32 sm:w-44 sm:h-44 rounded-full ring-1 ring-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.55)] animate-float",
  },
  {
    src: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80",
    alt: "Late night sweet",
    className:
      "bottom-[16%] right-[14%] w-28 h-28 sm:w-36 sm:h-36 rounded-full ring-1 ring-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.55)] animate-float",
  },
  {
    src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
    alt: "Pour close up",
    className:
      "top-[42%] right-[3%] w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-1 ring-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.55)] animate-float",
  },
  {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    alt: "Plated bite",
    className:
      "top-[48%] left-[3%] w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-1 ring-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.55)] animate-float",
  },
];

const occasionGallery: GalleryItem[] = [
  {
    title: "Friend's Nightout",
    subtitle: "Round one is on the bar",
    image:
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1100&q=80",
  },
  {
    title: "Family Dinner",
    subtitle: "Long table, slow plates",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1100&q=80",
  },
  {
    title: "Birthday Party",
    subtitle: "Candles and a deep red",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1100&q=80",
  },
  {
    title: "Couple's Date",
    subtitle: "A booth tucked in the back",
    image:
      "https://images.unsplash.com/photo-1529417305485-480f579e7578?auto=format&fit=crop&w=1100&q=80",
  },
  {
    title: "Brunch Plans",
    subtitle: "Eggs, citrus, and a pour",
    image:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1100&q=80",
  },
  {
    title: "Team Bonding",
    subtitle: "Off-site, late shift, loud",
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1100&q=80",
  },
];

export default function Home() {
  return (
    <div>
      <ScrollScrubVideoHero
        src="/hero/home-scroll-hero.mp4"
        scrollDistanceVh={300}
        overlayClassName="bg-[color:var(--bg)] opacity-0"
      />

      {/* Sticky sections must not live under transformed parents (breaks position: sticky). */}
      <Reveal preset="fadeIn">
        <ClipMenuShowcase className="bg-[color:var(--bg)]" />
      </Reveal>

      <Section
        eyebrow="Kitchen"
        title="Meet the line—two pages, two chefs"
        description="Hover the cover to open a real spread: the left page is our executive chef; the right page is pastry—each with portrait, name, and story. Reduced motion shows the same content in a static two-column card."
      >
        <Reveal preset="fadeUp">
          <ChefPerspectiveBook className="py-4" />
        </Reveal>
      </Section>

      <CircularGallery items={occasionGallery} scrollDistanceVh={280} />

      <FloatingFoodHero
        title="Plated for late hours."
        description="Smoke, citrus, and cold cream—small plates and slow desserts engineered for low light and long conversations."
        images={floatingFoodImages}
      />

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
