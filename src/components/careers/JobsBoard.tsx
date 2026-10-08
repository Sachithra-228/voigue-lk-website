"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CvModal, type CvMode } from "@/components/careers/CvModal";
import { setupDot, workSetups } from "@/lib/content";
import { clsx } from "@/lib/utils";
import type { PublicJob } from "@/types/content";

function List({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold text-ink">{title}</h4>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-violet" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function JobsBoard({ jobs }: { jobs: PublicJob[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [applying, setApplying] = useState<CvMode | null>(null);

  return (
    <section id="current-openings" className="scroll-mt-20 bg-white py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">Current Openings</p>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Take a look at what&apos;s open.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">Browse the opportunities currently available across our teams.</p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 rounded-2xl border border-line px-5 py-3 text-sm text-muted" aria-label="Work setup key">
            {workSetups.map((setup) => (
              <li key={setup.label} className="inline-flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${setup.dot}`} aria-hidden />
                {setup.label}
              </li>
            ))}
          </ul>
        </div>

        {jobs.length ? (
          <ul className="mt-12 border-t border-line">
            {jobs.map((job) => {
              const id = job._id ?? job.slug;
              const open = expanded === id;
              const panelId = `job-${job.slug}`;
              return (
                <li key={id} className="border-b border-line">
                  <div className="grid gap-4 py-6 md:grid-cols-[1fr_auto] md:items-center md:gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-ink">{job.title}</h3>
                      <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">{job.summary}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                      <span className="inline-flex min-w-20 items-center gap-2 text-sm font-medium text-ink">
                        <span className={`h-2.5 w-2.5 rounded-full ${setupDot(job.workSetup)}`} aria-hidden />
                        {job.workSetup}
                      </span>
                      <button
                        type="button"
                        onClick={() => setApplying({ type: "role", jobId: id, jobTitle: job.title })}
                        className="focus-ring inline-flex min-h-10 items-center rounded-full border border-ink/25 px-5 text-sm font-semibold text-ink transition hover:border-ink hover:bg-ink hover:text-white"
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => setExpanded(open ? null : id)}
                        className="focus-ring inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink"
                      >
                        {open ? "Show less" : "Read more"}
                        <ChevronDown size={16} className={clsx("transition-transform", open && "rotate-180")} />
                      </button>
                    </div>
                  </div>
                  <div
                    id={panelId}
                    role="region"
                    aria-label={`${job.title} details`}
                    className={clsx("grid transition-[grid-template-rows] duration-300", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                  >
                    <div className="overflow-hidden" inert={!open}>
                      <div className="grid gap-8 pb-8 md:grid-cols-[1.2fr_1fr] md:gap-12">
                        <p className="leading-7 text-muted">{job.description}</p>
                        <div className="grid gap-6">
                          <List title="Key responsibilities" items={job.responsibilities} />
                          <List title="What we're looking for" items={job.requirements} />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-12 rounded-2xl bg-paper p-8 text-center text-muted">
            There are no vacancies listed right now, but we&apos;re always open to great people. Send us your CV below and we&apos;ll keep you in mind.
          </p>
        )}
      </div>

      {applying ? <CvModal mode={applying} onClose={() => setApplying(null)} /> : null}
    </section>
  );
}
