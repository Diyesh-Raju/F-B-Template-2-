"use client";

import { Reveal } from "@/components/motion/Reveal";

type Dish = {
  tag: string;
  name: string;
  description: string;
  rating: number;
};

const DISHES: Dish[] = [
  {
    tag: "Seafood",
    name: "Shetty's Prawns Ghee Roast",
    description:
      "Succulent prawns roasted in aromatic ghee with coastal spices.",
    rating: 4.8,
  },
  {
    tag: "Vegetarian",
    name: "Mushroom Ghee Roast",
    description:
      "Crispy mushrooms tossed in traditional ghee roast masala.",
    rating: 4.7,
  },
  {
    tag: "Asian",
    name: "Crispy Lotus Tempura Roll",
    description:
      "Delicate lotus root tempura with Japanese-inspired flavors.",
    rating: 4.9,
  },
  {
    tag: "Italian",
    name: "Fiery BBQ Chicken Pizza",
    description:
      "Wood-fired pizza with smoky BBQ chicken and fresh toppings.",
    rating: 4.6,
  },
  {
    tag: "Dessert",
    name: "Lotus Biscoff Dessert",
    description:
      "Creamy Biscoff indulgence with caramelized lotus notes.",
    rating: 4.9,
  },
  {
    tag: "Starters",
    name: "Cream of Mushroom Soup",
    description:
      "Velvety smooth soup with earthy mushroom essence.",
    rating: 4.5,
  },
];

export function SignatureCreations() {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat py-14 sm:py-20"
      style={{ backgroundImage: "url('/brewery/signature-bg.png')" }}
    >
      <div className="relative mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <Reveal preset="fadeUp">
          <div className="mx-auto max-w-2xl text-center">
            <div className="font-[var(--font-serif)] text-xs font-medium tracking-[0.22em] text-[var(--accent)]">
              CULINARY EXCELLENCE
            </div>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              <span
                className="text-6xl font-normal sm:text-7xl md:text-8xl"
                style={{ fontFamily: "var(--font-passions-conflict)" }}
              >
                Signature
              </span>{" "}
              <span className="font-sans">Creations</span>
            </h2>
            <p className="mt-4 font-[var(--font-serif)] text-base leading-7 text-white/75 sm:text-lg">
              Our most loved dishes, crafted with passion and the finest
              ingredients.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {DISHES.map((dish, i) => (
            <Reveal
              key={dish.name}
              preset="fadeUp"
              transition={{ delay: (i % 3) * 0.06 }}
            >
              <article className="h-full rounded-[1.75rem] border border-white/10 bg-[#024E36] p-7 shadow-[0_18px_50px_rgba(0,0,0,0.4)] transition duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/30 sm:p-8">
                <span className="inline-flex items-center rounded-full bg-[var(--accent)]/15 px-3 py-1 font-[var(--font-serif)] text-xs font-medium text-[var(--accent)] ring-1 ring-[var(--accent)]/30">
                  {dish.tag}
                </span>
                <h3 className="mt-5 font-[var(--font-display)] text-xl font-bold leading-tight text-white sm:text-2xl">
                  {dish.name}
                </h3>
                <p className="mt-3 font-[var(--font-serif)] text-sm font-normal leading-6 text-white/75">
                  {dish.description}
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <StarIcon className="h-4 w-4 text-[var(--accent)]" />
                  <span className="font-[var(--font-serif)] text-sm font-semibold text-white">
                    {dish.rating.toFixed(1)}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2.5l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.56l-5.91 3.1 1.13-6.57L2.45 9.44l6.6-.96L12 2.5z" />
    </svg>
  );
}
