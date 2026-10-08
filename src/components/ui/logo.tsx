import { cx } from "@/lib/utils";

/** The Merry Mail wordmark: one typeface, one weight, one baseline — only the colour changes. */
export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span
      className={cx(
        "inline-flex items-baseline gap-[0.26em] font-display text-[1.6rem] leading-none font-semibold tracking-tight whitespace-nowrap",
        className,
      )}
    >
      <span className={inverted ? "text-gold-300" : "text-cranberry-700"}>Merry</span>
      <span className={inverted ? "text-cream-50" : "text-evergreen-800"}>Mail</span>
    </span>
  );
}
