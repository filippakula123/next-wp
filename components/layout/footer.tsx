import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import Image from "next/image";
import Link from "next/link";

import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

const courseLinks: readonly FooterLink[] = [
  {
    label: "Kursy prawa jazdy",
    href: "/kursy-prawa-jazdy",
  },
  {
    label: "Kursy prawa jazdy kategorii B",
    href: "/kursy-prawa-jazdy-kategorii-b",
  },
  {
    label: "Kursy prawa jazdy kategorii B automat",
    href: "/kursy-prawa-jazdy-kategorii-b-automat",
  },
  {
    label: "Kursy prawa jazdy kategorii A",
    href: "/kursy-prawa-jazdy-kategorii-a",
  },
  {
    label: "Kursy prawa jazdy kategorii A2",
    href: "/kursy-prawa-jazdy-kategorii-a2",
  },
  {
    label: "Kursy prawa jazdy kategorii A1",
    href: "/kursy-prawa-jazdy-kategorii-a1",
  },
  {
    label: "Kursy prawa jazdy kategorii AM",
    href: "/kursy-prawa-jazdy-kategorii-am",
  },
  {
    label: "Jazdy doszkalające",
    href: "/jazdy-doszkalajace",
  },
];

const schoolLinks: readonly FooterLink[] = [
  {
    label: "O nas",
    href: "/o-nas",
  },
  {
    label: "Instruktorzy",
    href: "/szkola-jazdy-luzik-instruktorzy",
  },
  {
    label: "Badania lekarskie",
    href: "/badania-lekarskie-na-prawo-jazdy-kielce",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Galeria",
    href: "/galeria",
  },
  {
    label: "Kontakt",
    href: "/kontakt",
  },
];

const INK = "#111114";
const BLUE = "#1383ec";

