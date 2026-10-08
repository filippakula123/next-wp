export interface NavigationLink {
  label: string;
  href: string;
}

export interface NavigationItem extends NavigationLink {
  children?: readonly NavigationLink[];
}

export const luzikNavigation: readonly NavigationItem[] = [
  {
    label: "Kursy prawa jazdy",
    href: "/kursy-prawa-jazdy",
    children: [
      {
        label: "Wszystkie kursy",
        href: "/kursy-prawa-jazdy",
      },
      {
        label: "Prawo jazdy kategorii B",
        href: "/kursy-prawa-jazdy-kategorii-b",
      },
      { label: "Prawo jazdy B automat", href: "/kursy-prawa-jazdy-kategorii-b-automat" },
      { label: "Prawo jazdy kategorii A", href: "/kursy-prawa-jazdy-kategorii-a" },
      { label: "Prawo jazdy kategorii A1", href: "/kursy-prawa-jazdy-kategorii-a1" },
      { label: "Prawo jazdy kategorii A2", href: "/kursy-prawa-jazdy-kategorii-a2" },
      { label: "Prawo jazdy kategorii AM", href: "/kursy-prawa-jazdy-kategorii-am" },
      {
        label: "Jazdy doszkalające",
        href: "/jazdy-doszkalajace",
      },
      { label: "Badania lekarskie", href: "/badania-lekarskie-na-prawo-jazdy-kielce" },
    ],
  },
  {
    label: "Szkoła",
    href: "/o-nas",
    children: [
      {
        label: "O nas",
        href: "/o-nas",
      },
      {
        label: "Instruktorzy",
        href: "/szkola-jazdy-luzik-instruktorzy",
      },
      {
        label: "Cennik",
        href: "/cennik",
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
