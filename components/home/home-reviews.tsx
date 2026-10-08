"use client";

import { useRef } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const reviews = [
  { author: "Alina Karachun", text: "Egzamin zdany bez stresu i z pewnością! Dziękuję za pewny profesjonalizm i spokój za kierownicą P. Marioli i P. Kacprowi. Szkoła się sprawdziła i gorąco polecam!" },
  { author: "Magdalena Lis", text: "Z całego serca polecam tę szkółkę jazdy! Miałam przyjemność odbyć jazdy z Panem Mirosławem." },
  { author: "Harlejowski Durlej", text: "SUPER !!! Pełen profesjonalizm." },
];
const googleUrl = "https://www.google.com/maps/search/?api=1&query=Szko%C5%82a+Jazdy+Luzik+Arkadiusz+Jaros+Kielce";

function Stars() {
  return <span className="home-review-stars" aria-label="Ocena 5 na 5">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill="currentColor" aria-hidden="true" />)}</span>;
}

export function HomeReviews() {
  const track = useRef<HTMLDivElement>(null);
  function scrollReviews(direction: number) {
    const element = track.current;
    const card = element?.querySelector("article");
    if (element && card) {
      element.scrollBy({ left: direction * (card.getBoundingClientRect().width + 20), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  }
  return (
    <section className="home-section" aria-labelledby="home-reviews-title">
      <div className="luzik-container">
        <div className="home-reviews-heading">
          <div><p className="home-eyebrow">Ich cel? Osiągnięty.</p><h2 id="home-reviews-title" className="home-title">Najlepiej mówią o nas<br />nasi kursanci.</h2></div>
          <a href={googleUrl} target="_blank" rel="noreferrer" className="home-text-link">Zobacz opinie w Google <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
        <div className="home-reviews-layout">
          <aside className="home-review-summary"><span className="home-review-score">4,8<span>/ 5</span></span><Stars /><h3>Szkoła Jazdy Luzik</h3><p>Ocena na podstawie 318 opinii w Google, według danych z dotychczasowej strony.</p><a href={googleUrl} target="_blank" rel="noreferrer">Sprawdź aktualne opinie <ArrowUpRight size={16} aria-hidden="true" /></a></aside>
          <div className="home-review-carousel">
            <div ref={track} id="home-review-track" className="home-review-track" tabIndex={0} role="region" aria-label="Opinie kursantów — przewijaj, aby zobaczyć kolejne">
              {reviews.map((review) => <article key={review.author} className="home-review-card"><Quote className="home-review-quote" size={28} aria-hidden="true" /><Stars /><blockquote>{review.text}</blockquote><div className="home-review-author"><span aria-hidden="true">{review.author.charAt(0)}</span><div><h3>{review.author}</h3><p>Opinia z Google</p></div></div></article>)}
            </div>
            <div className="home-review-controls"><span>Wybrane opinie kursantów</span><div><button type="button" onClick={() => scrollReviews(-1)} aria-label="Poprzednia opinia" aria-controls="home-review-track"><ChevronLeft size={20} aria-hidden="true" /></button><button type="button" onClick={() => scrollReviews(1)} aria-label="Następna opinia" aria-controls="home-review-track"><ChevronRight size={20} aria-hidden="true" /></button></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

