import { Link } from "react-router-dom";
import { brand } from "../../config/brand";
import { cn } from "../../utils/cn";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "masthead";
  to?: string;
  inverted?: boolean;
}

export function Logo({ size = "md", to = "/", inverted = false }: LogoProps) {
  const mark = (
    <span
      className={cn(
        "inline-flex items-center justify-center font-display font-semibold tracking-tight",
        inverted ? "bg-paper text-emerald" : "bg-emerald text-paper",
        size === "sm" && "h-6 w-6 text-[11px]",
        size === "md" && "h-7 w-7 text-xs",
        size === "lg" && "h-9 w-9 text-sm",
        size === "masthead" && "h-7 w-7 text-[11px] sm:h-9 sm:w-9 sm:text-base md:h-11 md:w-11 md:text-lg",
      )}
      aria-hidden
    >
      {brand.shortName}
    </span>
  );

  const word = (
    <span
      className={cn(
        "font-display font-medium tracking-[-0.03em]",
        inverted ? "text-paper" : "text-ink",
        size === "sm" && "text-base",
        size === "md" && "text-xl",
        size === "lg" && "text-2xl",
        size === "masthead" && "text-[1.45rem] sm:text-3xl md:text-[2.5rem] leading-none",
      )}
    >
      {brand.name}
    </span>
  );

  const inner = (
    <span
      className={cn(
        "inline-flex items-center",
        size === "masthead" ? "gap-1.5 sm:gap-2.5" : "gap-2.5",
      )}
    >
      {mark}
      {word}
    </span>
  );

  if (!to) return inner;

  return (
    <Link to={to} className="inline-flex items-center no-underline" aria-label={`${brand.wordmark} home`}>
      {inner}
    </Link>
  );
}
