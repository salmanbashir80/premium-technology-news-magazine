import { cn } from "../../utils/cn";

export function AdSlot({
  label = "Advertisement",
  size = "banner",
  className,
}: {
  label?: string;
  size?: "banner" | "square" | "rail";
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex w-full flex-col items-center justify-center border border-dashed border-rule-strong/70 bg-sand/40 px-4 text-center",
        size === "banner" && "min-h-[88px] py-5 sm:min-h-[104px] sm:py-6",
        size === "square" && "min-h-[220px] py-7 sm:min-h-[250px]",
        size === "rail" && "min-h-[340px] py-8 sm:min-h-[400px]",
        className,
      )}
      aria-label="Advertisement placeholder"
    >
      <p className="font-sans text-[9.5px] font-semibold uppercase tracking-[0.18em] text-muted">
        {label}
      </p>
      <p className="mt-1.5 max-w-xs font-sans text-[11px] leading-relaxed text-muted">
        Reserved display placement. No advertising is served in this prototype.
      </p>
    </aside>
  );
}
