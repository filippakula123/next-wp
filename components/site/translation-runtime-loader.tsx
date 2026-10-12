"use client";

import { useEffect, useState, type ComponentType } from "react";
import { languageStorageKey, storedLanguage } from "@/lib/luzik-languages";
import { updateTranslation } from "@/components/site/translation-store";

export function TranslationRuntimeLoader() {
  const [Runtime, setRuntime] = useState<ComponentType | null>(null);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem(languageStorageKey);
    } catch {
      // Session storage can be disabled by the browser.
    }
    try {
      saved ??= localStorage.getItem(languageStorageKey);
      localStorage.removeItem("__GT_TRANSLATE_LANGS");
    } catch {
      // Keep using the session value when persistent storage is unavailable.
    }

    const language = storedLanguage(saved);
    if (language === "pl") return;

    updateTranslation(language, "loading");
    let active = true;
    import("@/components/site/translation-runtime").then(({ TranslationRuntime }) => {
      if (active) setRuntime(() => TranslationRuntime);
    });
    return () => {
      active = false;
    };
  }, []);

  return Runtime ? <Runtime /> : null;
}
