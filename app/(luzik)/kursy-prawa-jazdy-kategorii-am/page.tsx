import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import { PageContent } from "@/components/site/luzik-page";
import { JsonLd } from "@/components/site/json-ld";
import { luzikPageMetadata, pageSchema } from "@/lib/luzik-seo";

export const metadata = luzikPageMetadata("kursy-prawa-jazdy-kategorii-am");

export default async function Page() {
  const data = await getLuzikSiteData();
  return <><JsonLd data={pageSchema("kursy-prawa-jazdy-kategorii-am", data.courses)} /><PageContent slug="kursy-prawa-jazdy-kategorii-am" /></>;
}
