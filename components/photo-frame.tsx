import "@/app/(site)/_components/site.module.css";

export function PhotoFrame({
  src,
  alt,
  credit,
  caption,
  className = "",
  showCredit = true,
}: {
  src: string;
  alt: string;
  credit: string;
  caption?: string;
  className?: string;
  creditClass?: string;
  showCredit?: boolean;
}) {
  return (
    <figure>
      {/* Local demo photos are already sized. Skip the image optimizer so the first screen stays simple. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={className} />
      {showCredit && caption ? <figcaption className={"credit"}>{caption}</figcaption> : null}
      {showCredit ? <p className={"credit"}>{credit}</p> : null}
    </figure>
  );
}
