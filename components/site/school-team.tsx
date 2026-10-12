import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { luzikTeam, featuredInstructors, profileHref } from "@/lib/luzik-team";

export function SchoolTeam({ contactHref = "/kontakt", detailed = false }: { contactHref?: string; detailed?: boolean } = {}) {
  const people = detailed ? [...featuredInstructors, ...luzikTeam.filter(person => !featuredInstructors.some(featured => featured.id === person.id))] : featuredInstructors;
  return (
    <section id="instruktorzy" className={`home-section luzik-school-team ${detailed ? "luzik-team-detailed" : ""}`} aria-labelledby="school-team-title">
      <div className="luzik-container">
        <div className="luzik-section-topline">
          <div><p className="home-eyebrow">Ludzie, którzy Cię wspierają</p><h2 id="school-team-title" className="home-title">Poznaj nasz zespół</h2></div>
          <p>Możliwość wyboru instruktora.<br />Spokojna nauka w Twoim tempie.</p>
        </div>
        <div className="luzik-team-grid">
          {people.map((person) => (
            <article key={person.name} id={person.id}>
              <Link href={profileHref(person.profile)} aria-label={`Poznaj instruktora: ${person.name}`} className="luzik-team-avatar">
                <Image src={person.image} alt={`${person.name} — instruktor nauki jazdy kategorii ${person.category} w Luziku`} fill sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 25vw" />
              </Link>
              <div className="luzik-team-info"><h3><Link href={profileHref(person.profile)} className="text-inherit no-underline hover:text-[#0075b2]">{person.name}</Link></h3><p>{person.role} · kat. {person.category}</p><Link className="home-text-link" href={profileHref(person.profile)}>Profil instruktora<ArrowRight size={17} aria-hidden="true" /><span className="sr-only">: {person.name}</span></Link></div>
            </article>
          ))}
        </div>
        <Link href={contactHref} className="home-text-link">Porozmawiaj z nami o wyborze instruktora<ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
