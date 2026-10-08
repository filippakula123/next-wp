import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LuzikLogoProps {
  className?: string;
  imageClassName?: string;
}

export function LuzikLogo({
  className,
  imageClassName,
}: LuzikLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Szkoła Jazdy Luzik — strona główna"
      className={cn(
        "relative flex h-[58px] w-[128px] shrink-0 items-center",
        "focus-visible:outline-2 focus-visible:outline-offset-4",
        "focus-visible:outline-[var(--color-luzik-blue)]",
        className,
      )}
    >
      <Image
        src="/luzik/logo.png"
        alt="Szkoła Jazdy Luzik"
        fill
        priority
        sizes="128px"
        className={cn(
          "object-contain object-left",
          imageClassName,
        )}
      />
    </Link>
  );
}