import { Reveal } from "@/components/motion/Reveal";

type Item = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  imageRight?: boolean;
};

const ITEMS: Item[] = [
  {
    eyebrow: "Presence",
    title: "40+ Physical Branches",
    description:
      "From flagship cafés to neighbourhood pickup counters, our 40+ branches put the retail range within walking distance of the people buying it. Every location stocks the full lineup, doubles as a sampling point for new SKUs, and feeds same-day demand back into production.",
    image: "/fmcg/branches.png",
    alt: "Refrigerated retail shelves filled with colourful bottled drinks",
  },
  {
    eyebrow: "Fulfilment",
    title: "4 Mother Warehouses",
    description:
      "Four climate-controlled hubs — one per region — anchor the supply chain. Cold-chain bays, batch-level tracking, and 24/7 dispatch into modern trade, quick commerce, and our own branches keep travel time under twelve hours from dock to shelf.",
    image: "/fmcg/warehouse.png",
    alt: "Aerial dusk view of a modern logistics warehouse with truck bays",
    imageRight: true,
  },
];

export function FootprintShowcase() {
  return (
    <section className="w-full py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-16 sm:gap-24">
          {ITEMS.map((item) => (
            <Row key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ item }: { item: Item }) {
  const imageOrder = item.imageRight ? "order-1 lg:order-2" : "order-1";
  const textOrder = item.imageRight ? "order-2 lg:order-1" : "order-2";

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
      <Reveal preset="scaleIn" className={imageOrder}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_22px_60px_rgba(0,0,0,0.45)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.alt}
            className="h-full w-full object-cover"
          />
        </div>
      </Reveal>

      <div className={textOrder}>
        <Reveal preset="fadeUp">
          <div className="text-xs font-medium uppercase tracking-[0.22em] text-white/55">
            {item.eyebrow}
          </div>
        </Reveal>
        <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
          <h3 className="mt-4 font-[var(--font-serif)] text-4xl leading-tight tracking-tight text-white sm:text-5xl">
            {item.title}
          </h3>
        </Reveal>
        <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
          <p className="mt-5 text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            {item.description}
          </p>
        </Reveal>
      </div>
    </div>
  );
}
