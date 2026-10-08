export interface LuzikPageContent {
  title: string;
  description: string;
  eyebrow?: string;
}

export const luzikPages = {
  "kursy-prawa-jazdy": {
    eyebrow: "Szkoła Jazdy Luzik",
    title: "Kursy prawa jazdy w Kielcach",
    description:
      "Kursy prawa jazdy w Kielcach: B manual, B automat, AM, A1, A2 i A. Porównaj kategorie, zakres szkolenia i ceny. Poznaj ofertę Szkoły Jazdy Luzik.",
  },
  "kursy-prawa-jazdy-kategorii-b": {
    eyebrow: "Kurs kategorii B",
    title: "Prawo jazdy kategorii B w Kielcach",
    description:
      "Kurs prawa jazdy kat. B w Kielcach: 30 godzin teorii i 30 godzin jazdy na Hyundai i20. Poznaj instruktorów, zakres szkolenia i cenę kursu w Luziku.",
  },
  "jazdy-doszkalajace": {
    eyebrow: "Szkoła Jazdy Luzik",
    title: "Jazdy doszkalające w Kielcach",
    description:
      "Jazdy doszkalające w Kielcach na manualu i automacie. Przygotuj się do egzaminu lub wróć za kierownicę. Sprawdź ceny i instruktorów Szkoły Jazdy Luzik.",
  },
  "kursy-prawa-jazdy-kategorii-b-automat": {
    title: "Prawo jazdy B automat w Kielcach",
    description: "Kurs prawa jazdy na automacie w Szkole Jazdy Luzik. Toyota Yaris, 30 godzin teorii i 30 godzin praktyki.",
  },
  "kursy-prawa-jazdy-kategorii-a": {
    title: "Kurs prawa jazdy kategorii A w Kielcach",
    description: "Kurs motocyklowy kategorii A w Luziku. Poznaj zakres szkolenia, wymagania, cenę i odpowiedzi na pytania.",
  },
  "kursy-prawa-jazdy-kategorii-a1": {
    title: "Kurs prawa jazdy kategorii A1 w Kielcach",
    description: "Prawo jazdy A1 w Szkole Jazdy Luzik. 30 godzin teorii, 20 godzin praktyki i wsparcie w formalnościach.",
  },
  "kursy-prawa-jazdy-kategorii-a2": {
    title: "Kurs prawa jazdy kategorii A2 w Kielcach",
    description: "Kurs na kategorię A2 w Kielcach. Przygotowanie do egzaminu i bezpiecznej jazdy motocyklem z Luzikiem.",
  },
  "kursy-prawa-jazdy-kategorii-am": {
    title: "Kurs prawa jazdy kategorii AM w Kielcach",
    description: "Prawo jazdy AM w Luziku. Kurs na motorower i lekki czterokołowiec, zakres szkolenia, cena i pytania.",
  },
  "badania-lekarskie-na-prawo-jazdy-kielce": {
    title: "Badania lekarskie na prawo jazdy w Kielcach",
    description: "Badania lekarskie przed kursem prawa jazdy i uzyskaniem PKK. Szkoła Jazdy Luzik pomaga znaleźć placówkę partnerską w Kielcach.",
  },
  cennik: {
    eyebrow: "Szkoła Jazdy Luzik",
    title: "Cennik kursów prawa jazdy w Kielcach",
    description:
      "Cennik Szkoły Jazdy Luzik w Kielcach. Sprawdź ceny kursów B, B automat, AM, A1, A2 i A oraz jazd doszkalających. Zobacz, co obejmuje cena szkolenia.",
  },
  "o-nas": {
    eyebrow: "Szkoła Jazdy Luzik",
    title: "O nas — szkoła jazdy w Kielcach",
    description:
      "Poznaj Szkołę Jazdy Luzik w Kielcach, instruktorów, samochody i sposób przygotowania do egzaminu w WORD Kielce. Bezpiecznie, profesjonalnie i na luzie.",
  },
  "szkola-jazdy-luzik-instruktorzy": {
    eyebrow: "Szkoła Jazdy Luzik",
    title: "Instruktorzy nauki jazdy w Kielcach",
    description:
      "Poznaj sześciu instruktorów Szkoły Jazdy Luzik w Kielcach. Zobacz zdjęcia zespołu, kategorie B i B automat, biuro oraz samochody szkoleniowe.",
  },
  galeria: {
    eyebrow: "Szkoła Jazdy Luzik",
    title: "Galeria szkoły jazdy w Kielcach",
    description:
      "Zobacz zdjęcia Szkoły Jazdy Luzik w Kielcach: instruktorzy, Hyundai i20, Toyota Yaris automat, motocykle szkoleniowe i nasi kursanci.",
  },
  blog: {
    eyebrow: "Strefa wiedzy kierowcy",
    title: "Blog o nauce jazdy w Kielcach",
    description:
      "Praktyczne informacje o nauce jazdy, przepisach i przygotowaniu do egzaminu.",
  },
  kontakt: {
    eyebrow: "Szkoła Jazdy Luzik",
    title: "Kontakt i zapisy na kurs w Kielcach",
    description:
      "Kontakt ze Szkołą Jazdy Luzik: Kielce, ul. Warszawska 4, I piętro. Telefon +48 504 166 557, autoluzik@wp.pl. Biuro czynne pn–pt 12:00–16:00.",
  },
} as const satisfies Record<string, LuzikPageContent>;

export type LuzikPageSlug = keyof typeof luzikPages;

// Unfinished sections remain available in navigation but are not submitted for indexing.
export const completedLuzikSlugs: readonly LuzikPageSlug[] = [
  "kursy-prawa-jazdy", "kursy-prawa-jazdy-kategorii-b", "kursy-prawa-jazdy-kategorii-b-automat",
  "kursy-prawa-jazdy-kategorii-a", "kursy-prawa-jazdy-kategorii-a1", "kursy-prawa-jazdy-kategorii-a2",
  "kursy-prawa-jazdy-kategorii-am", "jazdy-doszkalajace", "badania-lekarskie-na-prawo-jazdy-kielce",
  "cennik", "o-nas", "szkola-jazdy-luzik-instruktorzy", "kontakt", "galeria", "blog",
];
