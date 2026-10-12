import { type LuzikLanguage } from "@/lib/luzik-languages";

export type TranslationStatus = "idle" | "loading" | "ready" | "error";
export interface TranslationSnapshot {
  language: LuzikLanguage;
  status: TranslationStatus;
}

const initial: TranslationSnapshot = { language: "pl", status: "idle" };
let snapshot = initial;
const listeners = new Set<() => void>();

export const translationSnapshot = () => snapshot;
export const translationServerSnapshot = () => initial;
export function subscribeTranslation(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function updateTranslation(language: LuzikLanguage, status: TranslationStatus) {
  if (snapshot.language === language && snapshot.status === status) return;
  snapshot = { language, status };
  listeners.forEach((listener) => listener());
}
