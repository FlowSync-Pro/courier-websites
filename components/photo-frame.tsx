import "@/app/(site)/_components/site.module.css";

export function PhotoFrame({
  src,
  alt,
  credit,
  caption,
  className = "",
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
      {caption ? <figcaption className={"credit"}>{caption}</figcaption> : null}
      <p className={"credit"}>{credit}</p>
    </figure>
  );
}
