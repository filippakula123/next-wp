import Link from "next/link";
import { ArrowRight, BookOpen, CarFront, Clock3, HeartHandshake, ShieldCheck, Trophy } from "lucide-react";

const highlights = [
  { icon: BookOpen, title: "Wiedza i doświadczenie", description: "Praktyczne wskazówki od instruktorów, którzy znają kieleckie drogi i potrafią jasno wyjaśnić nawet trudne manewry." },
  { icon: Trophy, title: "Kurs dopasowany do celu", description: "Kursy samochodowe i motocyklowe oraz jazdy doszkalające. Wybierz szkolenie, którego potrzebujesz." },
  { icon: ShieldCheck, title: "Pewność za kierownicą", description: "Ćwiczymy realne sytuacje drogowe. Liczy się przygotowanie do egzaminu i bezpiecznej, samodzielnej jazdy." },
  { icon: HeartHandshake, title: "Indywidualne podejście", description: "Dopasowujemy tempo nauki do Twoich umiejętności. Pytaj, próbuj i ucz się bez niepotrzebnej presji." },
  { icon: CarFront, title: "Praktyka od pierwszych jazd", description: "Poznaj samochód, opanuj manewry i stopniowo nabieraj swobody w miejskim ruchu." },
  { icon: Clock3, title: "Elastyczne godziny", description: "Ustal z nami terminy jazd, które połączysz ze szkołą, pracą i swoim planem dnia." },
];

export function HomeHighlights() {
  return (
    <section className="home-section home-highlights" aria-labelledby="home-highlights-title">
      <div className="luzik-container">
        <div className="home-highlights-heading"><div><p className="home-eyebrow">Po prostu Luzik</p><h2 id="home-highlights-title" className="home-title">Dobra nauka zaczyna się<br />od dobrego podejścia.</h2></div><p>Konkretnie, spokojnie i z myślą o Tobie.<br />Zobacz, co dostajesz w Luziku.</p></div>
        <div className="home-highlights-grid">{highlights.map(({ icon: Icon, title, description }, index) => <article key={title} className="home-highlight-card"><div><Icon size={28} aria-hidden="true" /><span aria-hidden="true">0{index + 1}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div>
        <div className="home-highlights-cta"><p>Twój pierwszy krok do prawa jazdy?</p><Link href="/kursy-prawa-jazdy" className="home-button">Wybierz swój kurs <ArrowRight size={18} aria-hidden="true" /></Link></div>
      </div>
    </section>
  );
}

