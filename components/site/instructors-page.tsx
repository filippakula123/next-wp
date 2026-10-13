import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import Image from "@/components/site/static-image";
import Link from "@/components/site/site-link";
import { ArrowRight, MapPin, Phone } from "@/components/site/icons";
import { featuredInstructors, luzikOfficeTeam, profileHref } from "@/lib/luzik-team";
import { SubpageHero } from "./subpage-hero";
import { SchoolTeam } from "./school-team";
import { CourseContactForm } from "./course-contact-form";

const cars = [
  { image: "hyundai-silver", alt: "Szary Hyundai i20 z oznaczeniem L Szkoły Jazdy Luzik Kielce", caption: "Hyundai i20 wykorzystywany podczas szkolenia praktycznego kursantów kategorii B." },
  { image: "yaris", alt: "Biała Toyota Yaris automat do nauki jazdy kat. B w Kielcach", caption: "Toyota Yaris z automatyczną skrzynią biegów wykorzystywana podczas kursu prawa jazdy kat. B automat." },
  { image: "hyundai-lessons", alt: "Samochód Szkoły Jazdy Luzik do jazd doszkalających w Kielcach", caption: "Jazdy doszkalające Kielce." },
  { image: "hyundai-white", alt: "Biały Hyundai i20 z oznaczeniem nauki jazdy Szkoły Jazdy Luzik", caption: "Hyundai i20 wykorzystywany podczas nauki jazdy i przygotowania do egzaminu kat. B." },
  { image: "hyundai-dark", alt: "Ciemny Hyundai i20 do kursu prawa jazdy kat. B w Kielcach", caption: "Samochód do szkolenia kursantów kategorii B w Szkole Jazdy Luzik." },
  { image: "hyundai-black", alt: "Czarny Hyundai i20 do kursu prawa jazdy kat. B w Szkole Jazdy Luzik", caption: "Jeden z samochodów szkoleniowych Szkoły Jazdy Luzik w Kielcach." },
  { image: "hyundai-green", alt: "Zielony Hyundai i20 Szkoły Jazdy Luzik na placu w Kielcach", caption: "Hyundai i20 wykorzystywany podczas praktycznej nauki jazdy kategorii B." },
  { image: "hyundai-blue", alt: "Niebieski Hyundai i20 do nauki jazdy kategorii B w Kielcach", caption: "Samochód szkoleniowy Szkoły Jazdy Luzik przeznaczony do praktycznej nauki jazdy kat. B." },
];

export async function InstructorsPage() {
  const { header: luzikHeaderData, contact: luzikContactData } = await getLuzikSiteData();
  return <main id="main-content" className="luzik-instructors-page">
    <SubpageHero eyebrow="Szkoła Jazdy Luzik · Kielce" breadcrumb="Instruktorzy nauki jazdy"
      title={<>Instruktorzy nauki jazdy.<br /><span>Poznaj nas!</span></>}
      description="Poznaj instruktorów Szkoły Jazdy Luzik w Kielcach. Wybierz osobę, z którą chcesz rozpocząć naukę, i porozmawiaj z naszym biurem o terminach jazd."
      action={{ href: "#instruktorzy", label: "Poznaj nasz zespół" }}
      visual={<div className="luzik-team-hero-visual"><div className="luzik-team-hero-portraits">{featuredInstructors.map(person => <Link href={profileHref(person.profile)} key={person.id}><Image src={person.image} alt={person.name} fill sizes="(max-width: 767px) 45vw, 13vw" loading="eager" /><span>{person.name}</span></Link>)}</div><p>Twoja nauka. Twój instruktor.<span>Kategoria B · B automat</span></p></div>}>
      <div className="luzik-subhero-tags"><a href="#instruktorzy">Instruktorzy</a><a href="#biuro">Nasze biuro</a><a href="#samochody">Nasze samochody</a></div>
    </SubpageHero>
    <SchoolTeam detailed contactHref="#wybor-instruktora" />
    <section className="home-section luzik-instructors-office" id="biuro" aria-labelledby="office-team-title"><div className="luzik-container">
      <div className="luzik-section-topline"><div><p className="home-eyebrow">Spotkajmy się w Luziku</p><h2 className="home-title" id="office-team-title">Szkoła jazdy Luzik — biuro</h2></div><p><MapPin size={17} aria-hidden="true" />{luzikContactData.address}<br />{luzikContactData.floor}</p></div>
      <div className="luzik-office-team-grid">{luzikOfficeTeam.map(person => <article key={person.id}><div className="luzik-office-portrait"><Image src={person.image} alt={`${person.name} — ${person.role.toLowerCase()}, Szkoła Jazdy Luzik`} fill sizes="(max-width: 767px) 100vw, 25vw" /></div><div><p className="home-eyebrow">Szkoła Jazdy Luzik</p><h3>{person.name}</h3><p>{person.role}</p><a href={profileHref(person.profile)} className="home-text-link">Poznaj bliżej<ArrowRight size={17} aria-hidden="true" /><span className="sr-only">: {person.name}</span></a></div></article>)}</div>
    </div></section>
    <section className="home-section luzik-instructors-fleet" id="samochody" aria-labelledby="instructors-fleet-title"><div className="luzik-container">
      <div className="luzik-section-topline"><div><p className="home-eyebrow">Za kierownicą z Luzikiem</p><h2 className="home-title" id="instructors-fleet-title">Nasze samochody</h2></div><Link href="/kursy-prawa-jazdy" className="home-text-link">Poznaj ofertę kursów<ArrowRight size={18} aria-hidden="true" /></Link></div>
      <div className="luzik-instructors-car-grid">{cars.map(car => <figure key={car.image}><a href={`/luzik/courses/${car.image}.webp`} target="_blank" rel="noreferrer" aria-label={`Zobacz pełne zdjęcie: ${car.alt}`}><Image src={`/luzik/courses/${car.image}.webp`} alt={car.alt} width={768} height={512} sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw" /></a><figcaption>{car.caption}</figcaption></figure>)}</div>
      <div className="luzik-instructors-course-links"><Link href="/kursy-prawa-jazdy-kategorii-b">Hyundai i20 · kurs B<ArrowRight size={18} aria-hidden="true" /></Link><Link href="/kursy-prawa-jazdy-kategorii-b-automat">Toyota Yaris · kurs B automat<ArrowRight size={18} aria-hidden="true" /></Link><Link href="/jazdy-doszkalajace">Jazdy doszkalające<ArrowRight size={18} aria-hidden="true" /></Link></div>
    </div></section>
    <section className="home-section luzik-detail-registration" id="wybor-instruktora" aria-labelledby="instructor-contact-title"><div className="luzik-container luzik-registration-layout"><div><p className="home-eyebrow">Zacznijmy od rozmowy</p><h2 className="home-title" id="instructor-contact-title">Z kim chcesz<br />rozpocząć naukę?</h2><p className="luzik-prose">Napisz, którego instruktora chcesz wybrać, i podaj interesującą Cię kategorię. Biuro pomoże sprawdzić dostępne terminy i ustalić szczegóły szkolenia.</p><a href={luzikHeaderData.phoneHref} className="luzik-registration-phone"><Phone size={23} aria-hidden="true" /><span><small>Zadzwoń do biura</small>{luzikHeaderData.phoneLabel}</span></a></div><CourseContactForm subject="Wybór instruktora nauki jazdy" /></div></section>
  </main>;
}
