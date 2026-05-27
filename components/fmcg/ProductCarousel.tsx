"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Item = {
  src: string;
  alt: string;
  label: string;
  description: string;
  bg: string;
  panel: string;
  objectPosition: string;
  centerScale: number;
  centerScaleMobile: number;
};

// Four products — Dairy / Snacks / Beverages / Essentials. Per-product
// background colours are picked to coordinate with each product's own
// brand palette so the backdrop read reinforces the active item.
const ITEMS: Item[] = [
  {
    src: "/fmcg/product-dairy.png",
    alt: "Assorted dairy products",
    label: "Dairy Products",
    description:
      "Cold-chain milk, butter, ghee and cheeses, sourced from named dairies and packed within hours of the milking line.",
    bg: "#E8B153",
    panel: "#EFC579",
    objectPosition: "50% 80%",
    centerScale: 1.75,
    centerScaleMobile: 1.45,
  },
  {
    src: "/fmcg/product-snacks.png",
    alt: "Lay's Magic Masala chips bag with a bowl of chips",
    label: "Snacks",
    description:
      "Crisps, namkeen, baked bites and small-batch fried mixes — bold flavours from real kitchens, sealed for the shelf.",
    bg: "#0F2A6E",
    panel: "#1F3F8C",
    objectPosition: "50% 55%",
    centerScale: 1.55,
    centerScaleMobile: 1.25,
  },
  {
    src: "/fmcg/product-beverages.png",
    alt: "Red Bull energy drink can",
    label: "Beverages",
    description:
      "Energy drinks, sparkling sodas and zero-proof brews — chilled, carbonated and shelf-stable, delivered fast.",
    bg: "#B71D2E",
    panel: "#CB2E40",
    objectPosition: "50% 50%",
    centerScale: 1.25,
    centerScaleMobile: 1.05,
  },
  {
    src: "/fmcg/product-essentials.png",
    alt: "Aashirvaad atta wheat flour pack with bowl of flour",
    label: "Essentials",
    description:
      "Atta, rice, salt and pantry staples — the quiet workhorses of every Indian kitchen, milled fresh and sealed to lock in aroma.",
    bg: "#C46A24",
    panel: "#D87E38",
    objectPosition: "50% 55%",
    centerScale: 1.55,
    centerScaleMobile: 1.25,
  },
];

const AUTOPLAY_MS = 2400;
const TRANSITION_MS = 650;
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

