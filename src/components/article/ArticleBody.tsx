import type { ContentBlock } from "../../types";
import { cn } from "../../utils/cn";

export function ArticleBody({
  blocks,
  lead = false,
}: {
  blocks: ContentBlock[];
  /** Render the first paragraph as a larger lead (Option B presentation). */
  lead?: boolean;
}) {
  let paragraphIndex = 0;

  return (
    <div className="prose-article">
      {blocks.map((block, i) => {
        if (block.type === "p") {
          const isLead = lead && paragraphIndex === 0;
          paragraphIndex += 1;
          return (
            <p key={i} className={cn(isLead && "lead-paragraph")}>
              {block.text}
            </p>
          );
        }

        if (block.type === "h2") {
          return (
            <h2
              id={block.id}
              tabIndex={-1}
              key={i}
              className="mb-3 mt-10 scroll-mt-24 font-display text-[1.6rem] font-medium leading-[1.2] tracking-tight text-ink sm:text-[1.85rem] md:mt-12 md:text-[2.05rem]"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "h3") {
          return (
            <h3
              id={block.id}
              tabIndex={-1}
              key={i}
              className="mb-2.5 mt-8 scroll-mt-24 font-display text-[1.25rem] font-medium leading-snug tracking-tight text-ink sm:text-[1.4rem]"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote key={i} className="my-8 border-l-2 border-emerald py-0.5 pl-5 sm:my-10 sm:pl-6">
              <p className="!mb-0 !font-display !text-[1.35rem] !leading-[1.3] !text-ink italic sm:!text-[1.6rem] md:!text-[1.8rem]">
                {block.text}
              </p>
              {block.attribution && (
                <footer className="mt-3 font-sans text-[11px] uppercase tracking-[0.1em] text-muted">
                  {block.attribution}
                </footer>
              )}
            </blockquote>
          );
        }

        if (block.type === "callout") {
          const tone =
            block.variant === "warning"
              ? "border-newsred/30 bg-[#F8EEEE]"
              : block.variant === "analysis"
                ? "border-emerald/25 bg-emerald-soft"
                : "border-rule bg-canvas";
          return (
            <aside key={i} className={cn("my-7 border px-4 py-4 sm:my-8 sm:px-5 sm:py-5", tone)}>
              <p className="kicker">{block.title}</p>
              <p className="!mb-0 mt-2 !text-[15px] !leading-relaxed sm:!text-base">{block.text}</p>
            </aside>
          );
        }

        if (block.type === "list") {
          const Tag = block.ordered ? "ol" : "ul";
          return (
            <Tag
              key={i}
              className={cn(
                "my-5 space-y-2.5 pl-5 font-serif text-[1.0625rem] leading-[1.65] text-ink-soft sm:my-6 sm:text-[1.125rem]",
                block.ordered ? "list-decimal" : "list-disc",
              )}
            >
              {block.items.map((item) => (
                <li key={item} className="pl-1 marker:text-emerald">
                  {item}
                </li>
              ))}
            </Tag>
          );
        }

        if (block.type === "table") {
          return (
            <figure key={i} className="my-8 sm:my-10">
              <div
                role="region"
                aria-label={block.caption ?? "Article data table"}
                tabIndex={0}
                className="-mx-4 overflow-x-auto px-4 focus-visible:outline-2 focus-visible:outline-emerald sm:mx-0 sm:px-0"
              >
                <div className="min-w-[36rem] border border-rule sm:min-w-0">
                  <table className="w-full border-collapse text-left">
                    <thead className="bg-canvas">
                      <tr>
                        {block.headers.map((h) => (
                          <th
                            key={h}
                            scope="col"
                            className="border-b border-rule px-3 py-2.5 font-sans text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted sm:px-4 sm:py-3 sm:text-[11px]"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, ri) => (
                        <tr key={ri} className="odd:bg-paper even:bg-canvas/60">
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className="border-b border-rule px-3 py-2.5 font-serif text-[14px] leading-snug text-ink-soft sm:px-4 sm:py-3 sm:text-[15px]"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {block.caption && (
                <figcaption className="mt-2 font-sans text-[11.5px] leading-relaxed text-faint">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        if (block.type === "image") {
          return (
            <figure key={i} className="my-8 sm:my-10">
              <img src={block.src} alt={block.alt} loading="lazy" className="w-full object-cover" />
              <figcaption className="mt-2 font-sans text-[11.5px] leading-relaxed text-faint">
                {block.caption} <span className="text-rule-strong">/</span> {block.credit}
              </figcaption>
            </figure>
          );
        }

        return null;
      })}
    </div>
  );
}
