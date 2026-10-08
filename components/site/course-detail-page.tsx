import type { LuzikSiteData } from "@/lib/luzik-settings";
import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, ChevronDown, ClipboardCheck, HeartPulse, Phone, ShieldCheck } from "lucide-react";
import { courseContent, courseHref, coursePresentation, type CourseContent, type CourseId, type SourceBlock, type SourceSection } from "@/lib/luzik-course-details";
import { formatLuzikPrice, luzikCourses } from "@/lib/luzik-offer";
import { SubpageCta, SubpageHero } from "./subpage-hero";
import { SchoolTeam } from "./school-team";
import { CourseContactForm } from "./course-contact-form";

function resolveCopy(html: string, id?: CourseId, data?: LuzikSiteData) {
  const course = (data?.courses ?? luzikCourses).find(c => c.id === id);
  const manual = data?.lessonPrices.b ?? 140;
  const automatic = data?.lessonPrices["b-automat"] ?? 140;
  const same = manual === automatic;
  return html.replaceAll("{{lessonPrice}}", String(id ? data?.lessonPrices[id] ?? 150 : 150)).replaceAll("{{lessonManualPrice}}", String(manual)).replaceAll("{{lessonAutomaticPrice}}", String(automatic)).replaceAll("{{lessonBothPrices}}", same ? `${manual} zł` : `${manual} zł (manual) i ${automatic} zł (automat)`).replaceAll("{{lessonEqualityLong}}", same ? "Taka sama cena obowiązuje zarówno przy jazdach samochodem z manualną skrzynią biegów, jak i podczas jazd na samochodzie z automatem." : `Godzina jazdy na automacie kosztuje ${automatic} zł.`).replaceAll("{{lessonEqualityShort}}", same ? "Taka sama cena obowiązuje przy jazdach samochodem z manualną oraz automatyczną skrzynią biegów." : `Godzina jazdy na automacie kosztuje ${automatic} zł.`).replaceAll("{{coursePrice}}", course ? formatLuzikPrice(course.price) : "").replaceAll("{{practice}}", String(course?.practice ?? "")).replaceAll('href="/kontakt"', 'href="#zapisy"');
}

async function SourceBlocks({ blocks, id }: { blocks: SourceBlock[]; id?: CourseId }) {
  const data = await getLuzikSiteData();
  const groups: { list: boolean; blocks: SourceBlock[] }[] = [];
  for (const block of blocks) {
    if (block.tag === "li" && groups.at(-1)?.list) groups.at(-1)!.blocks.push(block);
    else groups.push({ list: block.tag === "li", blocks: [block] });
  }
  return <div className="luzik-prose">{groups.map((group, index) => group.list
    ? <ul key={index}>{group.blocks.map((b, i) => <li key={i} dangerouslySetInnerHTML={{ __html: resolveCopy(b.html, id, data) }} />)}</ul>
    : group.blocks.map((b, i) => b.tag.startsWith("h")
      ? <h3 key={`${index}-${i}`} dangerouslySetInnerHTML={{ __html: resolveCopy(b.html, id, data) }} />
      : <p key={`${index}-${i}`} dangerouslySetInnerHTML={{ __html: resolveCopy(b.html, id, data) }} />))}</div>;
}

function Intro({ content, id }: { content: CourseContent; id?: CourseId }) {
  const icons = [BookOpen, ShieldCheck, ClipboardCheck, HeartPulse];
  return <section className="home-section" id="zakres-kursu" aria-labelledby="detail-intro-title"><div className="luzik-container">
    <div className="luzik-editorial-intro"><div><p className="home-eyebrow">Wszystko, czego potrzebujesz</p><h2 className="home-title" id="detail-intro-title">{content.intro.title}</h2></div><SourceBlocks blocks={content.intro.blocks} id={id} /></div>
    {!!content.benefits.length && <div className="luzik-course-benefits">{content.benefits.map((benefit, i) => { const Icon = icons[i]; return <article key={benefit.title}><Icon size={27} aria-hidden="true" /><h3>{benefit.title}</h3><p>{benefit.text}</p></article>; })}</div>}
  </div></section>;
}

