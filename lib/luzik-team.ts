// Names, categories and profile links from the original Luzik team page.
export const luzikTeam = [
  { id: "arkadiusz-jaros", name: "Arkadiusz Jaros", role: "Właściciel / instruktor", category: "B", image: "/luzik/instructors/arkadiusz-jaros.jpg", profile: "instruktor-nauki-jazdy-arek" },
  { id: "kacper-jaros", name: "Kacper Jaros", role: "Instruktor", category: "B", image: "/luzik/instructors/kacper-jaros.jpg", profile: "instruktor-nauki-jazdy-kategoria-b-kacper-jaros" },
  { id: "oskar-telka", name: "Oskar Telka", role: "Instruktor", category: "B", image: "/luzik/instructors/oskar-telka.jpg", profile: "instruktor-nauki-jazdy-kategoria-b-oskar" },
  { id: "sandra-baczek", name: "Sandra Bączek", role: "Instruktor", category: "B", image: "/luzik/instructors/sandra-baczek.jpg", profile: "instruktor-nauki-jazdy-kategoria-b-sandra-baczek" },
  { id: "mariola-jaros", name: "Mariola Jaros", role: "Instruktor", category: "B i B automat", image: "/luzik/instructors/mariola-jaros.jpg", profile: "instruktor-nauki-jazdy-kategoria-b-i-b-automat-mariola" },
  { id: "zbigniew-zadlo", name: "Zbigniew Żądło", role: "Instruktor", category: "B", image: "/luzik/instructors/zbigniew-zadlo.jpg", profile: "instruktor-nauki-jazdy-kategorii-b-zbigniew-zadlo" },
] as const;

export const luzikOfficeTeam = [
  { id: "mariola-biuro", name: "Mariola Jaros", role: "Instruktor", image: "/luzik/instructors/mariola-biuro.jpg", profile: "mariola-jaros" },
  { id: "karolina-jaros", name: "Karolina Jaros", role: "Specjalistka ds. floty samochodowej", image: "/luzik/instructors/karolina-jaros.jpg", profile: "karolina-jaros-specjalistka-ds-floty-samochodowej" },
] as const;

export const featuredInstructors = [luzikTeam[0], luzikTeam[4], luzikTeam[1], luzikTeam[3]];
export const profileHref = (profile: string) => `/team/${profile}`;
