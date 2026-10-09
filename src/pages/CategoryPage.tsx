import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getCategory } from "../data/categories";
import { articlesByCategory } from "../data/articles";
import { ArticleCard } from "../components/ui/ArticleCard";
import { Newsletter } from "../components/ui/Newsletter";
import { AdSlot } from "../components/ui/AdSlot";

const PAGE_SIZE = 6;

export function CategoryPage() {
  const { slug = "" } = useParams();
  const { liveArticles } = useApp();
  const category = getCategory(slug);
  const all = useMemo(() => {
    const pool = liveArticles.length > 0 ? liveArticles : articlesByCategory(slug);
    return pool.filter((a) => a.category === slug && a.status === "published");
  }, [liveArticles, slug]);
  const [page, setPage] = useState(1);
  const [tag, setTag] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
    setTag(null);
  }, [slug]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    all.forEach((a) => a.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [all]);

  const filtered = tag ? all.filter((a) => a.tags.includes(tag)) : all;
  const featured = filtered[0];
  const rest = filtered.slice(1);
  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const paged = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Section not found</h1>
        <p className="mt-3 font-serif text-muted">That section is not in this demonstration library.</p>
        <Link to="/" className="mt-4 inline-block text-emerald">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:py-14">
          <p className="kicker">Section</p>
          <h1 className="mt-2 font-display text-[2.1rem] font-medium leading-[1.05] tracking-[-0.025em] sm:text-5xl md:text-6xl">
            {category.name}
          </h1>
          <p className="mt-3.5 max-w-2xl font-serif text-[16px] leading-[1.55] text-muted headline-pretty sm:mt-5 sm:text-lg">
            {category.description}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
        {tags.length > 0 && (
          <div className="mb-7 flex flex-wrap gap-2 sm:mb-10">
            <button
              type="button"
              onClick={() => {
                setTag(null);
                setPage(1);
              }}
              aria-pressed={tag === null}
              className={`h-9 px-3 font-sans text-xs font-semibold uppercase tracking-wide ${
                tag === null ? "bg-ink text-paper" : "border border-rule text-muted hover:text-ink"
              }`}
            >
              All
            </button>
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTag(t);
                  setPage(1);
                }}
                aria-pressed={tag === t}
                className={`h-9 px-3 font-sans text-xs font-semibold uppercase tracking-wide ${
                  tag === t ? "bg-ink text-paper" : "border border-rule text-muted hover:text-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {featured && (
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <ArticleCard article={featured} variant="feature" />
            </div>
            <div className="space-y-6 lg:col-span-4">
              <AdSlot size="square" />
              <Newsletter variant="compact" />
            </div>
          </div>
        )}

        <div className="mt-10 sm:mt-16">
          <div className="flex items-end justify-between gap-3 border-b border-ink pb-2.5 sm:pb-3">
            <h2 className="font-display text-xl font-medium tracking-tight sm:text-2xl">
              Latest in {category.navLabel}
            </h2>
            <p className="shrink-0 font-sans text-[11px] text-faint">{filtered.length} demo stories</p>
          </div>
          <div className="mt-6 grid gap-6 sm:mt-8 sm:gap-8 md:grid-cols-2 md:gap-10">
            {paged.map((a) => (
              <ArticleCard key={a.id} article={a} variant="horizontal" />
            ))}
          </div>
          {rest.length === 0 && (
            <p className="mt-8 font-serif text-muted">No further stories in this filter.</p>
          )}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2" role="navigation" aria-label="Pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-label={`Page ${n}`}
                  aria-current={n === page ? "page" : undefined}
                  className={`h-10 w-10 font-sans text-sm ${
                    n === page ? "bg-ink text-paper" : "border border-rule text-ink hover:border-ink"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
