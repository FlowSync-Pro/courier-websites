export function PhotoFrame({
  src,
  alt,
  credit,
  caption,
  className = "h-56 w-full object-cover",
  creditClass = "text-muted",
}: {
  src: string;
  alt: string;
  credit: string;
  caption?: string;
  className?: string;
  creditClass?: string;
}) {
  return (
    <figure>
      {/* Local demo photos are already sized. Skip the image optimizer so the first screen stays simple. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={className} />
      {caption ? <figcaption className="mt-2 text-sm font-semibold">{caption}</figcaption> : null}
      <p className={`mt-1 text-[11px] leading-snug ${creditClass}`}>{credit}</p>
    </figure>
  );
}
