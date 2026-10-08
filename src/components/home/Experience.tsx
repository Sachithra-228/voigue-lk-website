import { Button } from "@/components/ui/Button";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { media } from "@/lib/media";

const pillars = [
  {
    title: "People & Culture",
    image: media.home.experience.culture,
    label: "Culture photo",
    body: "Everything that makes Voigue feel like Voigue comes back to the culture we've built from the ground up. Celebrations, outings, team moments and plenty happening outside the work are all part of the experience."
  },
  {
    title: "Trust & Ownership",
    image: media.home.experience.trust,
    label: "Team photo",
    body: "You're given the responsibility to own your work without someone constantly looking over your shoulder. The trust is there from the start."
  },
  {
    title: "Growth & Progression",
    image: media.home.experience.growth,
    label: "Team photo",
    body: "International exposure, new responsibilities and opportunities to step into bigger roles give you plenty of room to move forward in your career at Voigue."
  }
];

export function Experience() {
  return (
    <section className="bg-paper py-20 lg:py-28">
      <div className="container-x">
        <MotionReveal>
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">What You&apos;re Stepping Into</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">The Voigue Experience</h2>
          </div>
        </MotionReveal>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <MotionReveal key={pillar.title} delay={index * 0.1}>
              <article>
                <ImageSlot src={pillar.image} label={pillar.label} className="aspect-[4/3] w-full rounded-2xl" sizes="(min-width: 768px) 33vw, 100vw" />
                <h3 className="mt-6 text-xl font-semibold text-ink">{pillar.title}</h3>
                <p className="mt-3 leading-7 text-muted">{pillar.body}</p>
              </article>
            </MotionReveal>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Button href="/life-at-voigue" variant="dark">
            See Life at Voigue
          </Button>
        </div>
      </div>
    </section>
  );
}
