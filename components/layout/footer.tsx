import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import Image from "@/components/site/static-image";
import Link from "@/components/site/site-link";
import { ArrowRight, ArrowUpRight, Clock3, CreditCard, Facebook, Instagram, Mail, MapPin, Phone } from "@/components/site/icons";
import { CopyAccountButton } from "@/components/site/copy-account-button";

interface FooterLink { label: string; href: string }
const courseLinks: readonly FooterLink[] = [
  { label: "Wszystkie kursy", href: "/kursy-prawa-jazdy" },
  { label: "Kategoria B · manual", href: "/kursy-prawa-jazdy-kategorii-b" },
  { label: "Kategoria B · automat", href: "/kursy-prawa-jazdy-kategorii-b-automat" },
  { label: "Kategoria A", href: "/kursy-prawa-jazdy-kategorii-a" },
  { label: "Kategoria A2", href: "/kursy-prawa-jazdy-kategorii-a2" },
  { label: "Kategoria A1", href: "/kursy-prawa-jazdy-kategorii-a1" },
  { label: "Kategoria AM", href: "/kursy-prawa-jazdy-kategorii-am" },
  { label: "Jazdy doszkalające", href: "/jazdy-doszkalajace" },
];
const schoolLinks: readonly FooterLink[] = [
  { label: "O nas", href: "/o-nas" },
  { label: "Instruktorzy", href: "/szkola-jazdy-luzik-instruktorzy" },
  { label: "Cennik", href: "/cennik" },
  { label: "Badania lekarskie", href: "/badania-lekarskie-na-prawo-jazdy-kielce" },
  { label: "Blog", href: "/blog" },
  { label: "Galeria", href: "/galeria" },
  { label: "Kontakt", href: "/kontakt" },
];

export async function Footer() {
  const { header, contact } = await getLuzikSiteData();
  const currentYear = new Date().getFullYear();
  return (
    <footer id="luzik-footer" className="luzik-footer">
      <div className="luzik-container">
        <div className="luzik-footer-invitation">
          <div>
            <p className="home-eyebrow">Twój pierwszy krok</p>
            <h2>Prawo jazdy.<br /><span>Na luzie.</span></h2>
            <p>Wybierz swój kurs. My pomożemy Ci ruszyć.</p>
          </div>
          <div className="luzik-footer-invitation-actions">
            <Link href={header.registrationHref} className="home-button">Zapisz się na kurs <ArrowRight size={18} aria-hidden="true" /></Link>
            <Link href="/kursy-prawa-jazdy" className="luzik-footer-secondary">Poznaj nasze kursy <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
          <span className="luzik-footer-road" aria-hidden="true" />
        </div>

        <div className="luzik-footer-grid">
          <div className="luzik-footer-brand">
            <Link href="/" aria-label="Szkoła Jazdy Luzik — strona główna" className="luzik-footer-logo">
              <Image src="/luzik/logo.webp" alt="Szkoła Jazdy Luzik" width={165} height={72} sizes="165px" />
            </Link>
            <p>Szkoła jazdy Luzik Kielce. Uczymy jeździć zgodnie z przepisami i skutecznie przygotowujemy do egzaminu w WORD Kielce. Bezpiecznie, profesjonalnie i na luzie.</p>
            <div className="luzik-footer-socials">
              <a href={header.facebookHref} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={18} aria-hidden="true" /></a>
              <a href={header.instagramHref} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={19} aria-hidden="true" /></a>
              <span>Spotkajmy się też tutaj.</span>
            </div>
          </div>

          <FooterColumn title="Kursy prawa jazdy" links={courseLinks} />
          <FooterColumn title="Szkoła Luzik" links={schoolLinks} />

          <div className="luzik-footer-contact">
            <h2 className="luzik-footer-title">Porozmawiajmy</h2>
            <a href={header.phoneHref} className="luzik-footer-phone"><Phone size={19} aria-hidden="true" /><span translate="no">{header.phoneLabel}</span><ArrowUpRight size={17} aria-hidden="true" /></a>
            <a className="luzik-footer-mail" href={`mailto:${header.email}`}><Mail size={17} aria-hidden="true" /><span translate="no">{header.email}</span></a>
            <div className="luzik-footer-office">
              <MapPin size={18} aria-hidden="true" /><div><p>{contact.address}</p><p>{contact.floor}</p></div>
            </div>
            <p className="luzik-footer-hours"><Clock3 size={16} aria-hidden="true" />{contact.hours}</p>
            <a className="luzik-footer-directions" href={contact.mapHref} target="_blank" rel="noopener noreferrer">Wyznacz dojazd do biura <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>

        <div className="luzik-footer-payment">
          <div className="luzik-footer-payment-label"><CreditCard size={21} aria-hidden="true" /><div><h3>Numer rachunku do wpłat</h3><p translate="no">{contact.bank}</p></div></div>
          <p className="luzik-footer-account" translate="no">{contact.account}</p>
          <CopyAccountButton />
        </div>

        <div className="luzik-footer-bottom">
          <p>© {currentYear} Szkoła Jazdy Luzik.</p>
          <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
          <p className="luzik-footer-credit">Projekt strony <span translate="no">Business HERO</span></p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly FooterLink[] }) {
  return <nav className="luzik-footer-column" aria-label={`${title} — stopka`}>
    <h2 className="luzik-footer-title">{title}</h2>
    <ul>{links.map(link => <li key={link.href}><Link href={link.href}><span>{link.label}</span><ArrowUpRight size={14} aria-hidden="true" /></Link></li>)}</ul>
  </nav>;
}
