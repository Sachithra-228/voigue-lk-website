import {
  BadgeDollarSign,
  BookOpen,
  Building2,
  Globe2,
  Home,
  Laptop,
  PartyPopper,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon
} from "lucide-react";
import { GeneralApplication } from "@/components/careers/GeneralApplication";
import { JobsBoard } from "@/components/careers/JobsBoard";
import { Button } from "@/components/ui/Button";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Accent } from "@/components/ui/SectionHeading";
import { media } from "@/lib/media";
import { getJobs } from "@/lib/query";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Careers",
  "Build your career your way with remote, hybrid and on-site roles, international exposure and room to grow at Voigue.",
  "/careers"
);

const setups: { icon: LucideIcon; title: string; image: string; body: string }[] = [
  {
    icon: Laptop,
    title: "Remote",
    image: media.careers.remote,
    body: "Work from wherever the role allows, while staying connected to the people you work with every day."
  },
  {
    icon: Home,
    title: "Hybrid",
    image: media.careers.hybrid,
    body: "Split your time between home and the office, giving you the flexibility of both while still having regular face time with the team."
  },
  {
    icon: Building2,
    title: "On-site",
    image: media.careers.onsite,
    body: "Work alongside the team in person and be right in the middle of the day-to-day."
  }
];

const benefits: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Globe2,
    title: "A seat at the global table",
    body: "You'll work directly with international businesses, picking up how different markets operate, communicate and make decisions, experience that goes well beyond a standard local role."
  },
  {
    icon: SlidersHorizontal,
    title: "Your setup, your call",
    body: "Remote, hybrid or onsite, depending on the role, so you can work in the way that actually suits how you get things done."
  },
  {
    icon: TrendingUp,
    title: "Growth that isn't capped",
    body: "As you take on more, you get more responsibility, bigger opportunities and the chance to grow faster than a rigid ladder usually allows."
  },
  {
    icon: Sparkles,
    title: "Work that gets noticed",
    body: "Good work doesn't go unnoticed here. The effort, ideas and impact you bring are recognised."
  },
  {
    icon: BadgeDollarSign,
    title: "Above-industry pay",
    body: "We believe good work should be paid properly, which is why our salaries are positioned above industry standards."
  },
  {
    icon: ShieldCheck,
    title: "Trusted from day one",
    body: "You're trusted to own your work and make decisions on it, without someone checking in every step of the way."
  },
  {
    icon: PartyPopper,
    title: "People worth showing up for",
    body: "An open, easygoing team that celebrates the wins, big or small, with outings, events and get-togethers that people genuinely look forward to."
  },
  {
    icon: BookOpen,
    title: "Every project teaches something",
    body: "Exposure to different industries, businesses and ways of working means you're constantly picking up new skills, just by doing the work in front of you."
  }
];

const process = [
  {
    title: "Initial screening",
    body: "If your CV is shortlisted, someone from our Talent Acquisition team will give you a call. It's a quick first conversation to learn a little more about you, your experience and what you're looking for."
  },
  {
    title: "Internal interview",
    body: "If the screening goes well, we'll invite you for an interview with our team. This is where we get a better sense of your experience, how you work and whether the role feels like the right fit for both you and the client."
  },
  {
    title: "Client review",
    body: "If you make it through the internal interview, we'll share your profile and interview details with the client so they can get to know who you are and what you could bring to their team."
  },
  {
    title: "Final interview",
    body: "If the client wants to move forward, we'll bring you both together for the final interview. You'll get to meet the people you could be working with, ask questions and see if the fit works on both sides."
  }
];

