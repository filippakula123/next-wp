import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, CreditCard, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { luzikTeam } from "@/lib/luzik-team";
import { SubpageHero } from "./subpage-hero";
import { CourseContactForm } from "./course-contact-form";
import { CopyAccountButton } from "./copy-account-button";

const contactInstructors = [luzikTeam[0], luzikTeam[1], luzikTeam[5]];

export async function ContactPage() {
  const { header: luzikHeaderData, contact: luzikContactData } = await getLuzikSiteData();
  return <main id="main-content" className="luzik-contact-page">
    <SubpageHero eyebrow="Szkoła Jazdy Luzik · Kielce" breadcrumb="Kontakt"
      title={<>Kontakt.<br /><span>Porozmawiajmy o Twoim kursie.</span></>}
      description="Chcesz zapisać się na kurs, ustalić jazdy lub porozmawiać o wyborze instruktora? Zadzwoń, napisz albo odwiedź nasze biuro."
      action={{ href: "#wiadomosc", label: "Napisz do nas" }}
      visual={<div className="luzik-contact-hero-card"><span className="luzik-contact-hero-pin"><MapPin size={38} strokeWidth={1.7} aria-hidden="true" /></span><p>Tutaj jesteśmy</p><strong>{luzikContactData.address}</strong><span>{luzikContactData.floor} · {luzikContactData.hours}</span><a href={luzikContactData.mapHref} target="_blank" rel="noreferrer">Zobacz gdzie jesteśmy<ArrowRight size={18} aria-hidden="true" /></a></div>}>
      <div className="luzik-subhero-tags"><a href="#dane-kontaktowe">Dane kontaktowe</a><a href="#mapa">Mapa dojazdu</a><a href="#platnosci">Numer rachunku</a></div>
    </SubpageHero>
    <section className="home-section luzik-contact-details" id="dane-kontaktowe" aria-labelledby="contact-details-title"><div className="luzik-container">
      <div className="luzik-section-topline"><div><p className="home-eyebrow">Wybierz wygodny kontakt</p><h2 className="home-title" id="contact-details-title">Jesteśmy do Twojej dyspozycji</h2></div><p>Szkoła Jazdy Luzik<br />{luzikContactData.address}</p></div>
      <div className="luzik-contact-details-grid">
        <article><span className="home-icon"><MapPin size={25} aria-hidden="true" /></span><h3>Tutaj jesteśmy</h3><p>{luzikContactData.address}<br />{luzikContactData.floor}</p><a href={luzikContactData.mapHref} target="_blank" rel="noreferrer" className="home-text-link">Wyznacz trasę<ArrowRight size={17} aria-hidden="true" /></a></article>
        <article><span className="home-icon"><Phone size={25} aria-hidden="true" /></span><h3>Kontakt</h3><p><a href={luzikHeaderData.phoneHref}>{luzikHeaderData.phoneLabel}</a><br /><a href={`mailto:${luzikHeaderData.email}`}>{luzikHeaderData.email}</a></p><div className="luzik-contact-socials"><a href={luzikHeaderData.facebookHref} target="_blank" rel="noreferrer" aria-label="Luzik na Facebooku"><Facebook size={18} aria-hidden="true" /></a><a href={luzikHeaderData.instagramHref} target="_blank" rel="noreferrer" aria-label="Luzik na Instagramie"><Instagram size={18} aria-hidden="true" /></a></div></article>
        <article><span className="home-icon"><Clock3 size={25} aria-hidden="true" /></span><h3>Godziny otwarcia</h3><p>{luzikContactData.hours}</p><span className="luzik-contact-card-note">Godziny pracy biura</span></article>
        <article id="platnosci"><span className="home-icon"><CreditCard size={25} aria-hidden="true" /></span><h3>Numer rachunku do wpłat</h3><p className="luzik-account-number">{luzikContactData.account}</p><span className="luzik-contact-card-note">{luzikContactData.bank}</span><CopyAccountButton /></article>
      </div>
    </div></section>
    <section className="home-section luzik-contact-message" id="wiadomosc" aria-labelledby="contact-message-title"><div className="luzik-container luzik-registration-layout"><div><p className="home-eyebrow">Zacznijmy od rozmowy</p><h2 className="home-title" id="contact-message-title">Napisz do nas</h2><p className="luzik-prose">Zapytaj o kurs, dostępne terminy lub jazdy doszkalające. Jeśli masz już wybranego instruktora, podaj jego imię i nazwisko w wiadomości.</p><a href={luzikHeaderData.phoneHref} className="luzik-registration-phone"><Phone size={23} aria-hidden="true" /><span><small>Zadzwoń do biura</small>{luzikHeaderData.phoneLabel}</span></a><a className="luzik-contact-email" href={`mailto:${luzikHeaderData.email}`}><Mail size={19} aria-hidden="true" />{luzikHeaderData.email}</a><div className="luzik-contact-message-note"><Clock3 size={22} aria-hidden="true" /><p>{luzikContactData.hours}<br /><span>Zapraszamy do biura: {luzikContactData.address} · {luzikContactData.floor}.</span></p></div></div><CourseContactForm subject="Kontakt ze Szkołą Jazdy Luzik" mode="contact" /></div></section>
    <section className="home-section luzik-contact-map-section" id="mapa" aria-labelledby="contact-map-title"><div className="luzik-container"><div className="luzik-section-topline"><div><p className="home-eyebrow">Do zobaczenia w Luziku</p><h2 className="home-title" id="contact-map-title">Zobacz gdzie jesteśmy</h2></div><a href={luzikContactData.mapHref} target="_blank" rel="noreferrer" className="home-text-link">Otwórz w Google Maps<ArrowRight size={18} aria-hidden="true" /></a></div><div className="luzik-contact-map"><iframe src={luzikContactData.mapEmbedSrc} title={`Mapa dojazdu do Szkoły Jazdy Luzik — ${luzikContactData.address}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><div><MapPin size={20} aria-hidden="true" /><p><strong>Szkoła Jazdy Luzik</strong><span>{luzikContactData.address} · {luzikContactData.floor}</span></p></div></div></div></section>
    <section className="home-section luzik-contact-team" aria-labelledby="contact-team-title"><div className="luzik-container"><div className="luzik-section-topline"><div><p className="home-eyebrow">Ludzie, których warto poznać</p><h2 className="home-title" id="contact-team-title">Szkoła jazdy Luzik — nasi instruktorzy</h2></div><Link href="/szkola-jazdy-luzik-instruktorzy" className="home-text-link">Poznaj cały zespół<ArrowRight size={18} aria-hidden="true" /></Link></div><div className="luzik-contact-team-grid">{contactInstructors.map(person => <Link href={`/szkola-jazdy-luzik-instruktorzy#${person.id}`} key={person.id}><div><Image src={person.image} alt={person.name} fill sizes="(max-width: 767px) 100vw, 33vw" /></div><span>{person.role} · kat. {person.category}</span><h3>{person.name}<ArrowRight size={20} aria-hidden="true" /></h3></Link>)}</div></div></section>
  </main>;
}
