import Image from "@/components/site/static-image";
import { ArrowUpRight, Award } from "@/components/site/icons";

const rankings = [
  { image: "/luzik/rankings/super-prawo-jazdy.webp", label: "Super Prawo Jazdy", href: "https://www.superprawojazdy.pl/szkola-jazdy-luzik,20823.htm" },
  { image: "/luzik/rankings/prawo-jazdy-360.webp", label: "Prawo Jazdy 360", href: "https://www.prawo-jazdy-360.pl/ranking-szkol-jazdy/szkola-jazdy-luzik/kielce" },
];

export function HomeRankings() {
  return (
    <section className="home-rankings-section" aria-labelledby="home-rankings-title">
      <div className="luzik-container">
        <div className="home-rankings-panel">
          <div>
            <span className="home-icon"><Award size={27} aria-hidden="true" /></span>
            <p className="home-eyebrow mt-6">Zaufanie kursantów</p>
            <h2 id="home-rankings-title" className="home-title">Dobra szkoła.<br />Dobre opinie.</h2>
            <p className="home-copy">Naszą pracę oceniają kursanci. Zobacz wyróżnienia i sprawdź ich doświadczenia na niezależnych portalach.</p>
          </div>
          <div className="home-ranking-cards">
            {rankings.map((ranking) => <a key={ranking.label} href={ranking.href} target="_blank" rel="noreferrer" className="home-ranking-card"><Image src={ranking.image} alt={`Wyróżnienie Szkoły Jazdy Luzik — ${ranking.label}`} width={650} height={420} sizes="(max-width: 767px) 90vw, 25vw" /><span>{ranking.label}<ArrowUpRight size={20} aria-hidden="true" /></span></a>)}
          </div>
        </div>
      </div>
    </section>
  );
}

