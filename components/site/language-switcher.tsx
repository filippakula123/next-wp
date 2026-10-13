"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { ChevronDown } from "@/components/site/icons";
import { LanguageFlag } from "./language-flag";
import { isLuzikLanguage, languageStorageKey, luzikLanguages } from "@/lib/luzik-languages";
import { subscribeTranslation, translationSnapshot, translationServerSnapshot } from "./translation-store";

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { language, status } = useSyncExternalStore(subscribeTranslation, translationSnapshot, translationServerSnapshot);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const listId = useId();
  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);
  function choose(next: string) {
      if (!isLuzikLanguage(next) || next === language) return;
      try { sessionStorage.setItem(languageStorageKey, next); } catch { /* Some browsers disable session storage. */ }
      try { localStorage.setItem(languageStorageKey, next); localStorage.removeItem("__GT_TRANSLATE_LANGS"); } catch { /* Session storage keeps the choice if persistent storage is disabled. */ }
      // Reload before translation to avoid mutating a hydrated React tree twice.
      window.location.reload();
  }
  return <div ref={root} className={`luzik-language notranslate${dark ? " luzik-language-dark" : ""}`} translate="no" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }} onKeyDown={event => {
    if (event.key === "Escape" && open) { event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus(); }
  }}>
    <button ref={trigger} type="button" className="luzik-language-trigger" aria-label="Wybierz język / Select language" aria-expanded={open} aria-controls={listId} onClick={() => setOpen(!open)}>
      <LanguageFlag language={language} />
      <span>{language.toUpperCase()}</span>
      <ChevronDown size={12} aria-hidden="true" />
    </button>
    {open && <ul id={listId} className="luzik-language-options" aria-label="Dostępne języki">
      {luzikLanguages.map(item => <li key={item.code}><button type="button" aria-pressed={item.code === language} onClick={() => { setOpen(false); choose(item.code); }}>
        <LanguageFlag language={item.code} /><span>{item.label}</span><span className="luzik-language-code">{item.short}</span>
      </button></li>)}
    </ul>}
    {status === "loading" && <span className="luzik-language-progress" aria-hidden="true" />}
  </div>;
}
