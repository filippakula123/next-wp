import { SubpageHero, SubpageCta } from "./subpage-hero";
import { GalleryGrid } from "./gallery-grid";

export function GalleryPage() {
  return <main id="main-content" className="luzik-gallery-page">
    <SubpageHero eyebrow="Szkoła Jazdy Luzik · Kielce" breadcrumb="Galeria"
      title={<>Galeria.<br /><span><span translate="no">Luzik{"\u00a0"}</span>w obiektywie.</span></>}
      description="Poznaj nasz zespół, samochody szkoleniowe i motocykle. Zobacz też chwile, które cieszą nas najbardziej — uśmiechy naszych kursantów."
      image="/luzik/gallery/photo-01.webp" imageAlt="Instruktorzy Szkoły Jazdy Luzik przy samochodzie szkoleniowym na rynku w Kielcach"
      imageLabel="Instruktorzy nauki jazdy — Szkoła jazdy Luzik"
      action={{ href: "#zdjecia", label: "Zobacz zdjęcia" }} />
    <section className="home-section luzik-gallery-section" id="zdjecia" aria-labelledby="gallery-title">
      <div className="luzik-container">
        <div className="luzik-section-topline"><div><p className="home-eyebrow">Z życia naszej szkoły</p><h2 className="home-title" id="gallery-title">Szkoła, ludzie i dobra jazda.</h2></div><p>Kliknij zdjęcie, żeby je powiększyć.</p></div>
        <GalleryGrid />
      </div>
    </section>
    <SubpageCta />
  </main>;
}
