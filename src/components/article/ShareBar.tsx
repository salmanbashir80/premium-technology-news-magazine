import { useEffect, useState } from "react";
import { Check, Link as LinkIcon, Mail, Printer } from "lucide-react";
import { cn } from "../../utils/cn";

export function ShareBar({
  title,
  slug,
  category,
  variant = "inline",
}: {
  title: string;
  slug: string;
  category?: string;
  variant?: "inline" | "rail";
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const defaultPath = category ? `/${category}/${slug}` : `/article/${slug}`;
  const [shareUrl, setShareUrl] = useState(() => `https://premium-technology-news-magazine.8002salman.workers.dev${defaultPath}`);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const copied = status === "copied";
  const message = copied ? "Article link copied." : status === "error"
    ? "Clipboard access is unavailable. Copy the article address from your browser."
    : "";

  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), 3500);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      const activeUrl = typeof window !== "undefined" ? window.location.href : shareUrl;
      await navigator.clipboard.writeText(activeUrl);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  const btn =
    "inline-flex items-center justify-center gap-1.5 border border-rule font-sans text-xs font-medium text-ink transition-colors hover:border-ink";

  if (variant === "rail") {
    return (
      <div className="flex flex-col gap-2">
        <span className="sr-only" role="status">{message}</span>
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">Share</p>
        <div className="flex gap-2 lg:flex-col">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className={cn(btn, "h-9 w-9")}
            aria-label="Share on X"
          >
            X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className={cn(btn, "h-9 w-9 text-[11px]")}
            aria-label="Share on LinkedIn"
          >
            in
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`}
            className={cn(btn, "h-9 w-9")}
            aria-label="Share by email"
          >
            <Mail size={14} />
          </a>
          <button type="button" onClick={copy} className={cn(btn, "h-9 w-9")} aria-label="Copy link">
            {copied ? <Check size={14} /> : <LinkIcon size={14} />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="sr-only" role="status">{message}</span>
      <span className="mr-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
        Share
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noreferrer"
        className={cn(btn, "h-8 px-3")}
      >
        X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noreferrer"
        className={cn(btn, "h-8 px-3")}
      >
        LinkedIn
      </a>
      <a
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`}
        className={cn(btn, "h-8 px-3")}
      >
        Email
      </a>
      <button type="button" onClick={copy} className={cn(btn, "h-8 px-3")}>
        {copied ? <Check size={13} /> : <LinkIcon size={13} />}
        {copied ? "Copied" : status === "error" ? "Copy unavailable" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className={cn(btn, "hidden h-8 px-3 sm:inline-flex")}
      >
        <Printer size={13} /> Print
      </button>
    </div>
  );
}
