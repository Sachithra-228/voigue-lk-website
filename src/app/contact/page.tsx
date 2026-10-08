import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/Button";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { site } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Contact Us",
  "Got something in mind? Talk to the Voigue team in Sri Lanka or Australia.",
  "/contact"
);

const contacts = [
  { icon: Mail, label: "General enquiries", value: site.emails.general, href: `mailto:${site.emails.general}` },
  { icon: Phone, label: "Sri Lanka", value: site.phones.sriLanka, href: `tel:${site.phones.sriLanka.replace(/\s/g, "")}` },
  { icon: Phone, label: "Australia", value: site.phones.australia, href: `tel:${site.phones.australia.replace(/\s/g, "")}` },
  { icon: Mail, label: "Careers & applications", value: site.emails.careers, href: `mailto:${site.emails.careers}` }
];

const offices = [site.locations.sriLanka, site.locations.australia];

export default function ContactPage() {
  return (
    <>
      <section className="bg-[linear-gradient(135deg,hsl(var(--lilac)),hsl(var(--lilac-deep)))] pb-16 pt-36 lg:pb-20 lg:pt-44">
        <div className="container-x">
          <h1 className="mx-auto max-w-3xl animate-[fadeIn_700ms_ease-out] text-center text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Got something in mind? Talk to us.
          </h1>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <MotionReveal direction="left">
            <p className="max-w-sm text-xl leading-9 text-muted">
              Send us a message and we&apos;ll take it from there. We&apos;ll make sure you get the answers you need and point
              you in the right direction.
            </p>
          </MotionReveal>
          <MotionReveal direction="right" delay={0.1}>
            <ContactForm />
          </MotionReveal>
        </div>
      </section>

      <section className="bg-paper py-16 lg:py-24">
        <div className="container-x">
          <MotionReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">Reach Us Directly</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Here when you need us.</h2>
          </MotionReveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contacts.map((contact) => (
              <li key={contact.label}>
                <a
                  href={contact.href}
                  className="focus-ring flex h-full items-start gap-4 rounded-2xl border border-line bg-white p-5 transition hover:border-brand-violet hover:shadow-soft"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lilac text-brand-violet">
                    <contact.icon size={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{contact.label}</span>
                    <span className="mt-1 block break-words font-semibold text-ink">{contact.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="container-x">
          <MotionReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">Our Locations</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Visit us in person.</h2>
          </MotionReveal>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {offices.map((office) => (
              <MotionReveal key={office.country}>
                <figure>
                  <div className="overflow-hidden rounded-2xl border border-line bg-paper">
                    <iframe
                      title={`Map of the ${office.country} office`}
                      src={`https://www.google.com/maps?q=${encodeURIComponent(office.mapQuery)}&output=embed`}
                      className="block h-72 w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                  <figcaption className="mt-4 flex items-start gap-3 leading-7 text-muted">
                    <MapPin size={18} className="mt-1.5 shrink-0 text-brand-violet" />
                    <span>
                      <strong className="font-semibold text-ink">{office.country}:</strong> {office.address}.
                    </span>
                  </figcaption>
                </figure>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-20 lg:py-28">
        <div className="container-x">
          <MotionReveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-5xl font-semibold leading-none tracking-tight text-ink sm:text-6xl">
                People-powered. <em className="font-semibold italic">Always.</em>
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                From the way we work to the opportunities we create, people stay at the centre of it.
              </p>
              <Button href="/about" variant="outline" className="mt-8">
                Discover Voigue
              </Button>
            </div>
          </MotionReveal>
        </div>
      </section>
    </>
  );
}
