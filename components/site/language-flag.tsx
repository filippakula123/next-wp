import type { LuzikLanguage } from "@/lib/luzik-languages";

// Inline vectors render consistently on Windows, which often displays flag
// emoji as two letters. These flags are decorative; the select names languages.
export function LanguageFlag({ language }: { language: LuzikLanguage }) {
  return <svg className="luzik-language-flag" viewBox="0 0 60 40" width="24" height="16" aria-hidden="true" focusable="false">
    {language === "pl" && <><path fill="#fff" d="M0 0h60v20H0z" /><path fill="#dc143c" d="M0 20h60v20H0z" /></>}
    {language === "de" && <><path fill="#151515" d="M0 0h60v14H0z" /><path fill="#d00" d="M0 14h60v13H0z" /><path fill="#ffce00" d="M0 27h60v13H0z" /></>}
    {language === "it" && <><path fill="#009246" d="M0 0h20v40H0z" /><path fill="#fff" d="M20 0h20v40H20z" /><path fill="#ce2b37" d="M40 0h20v40H40z" /></>}
    {language === "uk" && <><path fill="#0057b7" d="M0 0h60v20H0z" /><path fill="#ffd700" d="M0 20h60v20H0z" /></>}
    {language === "en" && <>
      <path fill="#012169" d="M0 0h60v40H0z" />
      <path stroke="#fff" strokeWidth="8" d="m0 0 60 40M60 0 0 40" />
      <path stroke="#c8102e" strokeWidth="3" d="m0 0 60 40M60 0 0 40" />
      <path stroke="#fff" strokeWidth="13" d="M30 0v40M0 20h60" />
      <path stroke="#c8102e" strokeWidth="8" d="M30 0v40M0 20h60" />
    </>}
  </svg>;
}