function Chapters({ sections, id }: { sections: SourceSection[]; id?: CourseId }) {
  return <div className="luzik-course-chapters"><div className="luzik-container">{sections.map((section, i) => <section key={section.title} className="luzik-course-chapter" aria-labelledby={`chapter-${i}`}><div><p className="home-eyebrow">{String(i + 1).padStart(2, "0")} · Warto wiedzieć</p><h2 id={`chapter-${i}`}>{section.title}</h2></div><SourceBlocks blocks={section.blocks} id={id} /></section>)}</div></div>;
}

async function Faq({ content, id }: { content: CourseContent; id?: CourseId }) {
  const data = await getLuzikSiteData();
  const { header: luzikHeaderData } = data;
  if (!content.faqs.length) return null;
  return <section id="pytania" className="home-section luzik-detail-faq" aria-labelledby="detail-faq-title"><div className="luzik-container luzik-faq-layout"><div><p className="home-eyebrow">Pytania? Wyjaśniamy.</p><h2 className="home-title" id="detail-faq-title">Najczęściej<br />zadawane pytania</h2><p>Sprawdź odpowiedzi lub porozmawiaj z naszym biurem.</p><a className="home-text-link" href={luzikHeaderData.phoneHref}><Phone size={17} aria-hidden="true" />{luzikHeaderData.phoneLabel}</a></div><div className="luzik-faq-list">{content.faqs.map(faq => <details key={faq.question} name="course-faq"><summary>{faq.question}<ChevronDown size={19} aria-hidden="true" /></summary><div className="luzik-prose" dangerouslySetInnerHTML={{ __html: resolveCopy(faq.answer, id, data) }} /></details>)}</div></div></section>;
}

async function Registration({ content, subject }: { content: CourseContent; subject: string }) {
  const { header: luzikHeaderData } = await getLuzikSiteData();
  return <section className="home-section luzik-detail-registration" id="zapisy" aria-labelledby="registration-title"><div className="luzik-container luzik-registration-layout"><div><p className="home-eyebrow">Porozmawiajmy o Twoim kursie</p><h2 className="home-title" id="registration-title">{content.registration?.title ?? "Pomożemy Ci przejść przez formalności"}</h2>{content.registration ? <SourceBlocks blocks={content.registration.blocks} /> : <p className="luzik-prose">Zadzwoń do nas lub napisz. Pomożemy znaleźć placówkę partnerską i wyjaśnimy, co przygotować przed badaniem.</p>}<a className="luzik-registration-phone" href={luzikHeaderData.phoneHref}><Phone size={23} aria-hidden="true" /><span><small>Zadzwoń do biura</small>{luzikHeaderData.phoneLabel}</span></a></div><CourseContactForm subject={subject} /></div></section>;
}

const guideLinks = {
  b: ["/profil-kandydata-na-kierowce-pkk-co-to-jest-i-jak-go-uzyskac/", courseHref("b-automat"), "/egzamin-wewnetrzny-praktyczny-i-teoretyczny-na-prawo-jazdy-jak-wyglada-i-czy-trzeba-go-zdac/"],
  lessons: ["/parkowanie-rownolegle-jak-wykonac-je-poprawnie/", "/czym-rondo-turbinowe-rozni-sie-od-zwyklego/", "/skrzyzowanie-rownorzedne-zasady-i-praktyka/", "/jak-zdac-egzamin-na-prawo-jazdy/"],
};

