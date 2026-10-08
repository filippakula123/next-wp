"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main id="main-content" className="home-section"><div className="luzik-container">
    <p className="home-eyebrow">Spróbujmy jeszcze raz</p><h1 className="home-title">Nie udało się wczytać strony</h1>
    <p className="home-copy">Odśwież widok lub skontaktuj się z naszym biurem.</p>
    <div className="luzik-recovery-actions"><button className="home-button" onClick={reset}>Spróbuj ponownie</button><Link href="/kontakt" className="home-text-link">Kontakt z Luzikiem</Link></div>
  </div></main>;
}
