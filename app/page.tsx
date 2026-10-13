import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import type { Metadata } from "next";
import { Suspense } from 'react';

import { HomeHero } from "@/components/home/home-hero";
import { HomeInstructors } from "@/components/home/home-instructors";
import { HomeIntro } from "@/components/home/home-intro";
import { HomeRankings } from "@/components/home/home-rankings";
import { HomeExamTraining } from "@/components/home/home-exam-training";
import { HomeReviewsLoader } from "@/components/home/home-reviews-loader";
import { googleReviewsConfigured } from "@/lib/luzik-reviews-server";
import { HomeImportantPlaces } from "@/components/home/home-important-places";
import { HomeHighlights } from "@/components/home/home-highlights";
import { HomeLatestPosts } from "@/components/home/home-latest-posts";
import { StatsStrip } from "@/components/home/stats-strip";
import { siteConfig } from "@/site.config";
import { pageSchema } from "@/lib/luzik-seo";
import { getLuzikMetadata } from "@/lib/luzik-seo-server";
import { JsonLd } from "@/components/site/json-ld";

export async function generateMetadata(): Promise<Metadata> { return getLuzikMetadata("Szkoła Jazdy Kielce Luzik", siteConfig.site_description, "/"); }

export default async function HomePage() {
  const data = await getLuzikSiteData();
  return (
<main id="main-content">
  <JsonLd data={pageSchema(undefined, data.courses)} />
  <HomeHero />
  <StatsStrip />
  <Suspense fallback={null}><HomeIntro /></Suspense>
  <Suspense fallback={null}><HomeRankings /></Suspense>
  <Suspense fallback={null}><HomeInstructors /></Suspense>
  <Suspense fallback={null}><HomeExamTraining /></Suspense>
  <Suspense fallback={null}><HomeReviewsLoader enabled={googleReviewsConfigured()} /></Suspense>
  <Suspense fallback={null}><HomeImportantPlaces /></Suspense>
  <Suspense fallback={null}><HomeHighlights /></Suspense>
  <Suspense fallback={null}><HomeLatestPosts /></Suspense>
</main>
  );
}
