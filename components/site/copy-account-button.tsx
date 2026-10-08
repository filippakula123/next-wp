"use client";
import { useLuzikSettings } from "@/components/site/luzik-settings-provider";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyAccountButton() {
  const { contact: luzikContactData } = useLuzikSettings();
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(luzikContactData.account.replaceAll(" ", ""));
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }
  return <div className="luzik-copy-account">
    <button type="button" onClick={copyAccount}>{status === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{status === "copied" ? "Skopiowano numer konta" : "Kopiuj numer konta"}</button>
    <span className={status === "error" ? "luzik-copy-error" : "sr-only"} role="status">{status === "copied" ? "Numer konta został skopiowany bez spacji." : status === "error" ? "Nie udało się skopiować. Zaznacz numer konta i skopiuj go ręcznie." : ""}</span>
  </div>;
}