export async function Footer() {
  const { header: luzikHeaderData, contact: luzikContactData } = await getLuzikSiteData();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="luzik-footer-accent relative overflow-hidden text-white"
      style={{ backgroundColor: INK }}
    >
      {/* ================================================= */}
      {/* SUBTELNE ZDJĘCIE AUTA                            */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[42%] lg:block">
        <Image
          src="/luzik/footer-car.jpg"
          alt=""
          fill
          sizes="42vw"
          className="object-cover object-left-bottom"
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundColor:
              "rgba(17,17,20,0.84)",
          }}
        />

        <div
          className="absolute inset-y-0 right-0 w-[70%]"
          style={{
            background:
              "linear-gradient(to right, rgba(17,17,20,0), #111114)",
          }}
        />
      </div>

      {/* ================================================= */}
      {/* GŁÓWNA ZAWARTOŚĆ                                 */}
      {/* ================================================= */}

      <div className="relative">
        <div
          className="
            mx-auto
            w-full
            max-w-[1500px]
            px-6
            py-[70px]
            md:px-8
            xl:px-10

            min-[1100px]:grid
            min-[1100px]:grid-cols-[1.15fr_0.95fr_0.9fr_1.35fr]
            min-[1100px]:gap-[55px]

            max-[1099px]:grid
            max-[1099px]:grid-cols-2
            max-[1099px]:gap-x-12
            max-[1099px]:gap-y-16

            max-md:grid-cols-1
            max-md:gap-y-12
          "
        >
          {/* ================================================= */}
          {/* 1. BRAND                                          */}
          {/* ================================================= */}

          <div className="min-w-0">
            <Link
              href="/"
              aria-label="Szkoła Jazdy Luzik — strona główna"
              className="inline-flex"
            >
              <div className="relative h-[72px] w-[165px]">
                <Image
                  src="/luzik/logo.png"
                  alt="Szkoła Jazdy Luzik"
                  fill
                  sizes="165px"
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <p className="mt-6 max-w-[360px] font-[var(--font-inter)] text-[15px] leading-[27px] text-white/65">
              Szkoła jazdy Luzik Kielce. Uczymy jeździć
              zgodnie z przepisami i skutecznie
              przygotowujemy do egzaminu w WORD Kielce.
              Bezpiecznie, profesjonalnie i na luzie.
            </p>

            <div className="mt-8">
              <p className="font-[var(--font-inter)] text-[13px] font-semibold text-white/55">
                Numer rachunku do wpłat
              </p>

              <p
                className="mt-1 break-all font-[var(--font-inter)] text-[14px] font-semibold leading-6"
                style={{ color: BLUE }}
              >
                {luzikContactData.account}
              </p>

              <p className="font-[var(--font-inter)] text-[13px] leading-5 text-white/45">
                {luzikContactData.bank}
              </p>
            </div>

            {/* SOCIAL */}

            <div className="mt-7 flex items-center gap-3">
              <SocialButton
                href={luzikHeaderData.facebookHref}
                label="Facebook"
              >
                <Facebook
                  size={17}
                  fill="currentColor"
                  strokeWidth={0}
                />
              </SocialButton>

              <SocialButton
                href={luzikHeaderData.instagramHref}
                label="Instagram"
              >
                <Instagram size={18} />
              </SocialButton>
            </div>
          </div>

          {/* ================================================= */}
          {/* 2. KURSY                                          */}
          {/* ================================================= */}

          <FooterColumn
            title="Kursy Prawa Jazdy"
            links={courseLinks}
          />

          {/* ================================================= */}
          {/* 3. SZKOŁA                                         */}
          {/* ================================================= */}

          <FooterColumn
            title="Szkoła Jazdy Luzik"
            links={schoolLinks}
          />

          {/* ================================================= */}
          {/* 4. KONTAKT + MAPA                                 */}
          {/* ================================================= */}

          <div className="min-w-0">
            <FooterTitle>
              Kontakt
            </FooterTitle>

            <div className="mt-7 space-y-4">
              <ContactRow icon={<MapPin size={18} />}>
                <span className="block text-[12px] font-semibold uppercase tracking-wide text-white/40">
                  Adres
                </span>

                <span className="block text-[14px] leading-6 text-white/80">
                  {luzikContactData.address}
                </span>
              </ContactRow>

              <ContactRow icon={<Phone size={18} />}>
                <span className="block text-[12px] font-semibold uppercase tracking-wide text-white/40">
                  Telefon
                </span>

                <a
                  href={luzikHeaderData.phoneHref}
                  className="block text-[14px] font-semibold leading-6 text-white no-underline transition-colors hover:text-[#1383ec]"
                >
                  {luzikHeaderData.phoneLabel}
                </a>
              </ContactRow>

              <ContactRow icon={<Mail size={18} />}>
                <span className="block text-[12px] font-semibold uppercase tracking-wide text-white/40">
                  E-mail
                </span>

                <a
                  href={`mailto:${luzikHeaderData.email}`}
                  className="block break-all text-[14px] leading-6 text-white/80 no-underline transition-colors hover:text-[#1383ec]"
                >
                  {luzikHeaderData.email}
                </a>
              </ContactRow>
            </div>

            {/* MAPA */}

            <div className="mt-7 overflow-hidden border border-white/10">
              <iframe
                src={luzikContactData.mapEmbedSrc}
                title="Mapa Google – Szkoła Jazdy Luzik"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="block h-[220px] w-full border-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* DOLNY PASEK                                       */}
      {/* ================================================= */}

      <div className="border-t border-white/10">
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-[1500px]
            flex-col
            gap-3
            px-6
            py-5
            md:px-8
            xl:flex-row
            xl:items-center
            xl:justify-between
            xl:px-10
          "
        >
          <p className="m-0 font-[var(--font-inter)] text-[13px] leading-5 text-white/40">
            Copyright © {currentYear} Szkoła Jazdy Luzik.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/polityka-prywatnosci"
              className="font-[var(--font-inter)] text-[13px] text-white/45 no-underline transition-colors hover:text-white"
            >
              Polityka prywatności
            </Link>

            <span className="font-[var(--font-inter)] text-[13px] text-white/25">
              Projekt strony{" "}
              <span className="text-[#f2cf00]">
                Business HERO
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly FooterLink[];
}) {
  return (
    <div className="min-w-0">
      <FooterTitle>
        {title}
      </FooterTitle>

      <ul className="m-0 mt-7 list-none space-y-[10px] p-0">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="
                group
                flex
                items-start
                gap-3
                font-[var(--font-inter)]
                text-[14px]
                leading-[23px]
                text-white/65
                no-underline
                transition-colors
                hover:text-white
              "
            >
              <span className="mt-[9px] h-[5px] w-[5px] shrink-0 bg-white/35 transition-colors group-hover:bg-[#1383ec]" />

              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2 className="relative m-0 inline-block pb-[13px] font-[var(--font-lexend)] text-[20px] font-semibold leading-[28px] text-white">
      {children}

      <span className="absolute bottom-0 left-0 h-[2px] w-[34px] bg-[#1383ec]" />
    </h2>
  );
}

function ContactRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-white/[0.06] text-[#1383ec]">
        {icon}
      </div>

      <div className="min-w-0 pt-[1px]">
        {children}
      </div>
    </div>
  );
}

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center border border-white/10 bg-white/[0.04] text-white/65 no-underline transition-colors hover:border-[#1383ec] hover:bg-[#1383ec] hover:text-white"
    >
      {children}
    </a>
  );
}
