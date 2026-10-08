import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { clsx } from "@/lib/utils";

type ImageSlotProps = {
  /** Path under /public or a remote URL. Leave empty to render the neutral placeholder. */
  src?: string;
  alt?: string;
  /** Short label shown inside the placeholder, e.g. "Team photo". */
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Use on dark backgrounds so the placeholder stays quiet. */
  tone?: "light" | "dark";
};

/**
 * Photo slot used everywhere real Voigue photography is still to come.
 * Set the matching value in src/lib/media.ts and the placeholder is replaced automatically.
 */
export function ImageSlot({ src, alt = "", label, className, sizes = "100vw", priority, tone = "light" }: ImageSlotProps) {
  // Callers may position the slot themselves (e.g. "absolute inset-0" for a hero background).
  const background = Boolean(className?.includes("absolute"));
  const position = background ? undefined : "relative";

  if (src) {
    return (
      <div className={clsx(position, "overflow-hidden", className)}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={clsx(
        position,
        "flex flex-col items-center justify-center gap-2 overflow-hidden",
        tone === "light"
          ? "bg-[linear-gradient(135deg,hsl(var(--lilac)),hsl(var(--lilac-deep)))] text-brand-violet/55"
          : "bg-[linear-gradient(135deg,hsl(278_50%_22%),hsl(262_45%_30%))] text-white/35",
        className
      )}
    >
      {background ? null : <ImageIcon size={32} strokeWidth={1.5} />}
      {label && !background ? <span className="px-3 text-center text-xs font-medium uppercase tracking-[0.18em]">{label}</span> : null}
    </div>
  );
}
