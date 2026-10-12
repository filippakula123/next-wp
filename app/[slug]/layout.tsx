import "../luzik-subpages.css";
import "../luzik-blog.css";

import type { ReactNode } from "react";

export default function WordPressDocumentLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
