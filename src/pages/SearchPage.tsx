import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchArticles } from "../data/articles";
import { categories } from "../data/categories";
import { ArticleCard } from "../components/ui/ArticleCard";
import { useApp } from "../context/AppContext";
import type { CategorySlug } from "../types";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const qParam = params.get("q") ?? "";
  const { setSearchQuery } = useApp();
  const [input, setInput] = useState(qParam);
  const [cat, setCat] = useState<CategorySlug | "all">("all");

  useEffect(() => {
    setInput(qParam);
  }, [qParam]);

  const results = useMemo(() => {
    const found = searchArticles(qParam);
    return cat === "all" ? found : found.filter((a) => a.category === cat);
  }, [qParam, cat]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSearchQuery(input);
    setParams({ q: input });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="kicker">Search</p>
      <h1 className="mt-2 font-display text-[2rem] font-medium leading-tight tracking-[-0.025em] sm:text-4xl md:text-5xl">
        Look through the desk
      </h1>
      <p className="mt-3 max-w-2xl font-serif text-[16px] leading-relaxed text-muted sm:text-lg">
        Search the demonstration library. This is a local filter of demo stories, not a live index.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:gap-3"
        role="search"
      >
        <label className="sr-only" htmlFor="search-input">
          Search articles
        </label>
        <input
          id="search-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try “power”, “identity”, “Series B”"
          className="h-12 flex-1 border border-rule bg-paper px-4 font-sans text-base sm:text-sm"
        />
        <button
          type="submit"
          className="h-12 shrink-0 bg-ink px-6 font-sans text-sm font-semibold text-paper"
        >
          Search
        </button>
      </form>

      <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
        <FilterChip active={cat === "all"} onClick={() => setCat("all")}>
          All sections
        </FilterChip>
        {categories.map((c) => (
          <FilterChip key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
            {c.navLabel}
          </FilterChip>
        ))}
      </div>

      <div className="mt-10">
        {!qParam && (
          <Empty
            title="Start with a query"
            body="Search titles, decks and tags in the demo archive. Suggestions: power, ransomware, App Store, warehouse."
          />
        )}
        {qParam && results.length === 0 && (
          <Empty
            title={`No demo stories for “${qParam}”`}
            body="Try a broader term, clear the section filter, or return to the homepage. Nothing is indexed outside this prototype."
          />
        )}
        {results.length > 0 && (
          <>
            <p className="mb-5 font-sans text-[13px] text-muted sm:mb-6 sm:text-sm">
              {results.length} result{results.length === 1 ? "" : "s"} for “{qParam}”
            </p>
            <div className="space-y-6 sm:space-y-8">
              {results.map((a) => (
                <ArticleCard key={a.id} article={a} variant="horizontal" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-9 px-3 font-sans text-xs font-semibold uppercase tracking-wide ${
        active ? "bg-ink text-paper" : "border border-rule text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-rule bg-paper px-6 py-14 text-center">
      <h2 className="font-display text-2xl font-medium">{title}</h2>
      <p className="mx-auto mt-3 max-w-md font-serif text-[16px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}
