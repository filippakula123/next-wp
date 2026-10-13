import { getImageProps, type ImageProps } from 'next/image';

/** Responsive Next-optimized images that do not need client effects or hydration. */
export default function StaticImage({ preloadMedia, preload, priority, ...input }: ImageProps & { preloadMedia?: string }) {
  const { props } = getImageProps({ ...input, loading: input.loading ?? 'lazy' });
  return <>
    {(preload || priority) && <link rel="preload" as="image"
      href={props.srcSet ? undefined : props.src} imageSrcSet={props.srcSet}
      imageSizes={props.sizes} media={preloadMedia} fetchPriority="high" />}
    {/* eslint-disable-next-line @next/next/no-img-element -- getImageProps retains Next's optimizer and srcset. */}
    <img {...props} alt={input.alt} />
  </>;
}
