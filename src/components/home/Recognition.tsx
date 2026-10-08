import Image from "next/image";
import { MotionReveal } from "@/components/ui/MotionReveal";

const awards = [
  {
    title: "ISO 9001 Certified",
    description: "ISO 9001 certification, accredited",
    image: "/images/awards/iso-9001-ukas.jpg",
    alt: "NQA ISO 9001 and UKAS quality management certification logos"
  },
  {
    title: "Great Place To Work",
    description: "Certified, May 2022 to May 2023",
    image: "/images/awards/great-place-to-work-2022.jpeg",
    alt: "Great Place To Work certified May 2022 to May 2023 badge"
  },
  {
    title: "Australian Service Excellence Awards",
    description: "Finalist 2024",
    image: "/images/awards/asea-finalist-2024.png",
    alt: "Australian Service Excellence Awards 2024 finalist badge"
  },
  {
    title: "Best Workplace for Women",
    description: "Great Place To Work, Sri Lanka 2022",
    image: "/images/awards/best-workplace-women-2022.png",
    alt: "Great Place To Work Best Workplaces for Women Sri Lanka 2022 badge"
  },
  {
    title: "Asia Awards",
    description: "Outstanding Outsourcing Company and Quality Proven Brand, 2020/2021",
    image: "/images/awards/asia-award.png",
    alt: "Asia Awards gold badge"
  }
];

export function Recognition() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-x">
        <MotionReveal>
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">Awards &amp; Recognition</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Recognition that reflects our standards.</h2>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.1}>
          <ul className="mt-14 grid grid-cols-2 gap-y-12 md:grid-cols-3 lg:grid-cols-5 lg:gap-y-0">
            {awards.map((award, index) => (
              <li key={award.title} className={`flex flex-col items-center px-4 text-center ${index > 0 ? "lg:border-l lg:border-line" : ""}`}>
                <div className="relative h-28 w-full">
                  <Image src={award.image} alt={award.alt} fill sizes="200px" className="object-contain" />
                </div>
                <h3 className="mt-5 text-base font-semibold leading-snug text-ink">{award.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{award.description}</p>
              </li>
            ))}
          </ul>
        </MotionReveal>
      </div>
    </section>
  );
}
