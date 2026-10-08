"use client";

import { useState } from "react";
import { FileUser } from "lucide-react";
import { CvModal } from "@/components/careers/CvModal";
import { Button } from "@/components/ui/Button";
import { MotionReveal } from "@/components/ui/MotionReveal";

export function GeneralApplication() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-white pb-20 lg:pb-28">
      <div className="container-x">
        <MotionReveal>
          <div className="relative grid items-center gap-10 overflow-hidden rounded-[2rem] border border-line bg-paper p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm text-muted">Don&apos;t see what you&apos;re looking for?</p>
              <h2 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                We&apos;re always open to great people.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8 text-muted">
                Send us your cv and we&apos;ll keep you in mind for future opportunities.
              </p>
              <Button variant="outline" className="mt-8" onClick={() => setOpen(true)}>
                Send your CV
              </Button>
            </div>
            <div aria-hidden className="hidden justify-center lg:flex">
              <span className="flex h-44 w-44 rotate-6 items-center justify-center rounded-3xl bg-white text-brand-violet shadow-soft">
                <FileUser size={84} strokeWidth={1.1} />
              </span>
            </div>
          </div>
        </MotionReveal>
      </div>
      {open ? <CvModal mode={{ type: "general" }} onClose={() => setOpen(false)} /> : null}
    </section>
  );
}
