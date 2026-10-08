import { FormEvent, useId, useState } from "react";
import { useApp } from "../../context/AppContext";
import { brand } from "../../config/brand";
import { cn } from "../../utils/cn";

export function Newsletter({
  variant = "banner",
}: {
  variant?: "banner" | "compact" | "article";
}) {
  const { subscribe, newsletterJoined } = useApp();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const fieldId = useId();
  const errorId = useId();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    subscribe();
  }

  if (newsletterJoined) {
    return (
      <div
        role="status"
        className={cn(
          "border border-emerald/20 bg-emerald-soft px-6 py-8",
          variant === "compact" && "px-4 py-5",
        )}
      >
        <p className="kicker">The Briefing</p>
        <p className="mt-2 font-display text-2xl text-ink">You’re on the list.</p>
        <p className="mt-2 max-w-md font-serif text-[15px] leading-relaxed text-muted">
          This is a local demo confirmation. No email has been sent and no list has been stored.
        </p>
      </div>
    );
  }

  return (
    <section
      className={cn(
        "bg-paper",
        variant === "banner" && "border border-rule px-5 py-8 sm:px-6 sm:py-10 md:px-12 md:py-12",
        variant === "compact" && "border border-rule px-4 py-5 sm:px-5 sm:py-6",
        variant === "article" && "border-y-2 border-emerald bg-emerald-soft/40 px-5 py-7 sm:px-7 sm:py-8",
      )}
    >
      <p className="kicker">Newsletter</p>
      <h2
        className={cn(
          "mt-2 font-display font-medium leading-tight tracking-[-0.02em] text-ink headline-balance",
          variant === "banner" ? "text-[1.6rem] sm:text-3xl md:text-4xl" : "text-[1.35rem] sm:text-2xl",
        )}
      >
        The Briefing, every weekday.
      </h2>
      <p className="mt-2.5 max-w-xl font-serif text-[15px] leading-[1.6] text-muted sm:text-[17px]">
        One considered email on AI, infrastructure and the business of technology. Written for
        people who already read too much. {brand.demoNotice}
      </p>
      <form
        onSubmit={onSubmit}
        className={cn(
          "mt-5 flex flex-col gap-2.5 sm:mt-6 sm:gap-3",
          variant !== "compact" && "sm:flex-row sm:items-stretch",
        )}
      >
        <label className="sr-only" htmlFor={fieldId}>
          Email address
        </label>
        <input
          id={fieldId}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="h-12 min-w-0 w-full flex-1 border border-rule bg-paper px-4 font-sans text-base text-ink placeholder:text-faint sm:text-sm"
        />
        <button
          type="submit"
          className="h-12 shrink-0 bg-emerald px-6 font-sans text-sm font-semibold tracking-wide text-paper transition-colors hover:bg-emerald-bright"
        >
          Subscribe
        </button>
      </form>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-newsred" role="alert">
          {error}
        </p>
      )}
      <p className="mt-3 text-xs text-faint">Demo form only. Nothing is transmitted.</p>
    </section>
  );
}
