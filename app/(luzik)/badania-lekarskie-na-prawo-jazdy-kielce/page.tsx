import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import { PageContent } from "@/components/site/luzik-page";
import { JsonLd } from "@/components/site/json-ld";
import { pageSchema } from "@/lib/luzik-seo";
import { getLuzikPageMetadata } from "@/lib/luzik-seo-server";

export async function generateMetadata() { return getLuzikPageMetadata("badania-lekarskie-na-prawo-jazdy-kielce"); }

export default async function Page() {
  const data = await getLuzikSiteData();
  return <><JsonLd data={pageSchema("badania-lekarskie-na-prawo-jazdy-kielce", data.courses)} /><PageContent slug="badania-lekarskie-na-prawo-jazdy-kielce" /></>;
}
