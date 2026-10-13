import Image from "@/components/site/static-image";
import Link from "@/components/site/site-link";
import { ArrowRight, BookOpen, HeartHandshake, Route } from "@/components/site/icons";

const benefits = [
  { icon: HeartHandshake, title: "Spokojnie, w Twoim tempie", text: "Instruktorzy, z którymi złapiesz dobry kontakt. Wsparcie od pierwszej jazdy do egzaminu." },
  { icon: Route, title: "Praktyka na kieleckich drogach", text: "Prawdziwe skrzyżowania, ruch miejski i okolice WORD. Budujemy pewność za kierownicą." },
  { icon: BookOpen, title: "Teoria, która ma sens", text: "Praktyczne wyjaśnienia, pierwsza pomoc i pytania egzaminacyjne dostępne także online." },
];

export function HomeIntro() {
  return (
    <section className="home-section" aria-labelledby="home-intro-title">
      <div className="luzik-container">
        <div className="home-intro-layout">
          <div className="home-intro-photo">
            <Image src="/luzik/footer-car.webp" alt="Samochód Szkoły Jazdy Luzik" fill sizes="(max-width: 767px) 100vw, 45vw" className="object-cover" />
            <div className="home-photo-label"><span>Twój cel. Nasze wsparcie.</span><strong>Prawo jazdy na luzie.</strong></div>
          </div>
          <div>
            <p className="home-eyebrow">Poznaj Luzik</p>
            <h2 id="home-intro-title" className="home-title">Naucz się jeździć.<br />Poczuj się pewnie.</h2>
            <p className="home-copy">Szkoła jazdy w centrum Kielc, w której od pierwszego spotkania wiesz, że masz wsparcie. Łączymy konkretną naukę z luźną atmosferą — za kierownicą i na sali wykładowej.</p>
            <Link href="/o-nas" className="home-text-link mt-6">Poznaj naszą szkołę <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="home-benefits-grid">
          {benefits.map(({ icon: Icon, title, text }) => <article key={title} className="home-benefit"><Icon size={26} aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div></article>)}
        </div>
      </div>
    </section>
  );
}

