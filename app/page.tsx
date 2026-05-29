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
import { HeroSlider } from "@/components/hero/HeroSlider";
import { CuratingMasterpieces } from "@/components/hero/CuratingMasterpieces";

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
    image: "/gallery/friends-nightout.png",
  },
  {
    title: "Family Dinner",
    subtitle: "Long table, slow plates",
    image: "/gallery/family-dinner.png",
  },
  {
    title: "Birthday Party",
    subtitle: "Candles and a deep red",
    image: "/gallery/birthday-party.png",
  },
  {
    title: "Couple's Date",
    subtitle: "A booth tucked in the back",
    image: "/gallery/couple-date.png",
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
    image: "/gallery/team-bonding.png",
  },
];

export default function Home() {
  return (
    <div>
      {/* Auto-sliding hero — Brewery / Café / FMCG, slides left every 2s. */}
      <HeroSlider />

      {/* Intro band — vertical matcha video on the left, heading + copy right. */}
      <CuratingMasterpieces />

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
    </div>
  );
}
