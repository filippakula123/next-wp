import Link from "next/link";
import type { Page } from "@/lib/wordpress.d";
import { blogText } from "@/lib/luzik-blog";
import { SubpageHero } from "./subpage-hero";

export function WordPressDocument({ page }: { page: Pick<Page, "title" | "content"> }) {
  const title = blogText(page.title.rendered);
  return <main id="main-content" className="luzik-blog-page">
    <SubpageHero eyebrow="Szkoła Jazdy Luzik" breadcrumb={title} title={title} description="Informacje dotyczące korzystania z serwisu Szkoły Jazdy Luzik." action={{ href: "#dokument", label: "Przeczytaj dokument" }} visual={<div className="luzik-blog-hero-visual"><strong>Twoje zaufanie.<br />Jasne zasady.</strong></div>} />
    <section className="home-section" id="dokument"><div className="luzik-container"><article className="luzik-article-body" aria-label={title} dangerouslySetInnerHTML={{ __html: page.content.rendered }} /><Link href="/kontakt" className="luzik-blog-back">Masz pytania? Skontaktuj się z nami</Link></div></section>
  </main>;
}
