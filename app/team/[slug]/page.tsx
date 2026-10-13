import Image from "@/components/site/static-image";
import Link from "@/components/site/site-link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Phone } from "@/components/site/icons";
import profiles from "@/lib/luzik-profiles.json";
import { luzikTeam, luzikOfficeTeam, profileHref } from "@/lib/luzik-team";
import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import { publicUrl } from "@/lib/luzik-seo";
import { getLuzikMetadata } from "@/lib/luzik-seo-server";
import { JsonLd } from "@/components/site/json-ld";
import { InstructorRatingWidget } from "@/components/site/instructor-rating";
import { getInstructorRating } from "@/lib/luzik-instructor-ratings-server";

type Props = { params: Promise<{ slug: string }> };
const personFor = (slug: string) => [...luzikTeam, ...luzikOfficeTeam].find(person => person.profile === slug);
export function generateStaticParams() { return profiles.map(profile => ({ slug: profile.slug })); }
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const profile = profiles.find(profile => profile.slug === slug), person = personFor(slug);
  return profile && person ? getLuzikMetadata(profile.title, profile.paragraphs.join(" ").slice(0, 160), profileHref(slug), person.image) : {};
}
export default async function InstructorProfile({ params }: Props) {
  const { slug } = await params;
  const profile = profiles.find(profile => profile.slug === slug), person = personFor(slug);
  if (!profile || !person) notFound();
  const { header } = await getLuzikSiteData();
  const { rating, connected, voting } = await getInstructorRating(slug);
  const url = publicUrl(profileHref(slug));
  return <main id="main-content" className="luzik-profile">
    <JsonLd data={{ "@context": "https://schema.org", "@graph": [
      { "@type": "ProfilePage", "@id": `${url}#webpage`, url, name: profile.title, inLanguage: "pl-PL", mainEntity: { "@id": `${url}#person` }, isPartOf: { "@id": publicUrl("/#website") } },
      { "@type": "Person", "@id": `${url}#person`, name: person.name, jobTitle: slug === "mariola-jaros" ? "Obsługa biura i zapisy na kursy" : person.role, image: publicUrl(person.image), description: profile.paragraphs.join(" "), worksFor: { "@id": publicUrl("/#school") }, url },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Strona główna", item: publicUrl("/") }, { "@type": "ListItem", position: 2, name: "Instruktorzy", item: publicUrl("/szkola-jazdy-luzik-instruktorzy") }, { "@type": "ListItem", position: 3, name: person.name, item: url }] },
    ] }} />
    <section className="luzik-profile-hero"><div className="luzik-container">
      <nav aria-label="Okruszki" className="luzik-profile-breadcrumb"><Link href="/">Strona główna</Link><span>/</span><Link href="/szkola-jazdy-luzik-instruktorzy">Instruktorzy</Link><span>/</span><span aria-current="page">{person.name}</span></nav>
      <div className="luzik-profile-grid"><div className="luzik-profile-photo"><Image src={person.image} alt={person.name} fill sizes="(max-width: 767px) 90vw, 38vw" priority /></div>
        <div className="luzik-profile-copy"><p className="home-eyebrow">Poznaj nas bliżej</p><h1>{person.name}</h1><p className="luzik-profile-role">{slug === "mariola-jaros" ? "Biuro · zapisy na kursy" : `${person.role}${"category" in person ? ` · kategoria ${person.category}` : ""}`}</p>
          {profile.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {!!profile.skills.length && <><h2>Umiejętności</h2><ul>{profile.skills.map(skill => <li key={skill}><Check size={18} aria-hidden="true" />{skill}</li>)}</ul></>}
          <InstructorRatingWidget key={slug} slug={slug} name={person.name} initial={rating} connected={connected} voting={voting} />
          <div className="luzik-profile-actions"><Link href="/kontakt" className="home-button">Porozmawiaj o swoim kursie<ArrowRight size={18} aria-hidden="true" /></Link><a href={header.phoneHref}><Phone size={18} aria-hidden="true" />{header.phoneLabel}</a></div>
        </div></div>
    </div></section>
    <section className="home-section"><div className="luzik-container"><p className="home-eyebrow">Zespół Luzika</p><h2 className="home-title">Poznaj pozostałych instruktorów</h2><div className="luzik-profile-others">{luzikTeam.filter(other => other.profile !== slug).map(other => <Link key={other.id} href={profileHref(other.profile)}><Image src={other.image} alt={other.name} width={280} height={330} sizes="(max-width: 600px) 85vw, 25vw" /><h3>{other.name}</h3><span>Kategoria {other.category}<ArrowRight size={18} aria-hidden="true" /></span></Link>)}</div></div></section>
  </main>;
}
