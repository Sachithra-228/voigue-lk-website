import { Button } from "@/components/ui/Button";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Accent } from "@/components/ui/SectionHeading";

/** Stylised globe with a connection line between Colombo and Melbourne (and a few "beyond" points). */
function Globe() {
  return (
    <svg viewBox="0 0 1200 460" className="h-auto w-full" role="img" aria-label="Globe showing a connection between Sri Lanka and Australia">
      <defs>
        <radialGradient id="globe-fill" cx="50%" cy="30%" r="75%">
          <stop offset="0%" stopColor="hsl(262 70% 97%)" />
          <stop offset="55%" stopColor="hsl(262 62% 90%)" />
          <stop offset="100%" stopColor="hsl(256 60% 78%)" />
        </radialGradient>
        <linearGradient id="arc" x1="0" x2="1">
          <stop offset="0%" stopColor="hsl(256 72% 52%)" />
          <stop offset="100%" stopColor="hsl(290 56% 49%)" />
        </linearGradient>
        <clipPath id="globe-clip">
          <circle cx="600" cy="620" r="560" />
        </clipPath>
      </defs>
      <circle cx="600" cy="620" r="560" fill="url(#globe-fill)" />
      <g clipPath="url(#globe-clip)" fill="none" stroke="hsl(256 60% 60% / 0.28)" strokeWidth="1.2">
        {[480, 380, 260, 130].map((rx) => (
          <ellipse key={rx} cx="600" cy="620" rx={rx} ry="560" />
        ))}
        {[470, 380, 290, 200, 110].map((ry) => (
          <ellipse key={ry} cx="600" cy="620" rx="560" ry={ry} />
        ))}
        <line x1="600" y1="60" x2="600" y2="1180" />
      </g>
      {/* Connection lines */}
      <path d="M470 150 Q 600 20 760 250" fill="none" stroke="url(#arc)" strokeWidth="2.5" strokeDasharray="7 9" className="animate-[dash-flow_1.6s_linear_infinite]" />
      <path d="M760 250 Q 850 150 960 190" fill="none" stroke="hsl(256 72% 52% / 0.5)" strokeWidth="1.6" strokeDasharray="5 8" />
      <path d="M760 250 Q 700 330 640 300" fill="none" stroke="hsl(256 72% 52% / 0.5)" strokeWidth="1.6" strokeDasharray="5 8" />
      {/* Points */}
      {[
        { x: 960, y: 190, r: 5 },
        { x: 640, y: 300, r: 5 },
        { x: 330, y: 230, r: 4 },
        { x: 880, y: 340, r: 4 }
      ].map((point) => (
        <circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r={point.r} fill="hsl(256 72% 52%)" opacity="0.7" />
      ))}
      <g>
        <circle cx="470" cy="150" r="18" fill="hsl(256 72% 52% / 0.18)" />
        <circle cx="470" cy="150" r="8" fill="hsl(256 72% 52%)" />
        <text x="470" y="118" textAnchor="middle" className="fill-ink text-[18px] font-semibold">Colombo</text>
      </g>
      <g>
        <circle cx="760" cy="250" r="18" fill="hsl(290 56% 49% / 0.18)" />
        <circle cx="760" cy="250" r="8" fill="hsl(290 56% 49%)" />
        <text x="760" y="288" textAnchor="middle" className="fill-ink text-[18px] font-semibold">Melbourne</text>
      </g>
    </svg>
  );
}

export function GlobalConnection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
          <MotionReveal direction="left">
            <h2 className="text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Linking <Accent>Lankan</Accent> talent with businesses across Australia and beyond.
            </h2>
          </MotionReveal>
          <MotionReveal direction="right" delay={0.1}>
            <div>
              <p className="text-lg leading-8 text-muted">
                The idea is pretty simple. Great talent is in Sri Lanka, great businesses are out there, and we help bring
                the two together. Being Australian-based means the roles we create put you directly into teams working with
                businesses across Australia and beyond, giving you international exposure from day one.
              </p>
              <Button href="/about" className="mt-8">
                About Voigue
              </Button>
            </div>
          </MotionReveal>
        </div>
        <MotionReveal delay={0.1}>
          <div className="-mb-10 mt-12 [mask-image:linear-gradient(to_bottom,black_55%,transparent)] lg:mt-16">
            <Globe />
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
