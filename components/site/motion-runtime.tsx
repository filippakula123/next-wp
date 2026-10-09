"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const targets = [
  "h2", "[data-luzik-reveal]", ".home-benefit", ".home-ranking-card",
  ".home-highlight-card", ".home-route-list > li", ".home-review-card",
  ".luzik-course-card", ".luzik-price-card", ".luzik-team-card",
  ".luzik-learning-grid > article", ".luzik-office-team-grid > article",
  ".luzik-gallery-card",
].join(",");

/** Enhance existing server HTML. No hidden classes, text rewrites or scroll listener. */
export function MotionRuntime() {
  const pathname = usePathname();
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main || typeof IntersectionObserver === "undefined" || typeof Element.prototype.animate !== "function") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Map<Element, Animation>();
    let watched = new WeakSet<Element>();
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      visible.forEach((entry, index) => {
        observer.unobserve(entry.target);
        if (reduced.matches || document.visibilityState === "hidden" || entry.target.contains(document.activeElement)) return;
        const animation = entry.target.animate([
          { opacity: 0.35, transform: "translateY(22px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 580, delay: Math.min(index, 3) * 65, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
        animations.set(entry.target, animation);
        animation.onfinish = () => animations.delete(entry.target);
      });
    }, { threshold: 0.08 });

    function register(root: Element) {
      if (reduced.matches) return;
      const candidates = [...(root.matches(targets) ? [root] : []), ...root.querySelectorAll(targets)];
      for (const element of candidates) {
        const markedParent = element.closest("[data-luzik-reveal]");
        if (watched.has(element) || (markedParent && markedParent !== element)) continue;
        watched.add(element);
        // Don't animate the initial viewport or an anchor destination; keep LCP steady.
        if (element.getBoundingClientRect().top >= window.innerHeight - 24) observer.observe(element);
      }
    }
    register(main);
    // Streamed sections, gallery filters and fetched reviews can add new cards.
    // Translation inserts text/font nodes; they do not match the reveal targets.
    const mutations = new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) if (node instanceof Element) register(node);
    });
    mutations.observe(main, { childList: true, subtree: true });
    function cancelMotion() {
      animations.forEach(animation => animation.cancel());
      animations.clear();
    }
    function onPreferenceChange() {
      if (reduced.matches) { observer.disconnect(); cancelMotion(); }
      else { watched = new WeakSet(); register(main!); }
    }
    function onFocus(event: FocusEvent) {
      animations.forEach((animation, element) => {
        if (event.target instanceof Node && element.contains(event.target)) { animation.cancel(); animations.delete(element); }
      });
    }
    reduced.addEventListener("change", onPreferenceChange);
    main.addEventListener("focusin", onFocus);
    return () => {
      observer.disconnect(); mutations.disconnect(); cancelMotion();
      reduced.removeEventListener("change", onPreferenceChange);
      main.removeEventListener("focusin", onFocus);
    };
  }, [pathname]);
  return null;
}
