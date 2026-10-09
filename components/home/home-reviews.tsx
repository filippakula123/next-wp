"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { luzikGoogleReviewsUrl, type GoogleReviews } from "@/lib/luzik-reviews";

function Stars({ rating }: { rating: number }) {
  return <span className="home-review-stars" role="img" aria-label={`Ocena ${rating.toLocaleString("pl-PL")} na 5`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill={index + 1 <= Math.round(rating) ? "currentColor" : "none"} aria-hidden="true" />)}</span>;
}

export function HomeReviews({ enabled = false }: { enabled?: boolean }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<GoogleReviews | null>(null);
  const [status, setStatus] = useState<"waiting" | "ready" | "unavailable">("waiting");

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    let started = false;
    async function load() {
      if (started) return;
      started = true;
      try {
        const response = await fetch("/api/reviews", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Reviews unavailable");
        const result: GoogleReviews = await response.json();
        if (!controller.signal.aborted) { setData(result); setStatus("ready"); }
      } catch {
        if (!controller.signal.aborted) setStatus("unavailable");
      }
    }
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer?.disconnect(); void load(); }
    }, { rootMargin: "200px" });
    if (observer && section.current) observer.observe(section.current);
    else void load();
    return () => { observer?.disconnect(); controller.abort(); };
  }, [enabled]);

  function scrollReviews(direction: number) {
    const element = track.current;
    const card = element?.querySelector("article");
    if (element && card) element.scrollBy({ left: direction * (card.getBoundingClientRect().width + 20), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  const url = data?.url || luzikGoogleReviewsUrl;
  return (
    <section ref={section} id="home-reviews" className="home-section" aria-labelledby="home-reviews-title">
      <div className="luzik-container">
        <div className="home-reviews-heading">
          <div><p className="home-eyebrow">Ich cel? Osiągnięty.</p><h2 id="home-reviews-title" className="home-title">Najlepiej mówią o nas<br />nasi kursanci.</h2></div>
          <a href={url} target="_blank" rel="noopener noreferrer" className="home-text-link">Zobacz opinie w Google <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
        {/* Remount provider content after loading; the translator may replace text nodes. */}
        <div key={data ? "reviews" : status} className={data ? "home-reviews-layout" : "home-review-unavailable"}>
          {data ? <>
            <aside className="home-review-summary">
              <Image src="/luzik/google-maps.svg" alt="Google Maps" width={98} height={18} className="home-review-google-logo notranslate" />
              {data.rating !== undefined && <><span className="home-review-score" translate="no">{data.rating.toLocaleString("pl-PL", { maximumFractionDigits: 1 })}<span>/ 5</span></span><Stars rating={data.rating} /></>}
              <h3 translate="no">{data.name}</h3>
              {data.count !== undefined && <p>Liczba ocen w Google: <strong translate="no">{data.count.toLocaleString("pl-PL")}</strong>.</p>}
              <a href={url} target="_blank" rel="noopener noreferrer">Wszystkie opinie <ArrowUpRight size={16} aria-hidden="true" /></a>
            </aside>
            <div className="home-review-carousel">
              {data.reviews.length > 0 ? <>
                <div ref={track} id="home-review-track" className="home-review-track" tabIndex={0} role="region" aria-label="Opinie kursantów — przewijaj, aby zobaczyć kolejne">
                  {data.reviews.map(review => <article key={review.id} className="home-review-card">
                    <Quote className="home-review-quote" size={28} aria-hidden="true" /><Stars rating={review.rating} />
                    {review.text ? <blockquote lang={review.language}>{review.text}</blockquote> : <p className="home-review-no-text">Ocena bez komentarza tekstowego.</p>}
                    <div className="home-review-author">
                      {review.photoUrl ? <Image src={review.photoUrl} alt="" width={40} height={40} unoptimized loading="lazy" referrerPolicy="no-referrer" /> : <span translate="no" aria-hidden="true">{review.author.charAt(0)}</span>}
                      <div><h3 translate="no">{review.authorUrl ? <a href={review.authorUrl} target="_blank" rel="noopener noreferrer">{review.author}</a> : review.author}</h3>
                        {review.date && <p><time dateTime={review.date}>{new Date(review.date).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Warsaw" })}</time></p>}
                      </div>
                    </div>
                    {review.translated && <p className="home-review-translation">Opinia przetłumaczona przez Google.</p>}
                    <a className="home-review-source" href={review.url || review.authorUrl || url} target="_blank" rel="noopener noreferrer">Przeczytaj w Google Maps <ArrowUpRight size={14} aria-hidden="true" /></a>
                  </article>)}
                </div>
                <div className="home-review-controls"><span>Opinie według trafności w Google.</span>{data.reviews.length > 1 && <div><button type="button" onClick={() => scrollReviews(-1)} aria-label="Poprzednia opinia" aria-controls="home-review-track"><ChevronLeft size={20} aria-hidden="true" /></button><button type="button" onClick={() => scrollReviews(1)} aria-label="Następna opinia" aria-controls="home-review-track"><ChevronRight size={20} aria-hidden="true" /></button></div>}</div>
                <p className="home-review-policy">Pokazujemy opinie udostępnione przez Google, bez filtrowania po ocenie. <a href="https://support.google.com/contributionpolicy/answer/7400114" target="_blank" rel="noopener noreferrer">Zasady publikowania opinii</a>.</p>
              </> : <p>Sprawdź opinie kursantów bezpośrednio w Google Maps.</p>}
              {data.attributions.map(item => <p key={item.name} className="home-review-policy" translate="no">{item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a> : item.name}</p>)}
            </div>
          </> : <>
            <span className="home-review-invitation-icon" aria-hidden="true"><Quote size={32} /></span>
            <div><h3>Przeczytaj historie naszych kursantów.</h3><p role="status">{enabled && status === "waiting" ? "Pobieramy opinie z Google…" : "Opinie i aktualną ocenę szkoły znajdziesz w naszym profilu Google Maps."}</p></div>
            <a href={url} target="_blank" rel="noopener noreferrer" className="home-button">Zobacz opinie <ArrowUpRight size={18} aria-hidden="true" /></a>
          </>}
        </div>
      </div>
    </section>
  );
}
