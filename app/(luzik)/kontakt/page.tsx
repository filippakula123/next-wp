import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import { PageContent } from "@/components/site/luzik-page";
import { JsonLd } from "@/components/site/json-ld";
import { pageSchema } from "@/lib/luzik-seo";
import { getLuzikPageMetadata } from "@/lib/luzik-seo-server";

export async function generateMetadata() {
  return getLuzikPageMetadata("kontakt", await getLuzikSiteData());
}

export default async function Page() {
  const data = await getLuzikSiteData();
  return <><JsonLd data={pageSchema("kontakt", data.courses, data)} /><PageContent slug="kontakt" /></>;
}
