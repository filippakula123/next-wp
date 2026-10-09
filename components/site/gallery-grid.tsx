"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { galleryPhotos, galleryCategories } from "@/lib/luzik-gallery";

export function GalleryGrid() {
  const [category, setCategory] = useState("all");
  const [active, setActive] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const photos = galleryPhotos.filter(photo => category === "all" || photo.category === category);
  const photo = active === null ? undefined : photos[active];
  function move(direction: number) { setActive(index => index === null ? null : (index + direction + photos.length) % photos.length); }

  return <Dialog.Root open={active !== null} onOpenChange={open => { if (!open) setActive(null); }}>
    <div className="luzik-gallery-toolbar">
      <div className="luzik-gallery-filters" role="group" aria-label="Filtruj zdjęcia">
        {galleryCategories.map(filter => <button key={filter.id} type="button" aria-pressed={category === filter.id} onClick={() => setCategory(filter.id)}>{filter.label}<span>{galleryPhotos.filter(p => filter.id === "all" || p.category === filter.id).length}</span></button>)}
      </div>
      <p role="status" aria-live="polite"><span translate="no">{photos.length} / {galleryPhotos.length}{"\u00a0"}</span>zdjęć</p>
    </div>
    <div className="luzik-gallery-grid">
      {photos.map((item, index) => <figure key={item.src} className="luzik-gallery-card">
        <button type="button" onClick={event => { opener.current = event.currentTarget; setActive(index); }} aria-haspopup="dialog" aria-label={`Powiększ: ${item.title}`}>
          <Image src={item.src} alt={item.alt} width={item.width} height={item.height} sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" />
          <span className="luzik-gallery-expand" aria-hidden="true"><Expand size={19} /></span>
        </button>
        <figcaption><span>{item.categoryLabel}</span><h3>{item.title}</h3>{item.caption && <p>{item.caption}</p>}</figcaption>
      </figure>)}
    </div>
    <Dialog.Portal>
      <Dialog.Overlay className="luzik-gallery-overlay" />
      <Dialog.Content className="luzik-gallery-dialog" onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus(); }} onKeyDown={event => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); } }}>
        {photo && <>
          <div className="luzik-gallery-dialog-header"><p aria-live="polite" translate="no">{active! + 1} / {photos.length}</p><Dialog.Close className="luzik-gallery-control" aria-label="Zamknij zdjęcie"><X size={24} /></Dialog.Close></div>
          <div className="luzik-gallery-full-photo"><Image src={photo.src} alt={photo.alt} fill sizes="100vw" loading="eager" /></div>
          <div className="luzik-gallery-dialog-footer"><button className="luzik-gallery-control" aria-label="Poprzednie zdjęcie" onClick={() => move(-1)}><ArrowLeft size={24} /></button>
            <div><Dialog.Title key={`title-${photo.src}`}>{photo.title}</Dialog.Title><Dialog.Description key={`description-${photo.src}`}>{photo.caption || photo.alt}</Dialog.Description></div>
            <button className="luzik-gallery-control" aria-label="Następne zdjęcie" onClick={() => move(1)}><ArrowRight size={24} /></button>
          </div>
        </>}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
