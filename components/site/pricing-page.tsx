import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import Link from "next/link";
import { ArrowRight, BookOpen, CarFront, Check, Clock3, WalletCards } from "lucide-react";

import { formatLuzikPrice } from "@/lib/luzik-offer";
import { SchoolTeam } from "./school-team";
import { SubpageCta, SubpageHero } from "./subpage-hero";

type Course = import("@/lib/luzik-settings").LuzikCourse;

function PriceCard({ course, combined = false }: { course: Course; combined?: boolean }) {
  return (
    <article id={`cena-${course.id}`} className={`luzik-price-card ${course.group === "car" ? "luzik-price-card-featured" : ""}`}>
      {combined && <span id="cena-a2" className="luzik-anchor" aria-hidden="true" />}
      <p className="luzik-price-card-label">{course.group === "car" ? "Kurs samochodowy" : "Kurs motocyklowy"}</p>
      <h3>{combined ? "Kategoria A, A2" : course.name}</h3>
      <p className="luzik-price-card-description">{combined ? "Szkolenie na motocykl" : course.subtitle}</p>
      <p className="luzik-course-price"><strong>{formatLuzikPrice(course.price)}</strong><span>zł / kurs</span></p>
      <ul className="luzik-price-includes">
        <li><BookOpen size={19} aria-hidden="true" /><span><strong>{course.theory} godzin</strong> teorii</span></li>
        <li><Clock3 size={19} aria-hidden="true" /><span><strong>{course.practice} godzin</strong> praktyki</span></li>
      </ul>
      <Link className="home-button" href="/kontakt" aria-label={`Zapisz się na kurs: ${combined ? "kategoria A lub A2" : course.name}`}>Zapisz się na kurs<ArrowRight size={17} aria-hidden="true" /></Link>
    </article>
  );
}

export async function PricingPage() {
  const { courses: luzikCourses, lessons: luzikExtraLessons } = await getLuzikSiteData();
  const cars = luzikCourses.filter((course) => course.group === "car");
  const combineA = luzikCourses.find(course => course.id === "a")?.price === luzikCourses.find(course => course.id === "a2")?.price;
  const motorcycles = luzikCourses.filter((course) => course.group === "motorcycle" && (!combineA || course.id !== "a2"));
  return (
    <main id="main-content">
      <SubpageHero
        eyebrow="Cennik · Szkoła Jazdy Luzik"
        title={<>Twój kurs.<br /><span>Jasna cena.</span></>}
        description="Cennik kursów prawa jazdy w Kielcach. Porównaj kategorie, sprawdź liczbę godzin i wybierz szkolenie dla siebie."
        breadcrumb="Cennik"
        image="/luzik/footer-car.jpg"
        imageAlt="Samochód szkoleniowy Luzik w centrum Kielc"
        imageLabel="Brak ukrytych kosztów"
        action={{ href: "#ceny-kursow", label: "Sprawdź ceny kursów" }}
      >
        <div className="luzik-subhero-tags"><a href="#ceny-kursow">Kursy</a><a href="#jazdy-doszkalajace">Jazdy doszkalające</a><a href="#dodatkowe-uslugi">Dodatkowe usługi</a></div>
      </SubpageHero>

      <section className="home-section" aria-labelledby="pricing-intro-title">
        <div className="luzik-container luzik-editorial-intro">
          <div><p className="home-eyebrow">Zaplanuj swój kurs</p><h2 id="pricing-intro-title" className="home-title">Kursy na prawo jazdy Kielce — cena poszczególnych kategorii</h2></div>
          <div className="luzik-prose"><p>Poniżej przedstawiamy aktualny cennik prawa jazdy. Kielce są miejscem, gdzie prowadzimy kursy z wysoką zdawalnością. Z nami nie tylko przygotujesz się do egzaminu, ale przede wszystkim zdobędziesz umiejętności bezpiecznej i odpowiedzialnej jazdy, które będą procentować przez kolejne lata prowadzenia pojazdów.</p><p>Sprawdź, ile kosztuje kurs prawa jazdy w Kielcach i okolicach.</p></div>
        </div>
      </section>

      <section id="ceny-kursow" className="home-section luzik-offer-section" aria-labelledby="car-prices-title">
        <div className="luzik-container">
          <div className="luzik-section-topline"><div><p className="home-eyebrow">Samochód</p><h2 id="car-prices-title" className="home-title">Kursy prawa jazdy<br />kategorii B</h2></div><Link href="/kursy-prawa-jazdy" className="home-text-link">Poznaj zakres szkolenia<ArrowRight size={18} aria-hidden="true" /></Link></div>
          <div className="luzik-price-grid luzik-price-grid-cars">{cars.map((course) => <PriceCard key={course.id} course={course} />)}</div>
          <div id="dodatkowe-uslugi" className="luzik-exam-car">
            <CarFront size={28} aria-hidden="true" />
            <div><h3>Podstawienie samochodu pod egzamin — B automat</h3><p>Na czas trwania egzaminu.</p></div>
            <strong>200 <span>zł</span></strong>
            <Link href="/kontakt" className="home-text-link">Umów podstawienie<ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
          <div className="luzik-motorcycle-heading"><p className="home-eyebrow">Jednoślady</p><h2 id="motorcycle-prices-title" className="home-title">Kursy prawa jazdy<br />kategorii motocyklowych</h2></div>
          <div className="luzik-price-grid" aria-labelledby="motorcycle-prices-title">{motorcycles.map((course) => <PriceCard key={course.id} course={course} combined={combineA && course.id === "a"} />)}</div>
        </div>
      </section>

      <section id="jazdy-doszkalajace" className="home-section" aria-labelledby="extra-lessons-title">
        <div className="luzik-container luzik-extra-lessons-layout">
          <div><p className="home-eyebrow">Więcej praktyki</p><h2 id="extra-lessons-title" className="home-title">Jazdy doszkalające</h2><p className="home-copy">Cena za 1 godzinę praktyki. Wybierz kategorię i umów dodatkową jazdę.</p><Link href="/kontakt" className="home-button mt-7">Zapisz się na jazdy<ArrowRight size={18} aria-hidden="true" /></Link></div>
          <div className="luzik-extra-lessons-table"><table><caption className="sr-only">Jazdy doszkalające — ceny za jedną godzinę praktyki</caption><thead><tr><th scope="col">Kategoria</th><th scope="col">Cena / 1 godz.</th></tr></thead><tbody>{luzikExtraLessons.map((lesson) => <tr key={lesson.category}><th scope="row"><strong>{lesson.category}</strong><span>{lesson.description}</span></th><td>{lesson.price} <span>zł</span></td></tr>)}</tbody></table></div>
        </div>
      </section>
      <section className="luzik-payment-section" aria-labelledby="payment-title"><div className="luzik-container"><div className="luzik-payment-panel"><WalletCards size={32} aria-hidden="true" /><div><h2 id="payment-title">Możliwość zapłaty za kurs w dowolnych ratach</h2><p>Zapytaj nas o sposób rozłożenia płatności. Badania lekarskie są dodatkowo płatne.</p></div><span><Check size={17} aria-hidden="true" />Brak ukrytych kosztów</span></div></div></section>
      <SchoolTeam />
      <SubpageCta />
    </main>
  );
}
