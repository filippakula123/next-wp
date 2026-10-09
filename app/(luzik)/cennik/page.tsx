import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import { PageContent } from "@/components/site/luzik-page";
import { JsonLd } from "@/components/site/json-ld";
import { pageSchema } from "@/lib/luzik-seo";
import { getLuzikPageMetadata } from "@/lib/luzik-seo-server";

export async function generateMetadata() { return getLuzikPageMetadata("cennik"); }

export default async function Page() {
  const data = await getLuzikSiteData();
  return <><JsonLd data={pageSchema("cennik", data.courses)} /><PageContent slug="cennik" /></>;
}
