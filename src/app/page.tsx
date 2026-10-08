import { CareersTeaser } from "@/components/home/CareersTeaser";
import { Experience } from "@/components/home/Experience";
import { Foundation } from "@/components/home/Foundation";
import { GlobalConnection } from "@/components/home/GlobalConnection";
import { HomeHero } from "@/components/home/HomeHero";
import { Recognition } from "@/components/home/Recognition";
import { getJobs } from "@/lib/query";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Voigue | See what's waiting for you",
  "Remote, hybrid and on-site careers with international exposure. Explore life at Voigue and find a role that fits the way you want to work."
);

// Vacancies, photos and employee voices come from the CMS; refresh the static page every minute.
export const revalidate = 60;

export default async function Home() {
  const jobs = await getJobs();

  return (
    <>
      <HomeHero />
      <Foundation />
      <Experience />
      <GlobalConnection />
      <CareersTeaser jobs={jobs} />
      <Recognition />
    </>
  );
}
