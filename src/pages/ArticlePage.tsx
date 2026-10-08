import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  articlesByAuthor,
  getArticle,
  moreFromCategory,
  relatedArticles,
} from "../data/articles";
import { getAuthor } from "../data/authors";
import { categoryMap } from "../data/categories";
import { formatDateTime } from "../lib/format";
import { ArticleBody } from "../components/article/ArticleBody";
import { AuthorCard } from "../components/article/AuthorCard";
import { KeyTakeaways } from "../components/article/KeyTakeaways";
import { ShareBar } from "../components/article/ShareBar";
import { TableOfContents } from "../components/article/TableOfContents";
import { ReadingProgress } from "../components/article/ReadingProgress";
import { CorrectionsNote, SourceList } from "../components/article/SourceList";
import { ArticleCard } from "../components/ui/ArticleCard";
import { Newsletter } from "../components/ui/Newsletter";
import { AdSlot } from "../components/ui/AdSlot";
import { brand } from "../config/brand";

export function ArticlePage() {
  const { slug } = useParams();
  const article = slug ? getArticle(slug) : undefined;

  /** Split the body so a discreet in-article advert sits at a natural section break. */
  const split = useMemo(() => {
    if (!article) return { first: [], second: [] };
    const blocks = article.body;
    const headingPositions = blocks.map((b, i) => (b.type === "h2" ? i : -1)).filter((i) => i > 0);
    const target = headingPositions[1] ?? Math.ceil(blocks.length / 2);
    return { first: blocks.slice(0, target), second: blocks.slice(target) };
  }, [article]);

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:py-24">
        <p className="kicker">Not found</p>
        <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
          This story is not in the demo library.
        </h1>
        <p className="mt-3 font-serif text-muted">
          The prototype only contains a fixed set of illustrative articles.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block border border-ink px-5 py-2.5 text-sm font-semibold text-ink hover:bg-ink hover:text-paper"
        >
          Return to the homepage
        </Link>
      </div>
    );
  }

  const author = getAuthor(article.authorId);
  const category = categoryMap[article.category];
  const related = relatedArticles(article, 3);
  const sidebarStories = moreFromCategory(article, related, 4);
  const authorStories = author ? articlesByAuthor(author.id).length : 0;
  const wasUpdated = article.updatedAt !== article.publishedAt;

  return (
    <>
      <ReadingProgress targetId="article-root" />

      <article id="article-root" className="bg-paper">
        {/* ---------------- Headline block ---------------- */}
        <header className="mx-auto max-w-4xl px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-7 md:pt-9">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-1.5 font-sans text-[11.5px] text-faint">
              <li>
                <Link to="/" className="hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-rule-strong">
                /
              </li>
              <li>
                <Link to={`/category/${category.slug}`} className="hover:text-ink">
                  {category.name}
                </Link>
              </li>
            </ol>
          </nav>

          <div className="mt-3.5 flex flex-wrap items-center gap-2 sm:mt-5">
            <Link to={`/category/${category.slug}`} className="kicker hover:underline">
              {category.kicker}
            </Link>
            {article.isBreaking && (
              <span className="bg-newsred px-1.5 py-0.5 font-sans text-[9.5px] font-bold uppercase tracking-[0.12em] text-paper">
                Developing
              </span>
            )}
          </div>

          <h1 className="mt-2 max-w-[21ch] font-display text-[1.8rem] font-medium leading-[1.11] tracking-[-0.022em] text-ink headline-balance sm:text-[2.55rem] sm:leading-[1.06] md:text-[3.05rem] lg:text-[3.35rem]">
            {article.title}
          </h1>

          <p className="mt-3.5 max-w-[46ch] font-serif text-[16.5px] leading-[1.5] text-muted headline-pretty sm:mt-5 sm:text-xl md:text-[1.3rem]">
            {article.dek}
          </p>

          {/* Compact author metadata */}
          <div className="mt-5 border-t border-rule pt-3.5 sm:mt-7 sm:pt-4">
            <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between md:gap-6">
              {author && (
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Link to={`/author/${author.slug}`} aria-label={`About ${author.name}`} className="shrink-0">
                    <img
                      src={author.image}
                      alt=""
                      width={44}
                      height={44}
                      className="h-10 w-10 object-cover sm:h-11 sm:w-11"
                    />
                  </Link>
                  <div className="min-w-0">
                    <p className="font-sans text-[13px] leading-tight sm:text-[13.5px]">
                      <span className="text-muted">By </span>
                      <Link to={`/author/${author.slug}`} className="font-semibold hover:text-emerald">
                        {author.name}
                      </Link>
                      <span className="text-muted"> · {author.role}</span>
                    </p>
                    <p className="mt-1 font-sans text-[11px] leading-[1.45] text-faint sm:text-[11.5px]">
                      <time dateTime={article.publishedAt}>
                        {formatDateTime(article.publishedAt)}
                      </time>
                      {wasUpdated && (
                        <>
                          <span className="mx-1.5 text-rule-strong">·</span>
                          <span>
                            Updated{" "}
                            <time dateTime={article.updatedAt}>
                              {formatDateTime(article.updatedAt)}
                            </time>
                          </span>
                        </>
                      )}
                      <span className="mx-1.5 text-rule-strong">·</span>
                      <span className="whitespace-nowrap">{article.readingTime} min read</span>
                    </p>
                  </div>
                </div>
              )}
              <div className="md:shrink-0">
                <ShareBar title={article.title} slug={article.slug} />
              </div>
            </div>
          </div>
        </header>

        {/* ---------------- Featured image ---------------- */}
        <figure className="mx-auto max-w-6xl sm:px-6">
          <img
            src={article.featuredImage}
            alt={article.featuredImageCaption}
            fetchPriority="high"
            className="aspect-[4/3] w-full object-cover sm:aspect-[16/9]"
          />
          <figcaption className="mx-4 mt-2.5 max-w-3xl font-sans text-[11.5px] leading-[1.5] text-faint sm:mx-0">
            {article.featuredImageCaption}
            <span className="mx-1.5 text-rule-strong">/</span>
            <span className="uppercase tracking-wide">{article.featuredImageCredit}</span>
          </figcaption>
        </figure>

        {/* ---------------- Body + rails ---------------- */}
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-7 sm:px-6 sm:pb-14 sm:pt-10">
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-8">
              <div className="article-measure">
                <div className="lg:hidden">
                  <TableOfContents blocks={article.body} variant="inline" />
                </div>

                <div className="mt-5 lg:mt-0">
                  <KeyTakeaways items={article.keyTakeaways} />
                </div>

                <div className="mt-7 sm:mt-9">
                  <ArticleBody blocks={split.first} lead />
                </div>

                <div className="my-9 sm:my-10">
                  <AdSlot label="Advertisement" />
                </div>

                <ArticleBody blocks={split.second} />

                {/* Tags */}
                {article.tags.length > 0 && (
                  <div className="mt-10 border-t border-rule pt-5">
                    <p className="kicker">Filed under</p>
                    <ul className="mt-2.5 flex flex-wrap gap-1.5">
                      {article.tags.map((t) => (
                        <li key={t}>
                          <Link
                            to={`/search?q=${encodeURIComponent(t)}`}
                            className="inline-block border border-rule px-2.5 py-1 font-sans text-[11.5px] text-muted hover:border-ink hover:text-ink"
                          >
                            {t}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-9 flex flex-col gap-4 border-y border-rule py-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-sans text-[13px] text-muted">
                    Share this story from the desk.
                  </p>
                  <ShareBar title={article.title} slug={article.slug} />
                </div>

                <div className="mt-9 space-y-7 sm:mt-10 sm:space-y-8">
                  <SourceList sources={article.sources} />
                  <CorrectionsNote corrections={article.corrections} />
                  {author && <AuthorCard author={author} storyCount={authorStories} />}
                  <Newsletter variant="article" />
                  <p className="font-sans text-[11.5px] leading-relaxed text-faint">
                    {brand.demoNotice}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4" aria-label="Article extras">
              <div className="space-y-7 lg:sticky lg:top-6">
                <div className="hidden lg:block">
                  <TableOfContents blocks={article.body} />
                </div>
                <div className="hidden lg:block">
                  <ShareBar title={article.title} slug={article.slug} variant="rail" />
                </div>
                <AdSlot size="square" />
                <div className="border-t-2 border-ink pt-4">
                  <p className="kicker">More from the desk</p>
                  <div className="mt-2 divide-y divide-rule">
                    {sidebarStories.map((a) => (
                      <ArticleCard key={a.id} article={a} variant="text" />
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ---------------- Related ---------------- */}
        {related.length > 0 && (
          <section className="border-t border-rule bg-canvas" aria-labelledby="related-heading">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
              <div className="border-b border-ink pb-2.5 sm:pb-3">
                <p className="kicker">Related</p>
                <h2
                  id="related-heading"
                  className="mt-1 font-display text-[1.4rem] font-medium tracking-[-0.02em] sm:text-[1.75rem]"
                >
                  Further reading from the desk
                </h2>
              </div>
              <div className="mt-6 grid gap-8 sm:mt-7 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
              <div className="mt-9 sm:mt-10">
                <AdSlot label="Advertisement — footer placement" />
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
