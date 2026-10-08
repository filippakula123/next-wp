import source from "./luzik-legacy-seo.json";
import { legacyPaths } from "./luzik-redirects";
import { luzikCourses } from "./luzik-offer";
import type { LuzikSiteData } from "./luzik-settings";

type Entry = { type: string; title: string; template?: string; description?: string; noindex?: boolean; socialImage?: string; socialTitle?: string; socialDescription?: string };
const entries: Record<string, Entry> = source.entries;

// Rank Math's saved title/description templates survive the headless migration.
// Generated excerpts use the current content; prices use the same CMS values as the page.
export function legacySeo(path: string, title: string, description: string, data?: LuzikSiteData) {
  const pathname = path.split("?")[0];
  const original = Object.entries(legacyPaths).find(([, target]) => target === pathname)?.[0];
  const entry = entries[pathname] ?? (original ? entries[original] : undefined);
  if (!entry) return { title, description, indexable: true };
  const contentTitle = entry.type === "post" ? title : entry.title;
  const resolve = (template: string) => template.replace(/%(title|sitename|sep|page|excerpt)%/g, (_, key: string) => ({ title: contentTitle, sitename: source.options.sitename, sep: source.options.title_separator, page: "", excerpt: description })[key] ?? "").replace(/\s+/g, " ").trim();
  const template = entry.template ?? (entry.type === "post" ? source.options.pt_post_title : entry.type === "team" ? source.options.pt_team_title : source.options.pt_page_title);
  // Two obvious spelling mistakes in the original metadata, without changing its meaning.
  const page = Number(new URL(path, "https://luzikkielce.pl").searchParams.get("page"));
  const resolvedTitle = resolve(template).replace("sitename%", source.options.sitename).replace("LSzkoła jazdy uzik", "Szkoła jazdy Luzik") + (pathname === "/blog" && Number.isSafeInteger(page) && page > 1 ? ` — strona ${page}` : "");
  let resolvedDescription = entry.description ? resolve(entry.description) : description;
  if (pathname === "/kursy-prawa-jazdy-kategorii-b") resolvedDescription = resolvedDescription.replace("3500 zł", `${(data?.courses ?? luzikCourses).find(course => course.id === "b")!.price} zł`);
  if (pathname === "/jazdy-doszkalajace" && data) {
    const manual = data.lessonPrices.b, automatic = data.lessonPrices["b-automat"];
    resolvedDescription = resolvedDescription.replace("140 zł/h", manual === automatic ? `${manual} zł/h` : `${manual} zł/h (manual) i ${automatic} zł/h (automat)`);
  }
  return { title: resolvedTitle, description: resolvedDescription, indexable: !entry.noindex, socialImage: entry.socialImage, socialTitle: entry.socialTitle ? resolve(entry.socialTitle) : resolvedTitle, socialDescription: entry.socialDescription ? resolve(entry.socialDescription) : resolvedDescription };
}

export const legacyOrganization = { description: source.options.organization_description, latitude: 50.87243573373555, longitude: 20.632619556558957 };
