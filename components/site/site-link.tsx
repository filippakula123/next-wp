import type { ComponentProps } from 'react';

/** Standard navigation keeps marketing links out of the hydration/prefetch path. */
export default function SiteLink(props: ComponentProps<'a'> & { href: string; prefetch?: boolean }) {
  const attributes = { ...props };
  delete attributes.prefetch;
  return <a {...attributes} />;
}
