"use client";

import { useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";
import { LanguageFlag } from "./language-flag";
import { isLuzikLanguage, languageStorageKey, luzikLanguages } from "@/lib/luzik-languages";
import { subscribeTranslation, translationSnapshot, translationServerSnapshot } from "./translation-runtime";

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { language, status } = useSyncExternalStore(subscribeTranslation, translationSnapshot, translationServerSnapshot);
  return <div className={`luzik-language notranslate${dark ? " luzik-language-dark" : ""}`} translate="no">
    <LanguageFlag language={language} />
    <select aria-label="Wybierz język / Select language" value={language} onChange={event => {
      const next = event.target.value;
      if (!isLuzikLanguage(next) || next === language) return;
      try { sessionStorage.setItem(languageStorageKey, next); } catch { /* Some browsers disable session storage. */ }
      try { localStorage.setItem(languageStorageKey, next); localStorage.removeItem("__GT_TRANSLATE_LANGS"); } catch { /* Session storage keeps the choice if persistent storage is disabled. */ }
      // Reload before translation to avoid mutating a hydrated React tree twice.
      window.location.reload();
    }}>
      {luzikLanguages.map(item => <option key={item.code} value={item.code}>{item.short} · {item.label}</option>)}
    </select>
    <span aria-hidden="true">{language.toUpperCase()}</span>
    <ChevronDown size={12} aria-hidden="true" />
    {status === "loading" && <span className="luzik-language-progress" aria-hidden="true" />}
  </div>;
}
