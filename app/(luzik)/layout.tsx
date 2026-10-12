import "../luzik-subpages.css";
import "../luzik-course-details.css";
import "../luzik-instructors.css";
import "../luzik-contact.css";
import "../luzik-gallery.css";

import type { ReactNode } from "react";

export default function LuzikPagesLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
