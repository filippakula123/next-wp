import content from "./luzik-course-content.json";
import { luzikCourses } from "./luzik-offer";

export type CourseId = (typeof luzikCourses)[number]["id"];
export type DetailKey = keyof typeof content;
export interface SourceBlock { tag: string; html: string }
export interface SourceSection { title: string; blocks: SourceBlock[] }
export interface CourseContent {
  intro: SourceSection;
  benefits: { title: string; text: string }[];
  sections: SourceSection[];
  price?: SourceSection;
  registration?: SourceSection;
  team?: SourceSection;
  fleet?: SourceSection;
  guides?: SourceSection;
  faqs: { question: string; answer: string }[];
}

// Original copy from the eight live Luzik pages. Older prices and the AM
// practice hours were reconciled with the pricing cards and central offer.
// HTML in this static JSON contains only text, links and basic prose markup.
export const courseContent: Record<DetailKey, CourseContent> = content;
export const medicalSlug = "badania-lekarskie-na-prawo-jazdy-kielce";
export const courseHref = (id: CourseId) => `/kursy-prawa-jazdy-kategorii-${id}`;

export const coursePresentation: Record<CourseId, { title: string; accent: string; description: string; image: string; imageAlt: string; label: string }> = {
  b: { title: "Prawo jazdy kategorii B.", accent: "Twoja droga do samodzielności.", description: "30 godzin teorii, 30 godzin praktyki i wsparcie na każdym etapie. Nauka jazdy w Kielcach na samochodach Hyundai i20.", image: "/luzik/courses/hyundai-grey.webp", imageAlt: "Szary Hyundai i20 Szkoły Jazdy Luzik w Kielcach", label: "Hyundai i20 · skrzynia manualna" },
  "b-automat": { title: "Prawo jazdy B automat.", accent: "Skup się na dobrej jeździe.", description: "Nauka jazdy bez obsługi sprzęgła i ręcznej zmiany biegów. Poznaj kurs na automacie w Szkole Jazdy Luzik w Kielcach.", image: "/luzik/courses/yaris.webp", imageAlt: "Biała Toyota Yaris z automatyczną skrzynią biegów Szkoły Jazdy Luzik", label: "Toyota Yaris · skrzynia automatyczna" },
  a: { title: "Prawo jazdy kategorii A.", accent: "Otwórz drogę do wolności.", description: "Od podstaw do pewnej jazdy motocyklem. Teoria, praktyka i indywidualne podejście do nauki w Kielcach.", image: "/luzik/courses/a-full.webp", imageAlt: "Motocyklistka w kasku na motocyklu", label: "Kategoria A · kurs motocyklowy" },
  a1: { title: "Prawo jazdy kategorii A1.", accent: "Zacznij przygodę na dwóch kołach.", description: "Kurs dla młodych motocyklistów. Zdobądź wiedzę, opanuj technikę jazdy i przygotuj się do egzaminu z Luzikiem.", image: "/luzik/courses/a1-full.webp", imageAlt: "Motocykl — zdjęcie z oryginalnej oferty kategorii A1", label: "Kategoria A1 · teoria i praktyka" },
  a2: { title: "Prawo jazdy kategorii A2.", accent: "Więcej możliwości. Więcej dróg.", description: "Twój pierwszy krok do motocyklowych przygód. Kompleksowe przygotowanie do bezpiecznej jazdy motocyklem o mocy do 35 kW.", image: "/luzik/courses/a2-full.webp", imageAlt: "Motocykl na leśnej drodze", label: "Kategoria A2 · kurs motocyklowy" },
  am: { title: "Prawo jazdy kategorii AM.", accent: "Pierwszy krok do niezależności.", description: "Naucz się prowadzić motorower lub lekki czterokołowiec. Zajęcia teoretyczne i praktyczne w Szkole Jazdy Luzik w Kielcach.", image: "/luzik/courses/am-full.webp", imageAlt: "Niebieski motorower — zdjęcie z oryginalnej oferty kategorii AM", label: "Kategoria AM · początek Twojej drogi" },
};
