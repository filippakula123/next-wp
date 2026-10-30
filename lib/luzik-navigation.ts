export interface NavigationLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavigationGroup {
  label: string;
  icon: "car" | "bike" | "help" | "school";
  links: readonly NavigationLink[];
}

export interface NavigationItem extends NavigationLink {
  id?: string;
  vehicle?: "car" | "bike";
  overviewLabel?: string;
  intro?: { title: string; description: string };
  children?: readonly NavigationLink[];
  groups?: readonly NavigationGroup[];
}

const courseGroups: readonly NavigationGroup[] = [
  {
    label: "Kursy samochodowe", icon: "car",
    links: [
      { label: "Kategoria B", href: "/kursy-prawa-jazdy-kategorii-b", description: "Twój pierwszy krok za kierownicą" },
      { label: "Kategoria B automat", href: "/kursy-prawa-jazdy-kategorii-b-automat", description: "Nauka jazdy z automatyczną skrzynią" },
    ],
  },
  {
    label: "Kursy motocyklowe", icon: "bike",
    links: [
      { label: "Kategoria A", href: "/kursy-prawa-jazdy-kategorii-a", description: "Motocykle bez ograniczenia mocy" },
      { label: "Kategoria A2", href: "/kursy-prawa-jazdy-kategorii-a2", description: "Motocykle o mocy do 35 kW" },
      { label: "Kategoria A1", href: "/kursy-prawa-jazdy-kategorii-a1", description: "Motocykle o pojemności do 125 cm³" },
      { label: "Kategoria AM", href: "/kursy-prawa-jazdy-kategorii-am", description: "Zacznij od motoroweru" },
    ],
  },
  {
    label: "Dla kursanta", icon: "help",
    links: [
      { label: "Jazdy doszkalające", href: "/jazdy-doszkalajace", description: "Więcej praktyki i pewności na drodze" },
      { label: "Badania lekarskie", href: "/badania-lekarskie-na-prawo-jazdy-kielce", description: "Przygotuj się do rozpoczęcia kursu" },
    ],
  },
];

export const luzikNavigation: readonly NavigationItem[] = [
  {
    id: "samochody",
    label: "Samochody",
    vehicle: "car",
    href: "/kursy-prawa-jazdy#kurs-b",
    overviewLabel: "Zobacz kursy samochodowe",
    intro: { title: "Twoja droga za kierownicę.", description: "Manual czy automat? Wybierz swój kurs kategorii B i ucz się jeździć z Luzikiem." },
    groups: [courseGroups[0], courseGroups[2]],
    children: [...courseGroups[0].links, ...courseGroups[2].links],
  },
  {
    id: "motocykle",
    label: "Motocykle",
    vehicle: "bike",
    href: "/kursy-prawa-jazdy#kurs-am",
    overviewLabel: "Zobacz kursy motocyklowe",
    intro: { title: "Twoja droga na dwa koła.", description: "Od pierwszego motoroweru po motocykl bez ograniczeń mocy. Znajdź kategorię dla siebie." },
    groups: [courseGroups[1]],
    children: courseGroups[1].links,
  },
  {
    label: "Szkoła",
    href: "/o-nas",
    children: [
      {
        label: "O nas",
        href: "/o-nas",
        description: "Poznaj szkołę jazdy Luzik",
      },
      {
        label: "Instruktorzy",
        href: "/szkola-jazdy-luzik-instruktorzy",
        description: "Ludzie, którzy nauczą Cię jeździć",
      },
      {
        label: "Cennik",
        href: "/cennik",
        description: "Sprawdź ceny kursów i jazd",
      },
    ],
  },
  {
    label: "Galeria",
    href: "/galeria",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Kontakt",
    href: "/kontakt",
  },
];

const nextCourse = {
  date: "12.10.2026",
  time: "15:00",
} as const;

export const luzikHeaderData = {
  courseLabel: `Najbliższy kurs ${nextCourse.date.slice(0, 5)} g.${nextCourse.time.replace(":", ".")}`,

  courseDateLabel: nextCourse.date,
  courseTimeLabel: nextCourse.time,

  officeAddress: "Kielce, ul. Warszawska 4/1 piętro",

  contactAddress: "Kielce, ul. Warszawska 4",

  phoneLabel: "+48 504 166 557",
  phoneHref: "tel:+48504166557",

  email: "autoluzik@wp.pl",

  registrationHref: "/kontakt",

  facebookHref: "https://www.facebook.com/Szkolajazdyluzik/",
  instagramHref: "https://www.instagram.com/luzikkielce/",
} as const;
