"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const MobileNavDialog = dynamic(
  () => import("@/components/nav/mobile-nav-dialog").then((module) => module.MobileNavDialog),
  { ssr: false, loading: () => null },
);

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  function openMenu() {
    setHasOpened(true);
    setOpen(true);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? "Menu otwarte" : "Otwórz menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation-dialog"
        onClick={openMenu}
        className="
          luzik-mobile-trigger flex
          h-[42px]
          w-[46px]
          items-center
          justify-center
          rounded-[2px]
          border-0
          bg-[#008bd0]
          text-white
          shadow-[0_7px_20px_rgba(0,139,208,0.18)]
        "
      >
        <span className="luzik-mobile-burger" aria-hidden="true"><span /><span /><span /></span>
      </button>
      {hasOpened && <MobileNavDialog open={open} onOpenChange={setOpen} />}
    </>
  );
}
