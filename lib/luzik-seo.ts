import type { Metadata } from "next";
import { legacySeo, legacyOrganization } from "./luzik-legacy-seo";
import { siteConfig } from "@/site.config";
import { completedLuzikSlugs, luzikPages, type LuzikPageSlug } from "./luzik-pages";
import { courseHref, coursePresentation, type CourseId } from "./luzik-course-details";
import { luzikCourses } from "./luzik-offer";
import { luzikTeam, luzikOfficeTeam } from "./luzik-team";
import { luzikContactData } from "./luzik-contact";
import { galleryPhotos } from "./luzik-gallery";
import { wordpressImageUnoptimized } from "./wordpress-media";
import type { LuzikCourse, LuzikSiteData } from "./luzik-settings";

export const publicUrl = (path: string) => new URL(path, siteConfig.site_domain).toString();
const schoolId = publicUrl("/#school");
const websiteId = publicUrl("/#website");

export function luzikMetadata(title: string, description: string, path: string, image = "/luzik/brand/social.jpg", indexable = true, data?: LuzikSiteData, useLegacy = true): Metadata {
  const legacy = useLegacy ? legacySeo(path, title, description, data) : { title, description, indexable: true, socialImage: undefined, socialTitle: title, socialDescription: description };
  title = legacy.title;
  description = legacy.description;
  const url = publicUrl(path);
  // Local media URLs cannot be read by social networks after deployment.
  const socialImage = legacy.socialImage ?? (wordpressImageUnoptimized(image) ? "/luzik/brand/social.jpg" : image);
  return {
    title: { absolute: title }, description, alternates: { canonical: url },
    robots: { index: siteConfig.site_indexable && indexable && legacy.indexable, follow: true, "max-image-preview": "large" },
    openGraph: { title: legacy.socialTitle ?? title, description: legacy.socialDescription ?? description, type: "website", url, locale: "pl_PL", siteName: siteConfig.site_name, images: [{ url: publicUrl(socialImage), alt: title, ...(socialImage === "/luzik/brand/social.jpg" ? { width: 1200, height: 630 } : {}) }] },
    twitter: { card: "summary_large_image", title, description, images: [publicUrl(socialImage)] },
  };
}

function pageDescription(slug: LuzikPageSlug, data?: LuzikSiteData) {
  return slug === "kontakt" && data
    ? `Kontakt ze Szkołą Jazdy Luzik: ${data.contact.address}, ${data.contact.floor}. Telefon ${data.header.phoneLabel}, ${data.header.email}. Biuro czynne ${data.contact.hours}.`
    : luzikPages[slug].description;
}

export function luzikPageMetadata(slug: LuzikPageSlug, data?: LuzikSiteData): Metadata {
  const page = luzikPages[slug];
  const course = luzikCourses.find(c => courseHref(c.id) === `/${slug}`);
  return luzikMetadata(page.title, pageDescription(slug, data), `/${slug}`, course ? coursePresentation[course.id].image : undefined, completedLuzikSlugs.includes(slug) && (slug !== "blog" || process.env.BLOG_INDEXABLE === "true"), data);
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": ["LocalBusiness", "EducationalOrganization"], "@id": schoolId, name: siteConfig.site_name, url: publicUrl("/"), description: legacyOrganization.description,
      geo: { "@type": "GeoCoordinates", latitude: legacyOrganization.latitude, longitude: legacyOrganization.longitude },
      telephone: "+48504166557", email: "autoluzik@wp.pl", logo: publicUrl("/luzik/logo.webp"), image: publicUrl("/luzik/hero.webp"),
      address: { "@type": "PostalAddress", streetAddress: "ul. Warszawska 4", addressLocality: "Kielce", postalCode: "25-306", addressCountry: "PL" },
      hasMap: luzikContactData.mapHref,
      areaServed: { "@type": "City", name: "Kielce" },
      sameAs: ["https://www.facebook.com/Szkolajazdyluzik/", "https://www.instagram.com/luzikkielce/"],
      openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: luzikContactData.opens, closes: luzikContactData.closes },
      contactPoint: { "@type": "ContactPoint", telephone: "+48504166557", email: "autoluzik@wp.pl", contactType: "customer service", url: publicUrl("/kontakt") },
    },
    { "@type": "WebSite", "@id": websiteId, url: publicUrl("/"), name: siteConfig.site_name, inLanguage: "pl-PL", publisher: { "@id": schoolId } },
  ],
};

