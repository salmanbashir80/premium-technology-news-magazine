import { Link } from "react-router-dom";
import { publishedArticles } from "../data/articles";
import { ArticleCard } from "../components/ui/ArticleCard";
import { Newsletter } from "../components/ui/Newsletter";
import { AdSlot } from "../components/ui/AdSlot";
import { getAuthor } from "../data/authors";
import { categoryMap } from "../data/categories";
import { formatDateShort } from "../lib/format";

export function HomePage() {
  const featured = publishedArticles.find((a) => a.isFeatured) ?? publishedArticles[0];
  const breaking = publishedArticles.filter((a) => a.isBreaking);
  const rest = publishedArticles.filter((a) => a.id !== featured.id);
  const secondary = rest.slice(0, 3);
  const latest = rest.slice(0, 6);
  const trending = publishedArticles.filter((a) => a.isTrending).slice(0, 5);
  const picks = publishedArticles.filter((a) => a.isEditorsPick).slice(0, 4);
  const ai = publishedArticles.filter((a) => a.category === "ai").slice(0, 4);
  const tech = publishedArticles.filter((a) => a.category === "technology").slice(0, 3);
  const startups = publishedArticles.filter((a) => a.category === "startups").slice(0, 3);
  const business = publishedArticles.filter((a) => a.category === "business").slice(0, 3);
  const cyber = publishedArticles.filter((a) => a.category === "cybersecurity").slice(0, 3);
  const commerce = publishedArticles.filter((a) => a.category === "ecommerce").slice(0, 3);
  const guides = publishedArticles.filter((a) => a.category === "guides").slice(0, 3);

  return (
    <div>
      <h1 className="sr-only">Signal Desk: technology news and analysis</h1>
      {/* Latest news ticker — single line, horizontally scrollable on mobile */}
      {breaking.length > 0 && (
        <section aria-label="Latest news" className="border-b border-rule bg-paper">
          <div className="mx-auto flex max-w-7xl items-center gap-2.5 px-4 py-1.5 sm:gap-4 sm:px-6 sm:py-2.5">
            <span className="shrink-0 bg-newsred px-1.5 py-0.5 font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-paper sm:text-[10px]">
              Latest
            </span>
            <ul className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] sm:flex-wrap sm:gap-x-6 sm:whitespace-normal [&::-webkit-scrollbar]:hidden">
              {breaking.map((a) => (
                <li key={a.id} className="shrink-0 sm:shrink">
                  <Link
                    to={`/article/${a.slug}`}
                    className="font-sans text-[12.5px] font-medium text-ink hover:text-emerald sm:text-sm"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Lead well */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-9 md:py-11">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-8">
            <ArticleCard article={featured} variant="feature" />
          </div>
          <div className="min-w-0 border-t border-rule pt-6 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="kicker mb-4 sm:mb-5">Also on the desk</p>
            <div className="flex flex-col gap-5">
              {secondary.map((a) => (
                <ArticleCard key={a.id} article={a} variant="secondary" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Latest feed */}
      <div className="border-y border-rule bg-paper">
        <div className="mx-auto grid max-w-7xl gap-x-6 gap-y-4 px-4 py-6 sm:px-6 sm:py-8 md:grid-cols-12">
          <div className="md:col-span-2">
            <p className="kicker">Latest</p>
            <h2 className="mt-1 font-display text-xl font-medium tracking-tight sm:text-2xl">
              The feed
            </h2>
          </div>
          <div className="grid gap-x-8 gap-y-1 divide-y divide-rule sm:grid-cols-2 sm:divide-y-0 md:col-span-10 lg:grid-cols-3">
            {latest.map((a) => (
              <ArticleCard key={a.id} article={a} variant="text" />
            ))}
          </div>
        </div>
      </div>

      {/* AI section */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <SectionHead
          kicker="Artificial Intelligence"
          title="The models, the machines, the megawatts."
          to="/category/ai"
        />
        <div className="mt-6 grid gap-8 sm:mt-8 lg:grid-cols-12">
          <div className="lg:col-span-7">{ai[0] && <ArticleCard article={ai[0]} />}</div>
          <div className="flex flex-col gap-5 sm:gap-6 lg:col-span-5">
            {ai.slice(1).map((a) => (
              <ArticleCard key={a.id} article={a} variant="horizontal" />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 sm:pb-6">
        <AdSlot />
      </div>

      {/* Two-column sections */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-12">
        <section>
          <SectionHead
            kicker="Technology"
            title="Chips, cloud and the physical internet."
            to="/category/technology"
          />
          <div className="mt-5 flex flex-col gap-5 sm:mt-6 sm:gap-6">
            {tech.map((a) => (
              <ArticleCard key={a.id} article={a} variant="minimal" />
            ))}
          </div>
        </section>
        <section>
          <SectionHead
            kicker="Startups"
            title="Building companies without the fog machine."
            to="/category/startups"
          />
          <div className="mt-5 flex flex-col gap-5 sm:mt-6 sm:gap-6">
            {startups.map((a) => (
              <ArticleCard key={a.id} article={a} variant="minimal" />
            ))}
          </div>
        </section>
      </div>

      {/* Trending + picks */}
      <div className="bg-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHead kicker="Trending" title="What readers are returning to." />
            <ol className="mt-6 divide-y divide-rule border-y border-rule sm:mt-8">
              {trending.map((a, i) => {
                const author = getAuthor(a.authorId);
                return (
                  <li key={a.id} className="grid grid-cols-[auto_1fr] gap-4 py-4 sm:gap-5 sm:py-5">
                    <span aria-hidden="true" className="font-display text-2xl font-medium leading-none text-faint sm:text-4xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="kicker">{categoryMap[a.category].kicker}</p>
                      <h3 className="mt-1 font-display text-[1.15rem] font-medium leading-[1.2] tracking-[-0.018em] sm:text-xl">
                        <Link to={`/article/${a.slug}`} className="hover:text-emerald">
                          {a.title}
                        </Link>
                      </h3>
                      <p className="mt-1.5 font-sans text-[11.5px] text-faint">
                        {author?.name}
                        <span className="mx-1.5 text-rule-strong">·</span>
                        {formatDateShort(a.publishedAt)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="lg:col-span-5">
            <SectionHead kicker="Editor’s picks" title="The desk’s recommended reading." />
            <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
              {picks.map((a) => (
                <ArticleCard key={a.id} article={a} variant="horizontal" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <Newsletter />
      </div>

      {/* Three-column briefs */}
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 sm:px-6 sm:pb-16 lg:grid-cols-3 lg:gap-12">
        <section>
          <SectionHead kicker="Business" title="Markets and power." to="/category/business" />
          <div className="mt-3 divide-y divide-rule sm:mt-4">
            {business.map((a) => (
              <ArticleCard key={a.id} article={a} variant="text" />
            ))}
          </div>
        </section>
        <section>
          <SectionHead
            kicker="Cybersecurity"
            title="The operational reality."
            to="/category/cybersecurity"
          />
          <div className="mt-3 divide-y divide-rule sm:mt-4">
            {cyber.map((a) => (
              <ArticleCard key={a.id} article={a} variant="text" />
            ))}
          </div>
        </section>
        <section>
          <SectionHead kicker="E-commerce" title="From cart to warehouse." to="/category/ecommerce" />
          <div className="mt-3 divide-y divide-rule sm:mt-4">
            {commerce.map((a) => (
              <ArticleCard key={a.id} article={a} variant="text" />
            ))}
          </div>
        </section>
      </div>

      {/* Guides */}
      <div className="border-t border-rule bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <SectionHead
            kicker="Guides & Analysis"
            title="Frameworks for people who have to decide."
            to="/category/guides"
          />
          <div className="mt-6 grid gap-8 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHead({ kicker, title, to }: { kicker: string; title: string; to?: string }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-ink pb-2.5 sm:pb-3">
      <div className="min-w-0">
        <p className="kicker">{kicker}</p>
        <h2 className="mt-1 font-display text-[1.35rem] font-medium leading-tight tracking-[-0.02em] sm:text-2xl md:text-[1.7rem]">
          {title}
        </h2>
      </div>
      {to && (
        <Link
          to={to}
          className="hidden shrink-0 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald hover:underline sm:inline"
        >
          View section
        </Link>
      )}
    </div>
  );
}
