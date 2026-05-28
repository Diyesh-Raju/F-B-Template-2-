"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  image: string;
  /** Natural aspect ratio of the source image, e.g. "1200 / 675". Drives how
   *  tall the image layer is rendered at the section's full width. */
  aspectRatio?: string;
  /** CSS height for the visible "window" through which the image scrolls. */
  height?: string;
  alt?: string;
};

/**
 * Section-height window that reveals a taller image by translating it
 * bottom→top as the section traverses the viewport. Same scroll mechanism
 * used for the cafe's CoffeeBanner, mirroring the 43coffee.com effect where
 * the next section "scrolls over" the image as you move down the page.
 */
export function ScrollImageBanner({
  image,
  aspectRatio = "16 / 9",
  height = "clamp(360px, 70vh, 640px)",
  alt = "",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const layer = layerRef.current;
    if (!section || !layer) return;

    const measure = () => {
      setTravel(Math.max(0, layer.offsetHeight - section.offsetHeight));
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(section);
    ro.observe(layer);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // progress 0 → image shifted up so its BOTTOM aligns with the window top.
  // progress 1 → image at neutral, its TOP aligned with the window top.
  // Sweep over the full image span as the user scrolls past the section.
  const y = useTransform(scrollYProgress, [0, 1], [-travel, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate w-full overflow-hidden"
      style={{ height }}
      aria-label={alt}
    >
      <motion.div
        ref={layerRef}
        aria-hidden="true"
        style={{
          y,
          backgroundImage: `url('${image}')`,
          aspectRatio,
        }}
        // On phones the image, scaled to the viewport width, is SHORTER than
        // the (short) banner section, so layerHeight - sectionHeight <= 0 and
        // there's nothing to parallax. Rendering it wider on mobile makes it
        // taller than the section, restoring travel room. We position with
        // left/width (NOT transform) so we don't clobber framer-motion's `y`
        // translate. sm+ restores the desktop full-width behavior exactly.
        className="absolute top-0 left-[-55%] w-[210%] bg-cover bg-center bg-no-repeat sm:left-0 sm:w-full"
      />
    </section>
  );
}
