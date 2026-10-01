type DogPhotoProps = {
  src: string;
  alt: string;
  className?: string;
};

/** Serve storage photos directly — Next image optimization was adding seconds per photo. */
export function DogPhoto({ src, alt, className }: DogPhotoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
