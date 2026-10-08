import { FileText, Search, Users } from "lucide-react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Accent } from "@/components/ui/SectionHeading";
import { media } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "About Us",
  "Voigue is an Australian-based outsourcing company with offices in Melbourne and Colombo, bringing international opportunity within reach.",
  "/about"
);

const steps = [
  {
    icon: FileText,
    title: "We understand what the client needs",
    body: "A client comes to us with a role, a team requirement or a challenge they need support with. We take the time to understand the work, the skills involved and what the right person needs to bring to the team."
  },
  {
    icon: Search,
    title: "We find the right fit",
    body: "Our recruitment team searches, screens and shortlists talent based on the role, experience and what the client actually needs from the person joining them."
  },
  {
    icon: Users,
    title: "We bring both sides together",
    body: "Once the right match is made, we help bring the client and the selected talent together and support the setup from there."
  }
];

export default function AboutPage() {
  return (
    <>
      <section className="relative flex min-h-[78svh] items-end overflow-hidden bg-brand-navy text-white">
        <ImageSlot
          src={media.about.hero}
          alt=""
          label="People image"
          tone="dark"
          priority
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,6,34,0.85),rgba(12,6,34,0.15)_70%)]" />
        <div className="container-x relative pb-14 pt-36 lg:pb-20">
          <div className="max-w-3xl animate-[fadeIn_700ms_ease-out]">
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Connecting people to what comes next.
            </h1>
            <p className="mt-6 text-lg text-white/85 sm:text-xl">Bringing international opportunity within reach.</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container-x">
          <MotionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">Who We Are</p>
              <div className="mx-auto mt-4 h-0.5 w-8 bg-brand-violet" aria-hidden />
              <p className="mt-8 text-lg leading-9 text-muted sm:text-xl sm:leading-9">
                Voigue is an Australian-based outsourcing company with offices in Melbourne, Australia and Colombo, Sri Lanka.
                Founded in 2017, we started with a simple idea: connect great people with businesses they can grow with.
                Since then, the team has grown, the work has expanded, and so have the opportunities we create. Today, we
                support Australian businesses beyond Australia by building dedicated teams around the people and skills they
                need, while opening the door to international careers for talent in Sri Lanka.
              </p>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="bg-paper py-20 lg:py-28">
        <div className="container-x">
          <MotionReveal>
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">How It Works</p>
              <div className="mx-auto mt-4 h-0.5 w-8 bg-brand-violet" aria-hidden />
            </div>
          </MotionReveal>
          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((step, index) => (
              <MotionReveal key={step.title} delay={index * 0.12}>
                <div className="relative text-center">
                  <span className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-lilac text-brand-violet">
                    <step.icon size={42} strokeWidth={1.4} />
                  </span>
                  {index < steps.length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute left-[calc(50%+4.5rem)] right-[calc(-50%+4.5rem)] top-14 hidden h-px bg-line md:block"
                    />
                  ) : null}
                  <span className="mx-auto mt-6 flex h-8 w-8 items-center justify-center rounded-full bg-lilac-deep text-xs font-semibold text-brand-violet">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-ink">{step.title}</h3>
                  <p className="mt-3 leading-7 text-muted">{step.body}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container-x">
          <MotionReveal>
            <h2 className="text-center text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Our Mission &amp; Vision</h2>
          </MotionReveal>
          <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:gap-10">
            <MotionReveal direction="left">
              <div className="grid items-center md:grid-cols-[0.8fr_1.4fr]">
                <div className="flex h-44 items-center justify-center rounded-3xl bg-brand-violet text-2xl font-semibold text-white md:h-52">
                  Mission
                </div>
                <p className="relative rounded-2xl bg-white p-7 text-lg leading-8 text-muted shadow-soft md:-ml-10 md:mt-10">
                  To connect businesses with handpicked talent and create partnerships where people feel valued, businesses
                  feel supported, and growth happens on both sides.
                </p>
              </div>
            </MotionReveal>
            <MotionReveal direction="right">
              <div className="grid items-center md:grid-cols-[1.4fr_0.8fr]">
                <p className="relative order-2 rounded-2xl bg-white p-7 text-lg leading-8 text-muted shadow-soft md:order-1 md:-mr-10 md:mb-10 md:z-10">
                  To make international careers more accessible to Sri Lankan talent and create a future where opportunity
                  isn&apos;t limited by where you&apos;re based.
                </p>
                <div className="order-1 flex h-44 items-center justify-center rounded-3xl bg-brand-navy text-2xl font-semibold text-white md:order-2 md:h-52">
                  Vision
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      <section className="bg-white pb-20 lg:pb-28">
        <div className="container-x">
          <MotionReveal>
            <div className="grid items-center gap-10 rounded-[2rem] bg-lilac p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-violet">The Future of Work</p>
                <h2 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
                  Made for the <Accent>next generation of work.</Accent>
                </h2>
                <p className="mt-6 text-lg leading-8 text-muted">
                  The way people build careers is changing, and we want to be part of what comes next. Voigue creates
                  international opportunities for ambitious talent in Sri Lanka while helping businesses build teams beyond
                  borders. It is about giving people more access, more exposure and more room to grow in a working world that
                  is becoming less defined by location.
                </p>
              </div>
              <ImageSlot src={media.about.future} label="Image" className="aspect-[4/3] w-full rounded-2xl" sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
          </MotionReveal>
        </div>
      </section>
    </>
  );
}
