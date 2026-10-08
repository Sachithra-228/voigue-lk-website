import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Carousel } from "@/components/ui/Carousel";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { openRolesHref, setupDot } from "@/lib/content";
import type { PublicJob } from "@/types/content";

export function CareersTeaser({ jobs }: { jobs: PublicJob[] }) {
  return (
    <section className="bg-paper py-20 lg:py-28">
      <div className="container-x">
        <MotionReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">Careers</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Like the sound of life here?</h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              Browse our current openings and see what catches your eye. We offer remote, hybrid and onsite roles.
            </p>
          </div>
        </MotionReveal>

        <div className="mt-12">
          {jobs.length ? (
            <Carousel label="Current openings" itemClassName="w-[82%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              {jobs.map((job) => (
                <Link
                  key={job.slug}
                  href={openRolesHref}
                  className="focus-ring group flex h-full flex-col rounded-2xl border border-line bg-white p-7 transition hover:-translate-y-1 hover:shadow-soft"
                >
                  <h3 className="text-xl font-semibold text-ink">{job.title}</h3>
                  <p className="mt-3 line-clamp-3 flex-1 leading-7 text-muted">{job.summary}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5 text-sm text-muted">
                    <span className="inline-flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${setupDot(job.workSetup)}`} aria-hidden />
                      {job.workSetup}
                    </span>
                    {job.location ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} aria-hidden /> {job.location}
                      </span>
                    ) : null}
                  </div>
                </Link>
              ))}
            </Carousel>
          ) : (
            <p className="mx-auto max-w-md rounded-2xl border border-line bg-white p-8 text-center text-muted">
              There are no vacancies listed right now, but we&apos;re always open to great people. Send us your CV from the Careers page.
            </p>
          )}
        </div>

        <div className="mt-12 text-center">
          <Button href={openRolesHref} variant="dark">
            View All Open Roles
          </Button>
        </div>
      </div>
    </section>
  );
}
