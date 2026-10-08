"use client";
import { useLuzikSettings } from "@/components/site/luzik-settings-provider";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export function CourseContactForm({ subject, mode = "course" }: { subject: string; mode?: "course" | "contact" }) {
  const { header: luzikHeaderData } = useLuzikSettings();
  const contact = mode === "contact";
  const [draftReady, setDraftReady] = useState(false);
  function prepareMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = contact ? `${data.get("firstName")} ${data.get("lastName")}` : data.get("name");
    const body = `${data.get("message")}\n\nImię i nazwisko: ${name}\nAdres e-mail: ${data.get("email")}\nTelefon: ${data.get("phone") || "Nie podano"}`;
    window.location.href = `mailto:${luzikHeaderData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setDraftReady(true);
  }
  return (
    <form className="luzik-contact-form" aria-label={contact ? "Formularz kontaktowy" : "Zapytanie o kurs"} onSubmit={prepareMessage}>
      <p className="luzik-form-heading"><Mail size={20} aria-hidden="true" />Napisz do nas</p>
      {contact ? <fieldset className="luzik-form-name-group"><legend>Imię i nazwisko</legend><div className="luzik-form-row"><label>Imię<input name="firstName" autoComplete="given-name" required maxLength={60} /></label><label>Nazwisko<input name="lastName" autoComplete="family-name" required maxLength={60} /></label></div></fieldset> : <label>Imię i nazwisko<input name="name" autoComplete="name" required maxLength={120} /></label>}
      <div className="luzik-form-row">
        <label>Adres e-mail<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        <label>{contact ? "Telefon" : "Telefon (opcjonalnie)"}<input name="phone" type="tel" autoComplete="tel" required={contact} maxLength={30} /></label>
      </div>
      <label>Treść wiadomości<textarea name="message" required rows={5} maxLength={4000} defaultValue={contact ? "" : `Dzień dobry,\n\nProszę o informacje dotyczące oferty: ${subject.toLowerCase()}. Interesują mnie dostępne terminy.`} placeholder={contact ? "Napisz, w czym możemy Ci pomóc." : undefined} /></label>
      {contact && <p className="luzik-form-note">Wszystkie pola są wymagane.</p>}
      <p className="luzik-form-note">Przygotujemy wiadomość w Twojej aplikacji pocztowej. Tam sprawdzisz jej treść i wyślesz ją do naszego biura.</p>
      <p className="luzik-form-note"><Link href="/polityka-prywatnosci">Zasady przetwarzania danych — polityka prywatności</Link></p>
      <button className="home-button" type="submit">Przygotuj wiadomość e-mail<ArrowRight size={17} aria-hidden="true" /></button>
      {draftReady && <p role="status" className="luzik-form-note">Dokończ wysyłanie w aplikacji pocztowej. Możesz też napisać bezpośrednio na <a href={`mailto:${luzikHeaderData.email}`}>{luzikHeaderData.email}</a> lub zadzwonić: <a href={luzikHeaderData.phoneHref}>{luzikHeaderData.phoneLabel}</a>.</p>}
    </form>
  );
}
