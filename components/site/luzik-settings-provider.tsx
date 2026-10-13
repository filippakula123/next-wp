"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { LuzikSiteData } from "@/lib/luzik-settings";

type PublicSettings = Pick<LuzikSiteData, "header" | "contact">;
const Context = createContext<PublicSettings | undefined>(undefined);
export function LuzikSettingsProvider({ value, children }: { value: PublicSettings; children: ReactNode }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useLuzikSettings = () => {
  const value = useContext(Context);
  if (!value) throw new Error('LuzikSettingsProvider is required');
  return value;
};