function Guides({ content, kind }: { content: CourseContent; kind: "b" | "lessons" }) {
  if (!content.guides) return null;
  const cards: { title: string; blocks: SourceBlock[] }[] = [];
  const intro: SourceBlock[] = [];
  for (const block of content.guides.blocks) {
    if (block.tag === "h3") cards.push({title:block.html,blocks:[]});
    else if (cards.length) cards.at(-1)!.blocks.push(block);
    else intro.push(block);
  }
  return <section className="home-section luzik-course-guides"><div className="luzik-container"><p className="home-eyebrow">Przygotuj się krok po kroku</p><h2 className="home-title">{content.guides.title}</h2><SourceBlocks blocks={intro} /><div className="luzik-guide-grid">{cards.map((card,i)=><Link href={guideLinks[kind][i]} key={card.title}><span>{String(i+1).padStart(2,"0")}</span><h3>{card.title}</h3><SourceBlocks blocks={card.blocks} /><strong>Dowiedz się więcej<ArrowRight size={18} aria-hidden="true" /></strong></Link>)}</div></div></section>;
}

async function Price({ id, content }: { id: CourseId; content: CourseContent }) {
  const { courses: luzikCourses } = await getLuzikSiteData();
  const course = luzikCourses.find(c=>c.id===id)!;
  return <section className="home-section luzik-detail-price" id="cena-kursu" aria-labelledby="detail-price-title"><div className="luzik-container luzik-detail-price-layout"><div><p className="home-eyebrow">Kompletne szkolenie</p><h2 className="home-title" id="detail-price-title">{content.price?.title ?? `Ile kosztuje kurs kategorii ${course.category}?`}</h2>{content.price ? <SourceBlocks blocks={content.price.blocks} id={id} /> : <p className="luzik-prose">Teoria, praktyczna nauka jazdy i egzamin wewnętrzny. Porównaj wszystkie kategorie w naszym cenniku.</p>}<Link className="home-text-link" href={`/cennik#cena-${id}`}>Zobacz pełny cennik<ArrowRight size={18} aria-hidden="true" /></Link></div><article className="luzik-price-card luzik-detail-price-card"><p className="luzik-price-card-label">{course.name}</p><p className="luzik-course-price"><strong>{formatLuzikPrice(course.price)}</strong><span>zł / kurs</span></p><ul>{[`${course.theory} godzin teorii`,`${course.practice} godzin praktyki`,"Egzamin wewnętrzny w cenie","Ustalenie terminu egzaminu państwowego","Kurs trwa około 4 tygodni"].map(text=><li key={text}><Check size={18} aria-hidden="true" />{text}</li>)}</ul><Link href="#zapisy" className="home-button">Zapisz się na kurs<ArrowRight size={17} aria-hidden="true" /></Link><p className="luzik-price-footnote">Badanie lekarskie i egzamin państwowy są płatne osobno.</p></article></div></section>;
}

const fleetImages = ["hyundai-grey", "hyundai-green", "hyundai-dark", "hyundai-white", "yaris", "hyundai-blue", "hyundai-silver", "hyundai-black"];
function Fleet({ id, content }: { id: CourseId; content: CourseContent }) {
  if (!content.fleet) return null;
  const images = id === "b" ? fleetImages : ["yaris"];
  return <section className="home-section" aria-labelledby="fleet-title"><div className="luzik-container"><p className="home-eyebrow">Poznaj samochody Luzika</p><h2 className="home-title" id="fleet-title">{content.fleet.title}</h2><SourceBlocks blocks={content.fleet.blocks} id={id} /><div className={`luzik-fleet-grid ${images.length===1 ? "luzik-fleet-single" : ""}`}>{images.map((image,i)=><a key={image} href={`/luzik/courses/${image}.jpg`} target="_blank" rel="noreferrer" aria-label={`Zobacz pełne zdjęcie: ${image==="yaris" ? "Toyota Yaris automat" : "Hyundai i20"}, ${i+1}`}><Image src={`/luzik/courses/${image}.jpg`} alt={image==="yaris" ? "Toyota Yaris automat Szkoły Jazdy Luzik" : "Hyundai i20 Szkoły Jazdy Luzik w Kielcach"} width={image==="yaris" ? 1024 : 768} height={image==="yaris" ? 683 : 512} sizes="(max-width: 767px) 100vw, 50vw" /><span>{image==="yaris" ? "Toyota Yaris · automat" : "Hyundai i20 · manual"}<ArrowRight size={17} aria-hidden="true" /></span></a>)}</div></div></section>;
}

