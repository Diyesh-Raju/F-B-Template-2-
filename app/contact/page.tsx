import { Section } from "@/components/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/Button";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}`
    : "";
  const gmailHref = contactEmail ? `mailto:${contactEmail}` : "";

  return (
    <div>
      {/* Full-bleed hero — cliffside dinner photo behind the heading, dark
          scrim so the white type reads cleanly over the sunset highlights. */}
      <section
        aria-label="Your Table Awaits"
        className="relative isolate w-full overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/contact/your-table-awaits.png')",
          minHeight: "clamp(360px, 60vh, 560px)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65"
        />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-center px-4 py-20 sm:px-6 sm:py-28 md:py-32">
          <Reveal preset="fadeUpLg">
            <h1 className="font-[var(--font-serif)] text-4xl leading-[1.05] tracking-tight text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.7)] sm:text-5xl md:text-6xl lg:text-7xl">
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

      <Section
        eyebrow="Find us"
        title="Hours, address, and a note"
        description="Replace map and details with real info when you’re ready."
      >
        <div className="grid gap-4 lg:grid-cols-12">
          <Reveal preset="scaleIn" className="lg:col-span-7">
            <div className="h-72 rounded-2xl border border-white/10 bg-white/5 sm:h-96" />
          </Reveal>
          <div className="grid gap-4 lg:col-span-5">
            <Reveal preset="fadeUp">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm font-medium text-white">Nocturne</div>
                <div className="mt-2 text-sm leading-6 text-white/60">
                  14 Midnight Lane
                  <br />
                  Bandra West, Mumbai, Maharashtra
                </div>
                <div className="mt-4 text-sm text-white/70">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/55">Hours</span>
                    <span>6:00 pm – 1:00 am</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-4">
                    <span className="text-white/55">Phone</span>
                    <span>+91 90000 00000</span>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/65">
                <div className="font-medium text-white">Private events</div>
                <p className="mt-2 leading-6">
                  For groups, we’ll tailor a menu around your pace and your
                  palette.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Contact us — live Google Maps embed on the left, three info boxes
          stacked on the right. Each box has an icon on the left and the
          heading + sub on the right. */}
      <Section title="Contact us">
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
                    <path d="M12 22s-7-7.58-7-12a7 7 0 1 1 14 0c0 4.42-7 12-7 12Z" />
                    <circle cx="12" cy="10" r="2.6" />
                  </svg>
                }
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

      <Section
        eyebrow="Connect"
        title="WhatsApp or Gmail"
        description="These links will open the respective app or web client. Add the real phone/email later."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal preset="fadeUp">
            <a
              href={whatsappHref || "#"}
              target={whatsappHref ? "_blank" : undefined}
              rel={whatsappHref ? "noreferrer" : undefined}
              aria-disabled={!whatsappHref}
              className={[
                "block rounded-2xl border border-white/10 bg-white/5 p-6 transition focus-visible:outline-offset-4",
                whatsappHref ? "hover:bg-white/10" : "opacity-50 cursor-not-allowed",
              ].join(" ")}
            >
              <div className="text-sm font-medium text-white">WhatsApp</div>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Fast replies for reservations and quick questions.
              </p>
              <div className="mt-4 text-xs text-white/55">
                Set <span className="text-white/75">NEXT_PUBLIC_WHATSAPP_NUMBER</span>
              </div>
            </a>
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <a
              href={gmailHref || "#"}
              aria-disabled={!gmailHref}
              className={[
                "block rounded-2xl border border-white/10 bg-white/5 p-6 transition focus-visible:outline-offset-4",
                gmailHref ? "hover:bg-white/10" : "opacity-50 cursor-not-allowed",
              ].join(" ")}
            >
              <div className="text-sm font-medium text-white">Gmail / Email</div>
              <p className="mt-2 text-sm leading-6 text-white/60">
                For private events, partnerships, and longer notes.
              </p>
              <div className="mt-4 text-xs text-white/55">
                Set <span className="text-white/75">NEXT_PUBLIC_CONTACT_EMAIL</span>
              </div>
            </a>
          </Reveal>
        </div>
      </Section>

      {/* Reservation platforms — three cards, each a deep-link to the
          restaurant's listing on the external booking partner. The Book CTA
          inside the card is purely visual (a styled span); the entire card is
          the actual anchor, so wrapping a real <button> inside the <a> is
          avoided (invalid nested interactive elements). */}
      <Section title="Make a Reservation">
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
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <ReservationCard
              title="Zomato"
              body="View menu, reviews, and book a table."
              href="https://www.zomato.com/"
            />
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
            <ReservationCard
              title="Swiggy Dineout"
              body="Discounts, deals, and instant bookings."
              href="https://www.swiggy.com/dineout"
            />
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="Message"
        title="Send a note"
        description="A simple form UI with strong focus states for accessibility."
      >
        <Reveal preset="fadeUp">
          <form className="mx-auto grid max-w-2xl gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-white/70">
                Name
                <input
                  className="h-11 rounded-xl border border-white/12 bg-black/20 px-4 text-white placeholder:text-white/35 focus-visible:outline-offset-4"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
              <label className="grid gap-2 text-sm text-white/70">
                Email
                <input
                  className="h-11 rounded-xl border border-white/12 bg-black/20 px-4 text-white placeholder:text-white/35 focus-visible:outline-offset-4"
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm text-white/70">
              Message
              <textarea
                className="min-h-[140px] resize-y rounded-xl border border-white/12 bg-black/20 px-4 py-3 text-white placeholder:text-white/35 focus-visible:outline-offset-4"
                placeholder="Tell us what you’re planning…"
              />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-white/50">
                By sending, you agree we may reply by email.
              </div>
              <Button type="button" variant="primary">
                Send message
              </Button>
            </div>
          </form>
        </Reveal>
      </Section>

    </div>
  );
}

function ReservationCard({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10 focus-visible:outline-offset-4"
    >
      <div className="font-[var(--font-serif)] text-xl font-bold text-white sm:text-2xl">
        {title}
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
        Book
      </span>
    </a>
  );
}

function InfoBox({
  title,
  body,
  icon,
}: {
  title: string;
  body: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-white/70 sm:p-6">
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-base font-medium text-white">{title}</div>
        <div className="mt-1 text-sm leading-6 text-white/65">{body}</div>
      </div>
    </div>
  );
}

