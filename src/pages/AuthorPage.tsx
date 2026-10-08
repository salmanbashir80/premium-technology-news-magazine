import { Link, useParams } from "react-router-dom";
import { authors } from "../data/authors";
import { articlesByAuthor } from "../data/articles";
import { ArticleCard } from "../components/ui/ArticleCard";

export function AuthorPage() {
  const { slug } = useParams();
  const author = authors.find((a) => a.slug === slug);

  if (!author) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Author not found</h1>
        <Link to="/" className="mt-4 inline-block text-emerald">
          Back home
        </Link>
      </div>
    );
  }

  const stories = articlesByAuthor(author.id);

  return (
    <div>
      <div className="border-b border-rule bg-paper">
        <div className="mx-auto grid max-w-5xl gap-5 px-4 py-8 sm:gap-8 sm:px-6 sm:py-12 md:grid-cols-[200px_1fr] md:py-16">
          <img
            src={author.image}
            alt={author.name}
            className="h-44 w-full object-cover sm:h-56 md:h-64"
          />
          <div>
            <p className="kicker">Correspondent</p>
            <h1 className="mt-1.5 font-display text-[2.1rem] font-medium leading-tight tracking-[-0.025em] sm:text-4xl md:text-5xl">
              {author.name}
            </h1>
            <p className="mt-1.5 font-sans text-[13px] text-muted sm:text-sm">
              {author.role} · {author.location}
            </p>
            <p className="mt-4 max-w-2xl font-serif text-[16px] leading-[1.6] text-ink-soft sm:mt-5 sm:text-lg">
              {author.bio}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {author.expertise.map((e) => (
                <span key={e} className="border border-rule px-2.5 py-1 font-sans text-[11px] uppercase tracking-wide text-muted">
                  {e}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-4 font-sans text-sm">
              <a href={`mailto:${author.email}`} className="break-all text-emerald hover:underline">
                {author.email}
              </a>
              <a href={author.social.linkedin} className="text-muted hover:text-ink" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <h2 className="border-b border-ink pb-2.5 font-display text-xl font-medium tracking-tight sm:pb-3 sm:text-2xl">
          Stories
        </h2>
        <div className="mt-6 space-y-6 sm:mt-8 sm:space-y-8">
          {stories.map((a) => (
            <ArticleCard key={a.id} article={a} variant="horizontal" />
          ))}
        </div>
      </div>
    </div>
  );
}
