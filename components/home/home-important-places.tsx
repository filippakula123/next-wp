import { ArrowUpRight, MapPin, Navigation } from "@/components/site/icons";
import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import { luzikContactData } from "@/lib/luzik-contact";

// The same custom Google My Maps map used on luzikkielce.pl.
const mapId = "1gexRK7vA_JN47f3c_whk4WH7Z3OkT34";
const mapUrl = `https://www.google.com/maps/d/viewer?mid=${mapId}&ll=50.87%2C20.63&z=9`;

export async function HomeImportantPlaces() {
  const { contact } = await getLuzikSiteData();
  return (
    <section className="home-section" aria-labelledby="important-places-title">
      <div className="luzik-container">
        <div className="home-section-heading">
          <p className="home-eyebrow">Kielce i okolice</p>
          <h2 id="important-places-title" className="home-title">Wszystkie ważne miejsca.<br />Jedna mapa.</h2>
          <p className="home-copy">Biuro, miejsca ważne podczas kursu i pobliskie gminy. Sprawdź mapę i zaplanuj swój dojazd.</p>
        </div>
        <div className="home-places-layout">
          <aside className="home-places-info">
            <span className="home-icon"><MapPin size={25} aria-hidden="true" /></span>
            <h3>Zacznij w centrum Kielc</h3>
            <p>{contact.address === luzikContactData.address && contact.floor === luzikContactData.floor ? "Nasze biuro znajdziesz przy ul. Warszawskiej 4, na pierwszym piętrze." : `Nasze biuro: ${contact.address}, ${contact.floor}.`} Tutaj porozmawiamy o kursie i pomożemy Ci zacząć.</p>
            <a className="home-text-link" href={contact.mapHref} target="_blank" rel="noreferrer">Wyznacz dojazd do biura <Navigation size={17} aria-hidden="true" /></a>
            <div className="home-places-note"><strong>Przyjeżdżasz spoza Kielc?</strong><p>Przybliż mapę, sprawdź swoją okolicę i zobacz oznaczone miejsca.</p></div>
            <a className="home-text-link" href={mapUrl} target="_blank" rel="noreferrer">Otwórz pełną mapę <ArrowUpRight size={18} aria-hidden="true" /></a>
          </aside>
          <div className="home-map-panel">
            <iframe src={`https://www.google.com/maps/d/embed?mid=${mapId}&ehbc=2E312F&noprof=1&ll=50.87%2C20.63&z=9`} title="Mapa Luzik: ważne miejsca dla kursanta, Kielce i pobliskie gminy" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            <div className="home-map-caption"><span><MapPin size={16} aria-hidden="true" /> Mapa miejsc dla kursanta</span><a href={mapUrl} target="_blank" rel="noreferrer">Powiększ mapę <ArrowUpRight size={16} aria-hidden="true" /></a></div>
          </div>
        </div>
      </div>
    </section>
  );
}

