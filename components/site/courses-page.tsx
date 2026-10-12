import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CarFront, Check, ClipboardCheck, HeartPulse } from "lucide-react";

import { formatLuzikPrice } from "@/lib/luzik-offer";
import { courseHref } from "@/lib/luzik-course-details";
import { SubpageCta, SubpageHero } from "./subpage-hero";

export async function CoursesPage() {
  const { courses: luzikCourses } = await getLuzikSiteData();
  return (
    <main id="main-content">
      <SubpageHero
        eyebrow="Szkoła Jazdy Luzik · Kielce"
        title={<>Kursy prawa jazdy.<br /><span>Twój kierunek. Twój Luzik.</span></>}
        description="Kursy prawa jazdy w szkole jazdy Luzik Kielce — zapraszamy! Samochód, automat czy motocykl? Wybierz szkolenie i zacznij swoją drogę do samodzielnej jazdy."
        breadcrumb="Kursy prawa jazdy"
        image="/luzik/courses/intro.webp"
        imageAlt="Instruktorzy Szkoły Jazdy Luzik przy samochodzie szkoleniowym w Kielcach"
        imageLabel="Teoria i praktyka · na luzie"
        action={{ href: "#oferta-kursow", label: "Wybierz swój kurs" }}
      >
        <div className="luzik-subhero-tags"><span>B · manual</span><span>B · automat</span><span>AM · A1 · A2 · A</span></div>
      </SubpageHero>

      <section className="home-section" aria-labelledby="courses-intro-title">
        <div className="luzik-container luzik-editorial-intro">
          <div><p className="home-eyebrow">Dobry początek</p><h2 id="courses-intro-title" className="home-title">Kursy prawa jazdy<br />Kielce</h2></div>
          <div className="luzik-prose">
            <p>Aby uzyskać uprawnienia do prowadzenia pojazdów mechanicznych, należy przejść przez odpowiednie szkolenie i zdać egzamin. Warto wiedzieć, że dobry kurs prawa jazdy np. w Kielcach ma ogromne znaczenie dla pomyślności. Dlatego, jeśli chcesz zyskać licencję na kierowanie samochodem lub motocyklem — powinieneś wybrać szkołę, która zagwarantuje Ci najwyższą jakość kształcenia.</p>
            <p>W ośrodku Luzik stawiamy duży nacisk na to, abyś miał najlepsze warunki do nauki teorii oraz praktyki. Dowiedz się więcej o ofercie już teraz.</p>
          </div>
        </div>
      </section>

      <section id="oferta-kursow" className="home-section luzik-offer-section" aria-labelledby="courses-offer-title">
        <div className="luzik-container">
          <div className="luzik-section-topline">
            <div><p className="home-eyebrow">Samochód czy motocykl?</p><h2 id="courses-offer-title" className="home-title">Jakie kursy znajdziesz<br />w naszej ofercie?</h2></div>
            <Link href="/cennik" className="home-text-link">Zobacz pełny cennik<ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
          <div className="luzik-course-grid">
            {luzikCourses.map((course) => (
              <article key={course.id} id={`kurs-${course.id}`} className="luzik-course-card">
                <div className="luzik-course-photo">
                  <Image src={course.image} alt={course.imageAlt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" />
                  <span className="luzik-category-badge">{course.category}{course.id === "b-automat" && <small>automat</small>}</span>
                </div>
                <div className="luzik-course-content">
                  <p className="luzik-course-subtitle">{course.subtitle}</p>
                  <h3><Link href={courseHref(course.id)}>{course.name}</Link></h3>
                  <ul className="luzik-check-list">
                    <li><Check size={16} aria-hidden="true" />{course.theory} godzin teorii</li>
                    <li><Check size={16} aria-hidden="true" />{course.practice} godzin praktyki</li>
                  </ul>
                  <div className="luzik-course-bottom">
                    <span><strong>{formatLuzikPrice(course.price)}</strong> zł <small>za kurs</small></span>
                    <Link href={courseHref(course.id)} aria-label={`Poznaj kurs: ${course.name}`}><ArrowRight size={21} aria-hidden="true" /></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="luzik-offer-note">Interesuje Cię szkolenie B1? W naszej ofercie jest również szkolenie obejmujące wyłącznie prowadzenie samochodu. <Link href="/kontakt">Zapytaj nas o szczegóły.</Link></p>
        </div>
      </section>

      <section className="home-section" aria-labelledby="courses-learning-title">
        <div className="luzik-container">
          <div className="luzik-editorial-intro">
            <div><p className="home-eyebrow">Kompletne przygotowanie</p><h2 id="courses-learning-title" className="home-title">Teoria, praktyka<br />i wsparcie.</h2></div>
            <div className="luzik-prose">
              <p>Prowadzimy szkolenia w ramach najpopularniejszych kategorii. Proponujemy m.in. <Link href="#kurs-b">kursy prawa jazdy kat. B</Link> (w tym też na <Link href="#kurs-b-automat">automat</Link>). Podczas nauki poznasz najważniejszą teorię, obejmującą również pierwszą pomoc. Ponadto kursanci otrzymują podręcznik, ułatwiający przyswajanie sobie wiedzy także poza salą wykładową. Dodatkowo udostępniamy klientom stronę z przykładowymi pytaniami egzaminacyjnymi — teoria to nieodzowny element zdawania egzaminu na uprawnienia do prowadzenia motocykla czy samochodu.</p>
            </div>
          </div>
          <div className="luzik-learning-grid">
            <article><BookOpen size={28} aria-hidden="true" /><h3>Wiedza, do której wracasz</h3><p>Teoria, pierwsza pomoc, podręcznik i dostęp do przykładowych pytań egzaminacyjnych.</p></article>
            <article><CarFront size={28} aria-hidden="true" /><h3>Jazdy po mieście i placu</h3><p>Praktyka z instruktorem i przygotowanie do sytuacji, które spotkasz na egzaminie.</p></article>
            <article><ClipboardCheck size={28} aria-hidden="true" /><h3>Pomoc w formalnościach</h3><p>Wsparcie w czynnościach związanych ze zdobyciem prawa jazdy, również w urzędach.</p></article>
          </div>
          <div className="luzik-prose luzik-course-detail-copy">
            <h3>Praktyka na kursie kategorii B</h3>
            <p>Witalną częścią tego pakietu są jazdy — te trwają 30 godzin i obejmują m.in. poruszanie się po mieście i po placu. W trakcie praktyki instruktor nie tylko uczy najważniejszych zasad prowadzenia pojazdu, ale i zwraca uwagę na kwestie szczególnie istotne dla egzaminatorów. Warto dodać, że proponujemy szkolenie B1, obejmujące wyłącznie prowadzenie samochodu.</p>
            <p>Oprócz tego możesz też odbyć u nas kurs stworzony z myślą o jednośladach. <Link href="#kurs-a">Kategoria A</Link> i <Link href="#kurs-a2">A2</Link> to szkolenie na prawo jazdy na motocykl, obejmujące najważniejsze zagadnienia teoretyczne i jazdy. Ponadto w ofercie mamy jeszcze pakiety szkoleniowe na kat. <Link href="#kurs-am">AM</Link> i <Link href="#kurs-a1">A1</Link>.</p>
          </div>
          <div className="luzik-support-panel">
            <HeartPulse size={30} aria-hidden="true" />
            <div><h3>Jesteśmy z Tobą także przy formalnościach</h3><p>Do oferowanych szkoleń podchodzimy w pełni kompleksowo. Zależy nam na tym, aby kursanci uczący się na prawo jazdy na samochód czy motocykl w naszej szkole w Kielcach mogli nie tylko wynieść jak najwięcej wiedzy i szlifować swoje umiejętności, ale i byli zaopiekowani w obrębie czynności związanych ze zdobyciem licencji. Dlatego m.in. pomagamy w formalnościach w urzędach, a także proponujemy — dodatkowo płatne — badania lekarskie w naszym ośrodku. Chcesz dowiedzieć się więcej? <Link href="/kontakt">Skontaktuj się z nami!</Link></p></div>
          </div>
        </div>
      </section>
      <SubpageCta />
    </main>
  );
}
