import type { ArticleStatus } from "../../types";

export const statusMeta: Record<
  ArticleStatus,
  { label: string; className: string; hint: string }
> = {
  discovered: {
    label: "Discovered",
    className: "bg-slate-200 text-slate-800",
    hint: "In the intake pile. Not yet assigned for research.",
  },
  researching: {
    label: "Researching",
    className: "bg-sky-100 text-sky-900",
    hint: "A reporter or agent is gathering sources.",
  },
  draft: {
    label: "Draft",
    className: "bg-amber-100 text-amber-950",
    hint: "Writer or reporter drafting story copy.",
  },
  drafted: {
    label: "Drafted",
    className: "bg-amber-100 text-amber-950",
    hint: "Copy exists. Ready for review.",
  },
  fact_check: {
    label: "Fact Check",
    className: "bg-purple-100 text-purple-950",
    hint: "Sources and citations under verification.",
  },
  editorial_review: {
    label: "Editorial Review",
    className: "bg-orange-100 text-orange-950",
    hint: "Desk editor reviewing tone, legal, and headlines.",
  },
  needs_review: {
    label: "Needs review",
    className: "bg-orange-100 text-orange-950",
    hint: "Waiting on an editor, lawyer or standards.",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-soft text-emerald-deep",
    hint: "Cleared to publish by editorial desk.",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-teal-100 text-teal-950",
    hint: "Queued for a future publish time.",
  },
  published: {
    label: "Published",
    className: "bg-emerald text-paper",
    hint: "Live on the public website.",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-900",
    hint: "Killed or sent back for rewrite.",
  },
  archived: {
    label: "Archived",
    className: "bg-stone-200 text-stone-700",
    hint: "Archived from active publication.",
  },
  failed: {
    label: "Failed",
    className: "bg-red-900 text-paper",
    hint: "Automation or research job failed.",
  },
};

export const statusOrder: ArticleStatus[] = [
  "discovered",
  "researching",
  "draft",
  "fact_check",
  "editorial_review",
  "approved",
  "scheduled",
  "published",
  "rejected",
  "archived",
];

export function StatusBadge({ status }: { status: ArticleStatus }) {
  const meta = statusMeta[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}
