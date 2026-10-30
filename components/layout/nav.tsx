import { getLuzikSiteData } from "@/lib/luzik-settings-server";

import type { ReactNode } from "react";

import Link from "@/components/site/site-link";
import { DesktopNavRuntime } from "@/components/nav/desktop-nav-runtime";

import {
  ChevronDown,
  ChevronRight,
  Facebook,
  Instagram,
  MapPin,
  Phone,
  Share2,
  Timer,
} from "@/components/site/icons";

import { MobileNav } from "@/components/nav/mobile-nav";
import { NavigationGroups, NavigationVehicleIcon } from "@/components/nav/navigation-groups";
import { LanguageSwitcher } from "@/components/site/language-switcher";

import {
  luzikNavigation,
} from "@/lib/luzik-navigation";

import { clsx as cn } from "clsx";

interface NavProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  brand: ReactNode;
}

export async function Nav({
  className,
  children,
  id,
  brand,
}: NavProps) {
  const { header: luzikHeaderData } = await getLuzikSiteData();

  return (
    <header
      data-luzik-header
      id={id}
      className={cn(
        "luzik-header sticky top-0 z-[100] w-full bg-white",
        className,
      )}
    >
      {/* ================================================== */}
      {/* TOP BAR                                             */}
      {/* ================================================== */}

      <div className="luzik-header-top hidden h-[38px] bg-[#111214] text-white lg:block">
        <div className="luzik-header-top-inner mx-auto flex h-full w-full max-w-[1500px] items-center justify-between px-8">
          {/* Kurs */}

          <Link
            href={luzikHeaderData.registrationHref}
            className="group flex items-center gap-2 font-[var(--font-inter)] text-[12px] font-bold uppercase tracking-[0.01em] text-white no-underline"
          >
            <Timer
              size={16}
              strokeWidth={2}
              className="text-[#008bd0]"
            />

            <span>
              {luzikHeaderData.courseLabel}
            </span>

            <ChevronRight
              size={13}
              className="text-white/40 transition-transform group-hover:translate-x-1"
            />
          </Link>

          {/* Biuro */}

          <Link
            href="/kontakt"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 font-[var(--font-inter)] text-[12px] text-white no-underline xl:flex"
          >
            <MapPin
              size={16}
              className="text-[#008bd0]"
            />

            <span className="font-bold uppercase">
              Nasze biuro:
            </span>

            <span className="text-white/65">
              {luzikHeaderData.officeAddress}
            </span>

            <ChevronRight
              size={12}
              className="text-white/40"
            />
          </Link>

          {/* Social */}

          <div className="ml-auto flex items-center gap-3">
            <Share2
              size={15}
              className="text-[#008bd0]"
            />

            <span className="font-[var(--font-inter)] text-[11px] font-bold uppercase tracking-wide">
              Znajdziesz nas w:
            </span>

            <a
              href={luzikHeaderData.facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="transition-colors hover:text-[#008bd0]"
            >
              <Facebook
                size={13}
                fill="currentColor"
                strokeWidth={0}
              />
            </a>

            <a
              href={luzikHeaderData.instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-[#008bd0]"
            >
              <Instagram size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* MAIN HEADER                                         */}
      {/* ================================================== */}

      <div className="border-b border-[#e9eaec] bg-white shadow-[0_4px_18px_rgba(15,23,42,0.05)]">
        <div className="luzik-header-main mx-auto flex h-[82px] w-full max-w-[1500px] items-center px-6 lg:px-8">
          
          {/* LOGO */}

          <div className="luzik-header-brand flex w-[135px] shrink-0 items-center sm:w-[185px]">
            {brand}
          </div>

          {children}

          {/* DESKTOP */}

          <div className="luzik-header-desktop hidden min-w-0 flex-1 items-center justify-end gap-5 xl:flex">
            <nav aria-label="Nawigacja główna" data-desktop-nav>
              <ul className="flex items-center gap-5">
                {luzikNavigation.map((item) => {
                  return (
                    <li
                      key={item.id ?? item.href}
                      data-nav-item
                      data-nav-vehicle={item.vehicle}
                      className="luzik-nav-item"
                    >
                      {item.children ? (
                        <div>
                          <button
                            type="button"
                            data-nav-toggle
                            data-nav-primary
                            aria-expanded={false}
                            aria-controls={`nav-${item.id ?? item.href.slice(1)}`}
                            data-vehicle={item.vehicle}
                            className={cn(
                              "luzik-nav-trigger flex cursor-pointer list-none items-center gap-1.5",
                              "font-[var(--font-inter)] text-[12px]",
                              "font-extrabold uppercase",
                              "tracking-[0.01em]",
                              "transition-colors",
                              "border-0 bg-transparent p-0",
                              "text-[#191a1c]",
                              item.vehicle && "luzik-nav-vehicle-trigger",
                            )}
                          >
                            {item.vehicle && <NavigationVehicleIcon vehicle={item.vehicle} size={18} />}
                            {item.label}

                            <ChevronDown
                              size={13}
                              strokeWidth={2.5}
                              className="luzik-nav-chevron text-[#95979a] transition-transform"
                            />
                          </button>

                          <div id={`nav-${item.id ?? item.href.slice(1)}`} hidden className="luzik-mega-panel" data-vehicle={item.vehicle}>
                            <div className="luzik-mega-inner">
                              <div className={cn("luzik-mega-body", !item.groups && "luzik-mega-school", item.vehicle && "luzik-mega-vehicle")}>
                                {item.intro && <div className="luzik-mega-intro"><span>{item.vehicle === "car" ? "Prawo jazdy · kategoria B" : "Prawo jazdy · AM, A1, A2, A"}</span><h2>{item.intro.title}</h2><p>{item.intro.description}</p></div>}
                                {!item.groups && <div className="luzik-mega-intro"><span>Szkoła jazdy Luzik</span><h2>Poznaj nas.<br />Ruszaj z pewnością.</h2><p>Sprawdź, z kim będziesz się uczyć i wybierz kurs dla siebie.</p></div>}
                                <NavigationGroups item={item} />
                              </div>
                              <div className="luzik-mega-footer">
                                <span>{item.groups ? "Twoja droga do prawa jazdy zaczyna się tutaj." : "Nauka jazdy w Kielcach. Po prostu Luzik."}</span>
                                <a href={luzikHeaderData.phoneHref}><Phone size={16} aria-hidden="true" />{luzikHeaderData.phoneLabel}</a>
                                <Link href={item.groups ? "/kursy-prawa-jazdy" : item.href}>{item.groups ? "Wszystkie kursy" : "O naszej szkole"}<ChevronRight size={16} aria-hidden="true" /></Link>
                                <Link href={luzikHeaderData.registrationHref} className="luzik-header-register">Zapisz się na kurs</Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          data-nav-primary
                          className={cn(
                            "luzik-nav-link relative font-[var(--font-inter)] text-[12px] font-extrabold uppercase tracking-[0.01em] no-underline transition-colors",
                            "text-[#191a1c] hover:text-[#008bd0]",
                          )}
                        >
                          {item.label}

                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* CTA */}

            <Link
              href={luzikHeaderData.registrationHref}
              className="luzik-header-register"
            >
              Zapisz się na kurs
            </Link>

            {/* PHONE */}

            <div className="hidden border-l border-[#e5e6e8] pl-5 min-[1500px]:block">
              <a href={luzikHeaderData.phoneHref} className="luzik-header-call">
              <span className="luzik-header-call-icon">
                <Phone
                  size={19}
                  strokeWidth={2}
                />
              </span>

              <span className="luzik-header-call-copy">
                <span className="luzik-header-call-label">
                  Zadzwoń
                </span>

                <span className="luzik-header-call-number">
                  {luzikHeaderData.phoneLabel}
                </span>
              </span>
              </a>
            </div>
          </div>

          {/* MOBILE */}
          <div className="ml-auto mr-3 shrink-0 xl:ml-5 xl:mr-0"><LanguageSwitcher /></div>
          <div className="xl:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
      <DesktopNavRuntime />
    </header>
  );
}
