import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Distribution } from "@/components/fmcg/Distribution";
import { BrandShowcase } from "@/components/fmcg/BrandShowcase";
import { ProductCarousel } from "@/components/fmcg/ProductCarousel";
import { DistributionChannels } from "@/components/fmcg/DistributionChannels";
import { USPs } from "@/components/fmcg/USPs";
import { BoatScrollBanner } from "@/components/fmcg/BoatScrollBanner";
import { FootprintShowcase } from "@/components/fmcg/FootprintShowcase";
import { FmcgHeroScrub } from "@/components/fmcg/FmcgHeroScrub";

export const metadata = {
  title: "FMCG",
};

export default function FmcgPage() {
  return (
    <div>
      <FmcgHeroScrub />

      <Distribution />

      <BoatScrollBanner>
        <Section
          eyebrow="Range"
          title="Four shelves, one kitchen"
          description="Categories that take the restaurant home with you."
        >
          <div className="grid gap-4 md:grid-cols-4">
            <Reveal preset="fadeUp">
              <Card
                title="Sauces & condiments"
                description="Slow-cooked bases, ghee roasts, and finishing oils."
              />
            </Reveal>
            <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
              <Card
                title="Snacks"
                description="Roasted, baked, and small-batch fried, never fried twice."
              />
            </Reveal>
            <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
              <Card
                title="Bottled brews"
                description="Tap-fresh pours and zero-proof sodas, sealed cold."
              />
            </Reveal>
            <Reveal preset="fadeUp" transition={{ delay: 0.18 }}>
              <Card
                title="Ready meals"
                description="Chef-portioned mains, blast-chilled within the hour."
              />
            </Reveal>
          </div>
        </Section>
      </BoatScrollBanner>

      <FootprintShowcase />

      <ProductCarousel />

      <BrandShowcase />

      <Section
        eyebrow="Standards"
        title="The labels behind the label"
        description="Certifications, audits, and the paperwork most brands skip."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal preset="fadeUp">
            <Card
              title="FSSAI compliant"
              description="Every SKU manufactured under audited HACCP conditions."
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <Card
              title="Clean labels"
              description="No artificial colours, no added preservatives, no shortcuts."
            />
          </Reveal>
        </div>
      </Section>

      <DistributionChannels />

      <USPs />
    </div>
  );
}
