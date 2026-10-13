import Image from "@/components/site/static-image";
import { Award, CarFront, HeartHandshake, MapPin, ShieldCheck, UserRoundCheck, WalletCards } from "@/components/site/icons";

import { SchoolTeam } from "./school-team";
import { SubpageCta, SubpageHero } from "./subpage-hero";

const benefits = [
  { icon: UserRoundCheck, title: "Możliwość wyboru instruktora", text: "Możliwość wyboru instruktora np. tylko kobieta." },
  { icon: ShieldCheck, title: "Jasne zasady", text: "Brak ukrytych kosztów." },
  { icon: CarFront, title: "Hyundai i20", text: "Nasza flota to obecny standard na egzaminie — Hyundai i20." },
  { icon: HeartHandshake, title: "Wiemy, jak przygotować Cię do egzaminu", text: "Doskonale znamy wymagania egzaminatorów." },
  { icon: MapPin, title: "Plac manewrowy blisko WORD-u", text: "Posiadamy plac manewrowy blisko WORD-u." },
  { icon: WalletCards, title: "Płatność w ratach", text: "Możliwość zapłaty za kurs w dowolnych ratach." },
];
const awards = [
  { year: "2013", text: "1 miejsce w rankingu zdawalności w województwie świętokrzyskim" },
  { year: "2014", text: "1 miejsce w rankingu zdawalności w Kielcach" },
  { year: "2015", text: "1 miejsce w rankingu zdawalności w pierwszym półroczu w Kielcach" },
];
// Values from the live original about page, including its completed counters.
const statistics = [
  { value: "10 000+", label: "Zadowolonych klientów" },
  { value: "15", label: "Lat istnienia szkoły" },
  { value: "13", label: "Doświadczonych instruktorów" },
  { value: "7", label: "Kategorii kursów" },
  { value: "4 237", label: "Opinii" },
];

export function AboutPage() {
  return (
    <main id="main-content">
      <SubpageHero
        eyebrow="O nas · Szkoła Jazdy Luzik"
        title={<>Dobra jazda zaczyna się<br /><span>od dobrego zespołu.</span></>}
        description="Szkoła jazdy Luzik Kielce. Uczymy jeździć zgodnie z przepisami i skutecznie przygotowujemy do egzaminu w WORD Kielce. Bezpiecznie, profesjonalnie i na luzie."
        breadcrumb="O nas"
        image="/luzik/courses/intro.webp"
        imageAlt="Arkadiusz, Mariola i Kacper Jaros — zespół Szkoły Jazdy Luzik"
        imageLabel="Szkoła Jazdy Luzik · Kielce"
        action={{ href: "#co-nas-wyroznia", label: "Poznaj naszą szkołę" }}
      >
        <div className="luzik-subhero-tags"><span>Doświadczenie</span><span>Indywidualne podejście</span><span>Na luzie</span></div>
      </SubpageHero>

      <section id="co-nas-wyroznia" className="home-section" aria-labelledby="about-benefits-title">
        <div className="luzik-container">
          <div className="luzik-section-topline"><div><p className="home-eyebrow">Nasze zalety</p><h2 id="about-benefits-title" className="home-title">Co nas wyróżnia?</h2></div><p>Dobre warunki do nauki.<br />Wsparcie na każdym etapie kursu.</p></div>
          <div className="luzik-about-benefits">{benefits.map(({icon: Icon, title, text}, index) => <article key={title}><div className="luzik-about-benefit-top"><Icon size={28} aria-hidden="true" /><span aria-hidden="true">0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section className="home-section luzik-awards-section" aria-labelledby="about-awards-title">
        <div className="luzik-container luzik-awards-layout">
          <div><p className="home-eyebrow">Lata pracy. Realne wyróżnienia.</p><h2 id="about-awards-title" className="home-title">Nasze nagrody</h2><ol className="luzik-award-timeline">{awards.map((award) => <li key={award.year}><span>{award.year}</span><div><Award size={22} aria-hidden="true" /><p>{award.text}</p></div></li>)}</ol></div>
          <div className="luzik-award-images"><figure><Image src="/luzik/about/award-1.webp" width={350} height={332} sizes="(max-width: 767px) 40vw, 220px" alt="Orły Nauki Jazdy — pierwsze miejsce w Kielcach, 2019" /><figcaption>Orły Nauki Jazdy · 1 miejsce · 2019</figcaption></figure><figure><Image src="/luzik/about/award-2.webp" width={451} height={607} sizes="(max-width: 767px) 40vw, 220px" alt="Orły Nauki Jazdy — laureat i wyróżnienie Gold, ocena 10 na 10, 2019" /><figcaption>Laureat konkursu · Gold · 2019</figcaption></figure></div>
        </div>
      </section>

      <section className="luzik-about-statistics" aria-label="Szkoła Jazdy Luzik w liczbach"><div className="luzik-container">{statistics.map((statistic) => <div key={statistic.label}><strong>{statistic.value}</strong><span>{statistic.label}</span></div>)}</div></section>
      <SchoolTeam />
      <SubpageCta />
    </main>
  );
}
