import { readFile } from "node:fs/promises";
import path from "node:path";
import { WordPressDocument } from "@/components/site/wordpress-document";
import { luzikMetadata } from "@/lib/luzik-seo";

export const metadata = luzikMetadata("Polityka prywatności", "Zasady przetwarzania danych osobowych i korzystania z plików cookies w serwisie Szkoły Jazdy Luzik.", "/polityka-prywatnosci", undefined, false);

export default async function PrivacyPage() {
  // Original text from https://luzikkielce.pl/polityka-prywatnosci/,
  // retrieved 2026-10-08. Only presentation markup has been simplified.
  const html = await readFile(path.join(process.cwd(), "lib/luzik-privacy.html"), "utf8");
  return <WordPressDocument page={{ title: { rendered: "Polityka prywatności" }, content: { rendered: html, protected: false } }} />;
}
