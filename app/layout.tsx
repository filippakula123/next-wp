import "./globals.css";
import "./luzik.css";
import "./luzik-subpages.css";
import "./luzik-course-details.css";
import "./luzik-instructors.css";
import "./luzik-contact.css";
import "./luzik-gallery.css";
import "./luzik-blog.css";
import "./luzik-accents.css";
import "./luzik-profiles.css";
import "./luzik-languages.css";
import "./luzik-motion.css";
import "./luzik-footer.css";
import "./luzik-mobile-nav.css";
import "./luzik-header-polish.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Lexend } from "next/font/google";

import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/site/json-ld";
import { organizationSchemaFor } from "@/lib/luzik-seo";
import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import { LuzikSettingsProvider } from "@/components/site/luzik-settings-provider";
import { TranslationRuntime } from "@/components/site/translation-runtime";
import { MotionRuntime } from "@/components/site/motion-runtime";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin", "latin-ext"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.site_domain),
  title: {
    default: siteConfig.site_name,
    template: `%s | ${siteConfig.site_name}`,
  },
  description: siteConfig.site_description,
  applicationName: siteConfig.site_name,
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false },
  alternates: { types: { "application/rss+xml": [{ url: "/feed.xml", title: "Blog Szkoły Jazdy Luzik" }] } },
  robots: {
    // Only finished Luzik pages opt into public indexing through their metadata.
    index: false,
    follow: true,
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0075b8" };

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const data = await getLuzikSiteData();
  return (
    <html lang="pl" className="light">
      <body
        // ColorZilla adds cz-shortcut-listen before React hydrates. Suppress
        // attribute differences on this element only; children remain checked.
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          lexend.variable,
        )}
      >
        <a href="#main-content" className="luzik-skip-link">Przejdź do treści</a>
          <JsonLd data={organizationSchemaFor(data)} />
          <LuzikSettingsProvider value={{ header: data.header, contact: data.contact }}>
          <Nav />
          {children}
          <Footer />
          <TranslationRuntime />
          <MotionRuntime />
          </LuzikSettingsProvider>
      </body>
    </html>
  );
}
