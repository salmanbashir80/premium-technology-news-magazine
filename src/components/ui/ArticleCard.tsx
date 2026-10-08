import { Link } from "react-router-dom";
import type { Article } from "../../types";
import { categoryMap } from "../../data/categories";
import { getAuthor } from "../../data/authors";
import { formatDateShort } from "../../lib/format";
import { cn } from "../../utils/cn";

type Variant = "feature" | "secondary" | "standard" | "horizontal" | "minimal" | "text";

export function ArticleCard({
  article,
  variant = "standard",
  className,
}: {
  article: Article;
  variant?: Variant;
  className?: string;
}) {
  const category = categoryMap[article.category];
  const author = getAuthor(article.authorId);

  if (variant === "text") {
    return (
      <article className={cn("py-3", className)}>
        <Link to={`/article/${article.slug}`} className="group block">
          <p className="kicker">{category.kicker}</p>
          <h3 className="mt-1 font-display text-[1.0625rem] font-medium leading-[1.25] tracking-[-0.015em] text-ink group-hover:text-emerald sm:text-[1.15rem]">
            {article.title}
          </h3>
          <p className="mt-1.5 font-sans text-[11.5px] text-faint">
            {author?.name}
            <span className="mx-1.5 text-rule-strong">·</span>
            {formatDateShort(article.publishedAt)}
          </p>
        </Link>
      </article>
    );
  }

  if (variant === "minimal") {
    return (
      <article className={cn("border-t border-rule pt-4", className)}>
        <Link to={`/article/${article.slug}`} className="group block">
          <p className="kicker">{category.kicker}</p>
          <h3 className="mt-2 font-display text-[1.25rem] font-medium leading-[1.18] tracking-[-0.018em] text-ink group-hover:text-emerald sm:text-[1.35rem]">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 font-serif text-[14.5px] leading-[1.55] text-muted sm:text-[15px]">
            {article.excerpt}
          </p>
          <p className="mt-2.5 font-sans text-[11.5px] text-faint">
            {author?.name}
            <span className="mx-1.5 text-rule-strong">·</span>
            {article.readingTime} min
          </p>
        </Link>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article
        className={cn(
          "group grid grid-cols-[104px_1fr] gap-3.5 sm:grid-cols-[180px_1fr] sm:gap-5",
          className,
        )}
      >
        <Link
          to={`/article/${article.slug}`}
          className="block self-start overflow-hidden bg-sand"
          tabIndex={-1}
          aria-hidden
        >
          <img
            src={article.featuredImage}
            alt=""
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <div className="min-w-0">
          <p className="kicker">{category.kicker}</p>
          <h3 className="mt-1 font-display text-[1.0625rem] font-medium leading-[1.22] tracking-[-0.015em] text-ink sm:text-xl">
            <Link to={`/article/${article.slug}`} className="hover:text-emerald">
              {article.title}
            </Link>
          </h3>
          <p className="mt-2 hidden font-serif text-[15px] leading-[1.55] text-muted sm:line-clamp-2">
            {article.dek}
          </p>
          <p className="mt-1.5 font-sans text-[11.5px] text-faint sm:mt-2">
            {author?.name}
            <span className="mx-1.5 text-rule-strong">·</span>
            {formatDateShort(article.publishedAt)}
            <span className="mx-1.5 hidden text-rule-strong sm:inline">·</span>
            <span className="hidden sm:inline">{article.readingTime} min</span>
          </p>
        </div>
      </article>
    );
  }

  if (variant === "secondary") {
    return (
      <article
        className={cn("group flex gap-4 border-b border-rule pb-5 last:border-0 last:pb-0", className)}
      >
        <div className="min-w-0 flex-1">
          <p className="kicker">{category.kicker}</p>
          <h3 className="mt-1.5 font-display text-[1.15rem] font-medium leading-[1.2] tracking-[-0.018em] text-ink sm:text-[1.3rem]">
            <Link to={`/article/${article.slug}`} className="hover:text-emerald">
              {article.title}
            </Link>
          </h3>
          <p className="mt-2 font-sans text-[11.5px] text-faint">
            {author?.name}
            <span className="mx-1.5 text-rule-strong">·</span>
            {article.readingTime} min
          </p>
        </div>
        <Link
          to={`/article/${article.slug}`}
          className="w-[84px] shrink-0 self-start overflow-hidden bg-sand sm:w-28"
          tabIndex={-1}
          aria-hidden
        >
          <img
            src={article.featuredImage}
            alt=""
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
        </Link>
      </article>
    );
  }

  if (variant === "feature") {
    return (
      <article className={cn("group", className)}>
        <Link to={`/article/${article.slug}`} className="block overflow-hidden bg-sand">
          <img
            src={article.featuredImage}
            alt={article.featuredImageCaption}
            fetchPriority="high"
            className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] sm:aspect-[16/10]"
          />
        </Link>
        <div className="pt-3.5 sm:pt-5">
          <p className="kicker">{category.kicker}</p>
          <h2 className="mt-2.5 max-w-[22ch] font-display text-[1.75rem] font-medium leading-[1.08] tracking-[-0.022em] text-ink headline-balance sm:text-[2.3rem] md:text-[2.7rem] lg:text-[3rem]">
            <Link to={`/article/${article.slug}`} className="hover:text-emerald-deep">
              {article.title}
            </Link>
          </h2>
          <p className="mt-3 max-w-2xl font-serif text-[16px] leading-[1.55] text-muted headline-pretty sm:mt-4 sm:text-lg md:text-xl">
            {article.dek}
          </p>
          <p className="mt-3.5 font-sans text-[12.5px] text-faint sm:text-[13px]">
            By{" "}
            <Link to={`/author/${author?.slug}`} className="font-semibold text-ink hover:text-emerald">
              {author?.name}
            </Link>
            <span className="mx-1.5 text-rule-strong">·</span>
            {formatDateShort(article.publishedAt)}
            <span className="mx-1.5 text-rule-strong">·</span>
            {article.readingTime} min read
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className={cn("group", className)}>
      <Link to={`/article/${article.slug}`} aria-label={article.title} className="block overflow-hidden bg-sand">
        <img
          src={article.featuredImage}
          alt=""
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <p className="kicker mt-3.5">{category.kicker}</p>
      <h3 className="mt-1.5 font-display text-[1.2rem] font-medium leading-[1.18] tracking-[-0.018em] text-ink sm:text-[1.3rem]">
        <Link to={`/article/${article.slug}`} className="hover:text-emerald">
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 font-serif text-[14.5px] leading-[1.55] text-muted sm:text-[15px]">
        {article.excerpt}
      </p>
      <p className="mt-2.5 font-sans text-[11.5px] text-faint">
        {author?.name}
        <span className="mx-1.5 text-rule-strong">·</span>
        {article.readingTime} min
      </p>
    </article>
  );
}