function RelatedCourses({ current }: { current?: CourseId }) {
  return <section className="home-section luzik-related-courses"><div className="luzik-container"><div className="luzik-section-topline"><div><p className="home-eyebrow">Wybierz swoją drogę</p><h2 className="home-title">Poznaj pozostałe kursy</h2></div><Link href="/kursy-prawa-jazdy" className="home-text-link">Pełna oferta<ArrowRight size={18} aria-hidden="true" /></Link></div><div className="luzik-category-links">{luzikCourses.filter(c=>c.id!==current).map(c=><Link key={c.id} href={courseHref(c.id)}><span>{c.id==="b-automat" ? "B automat" : c.category}</span><small>{c.subtitle}</small><ArrowRight size={20} aria-hidden="true" /></Link>)}</div></div></section>;
}

export async function CourseDetailPage({ id }: { id: CourseId }) {
  const { courses: luzikCourses } = await getLuzikSiteData();
  const content = courseContent[id];
  const presentation = coursePresentation[id];
  const course = luzikCourses.find(c=>c.id===id)!;
  return <main id="main-content" className={`luzik-course-detail ${course.group==="motorcycle" ? "luzik-course-detail-moto" : ""}`}>
    <SubpageHero eyebrow={`${course.name} · Kielce`} title={<>{presentation.title.replace("kategorii ", "kategorii\u00a0")}<br /><span>{presentation.accent}</span></>} description={presentation.description} breadcrumb={course.name} image={presentation.image} imageAlt={presentation.imageAlt} imageLabel={presentation.label} action={{href:"#zapisy",label:"Zapisz się na kurs"}} portrait={course.group==="motorcycle"}>
      <div className="luzik-subhero-tags"><a href="#zakres-kursu">Zakres kursu</a><a href="#cena-kursu">{formatLuzikPrice(course.price)} zł / kurs</a>{!!content.faqs.length && <a href="#pytania">Pytania i odpowiedzi</a>}</div>
    </SubpageHero>
    <div className="luzik-course-facts"><div className="luzik-container">{[{value:String(course.theory),label:"godzin teorii"},{value:String(course.practice),label:"godzin praktyki"},{value:"PL / EN",label:"języki szkolenia"},{value:"4 tyg.",label:"orientacyjny czas kursu"}].map(fact=><div key={fact.label}><strong>{fact.value}</strong><span>{fact.label}</span></div>)}</div></div>
    <Intro content={content} id={id} />
    {id==="b" && <Guides content={content} kind="b" />}
    <Chapters sections={content.sections} id={id} />
    <Price id={id} content={content} />
    {id==="b" && <><section className="home-section luzik-team-intro"><div className="luzik-container"><h2 className="home-title">{content.team?.title}</h2>{content.team && <SourceBlocks blocks={content.team.blocks} />}</div></section><SchoolTeam contactHref="#zapisy" /></>}
    <Fleet id={id} content={content} />
    <Faq content={content} id={id} />
    <SubpageCta href="#zapisy" />
    <Registration content={content} subject={`Kurs prawa jazdy ${course.name.toLowerCase()}`} />
    <RelatedCourses current={id} />
  </main>;
}

