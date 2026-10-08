import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { statusMeta, statusOrder, StatusBadge } from "../../components/admin/status";
import type { ArticleStatus } from "../../types";
import { mediaLibrary, automationJobs } from "../../data/admin";
import { publishedArticles } from "../../data/articles";
import { categoryMap } from "../../data/categories";
import { brand } from "../../config/brand";
import { formatDateTime } from "../../lib/format";
import { authors } from "../../data/authors";

const nextStatus: Partial<Record<ArticleStatus, ArticleStatus>> = {
  discovered: "researching",
  researching: "drafted",
  drafted: "needs_review",
  needs_review: "approved",
  approved: "scheduled",
  scheduled: "published",
};

export function AdminOverview() {
  const { adminItems } = useApp();
  const counts = statusOrder.map((s) => ({
    status: s,
    count: adminItems.filter((i) => i.status === s).length,
  }));

  return (
    <div>
      <Header
        kicker="Overview"
        title="Newsroom at a glance"
        dek="Local demo data only. Counts reflect mock records you can move between states in this prototype."
      />
      <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {counts.map((c) => (
          <div key={c.status} className="border border-rule bg-paper p-4">
            <StatusBadge status={c.status} />
            <p className="mt-3 font-display text-3xl">{c.count}</p>
            <p className="mt-1 font-sans text-[11px] leading-snug text-faint">{statusMeta[c.status].hint}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="border border-rule bg-paper p-5">
          <p className="kicker">Needs attention</p>
          <ul className="mt-4 divide-y divide-rule">
            {adminItems
              .filter((i) => i.status === "needs_review" || i.status === "failed")
              .map((i) => (
                <li key={i.id} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-sans text-sm font-medium">{i.headline}</p>
                    <StatusBadge status={i.status} />
                  </div>
                  <p className="mt-1 text-xs text-faint">
                    {i.assignee} · {i.source}
                  </p>
                </li>
              ))}
          </ul>
        </div>
        <div className="border border-rule bg-paper p-5">
          <p className="kicker">Future systems (not connected)</p>
          <ul className="mt-4 space-y-2 font-sans text-sm text-muted">
            <li>Cloudflare Workers — edge publish</li>
            <li>GitHub repository — content history</li>
            <li>Supabase PostgreSQL — canonical store</li>
            <li>Hermes research agent — discovery</li>
            <li>n8n automation — watchers and pings</li>
            <li>Salman OS — approvals and monitoring</li>
          </ul>
          <p className="mt-4 text-xs text-faint">These names are listed so the desk UI can be wired later. They do nothing in this build.</p>
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
  return <QueuePage title="Draft articles" kicker="Copy" statuses={["drafted"]} />;
}
export function ApprovalsPage() {
  return (
    <QueuePage
      title="Editorial approvals"
      kicker="Standards"
      statuses={["needs_review", "approved", "scheduled"]}
    />
  );
}
export function PublishedAdminPage() {
  return <QueuePage title="Published articles" kicker="Live" statuses={["published"]} />;
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
        dek="Demo records. Moving a status only updates this browser session. Nothing is published for real."
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
                  No demo records in this state.
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
                  {categoryMap[row.category].navLabel}
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
                        className="h-8 bg-emerald px-3 text-[11px] font-semibold uppercase tracking-wide text-paper"
                      >
                        Move to {statusMeta[nextStatus[row.status]!].label}
                      </button>
                    )}
                    {row.status !== "rejected" && row.status !== "published" && (
                      <button
                        type="button"
                        onClick={() => updateAdminStatus(row.id, "rejected")}
                        className="h-8 border border-rule px-3 text-[11px] font-semibold uppercase tracking-wide"
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
        dek="Demonstration assets used on the public site. Credits are required before any live publish."
      />
      <div role="region" aria-label="Media library table" tabIndex={0} className="relative mt-6 overflow-x-auto border border-rule bg-paper focus-visible:outline-2 focus-visible:outline-emerald">
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
  const top = publishedArticles.slice(0, 8);
  return (
    <div>
      <Header
        kicker="SEO & analytics"
        title="How the demo library would look in analytics"
        dek="All figures below are invented for layout. They are not measurements of real traffic."
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          ["7-day readers", "—", "Not instrumented"],
          ["Newsletter list", "Demo only", "No vendor connected"],
          ["Avg. read depth", "—", "Placeholder"],
          ["Index coverage", "Prototype", "No Search Console"],
        ].map(([k, v, n]) => (
          <div key={k} className="border border-rule bg-paper p-4">
            <p className="text-[11px] uppercase tracking-wider text-faint">{k}</p>
            <p className="mt-2 font-display text-2xl">{v}</p>
            <p className="mt-1 text-xs text-muted">{n}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 border border-rule bg-paper">
        <p className="border-b border-rule px-4 py-3 font-sans text-xs uppercase tracking-wider text-muted">
          Demo story titles (not ranked)
        </p>
        <ul>
          {top.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-4 border-t border-rule px-4 py-3 text-sm">
              <Link to={`/article/${a.slug}`} className="hover:text-emerald">
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
        kicker="Automation health"
        title="Watchers, agents and the things that should fail loudly"
        dek="Every job listed here is a labelled demo. Hermes, n8n, Salman OS and Workers are not connected."
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
  return (
    <div>
      <Header
        kicker="Settings"
        title="Brand, desks and the switches we will actually need"
        dek="Centralised so a future rebrand does not require hunting through components."
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="border border-rule bg-paper p-6">
          <p className="kicker">Brand (from config)</p>
          <dl className="mt-4 space-y-3 text-sm">
            <Row k="Name" v={brand.name} />
            <Row k="Wordmark" v={brand.wordmark} />
            <Row k="Domain" v={brand.domain} />
            <Row k="Tagline" v={brand.tagline} />
            <Row k="Edition" v={brand.editionLabel} />
          </dl>
        </div>
        <div className="border border-rule bg-paper p-6">
          <p className="kicker">Publishing defaults</p>
          <label className="mt-4 flex items-center justify-between border-b border-rule py-3 text-sm">
            Require two-source confirmation for unnamed claims
            <input type="checkbox" defaultChecked className="accent-emerald" />
          </label>
          <label className="flex items-center justify-between border-b border-rule py-3 text-sm">
            Block publish without image credit
            <input type="checkbox" defaultChecked className="accent-emerald" />
          </label>
          <label className="flex items-center justify-between border-b border-rule py-3 text-sm">
            Label all AI-assisted research
            <input type="checkbox" defaultChecked className="accent-emerald" />
          </label>
          <label className="flex items-center justify-between py-3 text-sm">
            Connect live backends
            <input type="checkbox" disabled className="accent-emerald" />
          </label>
          <p className="text-xs text-faint">Live backends remain off in this design phase.</p>
        </div>
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

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-rule pb-2">
      <dt className="text-faint">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}
