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
      <div className="mx-auto w-full max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
        <Reveal preset="fadeUp">
          <h1 className="font-[var(--font-serif)] text-4xl tracking-tight text-white sm:text-5xl">
            Contact
          </h1>
        </Reveal>
        <Reveal preset="fadeUp" transition={{ delay: 0.08 }}>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
            Reach out for reservations, private events, or menu questions. This
            is UI-only (no backend) and ready to be connected later.
          </p>
        </Reveal>
      </div>

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

      <Section
        eyebrow="Details"
        title="Good to know"
        description="Extra context so the page doesn’t feel short."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal preset="fadeUp">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-medium text-white">Reservations</div>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Best for groups of 4+. For late walk-ins, the bar moves fast.
              </p>
            </div>
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-medium text-white">Dietary notes</div>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Vegetarian options are available across sections. Let us know
                about allergies.
              </p>
            </div>
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.12 }}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-medium text-white">Dress code</div>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Smart casual. Come comfortable—stay a while.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="FAQ"
        title="Before you message"
        description="A few common questions to save time."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal preset="fadeUp">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-medium text-white">Response time</div>
              <p className="mt-2 text-sm leading-6 text-white/60">
                WhatsApp is usually quickest. Email is best for event details.
              </p>
            </div>
          </Reveal>
          <Reveal preset="fadeUp" transition={{ delay: 0.06 }}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-medium text-white">Large groups</div>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Tell us your date range, headcount, and any preferences—we’ll propose options.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}

