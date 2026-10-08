import source from "./luzik-gallery-source.json";

export const galleryCategories = [
  { id: "all", label: "Wszystkie zdjęcia" },
  { id: "cars", label: "Samochody" },
  { id: "motorcycles", label: "Motocykle" },
  { id: "people", label: "Szkoła i kursanci" },
];

const titles = [
  "Nasz zespół na kieleckim rynku", "Hyundai i20 — nauka jazdy kat. B", "Toyota Yaris — B automat",
  "Hyundai i20 na rynku w Kielcach", "Samochód szkoleniowy Luzika", "Zielony Hyundai i20",
  "Nasze samochody szkoleniowe", "Czarny Hyundai i20", "Jazdy doszkalające w Kielcach",
  "Voucher podarunkowy Luzika", "Motocykle szkoleniowe", "Nauka jazdy na placu", "Spotkanie przy motocyklach",
  "Radość po egzaminie", "Uśmiech przy samochodzie szkoleniowym", "Wspólne chwile po egzaminie",
  "Kolejny powód do uśmiechu", "Za kierownicą z Luzikiem", "Miłe chwile naszych kursantów",
  "Pamiątkowe zdjęcie w biurze", "Razem z instruktorką", "Zdjęcie na pamiątkę", "Kursant i instruktor",
];

export const galleryPhotos = source.map((photo, index) => {
  const category = index >= 1 && index <= 8 ? "cars" : index >= 10 && index <= 12 ? "motorcycles" : "people";
  return { ...photo, title: titles[index], alt: photo.alt || titles[index], category, categoryLabel: galleryCategories.find(item => item.id === category)!.label };
});
