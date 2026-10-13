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
    function close() {
      toggles.forEach(button => {
        button.setAttribute('aria-expanded', 'false');
        const panel = document.getElementById(button.getAttribute('aria-controls') || '');
        if (panel) panel.hidden = true;
      });
    }
    for (const item of header.querySelectorAll<HTMLElement>('[data-nav-item]')) {
      const links = [...item.querySelectorAll<HTMLAnchorElement>('a[href]')];
      const active = links.some(link => pathname === link.pathname || (link.pathname === '/blog' && pathname.startsWith('/posts/')));
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
        if (opening) {
          button.setAttribute('aria-expanded', 'true');
          const panel = document.getElementById(button.getAttribute('aria-controls') || '');
          if (panel) panel.hidden = false;
        }
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
    header.addEventListener('focusout', blur);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      header.removeEventListener('click', click);
      header.removeEventListener('focusout', blur);
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [pathname]);
  return null;
}
