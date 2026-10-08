"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

type YouTubeEmbedProps = {
  /** The part after v= in the YouTube URL. Leave empty to show a placeholder. */
  videoId: string;
  title: string;
};

/** Click-to-load YouTube player: nothing from YouTube loads until the visitor presses play. */
export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink shadow-soft">
      {playing && videoId ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => videoId && setPlaying(true)}
          disabled={!videoId}
          aria-label={videoId ? `Play video: ${title}` : "Promotional video coming soon"}
          className="focus-ring group absolute inset-0 flex items-center justify-center disabled:cursor-default"
        >
          {videoId ? (
            <Image
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(min-width: 1024px) 960px, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <span className="absolute inset-0 bg-[linear-gradient(135deg,hsl(278_50%_22%),hsl(262_45%_34%))]" />
          )}
          <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-brand-violet shadow-xl transition group-hover:scale-105">
            <Play size={30} className="ml-1 fill-current" />
          </span>
          {!videoId ? (
            <span className="absolute bottom-5 text-xs font-medium uppercase tracking-[0.2em] text-white/60">
              Promotional video placeholder
            </span>
          ) : null}
        </button>
      )}
    </div>
  );
}
