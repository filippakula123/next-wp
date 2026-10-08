import { notFound } from "next/navigation";
import { AboutPage } from "@/components/site/about-page";
import { CoursesPage } from "@/components/site/courses-page";
import { PricingPage } from "@/components/site/pricing-page";
import { InstructorsPage } from "@/components/site/instructors-page";
import { ContactPage } from "@/components/site/contact-page";
import { GalleryPage } from "@/components/site/gallery-page";
import { CourseDetailPage, ExtraLessonsPage, MedicalPage } from "@/components/site/course-detail-page";
import { courseHref, medicalSlug } from "@/lib/luzik-course-details";
import { luzikCourses } from "@/lib/luzik-offer";
import type { LuzikPageSlug } from "@/lib/luzik-pages";

export function PageContent({ slug }: { slug: LuzikPageSlug }) {

  if (slug === "kursy-prawa-jazdy") return <CoursesPage />;
  if (slug === "cennik") return <PricingPage />;
  if (slug === "o-nas") return <AboutPage />;
  if (slug === "kontakt") return <ContactPage />;
  if (slug === "galeria") return <GalleryPage />;
  if (slug === "szkola-jazdy-luzik-instruktorzy") return <InstructorsPage />;
  const course = luzikCourses.find(course => courseHref(course.id) === `/${slug}`);
  if (course) return <CourseDetailPage id={course.id} />;
  if (slug === "jazdy-doszkalajace") return <ExtraLessonsPage />;
  if (slug === medicalSlug) return <MedicalPage />;

  notFound();
}
