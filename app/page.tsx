import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import type { Metadata } from "next";

import { HomeHero } from "@/components/home/home-hero";
import { HomeInstructors } from "@/components/home/home-instructors";
import { HomeIntro } from "@/components/home/home-intro";
import { HomeRankings } from "@/components/home/home-rankings";
import { HomeExamTraining } from "@/components/home/home-exam-training";
import { HomeReviews } from "@/components/home/home-reviews";
import { HomeImportantPlaces } from "@/components/home/home-important-places";
import { HomeHighlights } from "@/components/home/home-highlights";
import { HomeLatestPosts } from "@/components/home/home-latest-posts";
import { StatsStrip } from "@/components/home/stats-strip";
import { siteConfig } from "@/site.config";
import { luzikMetadata, pageSchema } from "@/lib/luzik-seo";
import { JsonLd } from "@/components/site/json-ld";

export const metadata: Metadata = luzikMetadata("Szkoła Jazdy Kielce Luzik", siteConfig.site_description, "/");

export default async function HomePage() {
  const data = await getLuzikSiteData();
  return (
<main id="main-content">
  <JsonLd data={pageSchema(undefined, data.courses)} />
  <HomeHero />
  <StatsStrip />
  <HomeIntro />
  <HomeRankings />
  <HomeInstructors />
  <HomeExamTraining />
  <HomeReviews />
  <HomeImportantPlaces />
  <HomeHighlights />
  <HomeLatestPosts />
</main>
  );
}
