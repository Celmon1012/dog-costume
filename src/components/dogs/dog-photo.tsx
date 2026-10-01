type DogPhotoProps = {
  src?: string | null;
  alt: string;
  className?: string;
};

export function DogPhoto({ src, alt, className }: DogPhotoProps) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-orange-100 text-3xl ${className ?? ""}`}
        aria-label={alt}
      >
        🐾
      </div>
    );
  }

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
