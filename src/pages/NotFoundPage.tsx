import { Link } from "react-router-dom";
import { brand } from "../config/brand";
import { categories } from "../data/categories";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
      <p className="kicker">404 Error · Not Found</p>
      <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-5xl">
        This story or section could not be found.
      </h1>
      <p className="mx-auto mt-4 max-w-lg font-serif text-lg leading-relaxed text-muted">
        The requested address does not correspond to an article or resource in our library.
      </p>
      
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="inline-block border border-ink bg-ink px-6 py-3 font-sans text-sm font-semibold text-paper transition-colors hover:bg-emerald hover:border-emerald"
        >
          Return to the Homepage
        </Link>
        <Link
          to="/search"
          className="inline-block border border-rule px-6 py-3 font-sans text-sm font-semibold text-ink transition-colors hover:border-ink"
        >
          Search Articles
        </Link>
      </div>

      <div className="mt-14 border-t border-rule pt-8">
        <p className="font-sans text-xs uppercase tracking-wider text-faint">Explore Sections</p>
        <ul className="mt-4 flex flex-wrap justify-center gap-3">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                to={`/category/${c.slug}`}
                className="font-sans text-xs font-medium text-muted hover:text-emerald"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-sans text-xs text-faint">{brand.demoNotice}</p>
      </div>
    </div>
  );
}
