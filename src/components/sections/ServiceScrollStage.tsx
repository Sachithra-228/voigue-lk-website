"use client";

import * as React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);

  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function ServiceScrollStage({ children }: { children: React.ReactNode }) {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const [scrollDistance, setScrollDistance] = React.useState(0);
  const reduceMotion = React.useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  React.useEffect(() => {
    const measure = () => {
      if (!viewportRef.current || !trackRef.current) return;
      setScrollDistance(Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth));
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);
  const x = useSpring(rawX, { stiffness: 90, damping: 28, mass: 0.25 });

  if (reduceMotion) {
    return (
      <section className="bg-paper py-20 lg:py-28">
        <div className="container-x">{children}</div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-paper"
      style={{ height: `calc(100svh + ${scrollDistance}px)` }}
    >
      <div className="sticky top-0 flex min-h-svh items-center overflow-hidden py-20 lg:py-24">
        <div ref={viewportRef} className="container-x w-full">
          <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-5 pr-4">
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
