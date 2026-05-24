"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { Reveal } from "@/components/motion/Reveal";

type Category = "Starters" | "Mains" | "Drinks" | "Desserts";

const categories: Category[] = ["Starters", "Mains", "Drinks", "Desserts"];

const items = [
  { name: "Crisp Chickpea Fritters", desc: "Yuzu aioli, herb dust.", price: "₹320", cat: "Starters" as const },
  { name: "Miso Butter Mushrooms", desc: "Sesame, scallion, lemon.", price: "₹420", cat: "Starters" as const },
  { name: "Coal-Roasted Chicken", desc: "Black garlic, charred greens.", price: "₹680", cat: "Mains" as const },
  { name: "Seared Salmon", desc: "Citrus glaze, smoked salt.", price: "₹720", cat: "Mains" as const },
  { name: "Charred Citrus Spritz", desc: "House cordial, bitter orange.", price: "₹480", cat: "Drinks" as const },
  { name: "Mint Cold Brew", desc: "Cocoa nib, vanilla bean.", price: "₹240", cat: "Drinks" as const },
  { name: "Midnight Chocolate Tart", desc: "Sea salt, mint cream.", price: "₹360", cat: "Desserts" as const },
  { name: "Citrus Olive Oil Cake", desc: "Candied peel, whipped ricotta.", price: "₹320", cat: "Desserts" as const },
];

export function MenuClient() {
  const [active, setActive] = useState<Category>("Starters");

  const filtered = useMemo(
    () => items.filter((i) => i.cat === active),
    [active]
  );

  return (
    <div>
      <Reveal preset="fadeUp" className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const isActive = c === active;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={[
                "cursor-pointer rounded-full px-4 py-2 text-sm transition focus-visible:outline-offset-4",
                isActive
                  ? "bg-white text-black"
                  : "border border-white/12 bg-white/5 text-white/80 hover:bg-white/10",
              ].join(" ")}
            >
              {c}
            </button>
          );
        })}
      </Reveal>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {filtered.map((item, idx) => (
          <Reveal key={`${active}-${item.name}`} preset="fadeUp" transition={{ delay: idx * 0.04 }}>
            <Card title={item.name} description={item.desc} meta={item.price} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

