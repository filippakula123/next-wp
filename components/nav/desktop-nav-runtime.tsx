"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Enhance the static header with one delegated listener instead of hydrating its content. */
export function DesktopNavRuntime() {
  const pathname = usePathname();
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('[data-luzik-header]');
    if (!header) return;
    const toggles = [...header.querySelectorAll<HTMLButtonElement>('[data-nav-toggle]')];
    let hoverTimeout: ReturnType<typeof setTimeout> | undefined;
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
    function cancelClose() { clearTimeout(hoverTimeout); }
    function close() {
      cancelClose();
      toggles.forEach(button => {
        button.setAttribute('aria-expanded', 'false');
        const panel = document.getElementById(button.getAttribute('aria-controls') || '');
        if (panel) panel.hidden = true;
      });
    }
    function show(button: HTMLButtonElement) {
      close();
      button.setAttribute('aria-expanded', 'true');
      const panel = document.getElementById(button.getAttribute('aria-controls') || '');
      if (panel) panel.hidden = false;
    }
    function pointerOver(event: PointerEvent) {
      if (!hover.matches || event.pointerType !== 'mouse') return;
      const item = event.target instanceof Element ? event.target.closest('[data-nav-item]') : null;
      const button = item?.querySelector<HTMLButtonElement>('[data-nav-toggle]');
      if (button) {
        cancelClose();
        if (button.getAttribute('aria-expanded') !== 'true') show(button);
      } else if (item) close();
    }
    function pointerOut(event: PointerEvent) {
      if (!hover.matches || event.pointerType !== 'mouse') return;
      const item = event.target instanceof Element ? event.target.closest('[data-nav-item]') : null;
      if (item && !(event.relatedTarget instanceof Node && item.contains(event.relatedTarget))) {
        cancelClose();
        hoverTimeout = setTimeout(close, 180);
      }
    }
    for (const item of header.querySelectorAll<HTMLElement>('[data-nav-item]')) {
      const links = [...item.querySelectorAll<HTMLAnchorElement>('a[href]')];
      const categoryLinks = item.hasAttribute('data-nav-vehicle') ? [...item.querySelectorAll<HTMLAnchorElement>('.luzik-nav-card')] : links;
      const active = categoryLinks.some(link => pathname === link.pathname || (link.pathname === '/blog' && pathname.startsWith('/posts/')));
      item.querySelector<HTMLElement>('[data-nav-primary]')?.setAttribute('data-active', String(active));
      links.forEach(link => {
        if (pathname === link.pathname) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    }
    function click(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target : null;
      const button = target?.closest<HTMLButtonElement>('[data-nav-toggle]');
      if (button) {
        const opening = button.getAttribute('aria-expanded') !== 'true';
        close();
        if (opening) show(button);
      } else if (target?.closest('a, .luzik-language-trigger')) close();
    }
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !header!.contains(event.target)) close();
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      const expanded = toggles.find(button => button.getAttribute('aria-expanded') === 'true');
      close();
      expanded?.focus();
    }
    function blur(event: FocusEvent) {
      const nav = header!.querySelector('[data-desktop-nav]');
      if (event.target instanceof Node && nav?.contains(event.target) && !(event.relatedTarget instanceof Node && nav.contains(event.relatedTarget))) close();
    }
    header.addEventListener('click', click);
    header.addEventListener('pointerover', pointerOver);
    header.addEventListener('pointerout', pointerOut);
    header.addEventListener('focusout', blur);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      header.removeEventListener('click', click);
      header.removeEventListener('pointerover', pointerOver);
      header.removeEventListener('pointerout', pointerOut);
      cancelClose();
      header.removeEventListener('focusout', blur);
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [pathname]);
  return null;
}
