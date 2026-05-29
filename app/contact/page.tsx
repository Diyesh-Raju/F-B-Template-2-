import { Section } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div>
      {/* Full-bleed hero — cliffside dinner photo behind the heading, dark
          scrim so the white type reads cleanly over the sunset highlights. */}
      <section
        aria-label="Your Table Awaits"
        className="relative isolate w-full overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/contact/your-table-awaits.png')",
          minHeight: "clamp(260px, 42vh, 400px)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65"
        />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-center px-4 py-14 sm:px-6 sm:py-20 md:py-24">
          <Reveal preset="fadeUpLg">
            <h1
              className="text-4xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.7)] sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-elms-sans)" }}
            >
              Your Table Awaits
            </h1>
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.08 }}>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 drop-shadow-[0_3px_18px_rgba(0,0,0,0.7)] sm:text-lg">
              Reach out for reservations, private events, or menu questions.
              This is UI-only (no backend) and ready to be connected later.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact us — live Google Maps embed on the left, three info boxes
          stacked on the right. Each box has an icon on the left and the
          heading + sub on the right. */}
      <Section
        title={
          <span
            className="font-normal"
            style={{ fontFamily: "var(--font-elms-sans)" }}
          >
            Contact us
          </span>
        }
      >
        <div className="grid gap-6 lg:grid-cols-12">
          <Reveal preset="scaleIn" className="lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
              <iframe
                title="Nocturne location on Google Maps"
                src="https://www.google.com/maps?q=14+Midnight+Lane,+Bandra+West,+Mumbai,+Maharashtra+400050&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-80 w-full sm:h-[28rem]"
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>
          </Reveal>

          <div className="grid gap-4 lg:col-span-4">
            <Reveal preset="fadeUp">
              <InfoBox
                title="Address"
                body={
                  <>
                    14 Midnight Lane,
                    <br />
                    Bandra West, Mumbai,
                    <br />
                    Maharashtra 400050
                  </>
                }
                icon={
                  /* Google Maps marker — filled red teardrop with white dot,
                     matches the pins shown inside the embedded map next to it. */
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-7 w-7"
                  >
                    <path
                      fill="#EA4335"
                      d="M12 22s-7-7.58-7-12a7 7 0 1 1 14 0c0 4.42-7 12-7 12Z"
                    />
                    <circle cx="12" cy="10" r="2.6" fill="#ffffff" />
                  </svg>
                }
                accentBg={false}
              />
            </Reveal>
            <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
              <InfoBox
                title="Open Hours"
                body="Open Daily: 12:00 PM – 1:00 AM"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-6 w-6"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7.5V12l3 2" />
                  </svg>
                }
              />
            </Reveal>
            <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
              <InfoBox
                title="Valet Parking"
                body="Complimentary valet parking available"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-6 w-6"
                  >
                    <path d="M5 16V12l2.2-5.3A2 2 0 0 1 9.04 5.5h5.92a2 2 0 0 1 1.84 1.2L19 12v4" />
                    <path d="M5 16h14" />
                    <path d="M5 16v2a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1v-2" />
                    <path d="M15.5 16v2a1 1 0 0 0 1 1H18a1 1 0 0 0 1-1v-2" />
                    <circle cx="8" cy="13.5" r="0.9" />
                    <circle cx="16" cy="13.5" r="0.9" />
                  </svg>
                }
              />
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Reservation platforms — three cards, each a deep-link to the
          restaurant's listing on the external booking partner. The Book CTA
          inside the card is purely visual (a styled span); the entire card is
          the actual anchor, so wrapping a real <button> inside the <a> is
          avoided (invalid nested interactive elements). */}
      <Section
        title={
          <span
            className="font-bold"
            style={{ fontFamily: "var(--font-elms-sans)" }}
          >
            Make a Reservation
          </span>
        }
      >
        <p className="mx-auto -mt-2 mb-8 max-w-2xl text-center text-base leading-7 text-white/65 sm:text-lg">
          Book your table in advance to ensure the best experience. For large
          parties or special events, please call us directly.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          <Reveal preset="fadeUp">
            <ReservationCard
              title="EazyDiner"
              body="Book online with instant confirmation."
              href="https://www.eazydiner.com/"
              logo="/contact/eazydiner-icon.png"
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <ReservationCard
              title="Zomato"
              body="View menu, reviews, and book a table."
              href="https://www.zomato.com/"
              logo="/contact/zomato-icon.svg"
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
            <ReservationCard
              title="Swiggy Dineout"
              body="Discounts, deals, and instant bookings."
              href="https://www.swiggy.com/dineout"
              logo="/contact/swiggy-icon.png"
            />
          </Reveal>
        </div>
      </Section>

      {/* Chat with us — single full-width pill that deep-links to WhatsApp.
          Layout per the sketch: large WhatsApp logo on the left, label on
          the right inside a single rounded bar. */}
      <Section
        title={
          <span
            className="text-[#ffffff]"
            style={{ fontFamily: "var(--font-modak)" }}
          >
            Chat with us 💬
          </span>
        }
      >
        <Reveal preset="fadeUp">
          <a
            href="https://wa.me/919000000000"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Connect on WhatsApp"
            className="group mx-auto flex w-full max-w-3xl items-center gap-5 rounded-full border border-white/10 bg-white/5 p-3 pr-8 transition hover:border-white/20 hover:bg-white/10 focus-visible:outline-offset-4 sm:gap-6 sm:p-4 sm:pr-10"
          >
            {/* Brand-green badge with the inline WhatsApp glyph. Stays the
                same WhatsApp green regardless of theme; the glyph is white. */}
            <span
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full sm:h-24 sm:w-24"
              style={{ backgroundColor: "#25D366" }}
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 32 32"
                className="h-12 w-12 sm:h-14 sm:w-14"
                fill="#ffffff"
              >
                <path d="M16 3C9.373 3 4 8.373 4 15c0 2.346.673 4.535 1.838 6.388L4 29l7.85-1.79A11.93 11.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3Zm0 21.7c-1.948 0-3.766-.547-5.32-1.495l-.38-.224-4.66 1.063 1.094-4.534-.245-.39A9.66 9.66 0 0 1 6.3 15c0-5.348 4.352-9.7 9.7-9.7s9.7 4.352 9.7 9.7-4.352 9.7-9.7 9.7Zm5.464-7.235c-.299-.149-1.766-.871-2.04-.971-.274-.1-.473-.149-.672.149-.199.298-.772.971-.946 1.17-.174.199-.348.224-.647.075-.299-.149-1.262-.465-2.404-1.484-.889-.793-1.49-1.772-1.664-2.07-.174-.298-.019-.46.131-.609.134-.133.299-.348.448-.522.149-.174.199-.298.298-.497.099-.199.05-.373-.025-.522-.075-.149-.672-1.622-.921-2.224-.243-.583-.49-.504-.672-.513l-.572-.01a1.1 1.1 0 0 0-.797.373c-.273.298-1.045 1.021-1.045 2.49 0 1.469 1.07 2.888 1.219 3.087.149.199 2.106 3.215 5.103 4.51.713.307 1.27.49 1.703.628.715.227 1.365.195 1.879.118.573-.085 1.766-.722 2.015-1.418.249-.696.249-1.292.174-1.418-.075-.124-.273-.199-.572-.348Z" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-xl font-semibold text-white sm:text-2xl">
                Connect on WhatsApp
              </div>
              <div className="mt-1 text-sm leading-6 text-white/65 sm:text-base">
                Fast replies for reservations and quick questions.
              </div>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="hidden h-6 w-6 shrink-0 text-white/55 transition group-hover:text-white sm:block"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </Reveal>

        {/* Quick-intent buttons — each opens WhatsApp with a topic-specific
            pre-filled message so the user lands in a conversation already
            tagged with what they want. */}
        <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
          <div className="mx-auto mt-5 flex w-full max-w-3xl flex-wrap items-center justify-center gap-3 sm:gap-4">
            <WhatsAppChip
              label="Event organizing"
              prefill="Hi, I'd like to enquire about event organizing."
            />
            <WhatsAppChip
              label="Party bookings"
              prefill="Hi, I'd like to enquire about party bookings."
            />
            <WhatsAppChip
              label="Bulk order"
              prefill="Hi, I'd like to enquire about placing a bulk order."
            />
          </div>
        </Reveal>
      </Section>

    </div>
  );
}