export async function ExtraLessonsPage() {
  const { lessons: luzikExtraLessons } = await getLuzikSiteData();
  const content = courseContent.lessons;
  return <main id="main-content" className="luzik-course-detail"><SubpageHero eyebrow="Jazdy doszkalające · Kielce" title={<>Wróć za kierownicę.<br /><span>Z większą pewnością.</span></>} description="Przed egzaminem, po dłuższej przerwie lub gdy chcesz poprawić konkretny manewr. Indywidualne jazdy kat. B i B automat z instruktorem Luzika." breadcrumb="Jazdy doszkalające" image="/luzik/courses/hyundai-green.jpg" imageAlt="Hyundai i20 Szkoły Jazdy Luzik w Kielcach" imageLabel="Twój cel · Twoje tempo · Twój instruktor" action={{href:"#zapisy",label:"Umów jazdy"}}><div className="luzik-subhero-tags"><a href="#cena-jazd">{luzikExtraLessons[0].price === luzikExtraLessons[1].price ? luzikExtraLessons[0].price : `${luzikExtraLessons[0].price} / ${luzikExtraLessons[1].price}`} zł / godzina</a><span>Manual i automat</span><a href="#pytania">Pytania i odpowiedzi</a></div></SubpageHero>
    <Intro content={content} /><Chapters sections={content.sections} /><Guides content={content} kind="lessons" />
    <section className="home-section luzik-detail-price" id="cena-jazd"><div className="luzik-container"><p className="home-eyebrow">Tyle jazd, ile potrzebujesz</p><h2 className="home-title">{content.price?.title}</h2>{content.price && <SourceBlocks blocks={content.price.blocks} />}<div className="luzik-lesson-price-grid">{luzikExtraLessons.slice(0,2).map(lesson=><article className="luzik-price-card luzik-detail-price-card" key={lesson.category}><p className="luzik-price-card-label">{lesson.description}</p><h3>Kategoria {lesson.category}</h3><p className="luzik-course-price"><strong>{lesson.price}</strong><span>zł / godzina</span></p><p className="luzik-prose">Indywidualna jazda z instruktorem.<br />Zakres dopasowany do Twoich potrzeb.</p><Link href="#zapisy" className="home-button">Umów jazdę<ArrowRight size={17} aria-hidden="true" /></Link></article>)}</div></div></section>
    <section className="luzik-subpage-cta"><div className="luzik-container"><div><h2 className="home-title">Chcesz pewniej poczuć się za kierownicą?</h2><p>Umów jazdy doszkalające z instruktorem i przećwicz dokładnie te elementy, które sprawiają Ci największą trudność.</p></div><Link href="#zapisy" className="home-button">Umów jazdy doszkalające<ArrowRight size={18} aria-hidden="true" /></Link></div></section>
    <section className="home-section luzik-team-intro"><div className="luzik-container"><h2 className="home-title">{content.team?.title}</h2>{content.team && <SourceBlocks blocks={content.team.blocks} />}</div></section><SchoolTeam contactHref="#zapisy" /><Faq content={content} /><Registration content={content} subject="Jazdy doszkalające" /><RelatedCourses />
  </main>;
}

export function MedicalPage() {
  const content = courseContent.medical;
  return <main id="main-content" className="luzik-course-detail"><SubpageHero eyebrow="Badania lekarskie · Kielce" title={<>Zacznij od formalności.<br /><span>My Ci w nich pomożemy.</span></>} description="Badanie lekarskie to jeden z kroków do uzyskania PKK. Pomożemy Ci znaleźć placówkę partnerską w Kielcach i przygotować się do rozpoczęcia kursu." breadcrumb="Badania lekarskie" action={{href:"#zapisy",label:"Zapytaj o badania"}} visual={<div className="luzik-medical-visual"><HeartPulse size={42} aria-hidden="true" /><p>Twoja droga do prawa jazdy</p><ol>{["Badanie lekarskie","Profil Kandydata na Kierowcę","Kurs w Szkole Jazdy Luzik"].map((step,i)=><li key={step}><span>{String(i+1).padStart(2,"0")}</span><strong>{step}</strong><Check size={20} aria-hidden="true" /></li>)}</ol><span>Wsparcie na każdym etapie</span></div>}><div className="luzik-subhero-tags"><a href="#zakres-kursu">Badania i PKK</a><a href="#pytania">Pytania i odpowiedzi</a></div></SubpageHero><Intro content={content} /><Chapters sections={content.sections} /><Faq content={content} /><Registration content={content} subject="Badania lekarskie na prawo jazdy" /><RelatedCourses /></main>;
}
