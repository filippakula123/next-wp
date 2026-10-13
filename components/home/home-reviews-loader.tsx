"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Quote } from "@/components/site/icons";
import { luzikGoogleReviewsUrl } from "@/lib/luzik-reviews";

const DeferredReviews = dynamic(
  () => import("@/components/home/home-reviews").then(module => module.HomeReviews),
  { ssr: false },
);

/** Keep the reviews section in the server HTML, but defer its carousel code until needed. */
export function HomeReviewsLoader({ enabled = false }: { enabled?: boolean }) {
  const section = useRef<HTMLElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!enabled || shouldLoad) return;
    if (typeof IntersectionObserver === "undefined") {
      const timer = window.setTimeout(() => setShouldLoad(true), 0);
      return () => window.clearTimeout(timer);
    }

    const target = section.current;
    if (!target) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        setShouldLoad(true);
      }
    }, { rootMargin: "400px 0px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, shouldLoad]);

  if (shouldLoad) return <DeferredReviews enabled={enabled} />;

  return (
    <section ref={section} id="home-reviews" className="home-section" aria-labelledby="home-reviews-title">
      <div className="luzik-container">
        <div className="home-reviews-heading">
          <div>
            <p className="home-eyebrow">Ich cel? Osiągnięty.</p>
            <h2 id="home-reviews-title" className="home-title">Najlepiej mówią o nas<br />nasi kursanci.</h2>
          </div>
          <a href={luzikGoogleReviewsUrl} target="_blank" rel="noopener noreferrer" className="home-text-link">
            Zobacz opinie w Google <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="home-review-unavailable">
          <span className="home-review-invitation-icon" aria-hidden="true"><Quote size={32} /></span>
          <div>
            <h3>Przeczytaj historie naszych kursantów.</h3>
            <p role="status">{enabled ? "Opinie pojawią się po przewinięciu do tej sekcji." : "Opinie i aktualną ocenę szkoły znajdziesz w naszym profilu Google Maps."}</p>
          </div>
          <a href={luzikGoogleReviewsUrl} target="_blank" rel="noopener noreferrer" className="home-button">
            Zobacz opinie <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
