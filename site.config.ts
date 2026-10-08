type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
  site_indexable: boolean;
};

const configuredUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://luzikkielce.pl");
const isLocalPreview = ["localhost", "127.0.0.1", "[::1]"].includes(configuredUrl.hostname);

export const siteConfig: SiteConfig = {
  site_name: "Szkoła Jazdy Luzik",
  site_description:
    "Szkoła Jazdy Luzik w Kielcach. Kursy B, B automat, A, A1, A2 i AM, jazdy doszkalające i pomoc w formalnościach. Biuro: ul. Warszawska 4.",
  // Canonicals always describe the public site, even in a localhost preview.
  site_domain: isLocalPreview ? "https://luzikkielce.pl" : configuredUrl.origin,
  site_indexable: process.env.NODE_ENV === "production" && !isLocalPreview &&
    process.env.VERCEL_ENV !== "preview" && process.env.SITE_INDEXABLE !== "false",
};
