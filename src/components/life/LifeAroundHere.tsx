"use client";

import { useState } from "react";
import { Carousel } from "@/components/ui/Carousel";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { momentCategories } from "@/lib/content";
import { clsx } from "@/lib/utils";
import type { PublicMoment } from "@/types/content";

export function LifeAroundHere({ moments }: { moments: PublicMoment[] }) {
  const [filter, setFilter] = useState<(typeof momentCategories)[number]>("All Moments");
  const visible = filter === "All Moments" ? moments : moments.filter((moment) => moment.category === filter);

  return (
    <section className="overflow-hidden bg-white py-20 lg:py-28">
      <div className="container-x">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-semibold leading-none tracking-tight text-ink sm:text-6xl lg:text-7xl">Life around here.</h2>
          <p className="mt-6 text-lg leading-8 text-muted">
            Parties, events, community days, plans that make it out of the group chat and plenty we probably have too many
            photos of by now.
          </p>
        </div>

        <div className="mt-12 px-0 md:px-6">
          {visible.length ? (
            <Carousel
              label="Life around here photos"
              resetKey={filter}
              itemClassName="w-[72%] sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]"
            >
              {visible.map((moment, index) => (
                <figure key={`${moment.title}-${index}`} className="group relative overflow-hidden rounded-2xl">
                  <ImageSlot
                    src={moment.image}
                    alt={moment.image ? moment.title : ""}
                    label={moment.title}
                    className="aspect-[3/4] w-full transition duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 72vw"
                  />
                  <figcaption className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
                    {moment.category}
                  </figcaption>
                </figure>
              ))}
            </Carousel>
          ) : (
            <p className="rounded-2xl bg-paper p-8 text-center text-muted">Photos for this category are coming soon.</p>
          )}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3" role="group" aria-label="Filter moments">
          {momentCategories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={filter === category}
              onClick={() => setFilter(category)}
              className={clsx(
                "focus-ring rounded-full border px-5 py-2 text-sm font-medium transition",
                filter === category ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-md text-center text-2xl font-semibold leading-snug text-ink">
          This is the side of Voigue you don&apos;t get from the job description.
        </p>
      </div>
    </section>
  );
}
