"use client";

import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "@/components/site/site-link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, Facebook, Instagram, Phone } from "@/components/site/icons";
import { LuzikLogo } from "@/components/layout/luzik-logo";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { useLuzikSettings } from "@/components/site/luzik-settings-provider";
import { NavigationGroups, NavigationVehicleIcon } from "@/components/nav/navigation-groups";
import { luzikNavigation } from "@/lib/luzik-navigation";

type MobileNavDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: number;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

export function MobileNavDialog({ open, onOpenChange, session, triggerRef }: MobileNavDialogProps) {
  const { header } = useLuzikSettings();
  const pathname = usePathname();
  const [expandedGroup, setExpandedGroup] = useState<{ session: number; href: string } | null>(null);
  const expandedItem = expandedGroup?.session === session ? expandedGroup.href : null;

  function closeMenu() { onOpenChange(false); }

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const onResize = () => { if (desktop.matches) onOpenChange(false); };
    desktop.addEventListener("change", onResize);
    return () => desktop.removeEventListener("change", onResize);
  }, [onOpenChange]);

  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="luzik-mobile-overlay" />
      <Dialog.Content asChild aria-describedby={undefined} onCloseAutoFocus={event => {
        event.preventDefault();
        triggerRef.current?.focus();
      }}>
        <aside id="mobile-navigation-dialog" className="luzik-mobile-panel" onPointerMove={event => {
          if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty("--glow-x", `${(event.clientX / bounds.width - .5) * 30}px`);
          event.currentTarget.style.setProperty("--glow-y", `${(event.clientY / bounds.height - .5) * 30}px`);
        }}>
          <div className="luzik-mobile-glow" aria-hidden="true" />
          <div className="luzik-mobile-heading">
            <div onClick={closeMenu}><LuzikLogo /></div>
            <Dialog.Close asChild>
              <button type="button" aria-label="Zamknij menu" className="luzik-mobile-close">
                <span className="luzik-mobile-burger" aria-hidden="true"><span /><span /><span /></span>
              </button>
            </Dialog.Close>
          </div>
          <div className="luzik-mobile-scroll">
            <div className="luzik-mobile-intro"><span>Nawigacja · Luzik Kielce</span><Dialog.Title>Gdzie teraz<span>?</span></Dialog.Title><p>Wybierz kierunek. Reszta na luzie.</p></div>
            <nav aria-label="Nawigacja mobilna">
              <ul className="luzik-mobile-list">
                {luzikNavigation.map((item, index) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`) ||
                    (item.href === "/blog" && pathname.startsWith("/posts/")) ||
                    item.children?.some(child => pathname === child.href);
                  const expanded = expandedItem === item.href;
                  const label = <><span className="luzik-mobile-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{item.vehicle && <span className="luzik-mobile-vehicle-icon" data-vehicle={item.vehicle}><NavigationVehicleIcon vehicle={item.vehicle} /></span>}<span className="luzik-mobile-label">{item.label}</span><ArrowUpRight className="luzik-mobile-arrow" size={23} aria-hidden="true" /></>;
                  return <li key={item.id ?? item.href} style={{ "--item-index": index } as CSSProperties}>
                    {item.children ? <>
                      <button type="button" className="luzik-mobile-item" aria-expanded={expanded}
                        aria-controls={`mobile-nav-${item.id ?? item.href.slice(1)}`} data-active={active || undefined}
                        onClick={() => setExpandedGroup(expanded ? null : { session, href: item.href })}>
                        {label}
                      </button>
                      <div id={`mobile-nav-${item.id ?? item.href.slice(1)}`} className="luzik-mobile-submenu" data-expanded={expanded} inert={!expanded} aria-hidden={!expanded}>
                        <div className="luzik-mobile-submenu-clip"><div className="luzik-mobile-submenu-content">
                          <NavigationGroups item={item} pathname={pathname} onNavigate={closeMenu} />
                          <Link href={item.href} onClick={closeMenu} className="luzik-mobile-overview">
                            {item.overviewLabel ?? (item.groups ? "Zobacz wszystkie kursy" : "O naszej szkole")}<ArrowRight size={16} aria-hidden="true" />
                          </Link>
                        </div></div>
                      </div>
                    </> : <Link href={item.href} onClick={closeMenu} className="luzik-mobile-item" aria-current={active ? "page" : undefined}>{label}</Link>}
                  </li>;
                })}
              </ul>
            </nav>
            <div className="luzik-mobile-contact">
              <a href={header.phoneHref} className="luzik-mobile-phone"><Phone size={18} aria-hidden="true" /><span><small>Porozmawiajmy o Twoim kursie</small>{header.phoneLabel}</span><ArrowUpRight size={18} aria-hidden="true" /></a>
              <div className="luzik-mobile-socials">
                <div><a href={header.facebookHref} aria-label="Facebook" target="_blank" rel="noopener noreferrer"><Facebook size={19} /></a><a href={header.instagramHref} aria-label="Instagram" target="_blank" rel="noopener noreferrer"><Instagram size={19} /></a></div>
                <LanguageSwitcher dark />
              </div>
            </div>
          </div>
          <div className="luzik-mobile-action"><Link href={header.registrationHref} onClick={closeMenu} className="luzik-mobile-cta"><span>Zapisz się na kurs<small>Twój pierwszy krok do prawa jazdy</small></span><ArrowUpRight size={24} aria-hidden="true" /></Link></div>
        </aside>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
