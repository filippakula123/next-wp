// Transcribed from the live Luzik course and pricing pages on 7 October 2026.
// Keep these values shared so the offer and pricing pages stay consistent.
export const luzikCourses = [
  {
    id: "b",
    category: "B",
    name: "Kategoria B",
    subtitle: "Samochód · skrzynia manualna",
    image: "/luzik/instructors/kacper-jaros.webp",
    imageAlt: "Kacper Jaros, instruktor kursu prawa jazdy kategorii B",
    price: 3700,
    theory: 30,
    practice: 30,
    group: "car",
  },
  {
    id: "b-automat",
    category: "B",
    name: "Kategoria B automat",
    subtitle: "Samochód · skrzynia automatyczna",
    image: "/luzik/courses/automatic.webp",
    imageAlt: "Samochód do nauki jazdy kategorii B automat w Luziku",
    price: 3700,
    theory: 30,
    practice: 30,
    group: "car",
  },
  {
    id: "am",
    category: "AM",
    name: "Kategoria AM",
    subtitle: "Kurs na jednoślady",
    image: "/luzik/courses/am.webp",
    imageAlt: "Szkolenie na kategorię AM w Szkole Jazdy Luzik",
    price: 1700,
    theory: 10,
    practice: 10,
    group: "motorcycle",
  },
  {
    id: "a1",
    category: "A1",
    name: "Kategoria A1",
    subtitle: "Kurs motocyklowy",
    image: "/luzik/courses/a1.webp",
    imageAlt: "Motocykl do nauki jazdy kategorii A1 w Luziku",
    price: 2700,
    theory: 30,
    practice: 20,
    group: "motorcycle",
  },
  {
    id: "a2",
    category: "A2",
    name: "Kategoria A2",
    subtitle: "Kurs motocyklowy",
    image: "/luzik/courses/a2.webp",
    imageAlt: "Motocykl do szkolenia kategorii A2 w Luziku",
    price: 2900,
    theory: 30,
    practice: 20,
    group: "motorcycle",
  },
  {
    id: "a",
    category: "A",
    name: "Kategoria A",
    subtitle: "Kurs motocyklowy",
    image: "/luzik/courses/a.webp",
    imageAlt: "Motocykl do szkolenia kategorii A w Luziku",
    price: 2900,
    theory: 30,
    practice: 20,
    group: "motorcycle",
  },
] as const;

export const luzikExtraLessons = [
  { category: "B", description: "Skrzynia manualna", price: "140" },
  { category: "B automat", description: "Skrzynia automatyczna", price: "140" },
  { category: "AM, A1", description: "Kategorie motocyklowe", price: "120 / 130" },
  { category: "A, A2", description: "Kategorie motocyklowe", price: "150" },
] as const;

export function formatLuzikPrice(price: number) {
  return new Intl.NumberFormat("pl-PL").format(price);
}
