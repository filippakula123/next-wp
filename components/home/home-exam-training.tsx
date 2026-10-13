import Link from "@/components/site/site-link";
import { ArrowRight, MapPin, Route } from "@/components/site/icons";

const routes = [
  { title: "Domaszowska · okolice WORD", text: "Włączanie się do ruchu, obserwacja znaków i pierwsze decyzje za kierownicą." },
  { title: "Żniwna · Świętokrzyska", text: "Zmiana pasów, płynność jazdy, sygnalizacja i ronda w okolicy Bocianka." },
  { title: "Poleska · Sandomierska", text: "Miejski ruch, przejścia dla pieszych i kontrola prędkości." },
  { title: "Wielkopolska · Legnicka · Mazurska", text: "Osiedlowe ulice, skrzyżowania równorzędne i zasada prawej ręki." },
  { title: "Solidarności · Warszawska", text: "Większy ruch, wybór pasa i prawidłowe ustawienie do skrętu." },
  { title: "Tarnowska · Winnicka · okolice bazarów", text: "Zmienna organizacja ruchu, piesi i skrzyżowania wymagające szczególnej uwagi." },
  { title: "IX Wieków Kielc · Pocieszki · Nowy Świat", text: "Parkowanie, wąskie ulice i uważna jazda w centrum." },
];

export function HomeExamTraining() {
  return (
    <section className="home-section home-training" aria-labelledby="exam-training-title">
      <div className="luzik-container home-training-layout">
        <div className="home-training-intro">
          <p className="home-eyebrow">Przygotowanie do egzaminu</p>
          <h2 id="exam-training-title" className="home-title">Poznaj miasto.<br />Przygotuj się do egzaminu.</h2>
          <p className="home-copy">Ćwiczymy na kieleckich drogach i w okolicach WORD. Uczysz się rozumieć sytuacje na drodze, podejmować decyzje i prowadzić samodzielnie.</p>
          <div className="home-training-start"><MapPin size={23} aria-hidden="true" /><div><strong>WORD Kielce</strong><span>ul. Domaszowska — ważny punkt Twoich przygotowań</span></div></div>
          <Link href="/jazdy-doszkalajace" className="home-button">Sprawdź jazdy doszkalające <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        <div>
          <div className="home-route-heading"><Route size={20} aria-hidden="true" /><h3>Tu budujemy Twoją pewność</h3></div>
          <ol className="home-route-list">{routes.map((route, index) => <li key={route.title}><span className="home-route-number">{String(index + 1).padStart(2, "0")}</span><div><h4>{route.title}</h4><p>{route.text}</p></div></li>)}</ol>
          <p className="home-route-footnote">Każdy egzamin może przebiegać inaczej. Przygotowujemy Cię do samodzielnej jazdy, także na nowych trasach.</p>
        </div>
      </div>
    </section>
  );
}

