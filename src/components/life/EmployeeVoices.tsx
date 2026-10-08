import { Carousel } from "@/components/ui/Carousel";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { MotionReveal } from "@/components/ui/MotionReveal";
import type { PublicVoice } from "@/types/content";

export function EmployeeVoices({ voices }: { voices: PublicVoice[] }) {
  if (!voices.length) return null;

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-x">
        <MotionReveal>
          <h2 className="text-center text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">Employee Voices</h2>
        </MotionReveal>
        <div className="mt-14 md:px-6">
          <Carousel label="Employee voices" itemClassName="w-[78%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
            {voices.map((voice, index) => (
              <figure key={`${voice.name}-${index}`}>
                <ImageSlot
                  src={voice.image}
                  alt={voice.image ? voice.name : ""}
                  label="Portrait"
                  className="aspect-[4/5] w-full rounded-2xl"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 78vw"
                />
                <figcaption className="mt-5">
                  <p className="text-lg font-semibold text-ink">{voice.name}</p>
                  <p className="text-sm text-muted">{voice.role}</p>
                </figcaption>
                <blockquote className="mt-3 leading-7 text-muted">&ldquo;{voice.quote}&rdquo;</blockquote>
              </figure>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
