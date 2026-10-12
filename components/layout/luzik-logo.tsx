import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LuzikLogoProps {
  className?: string;
  imageClassName?: string;
  dark?: boolean;
}

export function LuzikLogo({
  className,
  imageClassName,
  dark = false,
}: LuzikLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Szkoła Jazdy Luzik — strona główna"
      className={cn(
        "relative flex h-[58px] w-[128px] shrink-0 items-center",
        dark && "luzik-logo-on-light",
        "focus-visible:outline-2 focus-visible:outline-offset-4",
        "focus-visible:outline-[var(--color-luzik-blue)]",
        className,
      )}
    >
      <span className="luzik-logo-image relative block h-full w-full">
      <Image
        src={dark ? "/luzik/logo-outline.webp" : "/luzik/logo.webp"}
        alt="Szkoła Jazdy Luzik"
        fill
        sizes={dark ? "(min-width: 1280px) 152px, 116px" : "128px"}
        className={cn(
          "object-contain object-left",
          imageClassName,
        )}
      />
      </span>
    </Link>
  );
}
