"use client";

import { useEffect, useSyncExternalStore } from "react";
import { languageStorageKey, storedLanguage, translatedNavigation, type LuzikLanguage } from "@/lib/luzik-languages";

type TranslationStatus = "idle" | "loading" | "ready" | "error";
interface Translator {
  libReady: boolean;
  finished: boolean;
  error: boolean;
  readyCallback?: () => void;
  resultCallback?: () => void;
  translate: (source: string, target: string) => boolean;
}
declare global { interface Window { __GT?: { translator: Translator } } }
const initial = { language: "pl" as LuzikLanguage, status: "idle" as TranslationStatus };
let snapshot = initial;
const listeners = new Set<() => void>();
export const translationSnapshot = () => snapshot;
export const translationServerSnapshot = () => initial;
export function subscribeTranslation(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
function update(language: LuzikLanguage, status: TranslationStatus) { snapshot = { language, status }; listeners.forEach(listener => listener()); }

let runtimePromise: Promise<Translator> | undefined;
function loadTranslator(): Promise<Translator> {
  if (runtimePromise) return runtimePromise;
  runtimePromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "luzik-gtranslate-runtime";
    script.src = "https://cdn.gtranslate.net/widgets/latest/lib.min.js";
    script.async = true;
    const timer = window.setTimeout(() => { reject(new Error("Translation timeout")); }, 20000);
    script.onerror = () => { window.clearTimeout(timer); reject(new Error("Translation unavailable")); };
    script.onload = () => {
      const translator = window.__GT?.translator;
      if (!translator) { window.clearTimeout(timer); reject(new Error("Translation unavailable")); return; }
      const ready = () => { window.clearTimeout(timer); if (translator.error) reject(new Error("Translation unavailable")); else resolve(translator); };
      if (translator.libReady) ready(); else translator.readyCallback = ready;
    };
    document.body.appendChild(script);
  });
  return runtimePromise;
}

const messages = {
  en: { loading: "Translating the page…", error: "Translation is unavailable. Please try again or select Polish.", retry: "Try again" },
  de: { loading: "Die Seite wird übersetzt…", error: "Die Übersetzung ist nicht verfügbar. Bitte erneut versuchen oder Polnisch wählen.", retry: "Erneut versuchen" },
  it: { loading: "Traduzione della pagina…", error: "Traduzione non disponibile. Riprova oppure seleziona il polacco.", retry: "Riprova" },
  uk: { loading: "Перекладаємо сторінку…", error: "Переклад недоступний. Спробуйте ще раз або виберіть польську.", retry: "Спробувати ще раз" },
  pl: { loading: "Tłumaczenie strony…", error: "Tłumaczenie jest niedostępne. Spróbuj ponownie lub wybierz polski.", retry: "Spróbuj ponownie" },
};

export function TranslationRuntime() {
  const state = useSyncExternalStore(subscribeTranslation, translationSnapshot, translationServerSnapshot);
  useEffect(() => {
    let language: LuzikLanguage = "pl";
    let saved: string | null = null;
    try { saved = sessionStorage.getItem(languageStorageKey); } catch { /* Session storage may be disabled. */ }
    try { saved ??= localStorage.getItem(languageStorageKey); localStorage.removeItem("__GT_TRANSLATE_LANGS"); } catch { /* Persistent storage may be disabled. */ }
    language = storedLanguage(saved);
    update(language, language === "pl" ? "idle" : "loading");
    if (language === "pl") return;
    let alive = true;
    let resultTimer: ReturnType<typeof setTimeout> | undefined;
    loadTranslator().then(translator => {
      if (!alive) return;
      const finish = () => {
        if (!alive) return;
        clearTimeout(resultTimer);
        const success = !translator.error && translator.finished;
        // The server document stays Polish; the translated browser view has
        // its own language for assistive technology.
        if (success) document.documentElement.lang = language;
        update(language, success ? "ready" : "error");
      };
      translator.resultCallback = finish;
      resultTimer = setTimeout(() => { if (alive) update(language, "error"); }, 30000);
      if (!translator.translate("pl", language)) { clearTimeout(resultTimer); update(language, "error"); }
    }).catch(() => { if (alive) update(language, "error"); });
    function navigate(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const href = link.getAttribute("href");
      if (!href) return;
      const destination = translatedNavigation(href, location.href);
      if (!destination) {
        // Same-page anchors should use native navigation, without an RSC update.
        try {
          const target = new URL(href, location.href);
          if (target.origin === location.origin && target.pathname === location.pathname && target.search === location.search && target.hash) event.stopPropagation();
        } catch { /* Ignore malformed links. */ }
        return;
      }
      event.preventDefault(); event.stopPropagation(); window.location.assign(destination);
    }
    document.addEventListener("click", navigate, true);
    return () => { alive = false; clearTimeout(resultTimer); document.removeEventListener("click", navigate, true); };
  }, []);
  const copy = messages[state.language];
  if (state.status !== "loading" && state.status !== "error") return null;
  return <aside className={`luzik-translation-status notranslate ${state.status === "error" ? "is-error" : ""}`} translate="no" lang={state.language} aria-live="polite">
    <span>{state.status === "loading" ? copy.loading : copy.error}</span>
    {state.status === "error" && <button type="button" onClick={() => window.location.reload()}>{copy.retry}</button>}
  </aside>;
}
