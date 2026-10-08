"use client";
import { createContext, useContext, type ReactNode } from "react";
import { buildLuzikSiteData, type LuzikSiteData } from "@/lib/luzik-settings";

type PublicSettings = Pick<LuzikSiteData, "header" | "contact">;
const Context = createContext<PublicSettings>(buildLuzikSiteData());
export function LuzikSettingsProvider({ value, children }: { value: PublicSettings; children: ReactNode }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useLuzikSettings = () => useContext(Context);
