"use client";
import { useLuzikSettings } from "@/components/site/luzik-settings-provider";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import Link from "@/components/site/site-link";
import { usePathname } from "next/navigation";

import {
  ChevronDown,
  ChevronRight,
  Facebook,
  Instagram,
  Phone,
  X,
} from "@/components/site/icons";

import { LuzikLogo } from "@/components/layout/luzik-logo";
import { LanguageSwitcher } from "@/components/site/language-switcher";

import {
  luzikNavigation,
} from "@/lib/luzik-navigation";

interface MobileNavDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNavDialog({ open, onOpenChange }: MobileNavDialogProps) {
  const { header: luzikHeaderData } = useLuzikSettings();
  const pathname = usePathname();

  const [expandedItem, setExpandedItem] =
    useState<string | null>(null);

  function closeMenu() {
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={nextOpen => {
      if (!nextOpen) closeMenu();
      else { setExpandedItem(null); onOpenChange(true); }
    }}>
      {/* ================================================== */}
      {/* OVERLAY                                             */}
      {/* ================================================== */}

      <Dialog.Portal>
        <Dialog.Overlay className="luzik-mobile-overlay fixed inset-0 z-[200] bg-black/60 backdrop-blur-[2px]" />
        <Dialog.Content asChild aria-describedby={undefined}>
          {/* ================================================== */}
          {/* PANEL                                             */}
          {/* ================================================== */}

          <aside
            id="mobile-navigation-dialog"
            className="luzik-mobile-panel fixed z-[201] right-0 top-0 flex h-full w-[390px] max-w-[calc(100vw-20px)] flex-col overflow-hidden bg-[#111214] shadow-[-20px_0_60px_rgba(0,0,0,0.3)] max-[480px]:w-[calc(100vw-10px)]"
          >
            <Dialog.Title className="sr-only">Menu główne</Dialog.Title>
            {/* HEADER */}

            <div className="luzik-mobile-heading relative flex h-[105px] shrink-0 items-center border-b border-white/[0.08] px-7">
              <LuzikLogo />

              <button
                type="button"
                onClick={closeMenu}
                aria-label="Zamknij menu"
                className="luzik-mobile-close ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* CTA */}

            <div className="luzik-mobile-cta-wrap border-b border-white/[0.08] p-5">
              <Link
                href={luzikHeaderData.registrationHref}
                onClick={closeMenu}
                className="luzik-mobile-cta flex h-[50px] items-center justify-center rounded-[2px] bg-[#008bd0] font-[var(--font-inter)] text-[12px] font-extrabold uppercase tracking-wide text-white no-underline"
              >
                Zapisz się na kurs
              </Link>
            </div>

            {/* NAVIGATION */}

            <nav aria-label="Nawigacja mobilna" className="luzik-mobile-navigation min-h-0 flex-1 overflow-y-auto">
              <ul className="m-0 list-none p-0">
                {luzikNavigation.map(
                  (item) => {
                    const active =
                      pathname === item.href ||
                      (item.href === "/blog" && pathname.startsWith("/posts/")) ||
                      item.children?.some(child => pathname === child.href) ||
                      pathname.startsWith(
                        `${item.href}/`,
                      );

                    const expanded =
                      expandedItem === item.href;

                    return (
                      <li
                        key={item.href}
                        className="luzik-mobile-item border-b border-white/[0.08]"
                      >
                        <div className="flex min-h-[55px] items-center">
                          <Link
                            href={item.href}
                            onClick={closeMenu}
                            aria-current={pathname === item.href ? "page" : undefined}
                            className={`
                              luzik-mobile-link flex
                              min-w-0
                              flex-1
                              items-center
                              px-6
                              py-4
                              font-[var(--font-inter)]
                              text-[13px]
                              font-extrabold
                              uppercase
                              tracking-wide
                              no-underline
                              ${
                                active
                                  ? "text-[#008bd0]"
                                  : "text-white"
                              }
                            `}
                          >
                            {item.label}
                          </Link>

                          {item.children && (
                            <button
                              type="button"
                              aria-label={
                                expanded
                                  ? `Zwiń ${item.label}`
                                  : `Rozwiń ${item.label}`
                              }
                              aria-expanded={
                                expanded
                              }
                              aria-controls={`mobile-submenu-${item.href.slice(1)}`}
                              onClick={() =>
                                setExpandedItem(
                                  expanded
                                    ? null
                                    : item.href,
                                )
                              }
                              className="luzik-mobile-expand mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] border-0 bg-white/[0.07] text-white"
                            >
                              <ChevronDown
                                size={17}
                                className={
                                  expanded
                                    ? "rotate-180 transition-transform"
                                    : "transition-transform"
                                }
                              />
                            </button>
                          )}
                        </div>

                        {item.children && (
                          <div id={`mobile-submenu-${item.href.slice(1)}`} className="luzik-mobile-submenu" data-expanded={expanded} inert={!expanded} aria-hidden={!expanded}>
                            <div className="luzik-mobile-submenu-clip">
                            <div className="border-t border-white/[0.08] bg-[#18191b] px-3 py-2">
                              {item.children.map(
                                (child) => (
                                  <Link
                                    key={child.href}
                                    href={
                                      child.href
                                    }
                                    onClick={
                                      closeMenu
                                    }
                                    className="luzik-mobile-child flex items-center gap-2 px-4 py-3 font-[var(--font-inter)] text-[13px] text-white/65 no-underline transition-colors hover:text-[#008bd0]"
                                    aria-current={pathname === child.href ? "page" : undefined}
                                  >
                                    <ChevronRight
                                      size={13}
                                      className="text-[#008bd0]"
                                    />

                                    {
                                      child.label
                                    }
                                  </Link>
                                ),
                              )}
                            </div>
                            </div>
                          </div>
                          )}
                      </li>
                    );
                  },
                )}
              </ul>
            </nav>

            {/* CONTACT */}

            <div className="luzik-mobile-contact shrink-0 border-t border-white/[0.08] bg-[#0d0e10] px-6 py-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe101] text-[#151617]">
                  <Phone size={18} />
                </div>

                <div>
                  <span className="block font-[var(--font-inter)] text-[10px] font-semibold uppercase tracking-wide text-white/40">
                    Zadzwoń
                  </span>

                  <a
                    href={
                      luzikHeaderData.phoneHref
                    }
                    className="font-[var(--font-inter)] text-[15px] font-extrabold text-white no-underline"
                  >
                    {luzikHeaderData.phoneLabel}
                  </a>
                </div>
              </div>

              <div className="mb-5 flex flex-col gap-1 font-[var(--font-inter)] text-[13px] leading-5 text-white/60">
                <span>
                  {luzikHeaderData.contactAddress}
                </span>

                <a
                  href={`mailto:${luzikHeaderData.email}`}
                  className="text-white/60 no-underline"
                >
                  {luzikHeaderData.email}
                </a>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <a
                    href={
                      luzikHeaderData.facebookHref
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    <Facebook
                      size={17}
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  </a>

                  <a
                    href={
                      luzikHeaderData.instagramHref
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    <Instagram size={18} />
                  </a>
                </div>

                <LanguageSwitcher dark />
              </div>
            </div>
          </aside>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
