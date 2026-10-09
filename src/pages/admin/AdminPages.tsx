import { useState, useId } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { statusMeta, StatusBadge } from "../../components/admin/status";
import type { Article, ArticleStatus, CategorySlug } from "../../types";
import { mediaLibrary, automationJobs } from "../../data/admin";
import { categoryMap, categories } from "../../data/categories";
import { formatDateTime } from "../../lib/format";
import { authors } from "../../data/authors";
import { CheckCircle2, Plus, ShieldAlert } from "lucide-react";

const nextStatus: Partial<Record<ArticleStatus, ArticleStatus>> = {
  discovered: "researching",
  researching: "draft",
  draft: "fact_check",
  drafted: "editorial_review",
  fact_check: "editorial_review",
  editorial_review: "approved",
  needs_review: "approved",
  approved: "published",
  scheduled: "published",
};

export function AdminOverview() {
  const { adminItems, liveArticles, role } = useApp();

  const publishedCount = liveArticles.filter((a) => a.status === "published").length;
  const draftCount = liveArticles.filter((a) => a.status === "draft" || a.status === "drafted").length;
  const reviewCount = liveArticles.filter((a) => a.status === "editorial_review" || a.status === "fact_check" || a.status === "needs_review").length;
  const discoveredCount = adminItems.filter((i) => i.status === "discovered").length;
  const researchingCount = adminItems.filter((i) => i.status === "researching").length;

  const stats = [
    { label: "Live Published", count: publishedCount, status: "published" as ArticleStatus, hint: "Publicly visible on website" },
    { label: "In Review", count: reviewCount, status: "editorial_review" as ArticleStatus, hint: "Awaiting editor sign-off" },
    { label: "Active Drafts", count: draftCount, status: "draft" as ArticleStatus, hint: "Work-in-progress copy" },
    { label: "Researching", count: researchingCount, status: "researching" as ArticleStatus, hint: "Gathering sources & facts" },
    { label: "Intake / Discovered", count: discoveredCount, status: "discovered" as ArticleStatus, hint: "Candidate story leads" },
  ];

  return (
    <div>
      <Header
        kicker="Overview"
        title="Newsroom at a glance"
        dek="Live Supabase PostgreSQL connection active. All changes reflect in the canonical database."
      />

      <div className="mt-4 flex items-center gap-2 border border-emerald/30 bg-emerald-soft/30 px-3 py-2 text-xs text-emerald-deep">
        <CheckCircle2 size={14} className="shrink-0" />
        <span>
          Supabase Project: <strong>Signal-Desk-News</strong> (us-east-1) · Active Session Role: <strong>{role || "STAFF"}</strong> · RLS Enforced
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="border border-rule bg-paper p-4">
            <StatusBadge status={s.status} />
            <p className="mt-3 font-display text-3xl">{s.count}</p>
            <p className="mt-1 font-sans text-xs font-medium text-ink">{s.label}</p>
            <p className="mt-1 font-sans text-[11px] leading-snug text-faint">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="border border-rule bg-paper p-5">
          <div className="flex items-center justify-between border-b border-rule pb-3">
            <p className="kicker">Needs Editorial Attention</p>
            <Link to="/admin/approvals" className="text-xs font-semibold text-emerald hover:underline">
              View queue →
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-rule">
            {liveArticles
              .filter((a) => a.status === "editorial_review" || a.status === "fact_check" || a.status === "draft")
              .slice(0, 5)
              .map((a) => (
                <li key={a.id} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-sans text-sm font-medium">{a.title}</p>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="mt-1 text-xs text-faint">
                    {a.authorId} · Section: {a.category} · {a.readingTime} min read
                  </p>
                </li>
              ))}
            {liveArticles.filter((a) => a.status === "editorial_review" || a.status === "fact_check" || a.status === "draft").length === 0 && (
              <li className="py-4 text-center text-xs text-muted">
                No articles currently pending review.
              </li>
            )}
          </ul>
        </div>

        <div className="border border-rule bg-paper p-5">
          <p className="kicker">Connected Infrastructure</p>
          <ul className="mt-4 space-y-2.5 font-sans text-sm text-ink-soft">
            <li className="flex items-center justify-between border-b border-rule pb-2">
              <span>Supabase PostgreSQL 17</span>
              <span className="font-mono text-xs font-bold text-emerald">CONNECTED (RLS ON)</span>
            </li>
            <li className="flex items-center justify-between border-b border-rule pb-2">
              <span>Cloudflare Worker SSR</span>
              <span className="font-mono text-xs font-bold text-emerald">ACTIVE (Edge Hydration)</span>
            </li>
            <li className="flex items-center justify-between border-b border-rule pb-2">
              <span>GitHub Version Control</span>
              <span className="font-mono text-xs font-bold text-emerald">phase-3-supabase-cms</span>
            </li>
            <li className="flex items-center justify-between border-b border-rule pb-2">
              <span>Hermes AI Pipeline</span>
              <span className="font-mono text-xs text-faint">READY FOR INTEGRATION</span>
            </li>
            <li className="flex items-center justify-between">
              <span>n8n Orchestration</span>
              <span className="font-mono text-xs text-faint">READY FOR INTEGRATION</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function DiscoveryPage() {
  return <QueuePage title="News discovery" kicker="Intake" statuses={["discovered"]} />;
}

export function ResearchPage() {
  return <QueuePage title="Research queue" kicker="Reporting" statuses={["researching"]} />;
}

export function DraftsPage() {
  const { liveArticles, createArticle } = useApp();
  const [isCreating, setIsCreating] = useState(false);

  const drafts = liveArticles.filter(
    (a) => a.status === "draft" || a.status === "drafted"
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Header
          kicker="Editorial Drafting"
          title="Draft articles"
          dek="Articles currently being written. Staff can draft stories and submit them to fact-checking."
        />
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-1.5 bg-[#161615] px-4 py-2 text-xs font-bold uppercase tracking-widest text-paper hover:bg-emerald"
        >
          <Plus size={14} /> New Article
        </button>
      </div>

      {isCreating && (
        <ArticleEditorModal
          initialArticle={{ status: "draft" }}
          onClose={() => setIsCreating(false)}
          onSave={async (draft) => {
            await createArticle(draft);
            setIsCreating(false);
          }}
        />
      )}

      <div role="region" aria-label="Drafts table" tabIndex={0} className="relative mt-6 overflow-x-auto border border-rule bg-paper">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-canvas font-sans text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Headline</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {drafts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No active draft articles. Click "New Article" to create one in Supabase.
                </td>
              </tr>
            )}
            {drafts.map((d) => (
              <tr key={d.id} className="border-t border-rule">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{d.title}</p>
                  <p className="mt-0.5 text-xs text-muted truncate max-w-md">{d.dek}</p>
                </td>
                <td className="px-4 py-3 uppercase text-xs tracking-wider">{d.category}</td>
                <td className="px-4 py-3 text-xs">{d.authorId}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={d.status} />
                </td>
                <td className="px-4 py-3 text-xs text-faint">{formatDateTime(d.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ApprovalsPage() {
  const { liveArticles, updateArticle, role } = useApp();
  const canPublish = role === "OWNER" || role === "ADMIN" || role === "EDITOR";

  const approvalItems = liveArticles.filter(
    (a) =>
      a.status === "fact_check" ||
      a.status === "editorial_review" ||
      a.status === "needs_review" ||
      a.status === "approved" ||
      a.status === "scheduled"
  );

  const handleApproveAndPublish = async (articleId: string) => {
    if (!canPublish) {
      alert("Permission Denied: Only EDITOR, ADMIN, or OWNER can approve or publish articles.");
      return;
    }
    await updateArticle(articleId, {
      status: "published",
      publishedAt: new Date().toISOString(),
    });
  };

  const handleApprove = async (articleId: string) => {
    if (!canPublish) {
      alert("Permission Denied: Only EDITOR, ADMIN, or OWNER can approve articles.");
      return;
    }
    await updateArticle(articleId, { status: "approved" });
  };

  const handleReject = async (articleId: string) => {
    await updateArticle(articleId, { status: "rejected" });
  };

  return (
    <div>
      <Header
        kicker="Quality & Standards"
        title="Editorial approvals queue"
        dek="Articles requiring verification and senior editor approval prior to live edge publication."
      />

      {!canPublish && (
        <div className="mt-4 flex items-center gap-2 border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
          <ShieldAlert size={15} className="shrink-0" />
          <span>
            Logged in as <strong>{role || "RESEARCHER"}</strong>. Approval & publication actions require an <strong>EDITOR</strong>, <strong>ADMIN</strong>, or <strong>OWNER</strong> role.
          </span>
        </div>
      )}

      <div role="region" aria-label="Approvals table" tabIndex={0} className="relative mt-6 overflow-x-auto border border-rule bg-paper">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-canvas font-sans text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Headline</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Current Stage</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvalItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  Queue is clear. No articles awaiting approval.
                </td>
              </tr>
            )}
            {approvalItems.map((a) => (
              <tr key={a.id} className="border-t border-rule align-top">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{a.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{a.dek}</p>
                </td>
                <td className="px-4 py-3 uppercase text-xs">{a.category}</td>
                <td className="px-4 py-3 text-xs">{a.authorId}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={a.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {a.status !== "approved" && (
                      <button
                        onClick={() => handleApprove(a.id)}
                        disabled={!canPublish}
                        className="bg-emerald px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-paper hover:bg-emerald-deep disabled:opacity-40"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleApproveAndPublish(a.id)}
                      disabled={!canPublish}
                      className="bg-[#161615] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-paper hover:bg-emerald disabled:opacity-40"
                    >
                      Publish Live
                    </button>
                    <button
                      onClick={() => handleReject(a.id)}
                      className="border border-rule px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink-soft hover:bg-red-50 hover:text-red-800"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PublishedAdminPage() {
  const { liveArticles, updateArticle, role } = useApp();
  const canPublish = role === "OWNER" || role === "ADMIN" || role === "EDITOR";

  const published = liveArticles.filter((a) => a.status === "published");

  const handleUnpublish = async (articleId: string) => {
    if (!canPublish) {
      alert("Permission Denied: Only EDITOR, ADMIN, or OWNER can unpublish articles.");
      return;
    }
    if (confirm("Are you sure you want to unpublish this article and return it to drafts?")) {
      await updateArticle(articleId, { status: "draft" });
    }
  };

  return (
    <div>
      <Header
        kicker="Public Catalog"
        title="Published articles"
        dek="Live articles served through Cloudflare edge SSR. Public visitors can read these stories."
      />

      <div role="region" aria-label="Published articles table" tabIndex={0} className="relative mt-6 overflow-x-auto border border-rule bg-paper">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-canvas font-sans text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Headline</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Published Date</th>
              <th className="px-4 py-3">Controls</th>
            </tr>
          </thead>
          <tbody>
            {published.map((a) => (
              <tr key={a.id} className="border-t border-rule">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{a.title}</p>
                  <Link
                    to={`/${a.category}/${a.slug}`}
                    className="text-xs text-emerald hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Live Page ↗
                  </Link>
                </td>
                <td className="px-4 py-3 uppercase text-xs">{a.category}</td>
                <td className="px-4 py-3 text-xs">{a.authorId}</td>
                <td className="px-4 py-3 text-xs text-faint">{formatDateTime(a.publishedAt)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleUnpublish(a.id)}
                    disabled={!canPublish}
                    className="border border-rule px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink-soft hover:bg-stone-100 disabled:opacity-40"
                  >
                    Unpublish
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QueuePage({
  title,
  kicker,
  statuses,
}: {
  title: string;
  kicker: string;
  statuses: ArticleStatus[];
}) {
  const { adminItems, updateAdminStatus, assignAdmin } = useApp();
  const rows = adminItems.filter((i) => statuses.includes(i.status));

  return (
    <div>
      <Header
        kicker={kicker}
        title={title}
        dek="Database-backed candidates and intake queue stored in Supabase story_candidates."
      />
      <div role="region" aria-label={`${title} table`} tabIndex={0} className="relative mt-6 overflow-x-auto border border-rule bg-paper focus-visible:outline-2 focus-visible:outline-emerald">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-canvas font-sans text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Headline</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assignee</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Advance</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No records in this state.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-rule align-top">
                <td className="px-4 py-4">
                  <p className="font-medium text-ink">{row.headline}</p>
                  <p className="mt-1 text-xs text-faint">{row.source}</p>
                  <p className="mt-1 text-xs text-muted">{row.notes}</p>
                </td>
                <td className="px-4 py-4 text-xs uppercase tracking-wide">
                  {categoryMap[row.category]?.navLabel || row.category}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={row.status} />
                  <p className="mt-2 text-[11px] text-faint">{formatDateTime(row.updatedAt)}</p>
                </td>
                <td className="px-4 py-4">
                  <label className="sr-only" htmlFor={`assignee-${row.id}`}>
                    Assignee for {row.headline}
                  </label>
                  <select
                    id={`assignee-${row.id}`}
                    value={row.assignee}
                    onChange={(e) => assignAdmin(row.id, e.target.value)}
                    className="h-9 border border-rule bg-paper px-2 text-xs"
                  >
                    <option>Unassigned</option>
                    <option>Automation</option>
                    {authors.map((a) => (
                      <option key={a.id}>{a.name}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4 font-display text-lg">{row.score || "—"}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    {nextStatus[row.status] && (
                      <button
                        type="button"
                        onClick={() => updateAdminStatus(row.id, nextStatus[row.status]!)}
                        className="h-8 bg-emerald px-3 text-[11px] font-semibold uppercase tracking-wide text-paper hover:bg-emerald-deep"
                      >
                        Move to {statusMeta[nextStatus[row.status]!].label}
                      </button>
                    )}
                    {row.status !== "rejected" && row.status !== "published" && (
                      <button
                        type="button"
                        onClick={() => updateAdminStatus(row.id, "rejected")}
                        className="h-8 border border-rule px-3 text-[11px] font-semibold uppercase tracking-wide hover:bg-red-50"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function MediaPage() {
  return (
    <div>
      <Header
        kicker="Library"
        title="Media library"
        dek="Assets stored and verified with attribution and licensing credits."
      />
      <div role="region" aria-label="Media library table" tabIndex={0} className="relative mt-6 overflow-x-auto border border-rule bg-paper">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-canvas font-sans text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">File</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Used in</th>
              <th className="px-4 py-3">Credit</th>
              <th className="px-4 py-3">Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {mediaLibrary.map((m) => (
              <tr key={m.id} className="border-t border-rule">
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3 capitalize">{m.type}</td>
                <td className="px-4 py-3">{m.usedIn}</td>
                <td className="px-4 py-3 text-muted">{m.credit}</td>
                <td className="px-4 py-3 text-faint">{m.uploadedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SeoPage() {
  const { liveArticles } = useApp();
  const top = liveArticles.slice(0, 8);
  return (
    <div>
      <Header
        kicker="SEO & Analytics"
        title="Canonical Indexing & Search Engines"
        dek="Technical SEO signals, XML sitemaps, and NewsArticle metadata generated for public crawlers."
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          ["Sitemap Status", "Live", "sitemap.xml (All clean routes)"],
          ["Google News Sitemap", "Active", "sitemap-news.xml"],
          ["RSS 2.0 Feed", "Active", "/rss.xml with full summaries"],
          ["Schema.org NewsArticle", "Injected", "JSON-LD structured data"],
        ].map(([k, v, n]) => (
          <div key={k} className="border border-rule bg-paper p-4">
            <p className="text-[11px] uppercase tracking-wider text-faint">{k}</p>
            <p className="mt-2 font-display text-2xl text-emerald">{v}</p>
            <p className="mt-1 text-xs text-muted">{n}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 border border-rule bg-paper">
        <p className="border-b border-rule px-4 py-3 font-sans text-xs uppercase tracking-wider text-muted">
          Active Indexed Headlines
        </p>
        <ul>
          {top.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-4 border-t border-rule px-4 py-3 text-sm">
              <Link to={`/${a.category}/${a.slug}`} className="hover:text-emerald">
                {a.title}
              </Link>
              <span className="text-xs text-faint">{a.readingTime} min</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AutomationPage() {
  const tone = {
    healthy: "bg-emerald-soft text-emerald-deep",
    degraded: "bg-amber-100 text-amber-950",
    paused: "bg-slate-200 text-slate-800",
    failed: "bg-red-100 text-red-900",
  } as const;

  return (
    <div>
      <Header
        kicker="Automation Health"
        title="Pipelines, Agents & Queue Watchers"
        dek="Monitors background pipelines, Hermes research agents, and n8n webhook listeners."
      />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {automationJobs.map((j) => (
          <div key={j.id} className="border border-rule bg-paper p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl">{j.name}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-faint">{j.system}</p>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tone[j.status]}`}>
                {j.status}
              </span>
            </div>
            <p className="mt-4 font-serif text-[15px] text-ink-soft">{j.note}</p>
            <p className="mt-3 text-xs text-faint">
              Last run {j.lastRun === "Never" ? "Never" : formatDateTime(j.lastRun)} · Next {j.nextRun}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsPage() {

  const team = [
    { name: "Basco Editorial Director", email: "editorial.owner@signaldesk.news", role: "OWNER", desc: "Full Signal Desk management & root policy" },
    { name: "Managing Editor", email: "admin@signaldesk.news", role: "ADMIN", desc: "Manages articles, staff, authors, and sections" },
    { name: "Maya Ellison", email: "maya.ellison@signaldesk.news", role: "EDITOR", desc: "Reviews, approves, fact-checks and publishes stories" },
    { name: "Hermes Research Agent", email: "researcher@signaldesk.news", role: "RESEARCHER", desc: "Discovers story candidates, gathers data, drafts briefs" },
  ];

  return (
    <div>
      <Header
        kicker="Settings & Team"
        title="Editorial Roles & Access Control"
        dek="Supabase Row Level Security ensures strict isolation. Public editorial self-registration is permanently disabled."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="border border-rule bg-paper p-6">
          <p className="kicker">Editorial Staff Directory</p>
          <ul className="mt-4 divide-y divide-rule text-sm">
            {team.map((t) => (
              <li key={t.email} className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-faint">{t.email}</p>
                  </div>
                  <span className="bg-stone-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                    {t.role}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">{t.desc}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-rule bg-paper p-6">
          <p className="kicker">Security & Governance Policies</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="border-b border-rule pb-2">
              <p className="font-semibold text-ink">Row Level Security (RLS)</p>
              <p className="text-xs text-faint">Active on all 15 tables. Public visitors can only query published articles.</p>
            </div>
            <div className="border-b border-rule pb-2">
              <p className="font-semibold text-ink">Publishing Trigger Guard</p>
              <p className="text-xs text-faint">Database trigger trg_enforce_article_publishing blocks non-editors from setting status to published.</p>
            </div>
            <div className="border-b border-rule pb-2">
              <p className="font-semibold text-ink">Audit Logging</p>
              <p className="text-xs text-faint">Every article status transition is logged to public.audit_logs.</p>
            </div>
            <div>
              <p className="font-semibold text-ink">Staff Onboarding</p>
              <p className="text-xs text-faint">Invitation-only via admin API. Public registration is disabled.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleEditorModal({
  initialArticle,
  onClose,
  onSave,
}: {
  initialArticle: Partial<Article>;
  onClose: () => void;
  onSave: (article: Partial<Article>) => Promise<void>;
}) {
  const [title, setTitle] = useState(initialArticle.title || "");
  const [slug, setSlug] = useState(initialArticle.slug || "");
  const [dek, setDek] = useState(initialArticle.dek || "");
  const [category, setCategory] = useState<CategorySlug>(initialArticle.category || "ai");
  const [authorId, setAuthorId] = useState(initialArticle.authorId || "maya-ellison");
  const [featuredImage, setFeaturedImage] = useState(
    initialArticle.featuredImage || "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg"
  );
  const [takeaways, setTakeaways] = useState((initialArticle.keyTakeaways || []).join("\n"));
  const [bodyText, setBodyText] = useState(
    initialArticle.body ? initialArticle.body.map((b: any) => b.text || "").join("\n\n") : ""
  );
  const [saving, setSaving] = useState(false);

  const titleId = useId();
  const slugId = useId();
  const categoryId = useId();
  const authorSelectId = useId();
  const dekId = useId();
  const imageId = useId();
  const takeawaysId = useId();
  const bodyId = useId();

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialArticle.slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const bodyBlocks = bodyText
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => ({ type: "p" as const, text: p }));

    const takeawaysList = takeaways
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);

    await onSave({
      title,
      slug: slug || `story-${Date.now()}`,
      dek,
      excerpt: dek,
      category,
      authorId,
      featuredImage,
      featuredImageCaption: title,
      featuredImageCredit: "Signal Desk Archive",
      keyTakeaways: takeawaysList,
      body: bodyBlocks,
      status: "draft",
      readingTime: Math.max(3, Math.ceil(bodyText.split(/\s+/).length / 200)),
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-rule bg-paper p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-rule pb-3">
          <h2 className="font-display text-xl font-medium">Create New Article</h2>
          <button onClick={onClose} className="text-muted hover:text-ink text-sm">
            ✕ Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor={titleId} className="block text-xs font-semibold uppercase tracking-wider text-muted">
              Headline
            </label>
            <input
              id={titleId}
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="mt-1 w-full border border-rule bg-white px-3 py-2 text-sm"
              placeholder="e.g. Next-Generation AI Silicon Challenges Legacy Compute"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={slugId} className="block text-xs font-semibold uppercase tracking-wider text-muted">
                URL Slug
              </label>
              <input
                id={slugId}
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="mt-1 w-full border border-rule bg-white px-3 py-2 text-sm font-mono text-xs"
              />
            </div>
            <div>
              <label htmlFor={categoryId} className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Section / Category
              </label>
              <select
                id={categoryId}
                value={category}
                onChange={(e) => setCategory(e.target.value as CategorySlug)}
                className="mt-1 w-full border border-rule bg-white px-3 py-2 text-sm"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={authorSelectId} className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Author
              </label>
              <select
                id={authorSelectId}
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="mt-1 w-full border border-rule bg-white px-3 py-2 text-sm"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={imageId} className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Featured Image URL
              </label>
              <input
                id={imageId}
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="mt-1 w-full border border-rule bg-white px-3 py-2 text-sm text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label htmlFor={dekId} className="block text-xs font-semibold uppercase tracking-wider text-muted">
              Dek / Summary Subtitle
            </label>
            <textarea
              id={dekId}
              rows={2}
              required
              value={dek}
              onChange={(e) => setDek(e.target.value)}
              className="mt-1 w-full border border-rule bg-white px-3 py-2 text-sm"
              placeholder="One or two sentences summarizing the report."
            />
          </div>

          <div>
            <label htmlFor={takeawaysId} className="block text-xs font-semibold uppercase tracking-wider text-muted">
              Key Takeaways (one per line)
            </label>
            <textarea
              id={takeawaysId}
              rows={3}
              value={takeaways}
              onChange={(e) => setTakeaways(e.target.value)}
              className="mt-1 w-full border border-rule bg-white px-3 py-2 text-xs"
              placeholder="First key point&#10;Second key point"
            />
          </div>

          <div>
            <label htmlFor={bodyId} className="block text-xs font-semibold uppercase tracking-wider text-muted">
              Article Body (paragraphs separated by blank line)
            </label>
            <textarea
              id={bodyId}
              rows={6}
              required
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className="mt-1 w-full border border-rule bg-white px-3 py-2 text-sm font-serif"
              placeholder="First reported paragraph..."
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-rule pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-rule px-4 py-2 text-xs font-semibold uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald px-5 py-2 text-xs font-bold uppercase tracking-wider text-paper hover:bg-emerald-deep disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Draft to Supabase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Header({ kicker, title, dek }: { kicker: string; title: string; dek: string }) {
  return (
    <div>
      <p className="kicker">{kicker}</p>
      <h1 className="mt-2 font-display text-3xl font-medium tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl font-serif text-[16px] text-muted">{dek}</p>
    </div>
  );
}
