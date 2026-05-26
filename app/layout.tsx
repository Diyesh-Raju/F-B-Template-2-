import type { Metadata } from "next";
import { Lato, Cormorant_Garamond, Anton, Bodoni_Moda, Archivo_Black, Caveat, Pacifico, Rye, Alex_Brush, Neonderthaw, Fascinate, Cherry_Bomb_One, Rampart_One, Passions_Conflict, Fleur_De_Leah, Syncopate, Italianno, Cause } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ContactCTA } from "@/components/ContactCTA";
import { PageTransition } from "@/components/motion/PageTransition";
import { ScrollToTopOnRoute } from "@/components/ScrollToTopOnRoute";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ThemeManager } from "@/components/providers/ThemeManager";

// Body / all non-heading text — Lato. 400 for normal copy, 700 for bold.
const fontSans = Lato({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// All headings — Cormorant Garamond Bold. Exposed as both --font-serif (the
// historical heading-font slot used by existing components) and --font-display
// (added later when previewing the font in a few sections). Both names point
// to the same font face so existing className references keep working.
const fontHeading = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

// Display-only condensed face used by the FMCG product carousel's giant
// ghost text and "DISCOVER IT" link. Single weight — Anton ships with 400
// and is designed to read as a heavy display face at that weight.
const fontDisplayBold = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Stand-in for the licensed "Bogue" face used by the FMCG hero overlay.
// Bodoni Moda is the closest Google-Fonts equivalent — high-contrast Didone
// serif. Swap the import for next/font/local once the real Bogue files land.
const fontBogue = Bodoni_Moda({
  variable: "--font-bogue",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Substitute for "Chunky Bolde" requested for the cafe scrolling captions —
// Archivo Black is a chunky bold sans-serif on Google Fonts that reads well
// over busy backgrounds.
const fontChunky = Archivo_Black({
  variable: "--font-chunky",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Substitute for the "Gohan" font requested for cafe accent lines — Caveat is
// a casual handwritten script on Google Fonts that gives the friendly,
// menu-card feel without needing a licensed file.
const fontGohan = Caveat({
  variable: "--font-gohan",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Substitute for the "Lovely Coffee" font requested for the coffee section
// heading — Pacifico is a casual flowing script on Google Fonts with the
// coffee-shop sign vibe.
const fontLovelyCoffee = Pacifico({
  variable: "--font-lovely-coffee",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Substitute for the "Tiki-Tide" font requested for the brewery hero outro —
// Rye is a vintage western/wood-block display face on Google Fonts that
// reads like a saloon / brewery signage.
const fontTikiTide = Rye({
  variable: "--font-tiki-tide",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Alex Brush — a flowing calligraphic script used for the "Signature" word in
// the brewery "Signature Creations" heading.
const fontAlexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Neonderthaw — a casual handwritten script on Google Fonts used for the
// "Perfect for Every Occasion" brewery heading.
const fontNeonderthaw = Neonderthaw({
  variable: "--font-neonderthaw",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Fascinate — a decorative display face on Google Fonts used for the cafe
// "From Our Kitchen to Your Table" line.
const fontFascinate = Fascinate({
  variable: "--font-fascinate",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Cherry Bomb One — a chunky bubble-style display face on Google Fonts used
// for the cafe coffee banner "Fuel your day, / Nourish your Soul" headline.
const fontCherryBomb = Cherry_Bomb_One({
  variable: "--font-cherry-bomb",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Rampart One — a 3D outlined / inline display face on Google Fonts used for
// the brewery hero outro "Good friends, / Good beer, / Great times!" line.
const fontRampartOne = Rampart_One({
  variable: "--font-rampart-one",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Passions Conflict — a flowing calligraphic script on Google Fonts used for
// the "Signature" word in the brewery "Signature Creations" heading.
const fontPassionsConflict = Passions_Conflict({
  variable: "--font-passions-conflict",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Fleur De Leah — an ornamental script on Google Fonts used for the brewery
// "Perspective" heading above the oval day-night gallery.
const fontFleurDeLeah = Fleur_De_Leah({
  variable: "--font-fleur-de-leah",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Syncopate — a wide, geometric sans-serif on Google Fonts used for the FMCG
// boat-banner tagline "The Art of Logistics — Delivered with Precision".
const fontSyncopate = Syncopate({
  variable: "--font-syncopate",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Italianno — an elegant cursive script on Google Fonts used for the cafe
// hero intro line "Your Daily Escape Starts Here".
const fontItalianno = Italianno({
  variable: "--font-italianno",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Cause — a wedge-serif display face on Google Fonts. Used for the cafe
// hero intro line as a more architectural replacement for Italianno.
const fontCause = Cause({
  variable: "--font-cause",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nocturne — Food & Beverage",
    template: "%s · Nocturne",
  },
  description:
    "A premium dark-themed food & beverage experience with animation-ready foundations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontHeading.variable} ${fontDisplayBold.variable} ${fontBogue.variable} ${fontChunky.variable} ${fontGohan.variable} ${fontLovelyCoffee.variable} ${fontTikiTide.variable} ${fontAlexBrush.variable} ${fontNeonderthaw.variable} ${fontFascinate.variable} ${fontCherryBomb.variable} ${fontRampartOne.variable} ${fontPassionsConflict.variable} ${fontFleurDeLeah.variable} ${fontSyncopate.variable} ${fontItalianno.variable} ${fontCause.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--fg)]">
        <SmoothScrollProvider>
          <ThemeManager />
          <ScrollToTopOnRoute />
          <SiteHeader />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <ContactCTA />
          <SiteFooter />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
