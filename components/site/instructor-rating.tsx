"use client";
import { useId, useState } from 'react';
import { Star } from 'lucide-react';
import type { InstructorRating } from '@/lib/luzik-instructor-ratings';
export function InstructorRatingWidget({ slug, name, initial, connected, voting }: { slug: string; name: string; initial: InstructorRating; connected: boolean; voting: boolean }) {
  const title = useId();
  const [totals, setTotals] = useState(initial);
  const [hover, setHover] = useState(0);
  const [busy, setBusy] = useState(false);
  const [voted, setVoted] = useState(false);
  const [message, setMessage] = useState('');
  async function vote(rating: number) {
    if (busy || voted || !voting) return;
    setBusy(true); setMessage('Zapisujemy Twoją ocenę…');
    try {
      const response = await fetch('/api/instructor-ratings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, rating }) });
      const result = await response.json();
      if (!response.ok) { if (response.status === 409) setVoted(true); throw new Error(result.error || 'Nie udało się zapisać oceny.'); }
      setTotals(result); setVoted(true); setMessage('Dziękujemy za ocenę!');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Nie udało się zapisać oceny. Spróbuj ponownie.'); }
    finally { setBusy(false); setHover(0); }
  }
  return <section className="luzik-instructor-rating" aria-labelledby={title}>
    <h2 id={title}>Oceń instruktora</h2>
    <p>{voting ? 'Kliknij gwiazdkę, aby wystawić ocenę.' : 'Oceny kursantów szkoły Luzik.'}</p>
    <div className="luzik-rating-stars" role="group" aria-label={`Oceń instruktora: ${name}`} onMouseLeave={() => setHover(0)}>
      {[1,2,3,4,5].map(value => <button key={value} type="button" disabled={!voting || busy || voted} aria-label={`Wystaw ocenę ${value} z 5`} onMouseEnter={() => setHover(value)} onFocus={() => setHover(value)} onBlur={() => setHover(0)} onClick={() => void vote(value)} data-filled={value <= (hover || Math.round(totals.average))}><Star size={30} aria-hidden="true" /></button>)}
    </div>
    <p translate="no">{totals.count ? <>Średnia ocena: <strong>{totals.average.toLocaleString('pl-PL')} / 5</strong> · Liczba ocen: <strong>{totals.count}</strong></> : 'Brak ocen. Bądź pierwszy!'}</p>
    {!connected && <p className="luzik-rating-note">Dane z kopii starej strony z 6.10.2026. Dodawanie ocen będzie dostępne po podłączeniu systemu.</p>}
    {connected && !voting && <p className="luzik-rating-note">Dodawanie ocen będzie dostępne po zakończeniu konfiguracji.</p>}
    <p className="luzik-rating-message" role="status" aria-live="polite">{message}</p>
  </section>;
}
