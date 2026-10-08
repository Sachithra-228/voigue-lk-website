import { Heart, Lightbulb, Sprout } from "lucide-react";
import { EmployeeVoices } from "@/components/life/EmployeeVoices";
import { LifeAroundHere } from "@/components/life/LifeAroundHere";
import { Button } from "@/components/ui/Button";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { LoopingVideo } from "@/components/ui/LoopingVideo";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { openRolesHref } from "@/lib/content";
import { media } from "@/lib/media";
import { getMoments, getVoices } from "@/lib/query";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Life at Voigue",
  "A look at the people, culture and everyday moments that shape life at Voigue.",
  "/life-at-voigue"
);

const values = [
  { icon: Lightbulb, title: "Open minds", body: "Different perspectives are welcomed here, and new ideas always have room to land." },
  { icon: Sprout, title: "Inclusive by nature", body: "We value diversity, treat people with respect, and make space for everyone to be heard." },
  { icon: Heart, title: "A sense of belonging", body: "It is the kind of environment where people feel comfortable, supported and part of something." }
];

// Vacancies, photos and employee voices come from the CMS; refresh the static page every minute.
export const revalidate = 60;

export default async function LifeAtVoiguePage() {
  const [moments, voices] = await Promise.all([getMoments(), getVoices()]);

  return (
    <>
      <section className="relative flex min-h-[80svh] items-center justify-center overflow-hidden bg-brand-navy text-center text-white">
        <LoopingVideo
          clips={media.life.heroVideo ? [media.life.heroVideo] : []}
          poster={media.life.heroPoster}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="container-x relative pb-10 pt-32">
          <div className="mx-auto max-w-3xl animate-[fadeIn_700ms_ease-out]">
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Come see what makes Voigue, Voigue.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/85 sm:text-xl">
              A look at the people, culture and everyday moments that shape life here.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <MotionReveal direction="left">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">People</p>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                At our heart, there&apos;s our people.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                We are a team of curious, open-minded people who bring different perspectives, experience, and personalities
                into what we do. We support each other, welcome new ideas, and create a space where everyone can be
                themselves and do their best work.
              </p>
            </div>
          </MotionReveal>
          <MotionReveal direction="right" delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              <ImageSlot src={media.life.peopleTeam} label="Team photo" className="col-span-2 aspect-[16/9] rounded-2xl" sizes="(min-width: 1024px) 50vw, 100vw" />
              <ImageSlot src={media.life.peoplePortrait} label="Employee portrait" className="aspect-square rounded-2xl" sizes="(min-width: 1024px) 25vw, 50vw" />
              <ImageSlot src={media.life.peopleMoment} label="Culture moment" className="aspect-square rounded-2xl" sizes="(min-width: 1024px) 25vw, 50vw" />
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="bg-paper py-20 lg:py-28">
        <div className="container-x">
          <MotionReveal>
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">What Matters Here</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">We live what matters to us.</h2>
              <p className="mt-5 text-lg leading-8 text-muted">
                The way we work is shaped by openness, inclusion and a genuine sense of belonging. Different perspectives are
                welcomed, people are respected for who they are, and the culture is built to make everyone feel part of it.
              </p>
            </div>
          </MotionReveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {values.map((value, index) => (
              <MotionReveal key={value.title} delay={index * 0.1}>
                <article className="relative h-full rounded-3xl bg-white p-8 pt-12 shadow-sm">
                  <span className="absolute -top-7 left-8 flex h-14 w-14 items-center justify-center rounded-full bg-lilac-deep text-brand-violet">
                    <value.icon size={24} />
                  </span>
                  <h3 className="text-xl font-semibold text-ink">{value.title}</h3>
                  <p className="mt-3 leading-7 text-muted">{value.body}</p>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <LifeAroundHere moments={moments} />

      <section className="bg-paper py-20 lg:py-28">
        <div className="container-x max-w-4xl">
          <MotionReveal>
            <div className="text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Here&apos;s a little more of us.</h2>
              <p className="mt-4 text-lg text-muted">A glimpse at the people, moments and energy behind Voigue.</p>
            </div>
            <div className="mt-12">
              <YouTubeEmbed videoId={media.life.promoYouTubeId} title="Voigue promotional video" />
            </div>
          </MotionReveal>
        </div>
      </section>

      <EmployeeVoices voices={voices} />

      <section className="bg-white pb-20 lg:pb-28">
        <div className="container-x">
          <MotionReveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-lilac px-8 py-14 sm:px-14">
              <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-brand-violet/20" />
              <div aria-hidden className="pointer-events-none absolute -right-8 top-10 h-72 w-72 rounded-full border border-brand-violet/15" />
              <div className="relative">
                <h2 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Find your place at Voigue.</h2>
                <p className="mt-4 max-w-md text-lg text-muted">Take a look at our open roles and see where you could fit.</p>
                <Button href={openRolesHref} className="mt-8">
                  View Open Roles
                </Button>
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>
    </>
  );
}
