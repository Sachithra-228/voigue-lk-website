"use client";

import { useState } from "react";
import Image from "next/image";

type LoopingVideoProps = {
  /** One or more short clips. They play one after another and loop continuously. */
  clips: string[];
  poster?: string;
  className?: string;
};

/**
 * Full-bleed looping background video. With no clips supplied it renders a quiet gradient
 * so the surrounding copy stays readable until the real footage is added in src/lib/media.ts.
 */
export function LoopingVideo({ clips, poster, className }: LoopingVideoProps) {
  const [index, setIndex] = useState(0);

  if (!clips.length) {
    return (
      <div
        aria-hidden
        className={`bg-[radial-gradient(circle_at_72%_28%,hsl(262_60%_42%/0.55),transparent_45%),linear-gradient(135deg,hsl(278_63%_16%),hsl(262_50%_28%))] ${className ?? ""}`}
      />
    );
  }

  return (
    <div aria-hidden className={className}>
      {poster ? <Image src={poster} alt="" fill sizes="100vw" className="object-cover" priority /> : null}
      <video
        key={clips[index]}
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        src={clips[index]}
        poster={poster}
        autoPlay
        muted
        playsInline
        loop={clips.length === 1}
        preload="auto"
        onEnded={() => setIndex((current) => (current + 1) % clips.length)}
      />
    </div>
  );
}
