"use client";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

interface MenuItem {
  num: string;
  name: string;
  clipId: string;
  image: string;
}

const defaultItems: MenuItem[] = [
  {
    num: "01",
    name: "Gourmet Burgers",
    clipId: "clip-original",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    num: "02",
    name: "Fresh Desserts",
    clipId: "clip-hexagons",
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    num: "03",
    name: "Artisan Waffles",
    clipId: "clip-pixels",
    image:
      "https://images.unsplash.com/photo-1562376552-0d160a2f238d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
];

export const Component = ({
  items = defaultItems,
  className,
}: {
  items?: MenuItem[];
  className?: string;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const imageRef = useRef<SVGImageElement>(null);
  const mainGroupRef = useRef<SVGGElement>(null);
  const masterTl = useRef<gsap.core.Timeline | null>(null);
  const isVisibleRef = useRef(false);
  const itemsRef = useRef(items);
  const autoCycleRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const createLoop = useCallback((index: number) => {
    const svg = svgRef.current;
    if (!svg) return;

    const item = itemsRef.current[index];
    if (!item) return;
    // Query elements via the SVG ref so we never depend on a global selector
    // that can race with mount/unmount during page transitions.
    const paths = svg.querySelectorAll<SVGGraphicsElement>(
      `#${item.clipId} .path`
    );
    if (paths.length === 0) return;

    if (masterTl.current) {
      masterTl.current.kill();
      masterTl.current = null;
    }

    if (imageRef.current) imageRef.current.setAttribute("href", item.image);
    if (mainGroupRef.current)
      mainGroupRef.current.setAttribute("clip-path", `url(#${item.clipId})`);

    gsap.set(paths, { scale: 0, transformOrigin: "50% 50%" });

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1,
      paused: !isVisibleRef.current,
    });

    tl.to(paths, {
      scale: 1,
      duration: 0.8,
      stagger: { amount: 0.4, from: "random" },
      ease: "expo.out",
    })
      .to(paths, {
        scale: 1.05,
        duration: 1.5,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
        stagger: { amount: 0.2, from: "center" },
      })
      .to(paths, {
        scale: 0,
        duration: 0.6,
        stagger: { amount: 0.3, from: "edges" },
        ease: "expo.in",
      });

    masterTl.current = tl;
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      createLoop(0);
    }, containerRef);
    return () => {
      if (masterTl.current) {
        masterTl.current.kill();
        masterTl.current = null;
      }
      ctx.revert();
    };
  }, [createLoop]);

  // Pause/resume the GSAP loop based on viewport visibility so it doesn't
  // burn CPU/GPU once the section is scrolled past.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        isVisibleRef.current = entry.isIntersecting;
        const tl = masterTl.current;
        if (!tl) return;
        if (entry.isIntersecting) tl.play();
        else tl.pause();
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Advance to a specific item and (re)start the 2s auto-cycle from there, so
  // the showcase keeps rotating through all items on its own while a hover
  // jumps straight to the hovered item without the timer fighting it.
  const goTo = useCallback(
    (index: number) => {
      if (index !== activeIndexRef.current) {
        activeIndexRef.current = index;
        setActiveIndex(index);
        createLoop(index);
      }
      if (autoCycleRef.current) window.clearInterval(autoCycleRef.current);
      autoCycleRef.current = window.setInterval(() => {
        const next = (activeIndexRef.current + 1) % itemsRef.current.length;
        activeIndexRef.current = next;
        setActiveIndex(next);
        createLoop(next);
      }, 2000);
    },
    [createLoop]
  );

  // Kick off the auto-cycle on mount; clear it on unmount.
  useEffect(() => {
    goTo(0);
    return () => {
      if (autoCycleRef.current) {
        window.clearInterval(autoCycleRef.current);
        autoCycleRef.current = null;
      }
    };
  }, [goTo]);

  const handleItemHover = (index: number) => {
    if (index === activeIndex) return;
    goTo(index);
  };

  return (
    <div
      ref={containerRef}
      className={cn("w-full bg-[color:var(--bg)]", className)}
    >
      <div className="flex h-[100svh] w-full flex-col items-center justify-between overflow-hidden bg-[color:var(--bg)] p-8 transition-colors duration-500 md:flex-row-reverse md:p-24">
        {/* LEFT SIDE: HIGH CONTRAST MENU */}
        <div className="z-20 w-full md:w-1/2 md:pl-40 md:translate-x-10">
          <nav>
            <ul className="flex flex-col gap-14">
              {items.map((item, index) => (
                <li
                  key={item.num}
                  onMouseEnter={() => handleItemHover(index)}
                  className="group cursor-pointer"
                >
                  <div className="flex items-start gap-6">
                    {/* Numbers: Increased visibility for non-hover state */}
                    <span
                      className={cn(
                        "text-3xl font-bold transition-all duration-500 mt-2",
                        activeIndex === index
                          ? "text-[var(--accent)] scale-110"
                          : "text-white/35"
                      )}
                    >
                      {item.num}
                    </span>

                    {/* Main Text: Enhanced visibility logic */}
                    <h2
                      className={cn(
                        "font-[var(--font-serif)] text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] transition-all duration-700",
                        activeIndex === index
                          ? "text-white opacity-100 translate-x-4"
                          : "opacity-55 translate-x-0 text-transparent " +
                              "[text-stroke:1.5px_rgba(255,255,255,0.22)] [-webkit-text-stroke:1.5px_rgba(255,255,255,0.22)]"
                      )}
                    >
                      {item.name.split(" ")[0]}
                      <br />
                      {item.name.split(" ")[1]}
                    </h2>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* RIGHT SIDE: SQUARE GRID (Sharp Squares) */}
        <div className="relative mt-16 flex w-full items-center justify-center md:mt-0 md:w-1/2">
          <div className="absolute h-[120%] w-[120%] rounded-full bg-[var(--accent)]/10 blur-[120px] transition-opacity duration-1000" />

          <svg
            ref={svgRef}
            viewBox="0 0 500 500"
            className="z-10 h-auto w-[100%] max-w-[500px] drop-shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
          >
            <defs>
              <clipPath id="clip-original">
                <path
                  className="path"
                  d="M480.6,235H19.4c-6,0-10.8-4.9-10.8-10.8v-9.5c0-6,4.9-10.8,10.8-10.8h461.1c6,0,10.8,4.9,10.8,10.8v9.5C491.4,230.2,486.6,235,480.6,235z"
                />
                <path
                  className="path"
                  d="M483.1,362.4H16.9c-4.6,0-8.3-3.7-8.3-8.3v-1.8c0-4.6,3.7-8.3,8.3-8.3h466.1c4.6,0,8.3,3.7,8.3,8.3v1.8C491.4,358.7,487.7,362.4,483.1,362.4z"
                />
                <path
                  className="path"
                  d="M460.3,336.3H39.7c-17.2,0-31.1-13.9-31.1-31.1v-31.5c0-17.2,13.9-31.1,31.1-31.1h420.7c17.2,0,31.1,13.9,31.1,31.1v31.5C491.4,322.4,477.5,336.3,460.3,336.3z"
                />
                <path
                  className="path"
                  d="M459.2,196.2H40.8v-35c0-47.5,38.5-86,86-86h246.5c47.5,0,86,38.5,86,86V196.2z"
                />
                <path
                  className="path"
                  d="M441.9,424.9H58.1c-9.6,0-17.3-7.8-17.3-17.3v-37.4h418.5v37.4C459.2,417.1,451.5,424.9,441.9,424.9z"
                />
              </clipPath>

              <clipPath id="clip-hexagons">
                <rect
                  className="path"
                  x="20"
                  y="20"
                  width="200"
                  height="280"
                  rx="12"
                />
                <rect
                  className="path"
                  x="20"
                  y="320"
                  width="200"
                  height="160"
                  rx="12"
                />
                <rect
                  className="path"
                  x="240"
                  y="20"
                  width="240"
                  height="140"
                  rx="12"
                />
                <rect
                  className="path"
                  x="240"
                  y="180"
                  width="110"
                  height="160"
                  rx="12"
                />
                <rect
                  className="path"
                  x="370"
                  y="180"
                  width="110"
                  height="160"
                  rx="12"
                />
                <rect
                  className="path"
                  x="240"
                  y="360"
                  width="240"
                  height="120"
                  rx="12"
                />
              </clipPath>

              {/* Grid Squares with rx="4" as requested */}
              <clipPath id="clip-pixels">
                {Array.from({ length: 9 }).map((_, i) => (
                  <rect
                    key={i}
                    className="path"
                    x={(i % 3) * 160 + 20}
                    y={Math.floor(i / 3) * 160 + 20}
                    width="140"
                    height="140"
                    rx="4"
                  />
                ))}
              </clipPath>
            </defs>

            <g ref={mainGroupRef} clipPath={`url(#${items[0].clipId})`}>
              <image
                ref={imageRef}
                href={items[0].image}
                width="500"
                height="500"
                preserveAspectRatio="xMidYMid slice"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
