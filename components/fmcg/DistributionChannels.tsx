"use client";

import { Reveal } from "@/components/motion/Reveal";

type Channel = {
  number: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

const CHANNELS: Channel[] = [
  {
    number: "01.",
    title: "Quick Commerce",
    description:
      "Maximize product exposure on India's fastest-growing quick commerce platforms. Boost visibility, accelerate sales, and reach a broader audience.",
    image: "/fmcg/channel-quick-commerce.png",
    alt: "Quick commerce delivery rider on a scooter",
  },
  {
    number: "02.",
    title: "E - Commerce",
    description:
      "Elevate your brand's visibility and competitive edge on every popular e-commerce platform in India with a strategic approach and proven best practices.",
    image: "/fmcg/channel-ecommerce.png",
    alt: "E-commerce parcels and a shopping cart icon on a laptop",
  },
  {
    number: "03.",
    title: "General Trade",
    description:
      "With an expansive reach across 145,000+ retail stores, we dominate the Indian market, ensuring seamless premium product distribution.",
    image: "/fmcg/channel-general-trade.png",
    alt: "Neighborhood kirana store storefront",
  },
  {
    number: "04.",
    title: "Traditional Wholesale",
    description:
      "VTC serves more than 3,700 key accounts in traditional wholesale, categorized as Platinum, Gold, and Silver based on business size and growth potential.",
    image: "/fmcg/channel-traditional-wholesale.png",
    alt: "Traditional wholesale market with stacked goods",
  },
  {
    number: "05.",
    title: "Modern Trade (National)",
    description:
      "Secure exclusive partnerships with India's leading national store chains to drive sales and brand awareness through coordinated category programs.",
    image: "/fmcg/channel-modern-trade-national.png",
    alt: "Large national supermarket aisle",
  },
  {
    number: "06.",
    title: "Modern Trade (Regional)",
    description:
      "We have established strong partnerships with regional chains of stores and are continually expanding our presence to cover upcoming stores in those regions.",
    image: "/fmcg/channel-modern-trade-regional.png",
    alt: "Regional supermarket interior",
  },
  {
    number: "07.",
    title: "Cash & Carry",
    description:
      "We have partnered with international and national companies in India's cash and carry retail sector to ensure comprehensive market coverage.",
    image: "/fmcg/channel-cash-and-carry.png",
    alt: "Cash and carry warehouse floor with pallets",
  },
  {
    number: "08.",
    title: "Airports",
    description:
      "We have expanded our presence to include airport stores, allowing us to serve travelers with premium products on the go.",
    image: "/fmcg/channel-airports.png",
    alt: "Airport retail concourse",
  },
];

export function DistributionChannels() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-14 sm:px-6 sm:py-20">
      <Reveal preset="fadeUp">
        <h2 className="font-[var(--font-serif)] text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
          We place your products in{" "}
          <span className="text-[var(--accent)]">Every</span>{" "}
          Distribution Channel in India
        </h2>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:mt-16 sm:gap-8 md:grid-cols-2">
        {CHANNELS.map((channel, i) => (
          <Reveal
            key={channel.number}
            preset="fadeUp"
            transition={{ delay: (i % 2) * 0.06 }}
          >
            <ChannelCard channel={channel} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <article className="flex flex-col gap-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={channel.image}
          alt={channel.alt}
          className="h-full w-full object-cover"
        />
      </div>

      <div>
        <h3 className="font-[var(--font-serif)] text-xl font-bold leading-tight text-white sm:text-2xl">
          {channel.number} {channel.title}
        </h3>
        <p className="mt-2 font-[var(--font-sans)] text-sm leading-6 text-white/75 sm:text-base">
          {channel.description}
        </p>
      </div>
    </article>
  );
}
