import { Button } from "@/components/ui/Button";
import { LoopingVideo } from "@/components/ui/LoopingVideo";
import { media } from "@/lib/media";

export function HomeHero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-brand-navy text-white">
      <LoopingVideo clips={media.home.heroClips} poster={media.home.heroPoster} className="absolute inset-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,6,34,0.85)_0%,rgba(12,6,34,0.45)_45%,rgba(12,6,34,0.2)_100%)]" />
      <div className="container-x relative pb-14 pt-36 lg:pb-20">
        <div className="max-w-3xl animate-[fadeIn_700ms_ease-out]">
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            See what&apos;s waiting for you at Voigue.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/85 sm:text-xl">
            Remote? Hybrid? International exposure. Find a role that fits the way you want to work.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/careers" variant="inverted" arrow={false} className="sm:min-w-44">
              Explore Careers
            </Button>
            <Button href="/life-at-voigue" variant="outline-light" arrow={false} className="sm:min-w-44">
              Life at Voigue
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
