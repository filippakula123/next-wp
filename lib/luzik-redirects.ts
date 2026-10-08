// Verified legacy links found in the imported articles and original course pages.
export const legacyPaths: Record<string, string> = {
  "/egzamin-teoretyczny-na-prawo-jazdy-ile-trwa-egzamin-i-jak-wyglada": "/jak-wyglada-egzamin-teoretyczny-na-prawo-jazdy-2026",
  "/egzamin-wewnetrzny-praktyczny-i-teoretyczny-na-prawo-jazdy-jak-wyglada-i-czy-trzeba-go-zdac-2": "/egzamin-wewnetrzny-praktyczny-i-teoretyczny-na-prawo-jazdy-jak-wyglada-i-czy-trzeba-go-zdac",
  "/kurs-prawa-jazdy-kategorii-b-automat": "/kursy-prawa-jazdy-kategorii-b-automat",
  "/ile-wazny-jest-egzamin-teoretyczny-na-prawo-jazdy-w-2025-roku": "/ile-wazny-jest-egzamin-teoretyczny-na-prawo-jazdy-w-2026-roku",
  "/kursy-prawa-jazdy/kursy-prawa-jazdy-kategorii-b": "/kursy-prawa-jazdy-kategorii-b",
  "/kursy-prawa-jazdy/jazdy-doszkalajace": "/jazdy-doszkalajace",
  "/https-luzikkielce-pl-profil-kandydata-na-kierowce-pkk-co-to-jest-i-jak-go-uzyskac": "/profil-kandydata-na-kierowce-pkk-co-to-jest-i-jak-go-uzyskac",
  "/https-luzikkielce-pl-czy-mozna-rozpoczac-nauke-jazdy-i-zdac-egzamin-na-prawo-jazdy-przed-18-rokiem-zycia": "/czy-mozna-rozpoczac-nauke-jazdy-i-zdac-egzamin-na-prawo-jazdy-przed-18-rokiem-zycia",
};
export const canonicalPath = (path: string) => legacyPaths[path.replace(/\/$/, "")] ?? path.replace(/\/$/, "");