// Vacancies, photos and employee voices come from the CMS; refresh the static page every minute.
export const revalidate = 60;

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <>
      <section className="relative flex min-h-[78svh] items-end overflow-hidden bg-brand-navy text-white">
        <ImageSlot src={media.careers.hero} label="Hero image" tone="dark" priority className="absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,6,34,0.85)_0%,rgba(12,6,34,0.5)_55%,rgba(12,6,34,0.15)_100%)]" />
        <div className="container-x relative pb-14 pt-36 lg:pb-20">
          <div className="max-w-2xl animate-[fadeIn_700ms_ease-out]">
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">There&apos;s a place for you here.</h1>
            <p className="mt-7 text-lg leading-8 text-white/85">
              Build your career your way, with roles across remote, hybrid and on-site setups. At Voigue, you&apos;ll get the
              chance to work with businesses across Australia and beyond, take on work that gives you real international
              exposure and grow into more as you go.
            </p>
            <p className="mt-4 text-base leading-7 text-white/75">
              Different roles come with different teams, responsibilities and ways of working, but the idea stays the same:
              good people should have access to good opportunities, wherever they&apos;re based.
            </p>
            <Button href="#current-openings" variant="outline-light" className="mt-9">
              View Open Roles
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container-x">
          <MotionReveal>
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-brand-violet">Flexibility comes first</p>
              <h2 className="mt-3 text-5xl font-semibold leading-none tracking-tight text-ink sm:text-6xl lg:text-7xl">
                Work <Accent>Your Way</Accent>
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                Some roles are fully remote, some are hybrid, and others work best onsite. The setup depends on the role and
                the team you&apos;ll be working with, so you&apos;ll know exactly what to expect before you apply.
              </p>
            </div>
          </MotionReveal>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {setups.map((setup, index) => (
              <MotionReveal key={setup.title} delay={index * 0.1}>
                <article>
                  <ImageSlot src={setup.image} label={`${setup.title} photo`} className="aspect-[16/10] w-full rounded-2xl" sizes="(min-width: 768px) 33vw, 100vw" />
                  <div className="mt-5 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lilac text-brand-violet">
                      <setup.icon size={18} />
                    </span>
                    <h3 className="text-xl font-semibold text-ink">{setup.title}</h3>
                  </div>
                  <p className="mt-3 leading-7 text-muted">{setup.body}</p>
                </article>
              </MotionReveal>
            ))}
          </div>
          <MotionReveal>
            <div className="mt-12 flex items-start gap-5 rounded-2xl bg-lilac p-6 sm:items-center sm:p-8">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-brand-violet">
                <Users size={22} />
              </span>
              <p className="leading-7 text-muted">
                <strong className="block text-lg font-semibold text-ink">Whatever the setup, you&apos;re still part of the culture.</strong>
                We make sure there are plenty of chances to connect, spend time together and actually know the people you work with.
              </p>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="bg-paper py-20 lg:py-28">
        <div className="container-x">
          <MotionReveal>
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">Careers</p>
              <h2 className="mt-4 text-5xl font-semibold leading-none tracking-tight text-ink sm:text-6xl lg:text-7xl">Why Join Voigue?</h2>
              <p className="mt-6 text-xl leading-8 text-muted">We believe a good job should add something to your life.</p>
            </div>
          </MotionReveal>
          <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <MotionReveal key={benefit.title} delay={(index % 4) * 0.08}>
                <article className="border-t-2 border-ink pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-brand-violet">{String(index + 1).padStart(2, "0")}</span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lilac-deep text-brand-violet">
                      <benefit.icon size={20} />
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold leading-snug text-ink">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{benefit.body}</p>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container-x">
          <MotionReveal>
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-violet">Our Hiring Process</p>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                What happens <Accent>after you apply.</Accent>
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted">
                A quick look at the journey from your application to meeting the client, so you know what to expect
              </p>
            </div>
          </MotionReveal>
          <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {process.map((step, index) => (
              <MotionReveal key={step.title} delay={index * 0.1}>
                <article>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-semibold leading-none text-brand-violet/70">{String(index + 1).padStart(2, "0")}</span>
                    {index < process.length - 1 ? <span aria-hidden className="hidden h-px flex-1 bg-brand-violet/25 lg:block" /> : null}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-ink">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{step.body}</p>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <JobsBoard jobs={jobs} />
      <GeneralApplication />
    </>
  );
}
