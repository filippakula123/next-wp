import { luzikHeaderData } from "./luzik-navigation";
import { luzikContactData } from "./luzik-contact";
import { luzikCourses, luzikExtraLessons } from "./luzik-offer";

export type LuzikCourse = Omit<(typeof luzikCourses)[number], "price"> & { price: number };

export function buildLuzikSiteData(input: unknown = {}) {
  const settings = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
  const text = (key: string, fallback: string) => typeof settings[key] === "string" && settings[key].trim() && settings[key].length <= 500 ? settings[key].trim() : fallback;
  const price = (key: string, fallback: number) => typeof settings[key] === "number" && Number.isInteger(settings[key]) && settings[key] > 0 && settings[key] <= 999999 ? settings[key] : fallback;
  const time = (key: string, fallback: string) => /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(text(key, "")) ? text(key, "") : fallback;
  const url = (key: string, fallback: string) => {
    try { const candidate = new URL(text(key, fallback)); return candidate.protocol === "https:" ? candidate.toString() : fallback; }
    catch { return fallback; }
  };
  const date = text("course_date", "");
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
  const courseDateLabel = validDate ? date.split("-").reverse().join(".") : luzikHeaderData.courseDateLabel;
  const courseTimeLabel = time("course_time", luzikHeaderData.courseTimeLabel);
  const rawPhone = text("phone", luzikHeaderData.phoneLabel);
  const phoneLabel = /^\+?[0-9 ()-]{7,30}$/.test(rawPhone) ? rawPhone : luzikHeaderData.phoneLabel;
  const rawEmail = text("email", luzikHeaderData.email);
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail) ? rawEmail : luzikHeaderData.email;
  const address = text("address", luzikContactData.address);
  const floor = text("floor", luzikContactData.floor);
  const contact = { ...luzikContactData, address, floor, mapEmbedSrc: address === luzikContactData.address ? luzikContactData.mapEmbedSrc : `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`, hours: text("hours", luzikContactData.hours), opens: time("opens", luzikContactData.opens), closes: time("closes", luzikContactData.closes), account: text("account", luzikContactData.account), bank: text("bank", luzikContactData.bank), mapHref: url("map_url", luzikContactData.mapHref) };
  const header = { ...luzikHeaderData, courseDateLabel, courseTimeLabel, courseLabel: `Najbliższy kurs ${courseDateLabel.slice(0, 5)} g.${courseTimeLabel.replace(":", ".")}`, phoneLabel, phoneHref: `tel:${phoneLabel.replace(/[^+\d]/g, "")}`, email, contactAddress: address, officeAddress: `${address} · ${floor}`, facebookHref: url("facebook", luzikHeaderData.facebookHref), instagramHref: url("instagram", luzikHeaderData.instagramHref) };
  const courses: LuzikCourse[] = luzikCourses.map(course => ({ ...course, price: price(`price_${course.id.replaceAll("-", "_")}`, course.price) }));
  const pair = (a: number, b: number) => a === b ? String(a) : `${a} / ${b}`;
  const lessonPrices = { b: price("lesson_b", 140), "b-automat": price("lesson_b_automat", 140), am: price("lesson_am", 120), a1: price("lesson_a1", 130), a2: price("lesson_a2", 150), a: price("lesson_a", 150) };
  const lessons = luzikExtraLessons.map((lesson, index) => ({ ...lesson, price: [String(price("lesson_b", 140)), String(price("lesson_b_automat", 140)), pair(price("lesson_am", 120), price("lesson_a1", 130)), pair(price("lesson_a", 150), price("lesson_a2", 150))][index] }));
  return { header, contact, courses, lessons, lessonPrices };
}

export type LuzikSiteData = ReturnType<typeof buildLuzikSiteData>;