export function organizationSchemaFor(data: LuzikSiteData) {
  const [school, website] = organizationSchema["@graph"];
  return { ...organizationSchema, "@graph": [{ ...school,
    telephone: data.header.phoneHref.replace("tel:", ""), email: data.header.email,
    address: { ...school.address, streetAddress: data.contact.address.replace(/^Kielce,\s*/, "") },
    hasMap: data.contact.mapHref, sameAs: [data.header.facebookHref, data.header.instagramHref],
    openingHoursSpecification: { ...school.openingHoursSpecification, opens: data.contact.opens, closes: data.contact.closes },
    contactPoint: { ...school.contactPoint, telephone: data.header.phoneHref.replace("tel:", ""), email: data.header.email },
  }, website] };
}

function courseSchema(id: CourseId, courses: readonly LuzikCourse[] = luzikCourses) {
  const course = courses.find(c => c.id === id)!;
  const url = publicUrl(courseHref(id));
  return { "@type": "Course", "@id": `${url}#course`, url, name: `${course.name} — kurs prawa jazdy w Kielcach`, description: coursePresentation[id].description,
    courseCode: id === "b-automat" ? "B automat" : course.category, inLanguage: ["pl", "en"], image: publicUrl(coursePresentation[id].image), provider: { "@id": schoolId },
    offers: { "@type": "Offer", price: course.price, priceCurrency: "PLN", url, seller: { "@id": schoolId } },
  };
}

export function pageSchema(slug?: LuzikPageSlug, courses: readonly LuzikCourse[] = luzikCourses, data?: LuzikSiteData) {
  const path = slug ? `/${slug}` : "/";
  const url = publicUrl(path);
  const course = luzikCourses.find(c => courseHref(c.id) === path);
  const teamPage = slug === "szkola-jazdy-luzik-instruktorzy";
  const galleryPage = slug === "galeria";
  const listPage = slug === "cennik" || slug === "kursy-prawa-jazdy";
  const name = slug ? luzikPages[slug].title : "Szkoła Jazdy Kielce Luzik";
  const graph: Record<string, unknown>[] = [{ "@type": galleryPage ? "ImageGallery" : slug === "kontakt" ? "ContactPage" : slug === "o-nas" ? "AboutPage" : teamPage || listPage ? "CollectionPage" : "WebPage",
    "@id": `${url}#webpage`, url, name, description: slug ? pageDescription(slug, data) : siteConfig.site_description, inLanguage: "pl-PL", isPartOf: { "@id": websiteId }, about: { "@id": schoolId },
    ...(slug ? { breadcrumb: { "@id": `${url}#breadcrumbs` } } : {}),
    ...(course ? { mainEntity: { "@id": `${url}#course` } } : teamPage || listPage ? { mainEntity: { "@id": `${url}#list` } } : slug === "kontakt" ? { mainEntity: { "@id": schoolId } } : {}),
  }];
  if (slug) graph.push({ "@type": "BreadcrumbList", "@id": `${url}#breadcrumbs`, itemListElement: [
    { "@type": "ListItem", position: 1, name: "Strona główna", item: publicUrl("/") },
    { "@type": "ListItem", position: 2, name, item: url },
  ] });
  if (course) graph.push(courseSchema(course.id, courses));
  if (slug === "blog") graph.push({ "@type": "Blog", "@id": `${url}#blog`, url, name, inLanguage: "pl-PL", publisher: { "@id": schoolId } });
  if (galleryPage) {
    graph[0].image = galleryPhotos.map(photo => ({ "@type": "ImageObject", contentUrl: publicUrl(photo.src), name: photo.title, description: photo.caption || photo.alt, width: photo.width, height: photo.height }));
  }
  if (listPage) {
    graph.push(...courses.map(c => courseSchema(c.id, courses)));
    graph.push({ "@type": "ItemList", "@id": `${url}#list`, itemListElement: luzikCourses.map((c, i) => ({ "@type": "ListItem", position: i + 1, item: { "@id": `${publicUrl(courseHref(c.id))}#course` } })) });
  }
  if (teamPage) {
    // Mariola appears in both sections but represents one person.
    const people = [...luzikTeam, ...luzikOfficeTeam.filter(office => !luzikTeam.some(instructor => instructor.name === office.name))];
    graph.push(...people.map(p => ({ "@type": "Person", "@id": `${url}#${p.id}`, name: p.name, jobTitle: p.role,
      image: publicUrl(p.image), worksFor: { "@id": schoolId }, ...( "category" in p ? { knowsAbout: `Nauka jazdy kategorii ${p.category}` } : {}),
    })));
    graph.push({ "@type": "ItemList", "@id": `${url}#list`, name: "Zespół Szkoły Jazdy Luzik", itemListElement: people.map((p, i) => ({ "@type": "ListItem", position: i + 1, item: { "@id": `${url}#${p.id}` } })) });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
