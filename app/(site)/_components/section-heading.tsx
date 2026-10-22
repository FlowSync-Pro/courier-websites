import { Highlight } from "./highlight";
import "./site.module.css";

export function SectionHeading({ title }: { title: string }) {
  return (
    <div>
      <h2 className={"heading"}>
        <Highlight text={title} />
      </h2>
      <div className={"bar"} />
    </div>
  );
}
