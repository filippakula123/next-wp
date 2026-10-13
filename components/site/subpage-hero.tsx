import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import Image from "@/components/site/static-image";
import Link from "@/components/site/site-link";
import { ArrowRight, ChevronRight, Phone } from "@/components/site/icons";
import type { ReactNode } from "react";


interface SubpageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  breadcrumb: string;
  image?: string;
  imageAlt?: string;
  imageLabel?: string;
  portrait?: boolean;
  visual?: ReactNode;
  action: { href: string; label: string };
  children?: ReactNode;
}

export async function SubpageHero({
  eyebrow, title, description, breadcrumb, image, imageAlt,
  imageLabel, action, children, portrait = false, visual,
}: SubpageHeroProps) {
  const { header: luzikHeaderData } = await getLuzikSiteData();
  return (
    <section className="luzik-subhero" aria-labelledby="subpage-title">
      <div className="luzik-container">
        <nav className="luzik-breadcrumbs" aria-label="Ścieżka nawigacji">
          <Link href="/">Strona główna</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page">{breadcrumb}</span>
        </nav>
        <div className="luzik-subhero-grid">
          <div className="luzik-subhero-content">
            <p className="home-eyebrow">{eyebrow}</p>
            <h1 id="subpage-title">{title}</h1>
            <p className="luzik-subhero-copy">{description}</p>
            <div className="luzik-subhero-actions">
              <Link className="home-button" href={action.href}>
                {action.label}<ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href={luzikHeaderData.phoneHref} className="luzik-subhero-phone">
                <Phone size={17} aria-hidden="true" />{luzikHeaderData.phoneLabel}
              </a>
            </div>
            {children}
          </div>
          {visual ?? <div className={`luzik-subhero-photo ${portrait ? "luzik-subhero-portrait" : ""}`}>
            <div className="luzik-subhero-image">
            {image && <Image src={image} alt={imageAlt ?? ""} fill
              sizes="(max-width: 767px) 100vw, 50vw" loading="eager" fetchPriority="high" />}
            </div>
            <span className="luzik-subhero-photo-label">{imageLabel}</span>
          </div>}
        </div>
      </div>
    </section>
  );
}

export function SubpageCta({ href = "/kontakt" }: { href?: string } = {}) {
  return (
    <section className="luzik-subpage-cta" aria-labelledby="subpage-cta-title">
      <div className="luzik-container">
        <div>
          <p className="home-eyebrow">Twój pierwszy krok</p>
          <h2 id="subpage-cta-title" className="home-title">
            Szukasz szkoły jazdy, która rzeczywiście nauczy Cię jak jeździć?
          </h2>
          <p>Dołącz do naszej grupy zadowolonych kursantów, a my pokażemy Ci co to znaczy dobra jazda!</p>
        </div>
        <Link href={href} className="home-button">
          Zapisz się na kurs<ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
