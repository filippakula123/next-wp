import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import { PageContent } from "@/components/site/luzik-page";
import { JsonLd } from "@/components/site/json-ld";
import { pageSchema } from "@/lib/luzik-seo";
import { getLuzikPageMetadata } from "@/lib/luzik-seo-server";

export async function generateMetadata() { return getLuzikPageMetadata("szkola-jazdy-luzik-instruktorzy"); }

export default async function Page() {
  const data = await getLuzikSiteData();
  return <><JsonLd data={pageSchema("szkola-jazdy-luzik-instruktorzy", data.courses)} /><PageContent slug="szkola-jazdy-luzik-instruktorzy" /></>;
}
