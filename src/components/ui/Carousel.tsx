"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "@/lib/utils";

type CarouselProps = {
  children: React.ReactNode;
  /** Accessible name for the carousel region. */
  label: string;
  /** Width classes for each slide, e.g. "w-[78%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]". */
  itemClassName: string;
  className?: string;
  /** Re-centre on the first slide when this changes (used by the filtered gallery). */
  resetKey?: string;
};

/** Scroll-snap carousel with arrow buttons and pagination dots. */
export function Carousel({ children, label, itemClassName, className, resetKey }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const items = Children.toArray(children);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = first.offsetWidth + gap;
    const visible = Math.max(1, Math.round((track.clientWidth + gap) / step));
    const total = Math.max(1, track.children.length - visible + 1);
    setPages(total);
    setPage(Math.min(total - 1, Math.round(track.scrollLeft / step)));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [measure, items.length]);

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
  }, [resetKey]);

  function go(target: number) {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollTo({ left: target * (first.offsetWidth + gap), behavior: "smooth" });
  }

  const arrow =
    "focus-ring absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-md transition hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30 md:inline-flex";

  return (
    <div className={clsx("relative", className)} role="region" aria-roledescription="carousel" aria-label={label}>
      <button type="button" aria-label="Previous" className={clsx(arrow, "-left-5")} disabled={page === 0} onClick={() => go(page - 1)}>
        <ChevronLeft size={20} />
      </button>
      <div
        ref={trackRef}
        onScroll={measure}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <div key={index} className={clsx("shrink-0 snap-start", itemClassName)}>
            {item}
          </div>
        ))}
      </div>
      <button type="button" aria-label="Next" className={clsx(arrow, "-right-5")} disabled={page >= pages - 1} onClick={() => go(page + 1)}>
        <ChevronRight size={20} />
      </button>
      {pages > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-2" role="group" aria-label="Carousel pagination">
          {Array.from({ length: pages }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === page}
              onClick={() => go(index)}
              className={clsx(
                "focus-ring h-2 rounded-full transition-all",
                index === page ? "w-6 bg-ink" : "w-2 bg-ink/25 hover:bg-ink/50"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
