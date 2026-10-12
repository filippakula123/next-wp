"use client";
import { useLuzikSettings } from "@/components/site/luzik-settings-provider";

import { useEffect, useRef, useState, type ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ChevronDown,
  ChevronRight,
  Facebook,
  Instagram,
  MapPin,
  Phone,
  Share2,
  Timer,
} from "lucide-react";

import { LuzikLogo } from "@/components/layout/luzik-logo";
import { MobileNav } from "@/components/nav/mobile-nav";
import { LanguageSwitcher } from "@/components/site/language-switcher";

import {
  luzikNavigation,
} from "@/lib/luzik-navigation";

import { cn } from "@/lib/utils";

interface NavProps {
  className?: string;
  children?: ReactNode;
  id?: string;
}

export function Nav({
  className,
  children,
  id,
}: NavProps) {
  const { header: luzikHeaderData } = useLuzikSettings();
  const pathname = usePathname();
  const [menu, setMenu] = useState<{ href: string; pathname: string } | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const expandedItem = menu?.pathname === pathname ? menu.href : null;

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setMenu(null);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        headerRef.current?.querySelector<HTMLButtonElement>('button[aria-controls^="nav-"][aria-expanded="true"]')?.focus();
        setMenu(null);
      }
    }
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      onClick={(event) => {
        if ((event.target as Element).closest("a, .luzik-language-trigger")) setMenu(null);
      }}
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
            <LuzikLogo dark />
          </div>

          {children}

          {/* DESKTOP */}

          <div className="luzik-header-desktop hidden min-w-0 flex-1 items-center justify-end gap-5 xl:flex">
            <nav aria-label="Nawigacja główna" onBlur={event => {
              if (!event.currentTarget.contains(event.relatedTarget)) setMenu(null);
            }}>
              <ul className="flex items-center gap-5">
                {luzikNavigation.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href === "/blog" && pathname.startsWith("/posts/")) ||
                    item.children?.some(child => pathname === child.href) ||
                    pathname.startsWith(
                      `${item.href}/`,
                    );

                  return (
                    <li
                      key={item.href}
                      className="relative"
                    >
                      {item.children ? (
                        <div>
                          <button
                            type="button"
                            aria-expanded={expandedItem === item.href}
                            aria-controls={`nav-${item.href.slice(1)}`}
                            onClick={() => setMenu(expandedItem === item.href ? null : { href: item.href, pathname })}
                            className={cn(
                              "flex cursor-pointer list-none items-center gap-1.5",
                              "font-[var(--font-inter)] text-[12px]",
                              "font-extrabold uppercase",
                              "tracking-[0.01em]",
                              "transition-colors",
                              "border-0 bg-transparent p-0",
                              active || expandedItem === item.href
                                ? "text-[#008bd0]"
                                : "text-[#191a1c]",
                            )}
                          >
                            {item.label}

                            <ChevronDown
                              size={13}
                              strokeWidth={2.5}
                              className={cn("text-[#95979a] transition-transform", expandedItem === item.href && "rotate-180")}
                            />
                          </button>

                          <div id={`nav-${item.href.slice(1)}`} hidden={expandedItem !== item.href} className="luzik-desktop-dropdown absolute left-1/2 top-[33px] z-[120] w-[270px] -translate-x-1/2 pt-3">
                            <div className="max-h-[calc(100dvh-170px)] overflow-y-auto rounded-[10px] border border-[#292a2d] bg-[#121315] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
                              {item.children.map(
                                (child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    aria-current={pathname === child.href ? "page" : undefined}
                                    className="block rounded-md px-4 py-3 font-[var(--font-inter)] text-[13px] font-medium text-white/80 no-underline transition-colors hover:bg-white/5 hover:text-[#008bd0]"
                                  >
                                    {child.label}
                                  </Link>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          aria-current={pathname === item.href ? "page" : undefined}
                          className={cn(
                            "relative font-[var(--font-inter)] text-[12px] font-extrabold uppercase tracking-[0.01em] no-underline transition-colors",
                            active
                              ? "text-[#008bd0]"
                              : "text-[#191a1c] hover:text-[#008bd0]",
                          )}
                        >
                          {item.label}

                          {active && (
                            <span className="absolute -bottom-[15px] left-0 right-0 h-[3px] rounded-full bg-[#008bd0]" />
                          )}
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
    </header>
  );
}
