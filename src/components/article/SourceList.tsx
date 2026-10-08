import { Link } from "react-router-dom";
import type { Correction, Source } from "../../types";

export function SourceList({ sources }: { sources: Source[] }) {
  if (!sources.length) return null;
  return (
    <section aria-labelledby="sources-heading" className="border-t border-rule pt-7">
      <h2 id="sources-heading" className="font-display text-xl font-medium tracking-tight sm:text-2xl">
        Sources &amp; references
      </h2>
      <p className="mt-1.5 font-sans text-[12px] leading-relaxed text-faint">
        Every Signal Desk story lists the material it rests on. The references below belong to a
        demonstration article and are not citations of real events.
      </p>
      <ol className="mt-4 divide-y divide-rule border-y border-rule">
        {sources.map((s, i) => (
          <li key={s.title} className="flex gap-3 py-3.5">
            <span className="mt-0.5 font-sans text-[11px] font-semibold tabular-nums text-faint">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-sans text-[14px] font-medium leading-snug text-ink">{s.title}</p>
              <p className="mt-1 font-sans text-[12.5px] text-muted">
                {s.publisher}
                <span className="mx-1.5 text-rule-strong">·</span>
                {s.note}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function CorrectionsNote({ corrections }: { corrections: Correction[] }) {
  return (
    <section aria-labelledby="corrections-heading" className="border border-rule bg-canvas px-4 py-4 sm:px-5">
      <h2 id="corrections-heading" className="kicker">
        Corrections &amp; updates
      </h2>
      {corrections.length === 0 ? (
        <p className="mt-2 font-serif text-[14.5px] leading-relaxed text-ink-soft">
          No corrections have been issued for this article. If you believe something here is wrong,
          write to the desk and we will review it. See our{" "}
          <Link to="/corrections-policy" className="text-emerald underline underline-offset-2">
            corrections policy
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {corrections.map((c) => (
            <li key={c.date} className="font-serif text-[14.5px] leading-relaxed text-ink-soft">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-wide text-newsred">
                {c.date}
              </span>
              <br />
              {c.text}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
