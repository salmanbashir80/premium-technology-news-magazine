import { useEffect, useMemo, useState } from "react";
import type { ContentBlock } from "../../types";
import { cn } from "../../utils/cn";
import { scrollToId } from "../../lib/dom";

type H2 = Extract<ContentBlock, { type: "h2" }>;

export function TableOfContents({
  blocks,
  variant = "rail",
}: {
  blocks: ContentBlock[];
  variant?: "rail" | "inline";
}) {
  const headings = useMemo(() => blocks.filter((b): b is H2 => b.type === "h2"), [blocks]);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!headings.length) return;
    function onScroll() {
      let current = "";
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= 140) current = h.id;
      }
      setActive(current);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  if (headings.length < 2) return null;

  function goTo(id: string) {
    setOpen(false);
    requestAnimationFrame(() => scrollToId(id));
  }

  const list = (
    <ol className="space-y-1.5">
      {headings.map((h, i) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault();
              goTo(h.id);
            }}
            className={cn(
              "flex gap-2.5 py-0.5 font-sans text-[13px] leading-snug transition-colors",
              active === h.id ? "text-emerald" : "text-ink-soft hover:text-emerald",
            )}
            aria-current={active === h.id ? "location" : undefined}
          >
            <span className={cn("tabular-nums", active === h.id ? "text-emerald" : "text-faint")}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{h.text}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  if (variant === "inline") {
    return (
      <nav aria-label="Table of contents" className="border border-rule bg-canvas lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <span className="kicker">Contents · {headings.length} sections</span>
          <span className="font-sans text-lg leading-none text-muted" aria-hidden>
            {open ? "−" : "+"}
          </span>
        </button>
        {open && <div className="border-t border-rule px-4 py-3">{list}</div>}
      </nav>
    );
  }

  return (
    <nav aria-label="Table of contents" className="border-t-2 border-ink pt-4">
      <p className="kicker">In this piece</p>
      <div className="mt-3">{list}</div>
    </nav>
  );
}
