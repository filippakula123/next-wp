import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Check,
  MapPin,
  Phone,
} from "lucide-react";


interface HomeHeroProps {
  imageSrc?: string;
  imageAlt?: string;
}

export async function HomeHero({
  imageSrc = "/luzik/hero.webp",
  imageAlt = "Szkoła Jazdy Luzik w Kielcach",
}: HomeHeroProps) {
  const { header: luzikHeaderData } = await getLuzikSiteData();
  return (
    <section
      aria-labelledby="home-hero-title"
      className="w-full overflow-hidden bg-white"
    >
      <div className="grid min-h-[650px] w-full grid-cols-1 lg:grid-cols-[42%_58%]">
        {/* ================================================= */}
        {/* LEWA CZĘŚĆ                                       */}
        {/* ================================================= */}

        <div className="relative flex bg-[#f3f8fc] text-[#182632]">
          {/* Delikatny dekor */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              right-0
              top-0
              h-full
              w-[240px]
              bg-gradient-to-l
              from-[#1383ec]/[0.07]
              to-transparent
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-0
              left-0
              h-[5px]
              w-full
              luzik-hero-underline
            "
          />

          <div
            className="
              relative
              z-10
              flex
              w-full
              flex-col
              justify-center
              px-6
              py-14
              sm:px-10
              sm:py-16
              md:px-14
              lg:px-12
              xl:px-20
              2xl:px-24
            "
          >
            {/* MAŁY NAGŁÓWEK */}

            <div className="flex items-center gap-3">
              <span className="luzik-accent-line h-[2px] w-10" />

              <span className="font-[var(--font-inter)] text-[11px] font-bold uppercase tracking-[0.16em] text-[#0075b2]">
                Szkoła jazdy • Kielce
              </span>
            </div>

            {/* H1 */}

            <h1
              id="home-hero-title"
              className="
                mt-7
                max-w-[620px]
                font-[var(--font-lexend)]
                text-[48px]
                font-semibold
                leading-[1.02]
                tracking-[-0.035em]
                text-[#182632]
                sm:text-[58px]
                md:text-[64px]
                xl:text-[72px]
                2xl:text-[78px]
              "
            >
              Szkoła Jazdy
              <span className="block text-[#0075b2]">
                Luzik Kielce
              </span>
            </h1>

            {/* OPIS */}

            <p
              className="
                mt-7
                max-w-[570px]
                font-[var(--font-inter)]
                text-[15px]
                leading-7
                text-[#52616e]
                sm:text-[16px]
              "
            >
              Kompleksowo przygotowujemy przyszłych
              kierowców do egzaminu WORD Kielce.
              Uczymy bezpiecznej i pewnej jazdy w
              profesjonalnej, spokojnej atmosferze.
            </p>

            {/* CTA */}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={luzikHeaderData.registrationHref}
                className="
                  inline-flex
                  min-h-[54px]
                  items-center
                  justify-center
                  gap-3
                  bg-[#0075b2]
                  px-7
                  font-[var(--font-inter)]
                  text-[12px]
                  font-extrabold
                  uppercase
                  tracking-wide
                  text-white
                  no-underline
                  transition-colors
                  hover:bg-[#005e91]
                  focus-visible:outline
                  focus-visible:outline-2
                  focus-visible:outline-offset-4
                  focus-visible:outline-[#1383ec]
                "
              >
                Zapisz się na kurs

                <ArrowRight size={17} />
              </Link>

              <Link
                href="/kursy-prawa-jazdy"
                className="
                  inline-flex
                  min-h-[54px]
                  items-center
                  justify-center
                  border
                  border-[#182632]/20
                  px-7
                  font-[var(--font-inter)]
                  text-[12px]
                  font-extrabold
                  uppercase
                  tracking-wide
                  text-[#182632]
                  no-underline
                  transition-colors
                  hover:border-[#0075b2]/50
                  hover:bg-white/80
                "
              >
                Zobacz kursy
              </Link>
            </div>

            {/* INFORMACJE */}

            <div className="mt-10 grid max-w-[620px] grid-cols-1 gap-4 border-t border-[#182632]/10 pt-7 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1383ec]/10 text-[#1383ec]">
                  <CalendarDays size={15} />
                </span>

                <div>
                  <span className="block font-[var(--font-inter)] text-[10px] font-bold uppercase tracking-[0.12em] text-[#52616e]">
                    Najbliższy kurs
                  </span>

                  <span className="mt-1 block font-[var(--font-inter)] text-[14px] font-semibold text-[#182632]">
                    {luzikHeaderData.courseDateLabel}
                    {" • "}
                    {luzikHeaderData.courseTimeLabel}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1383ec]/10 text-[#1383ec]">
                  <MapPin size={15} />
                </span>

                <div>
                  <span className="block font-[var(--font-inter)] text-[10px] font-bold uppercase tracking-[0.12em] text-[#52616e]">
                    Biuro
                  </span>

                  <span className="mt-1 block font-[var(--font-inter)] text-[14px] font-semibold text-[#182632]">
                    {luzikHeaderData.contactAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* ATUTY */}

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
              <HeroPoint text="Doświadczeni instruktorzy" />
              <HeroPoint text="Jazdy w Kielcach" />
              <HeroPoint text="Polski i angielski" />
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* PRAWA CZĘŚĆ - ZDJĘCIE                             */}
        {/* ================================================= */}

        <div className="relative min-h-[420px] lg:min-h-[650px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            preload
            fetchPriority="high"
            sizes="(max-width: 1023px) 100vw, 58vw"
            className="object-cover object-center"
          />

          {/* Górna etykieta */}

          <div className="luzik-hero-route" aria-hidden="true">
            <svg viewBox="0 0 140 92" focusable="false">
              <path className="luzik-route-base" d="M10 78h35a16 16 0 0 0 16-16V40a16 16 0 0 1 16-16h45" />
              <path className="luzik-route-trace" pathLength="100" strokeDasharray="100" d="M10 78h35a16 16 0 0 0 16-16V40a16 16 0 0 1 16-16h45" />
              <circle className="luzik-route-stop" cx="10" cy="78" r="5" />
              <circle className="luzik-route-stop" cx="61" cy="46" r="4" />
              <circle className="luzik-route-finish" cx="122" cy="24" r="7" />
              <path d="m118 24 3 3 5-6" fill="none" stroke="#111214" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div
            className="
              absolute
              left-5
              top-5
              flex
              items-center
              gap-2
              bg-white/90
              px-4
              py-3
              backdrop-blur-sm
              sm:left-7
              sm:top-7
            "
          >
            <span className="luzik-accent-dot h-2 w-2 rounded-full" />

            <span className="font-[var(--font-inter)] text-[10px] font-bold uppercase tracking-[0.14em] text-[#182632]">
              Nauka jazdy bez stresu
            </span>
          </div>

          {/* DOLNA INFORMACJA */}

          <div
            className="
              absolute
              bottom-0
              left-0
              w-full
              bg-gradient-to-t
              from-[#102b40]/95
              via-[#102b40]/55
              to-transparent
              px-5
              pb-6
              pt-12
              sm:px-8
              sm:pb-8
              sm:pt-16
            "
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="m-0 font-[var(--font-inter)] text-[10px] font-bold uppercase tracking-[0.15em] text-[#ffe101]">
                  Szkoła Jazdy Luzik
                </p>

                <p className="mt-2 max-w-[500px] font-[var(--font-lexend)] text-[21px] font-semibold leading-tight text-white sm:text-[26px]">
                  Bezpiecznie. Profesjonalnie.
                  <span className="block text-white/85">
                    Na luzie.
                  </span>
                </p>
              </div>

              <a
                href={luzikHeaderData.phoneHref}
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-3
                  border
                  border-white/15
                  bg-white/[0.06]
                  px-4
                  py-3
                  font-[var(--font-inter)]
                  text-[13px]
                  font-semibold
                  text-white
                  no-underline
                  backdrop-blur-sm
                  transition-colors
                  hover:bg-white/10
                "
              >
                <Phone
                  size={16}
                  className="text-[#ffe101]"
                />

                {luzikHeaderData.phoneLabel}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* DOLNY PAS - pełna szerokość                       */}
      {/* ================================================= */}

      <div className="border-t border-[#e4e6e8] bg-[#f7f8f9]">
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-[1500px]
            flex-col
            gap-3
            px-5
            py-4
            sm:px-7
            md:flex-row
            md:items-center
            md:justify-between
            lg:px-8
            xl:px-10
          "
        >
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1383ec]/10 text-[#1383ec]">
              <Check size={13} strokeWidth={3} />
            </span>

            <span className="font-[var(--font-inter)] text-[12px] font-medium text-[#52616e]">
              Prawo jazdy od 17 lat
            </span>
          </div>

          <div className="font-[var(--font-inter)] text-[12px] text-[#52616e]">
            Zajęcia prowadzone w języku polskim i angielskim
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroPoint({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1383ec]/10 text-[#1383ec]">
        <Check size={12} strokeWidth={3} />
      </span>

      <span className="font-[var(--font-inter)] text-[11px] font-medium text-[#52616e]">
        {text}
      </span>
    </div>
  );
}