function WhatsAppChip({
  label,
  prefill,
}: {
  label: string;
  prefill: string;
}) {
  const href = `https://wa.me/919000000000?text=${encodeURIComponent(prefill)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-offset-4 sm:px-5 sm:py-2.5"
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: "#25D366" }}
        aria-hidden="true"
      />
      {label}
    </a>
  );
}

function ReservationCard({
  title,
  body,
  href,
  logo,
}: {
  title: string;
  body: string;
  href: string;
  /** Path to the brand's small icon mark (square app-icon style). */
  logo: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`Reserve a table on ${title}`}
      className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10 focus-visible:outline-offset-4"
    >
      <div className="flex items-center gap-3">
        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.25)] sm:h-11 sm:w-11">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo}
            alt={`${title} logo`}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </span>
        <div className="font-[var(--font-serif)] text-xl font-bold text-white sm:text-2xl">
          {title}
        </div>
      </div>
      <p className="mt-3 mb-6 text-sm leading-6 text-white/65 sm:text-base">
        {body}
      </p>
      <span
        className="mt-auto inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#ffffff] shadow-[0_10px_30px_rgba(183,110,121,0.35)] transition group-hover:brightness-110"
        style={{
          background:
            "linear-gradient(135deg, #C9889A 0%, #B76E79 50%, #9E5B68 100%)",
        }}
      >
        Reserve your table
      </span>
    </a>
  );
}

function InfoBox({
  title,
  body,
  icon,
  accentBg = true,
}: {
  title: string;
  body: React.ReactNode;
  icon: React.ReactNode;
  /** Set false when the icon is a multi-color brand-style mark (e.g. the
   *  red Google Maps pin) and the amber-tinted circle would clash. */
  accentBg?: boolean;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-white/70 sm:p-6">
      <span
        className={[
          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          accentBg
            ? "bg-[var(--accent)]/15 text-[var(--accent)]"
            : "text-[var(--accent)]",
        ].join(" ")}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-lg font-semibold text-white sm:text-xl">
          {title}
        </div>
        <div className="mt-1 text-sm leading-6 text-white/65">{body}</div>
      </div>
    </div>
  );
}

