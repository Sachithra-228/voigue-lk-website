"use client";

import { motion, type Variants } from "framer-motion";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { media } from "@/lib/media";

const ease = [0.16, 1, 0.3, 1] as const;

const line: Variants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 0.9, ease } }
};
const statement: Variants = {
  hidden: { y: "105%" },
  visible: { y: 0, transition: { duration: 0.9, ease } }
};
const body: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: 0.25 } }
};

export function Foundation() {
  return (
    <section className="bg-white">
      <ImageSlot src={media.home.foundation} label="Team photo" className="h-56 w-full sm:h-72 lg:h-80" />
      {/* The observer sits on this wrapper: an element translated out of its own clipping parent never counts as visible. */}
      <motion.div
        className="container-x py-20 text-center lg:py-28"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">Our Foundation</p>
        {/* The vertical line and the statement reveal together, sliding up from the bottom. */}
        <div className="mx-auto mt-10 flex w-fit max-w-full items-stretch gap-5 text-left sm:gap-8">
          <motion.span aria-hidden className="w-0.5 origin-bottom bg-ink" variants={line} />
          <div className="overflow-hidden py-1">
            <motion.h2
              className="text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl"
              variants={statement}
            >
              People-powered.
              <br />
              <em className="font-semibold italic">Always.</em>
            </motion.h2>
          </div>
        </div>
        <motion.p className="mx-auto mt-10 max-w-xl text-base leading-8 text-muted sm:text-lg" variants={body}>
          It runs through everything we do, from the teams we build and the way we work together to how people grow and
          experience life at Voigue.
        </motion.p>
      </motion.div>
    </section>
  );
}
