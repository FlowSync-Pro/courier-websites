import "./site.module.css";

/** Words wrapped in [[double brackets]] render in the client's accent color. */
export function Highlight({ text }: { text: string }) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return (
    <>
      {parts.map((part, index) => {
        const marked = part.match(/^\[\[(.+)\]\]$/);
        if (!marked) return <span key={index}>{part}</span>;
        return (
          <span key={index} className={"hl"}>
            {marked[1]}
          </span>
        );
      })}
    </>
  );
}
