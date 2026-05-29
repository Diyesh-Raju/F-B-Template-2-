import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Component as ClipMenuShowcase } from "@/components/hero/ClipMenuShowcase";
import { ChefPerspectiveBook } from "@/components/hero/ChefPerspectiveBook";
import {
  CircularGallery,
  type GalleryItem,
} from "@/components/hero/CircularGallery";
import { HeroSlider } from "@/components/hero/HeroSlider";
import { CuratingMasterpieces } from "@/components/hero/CuratingMasterpieces";

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
