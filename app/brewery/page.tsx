import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/Button";
import { BreweryHeroScrub } from "@/components/brewery/BreweryHeroScrub";
import { FeatureStrip } from "@/components/brewery/FeatureStrip";
import { SignatureCreations } from "@/components/brewery/SignatureCreations";
import { OccasionsGrid } from "@/components/brewery/OccasionsGrid";
import { ScrollImageBanner } from "@/components/brewery/ScrollImageBanner";
import { ReviewsMarquee } from "@/components/brewery/ReviewsMarquee";
import { RatingsStrip } from "@/components/brewery/RatingsStrip";
import { BrewCarousel } from "@/components/brewery/BrewCarousel";
import { LocationCard } from "@/components/brewery/LocationCard";
import { DayNightShowcase } from "@/components/brewery/DayNightShowcase";
import { SocialRow } from "@/components/SocialRow";

export const metadata = {
  title: "Brewery",
};

export default function BreweryPage() {
  return (
    <div>
      <BreweryHeroScrub />

      <FeatureStrip />

      <div className="mx-auto w-full max-w-6xl px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
        <Reveal preset="fadeUpLg">
          <h1 className="font-[var(--font-serif)] text-4xl tracking-tight text-white sm:text-5xl">
            Brewery
          </h1>
        </Reveal>
        <Reveal preset="fadeUp" transition={{ delay: 0.08 }}>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
            Small-batch pours, crisp carbonation, and a tap list that changes
            with the week.
          </p>
        </Reveal>
        <Reveal preset="fadeUp" transition={{ delay: 0.14 }}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" variant="primary">
              Book a tour
            </ButtonLink>
            <ButtonLink href="/menu" variant="secondary">
              Food pairings
            </ButtonLink>
          </div>
        </Reveal>
      </div>

      <SignatureCreations />

      <OccasionsGrid />

      <ScrollImageBanner
        image="/brewery/terrace.png"
        aspectRatio="1536 / 1024"
        alt="Moonlit terrace dining"
      />

      <DayNightShowcase />

      <ScrollImageBanner
        image="/brewery/terrace.png"
        aspectRatio="1536 / 1024"
        alt="Moonlit terrace dining"
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <Reveal preset="scaleIn" className="lg:col-span-7">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_22px_60px_rgba(0,0,0,0.55)] sm:aspect-[5/6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brewery/event-brunch.png"
                alt="Event of the month — a good brunch"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-5">
            <Reveal preset="fadeUp">
              <div className="font-[var(--font-serif)] text-xs font-medium tracking-[0.22em] text-[var(--accent)]">
                EVENT OF THE MONTH!
              </div>
            </Reveal>

            <Reveal preset="fadeUp" transition={{ delay: 0.08 }}>
              <p className="mt-6 font-[var(--font-serif)] text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
                Live counters, freshly curated delicacies and so much more!
                Join us every Sunday from{" "}
                <strong className="font-bold text-white">
                  12:00 PM till 3:00 PM
                </strong>{" "}
                for this month&apos;s special dining experience.
              </p>
            </Reveal>

            <Reveal preset="fadeUp" transition={{ delay: 0.16 }}>
              <p className="mt-10 font-[var(--font-serif)] text-4xl font-bold italic leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
                Good friends,
                <br />
                Great beer,
                <br />
                Amazing times!
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <BrewCarousel />

      <ReviewsMarquee />

      <RatingsStrip />

      <SocialRow />

      <LocationCard />
    </div>
  );
}

