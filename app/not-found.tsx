import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="home-section"><div className="luzik-container">
      <p className="home-eyebrow">404 · Zmieniamy kierunek</p><h1 className="home-title">Tej strony nie znaleźliśmy</h1>
      <p className="home-copy">Sprawdź adres lub wróć na stronę główną. Jeśli szukasz kursu, poznaj naszą ofertę.</p>
      <div className="luzik-recovery-actions"><Link href="/" className="home-button">Wróć na stronę główną</Link><Link href="/kursy-prawa-jazdy" className="home-text-link">Zobacz kursy prawa jazdy</Link></div>
    </div></main>
  );
}
