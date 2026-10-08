import { Link } from "react-router-dom";
import type { Author } from "../../types";

export function AuthorCard({ author, storyCount }: { author: Author; storyCount?: number }) {
  return (
    <aside className="border border-rule bg-canvas p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
        <Link to={`/author/${author.slug}`} aria-label={`About ${author.name}`} className="shrink-0">
          <img
            src={author.image}
            alt=""
            loading="lazy"
            className="h-20 w-20 object-cover sm:h-24 sm:w-24"
          />
        </Link>
        <div className="min-w-0">
          <p className="kicker">About the author</p>
          <h3 className="mt-1 font-display text-2xl font-medium leading-tight tracking-tight">
            <Link to={`/author/${author.slug}`} className="hover:text-emerald">
              {author.name}
            </Link>
          </h3>
          <p className="mt-0.5 font-sans text-[13px] text-muted">
            {author.role} · {author.location}
          </p>
          <p className="mt-3 font-serif text-[15px] leading-[1.65] text-ink-soft">{author.bio}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {author.expertise.map((e) => (
              <span
                key={e}
                className="border border-rule-strong px-2 py-0.5 font-sans text-[10.5px] uppercase tracking-[0.08em] text-muted"
              >
                {e}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-[13px]">
            <Link to={`/author/${author.slug}`} className="font-semibold text-emerald hover:underline">
              {storyCount ? `All ${storyCount} stories` : "All stories"}
            </Link>
            <a href={`mailto:${author.email}`} className="text-muted hover:text-ink">
              Email
            </a>
            <a href={author.social.linkedin} target="_blank" rel="noreferrer" className="text-muted hover:text-ink">
              LinkedIn
            </a>
            <a href={author.social.x} target="_blank" rel="noreferrer" className="text-muted hover:text-ink">
              X
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