export function ProductCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    ITEMS.forEach((it) => {
      const img = new Image();
      img.src = it.src;
    });
  }, []);

  const navigate = useCallback(
    (dir: "next" | "prev") => {
      if (isAnimating) return;
      setIsAnimating(true);
      setActiveIndex((prev) =>
        dir === "next"
          ? (prev + 1) % ITEMS.length
          : (prev + ITEMS.length - 1) % ITEMS.length,
      );
      setTimeout(() => setIsAnimating(false), TRANSITION_MS);
    },
    [isAnimating],
  );

  useEffect(() => {
    const id = setInterval(() => {
      navigate("next");
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [navigate]);

  const active = ITEMS[activeIndex];
  const leftIndex = (activeIndex + ITEMS.length - 1) % ITEMS.length;
  const rightIndex = (activeIndex + 1) % ITEMS.length;

  // ALL motion lives on `transform` (translate + scale) so Safari/WebKit
  // doesn't desync layout-thread interpolation (left/bottom/height) with
  // compositor-thread interpolation (transform). Box dimensions are
  // intentionally static — never animate width/height/left/bottom here,
  // or the off-centre snap returns.
  const itemTransition = [
    `transform ${TRANSITION_MS}ms ${EASE}`,
    `filter ${TRANSITION_MS}ms ${EASE}`,
    `opacity ${TRANSITION_MS}ms ${EASE}`,
  ].join(", ");

  return (
    <section
      className="relative w-full overflow-hidden font-[var(--font-sans)]"
      style={{
        backgroundColor: active.bg,
        transition: `background-color ${TRANSITION_MS}ms ${EASE}`,
      }}
    >
      <div className="relative h-[100vh] w-full overflow-hidden">
        {/* Grain overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.08'/></svg>\")",
            backgroundSize: "200px 200px",
            backgroundRepeat: "repeat",
          }}
        />

        {/* Soft radial stage light behind the active product — pushes the
            background back and makes the product read as foreground. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 1,
            background:
              "radial-gradient(ellipse 55% 65% at 50% 68%, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.18) 35%, transparent 70%)",
          }}
        />

        {/* Giant ghost text */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 flex select-none items-center justify-center font-[var(--font-anton)]"
          style={{
            zIndex: 2,
            top: "14%",
            fontSize: "clamp(36px, 8vw, 120px)",
            fontWeight: 900,
            color: "white",
            opacity: 1,
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
          }}
        >
          WIDE RANGE PRODUCTS
        </div>

        {/* Brand label top-left */}
        <div
          className="absolute left-4 top-6 sm:left-8"
          style={{
            zIndex: 60,
            color: "white",
            opacity: 0.9,
            letterSpacing: "0.18em",
          }}
        >
          <span className="text-xs font-semibold uppercase">
            Nocturne FMCG
          </span>
        </div>

        {/* Contact / ground shadow under the active product. Sits between
            the stage light and the product so the centre item reads like
            it's resting on a surface in front of the viewer. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            zIndex: 18,
            left: "50%",
            bottom: isMobile ? "7%" : "5%",
            width: isMobile ? "44%" : "30%",
            height: isMobile ? "4%" : "5%",
            transform: "translateX(-50%)",
            background:
              "radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.28) 45%, transparent 75%)",
            filter: "blur(18px)",
            transition: `background-color ${TRANSITION_MS}ms ${EASE}`,
          }}
        />

        {/* Carousel layer */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {ITEMS.map((item, i) => {
            const role: "center" | "left" | "right" | "back" =
              i === activeIndex
                ? "center"
                : i === leftIndex
                  ? "left"
                  : i === rightIndex
                    ? "right"
                    : "back";

            const style = roleStyle(role, item, isMobile);
            return (
              <div
                key={item.src}
                className="absolute"
                style={{
                  ...style,
                  aspectRatio: "0.6 / 1",
                  transition: itemTransition,
                  willChange: "transform, filter, opacity",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.alt}
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: item.objectPosition,
                  }}
                 loading="lazy" decoding="async"/>
              </div>
            );
          })}
        </div>

        {/* Bottom-left: active label + per-item description */}
        <div
          className="absolute bottom-6 left-2 sm:bottom-20 sm:left-8"
          style={{ zIndex: 60, maxWidth: 360 }}
        >
          <p
            className="mb-2 text-base font-bold uppercase tracking-widest text-white sm:mb-3 sm:text-[22px]"
            style={{ opacity: 0.95, letterSpacing: "0.02em" }}
          >
            {active.label}
          </p>
          <p
            className="hidden text-xs leading-relaxed text-white sm:block sm:text-sm"
            style={{ opacity: 0.85, lineHeight: 1.6 }}
          >
            {active.description}
          </p>
        </div>

        {/* Bottom-right: prev / next nav */}
        <div
          className="absolute bottom-6 right-4 flex items-center gap-3 sm:bottom-20 sm:right-10"
          style={{ zIndex: 60 }}
        >
          <NavButton
            label="Previous"
            onClick={() => navigate("prev")}
            icon={<ArrowLeft size={26} strokeWidth={2.25} />}
          />
          <NavButton
            label="Next"
            onClick={() => navigate("next")}
            icon={<ArrowRight size={26} strokeWidth={2.25} />}
          />
        </div>
      </div>
    </section>
  );
}

function NavButton({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-transparent text-white transition-all duration-150 hover:scale-[1.08] hover:bg-white/15 sm:h-16 sm:w-16"
    >
      {icon}
    </button>
  );
}

// Beefier stacked drop-shadows so the centre product reads like it's
// genuinely in front of the user — a tight contact shadow plus body and
// ambient layers, each hugging the actual silhouette (drop-shadow follows
// the PNG's alpha channel, which is why removing the white background is
// step one for this 3D feel to land).
const CENTER_3D_SHADOW =
  "drop-shadow(0 6px 8px rgba(0,0,0,0.42)) " +
  "drop-shadow(0 22px 30px rgba(0,0,0,0.36)) " +
  "drop-shadow(0 55px 70px rgba(0,0,0,0.28)) " +
  "drop-shadow(0 110px 130px rgba(0,0,0,0.18))";
const SIDE_3D_SHADOW =
  "blur(2px) drop-shadow(0 8px 14px rgba(0,0,0,0.28)) drop-shadow(0 22px 28px rgba(0,0,0,0.18))";

// Static box dimensions used by every item, regardless of role. Sides are
// the same physical box as the centre; they just get translated up and
// scaled down via `transform` (no layout change → no Safari desync).
const BOX_BOTTOM_DESKTOP = 8; // vh — element's bottom edge sits 8vh from container bottom
const BOX_BOTTOM_MOBILE = 10;
const BOX_HEIGHT_DESKTOP = 70; // vh — element's intrinsic height
const BOX_HEIGHT_MOBILE = 62;

// Side visual targets (where sides used to live, in vh). Used to compute
// the translateY needed to put a scaled-down side at the right spot.
const SIDE_BOTTOM_DESKTOP = 12;
const SIDE_BOTTOM_MOBILE = 32;
const SIDE_HEIGHT_DESKTOP = 32;
const SIDE_HEIGHT_MOBILE = 18;

function roleStyle(
  role: "center" | "left" | "right" | "back",
  item: Item,
  isMobile: boolean,
): React.CSSProperties {
  const xVw =
    role === "center" || role === "back"
      ? 50
      : role === "left"
        ? isMobile
          ? 20
          : 26
        : // right
          isMobile
          ? 80
          : 74;

  const boxBottom = isMobile ? BOX_BOTTOM_MOBILE : BOX_BOTTOM_DESKTOP;
  const boxHeight = isMobile ? BOX_HEIGHT_MOBILE : BOX_HEIGHT_DESKTOP;
  const sideHeight = isMobile ? SIDE_HEIGHT_MOBILE : SIDE_HEIGHT_DESKTOP;
  const sideBottom = isMobile ? SIDE_BOTTOM_MOBILE : SIDE_BOTTOM_DESKTOP;

  // Shared base (identical for every item — only transform/opacity differ):
  const base: React.CSSProperties = {
    left: 0,
    bottom: `${boxBottom}vh`,
    height: `${boxHeight}vh`,
    transformOrigin: "50% 100%",
  };

  if (role === "center") {
    const scale = isMobile ? item.centerScaleMobile : item.centerScale;
    return {
      ...base,
      transform: `translate3d(${xVw}vw, 0, 0) translateX(-50%) scale(${scale})`,
      filter: CENTER_3D_SHADOW,
      opacity: 1,
      zIndex: 20,
    };
  }
  if (role === "left" || role === "right") {
    // Match the original side visual: a sideHeight-tall element whose
    // bottom sits at sideBottom. We achieve that by scaling the (taller)
    // box down to sideHeight/boxHeight and translating its bottom edge up
    // from boxBottom to sideBottom.
    const scale = sideHeight / boxHeight;
    const yVh = -(sideBottom - boxBottom);
    return {
      ...base,
      transform: `translate3d(${xVw}vw, ${yVh}vh, 0) translateX(-50%) scale(${scale})`,
      filter: SIDE_3D_SHADOW,
      opacity: 0.85,
      zIndex: 10,
    };
  }
  // back — parked behind centre, invisibly small. Same Y offset as sides
  // so the transition to/from a side role is pure scale + opacity, no
  // surprise vertical jump.
  const yVh = -(sideBottom - boxBottom);
  const scale = (sideHeight / boxHeight) * 0.5;
  return {
    ...base,
    transform: `translate3d(${xVw}vw, ${yVh}vh, 0) translateX(-50%) scale(${scale})`,
    filter: SIDE_3D_SHADOW,
    opacity: 0,
    zIndex: 1,
  };
}
