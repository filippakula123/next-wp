export const luzikLanguages = [
  { code: "pl", label: "Polski", short: "PL" },
  { code: "en", label: "English", short: "EN" },
  { code: "de", label: "Deutsch", short: "DE" },
  { code: "it", label: "Italiano", short: "IT" },
  { code: "uk", label: "Українська", short: "UK" },
] as const;

export type LuzikLanguage = (typeof luzikLanguages)[number]["code"];
export const languageStorageKey = "luzik-language";
export function isLuzikLanguage(value: unknown): value is LuzikLanguage {
  return luzikLanguages.some(language => language.code === value);
}
export function storedLanguage(value: string | null): LuzikLanguage {
  return isLuzikLanguage(value) ? value : "pl";
}

// A full document navigation keeps React's tree consistent with the DOM that
// the browser translator changes. Polish visitors retain Next.js navigation.
export function translatedNavigation(href: string, current: string) {
  try {
    const from = new URL(current), to = new URL(href, from);
    if (to.origin !== from.origin || !["https:", "http:"].includes(to.protocol)) return null;
    if (to.pathname === from.pathname && to.search === from.search && to.hash) return null;
    return to.href;
  } catch { return null; }
}
