import type { Paper } from "@/data/catalog";
import { cx } from "@/lib/utils";

/** A stack of paper sheets — the stack height hints at the paper weight. */
export function PaperSwatch({ paper, className }: { paper: Paper; className?: string }) {
  const sheets = paper.id === "classic" ? 2 : paper.id === "kraft" ? 3 : 4;
  return (
    <div className={cx("relative aspect-[4/3] w-full", className)} aria-hidden>
      {Array.from({ length: sheets }, (_, i) => (
        <div
          key={i}
          className="absolute inset-x-[8%] rounded-md shadow-[0_1px_0_rgba(0,0,0,0.08)] ring-1 ring-black/5"
          style={{
            top: `${14 + i * 3}%`,
            bottom: `${22 - i * 3}%`,
            transform: `rotate(${(i - sheets / 2) * 1.6}deg) translateY(${-i * 2}px)`,
            background: paper.tint,
          }}
        />
      ))}
      <div
        className="absolute inset-x-[8%] overflow-hidden rounded-md shadow-[0_14px_30px_-12px_rgba(40,25,10,0.45)] ring-1 ring-black/5"
        style={{ top: `${14 + sheets * 3}%`, bottom: `${22 - sheets * 3}%`, background: paper.tint }}
      >
        <div className={cx("paper-grain absolute inset-0 mix-blend-multiply", paper.id === "kraft" ? "opacity-100" : "opacity-60")} />
        {paper.id === "kraft" && (
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, #8a6a4433 1px, transparent 2px), radial-gradient(circle at 70% 60%, #6b4a2a33 1px, transparent 2px)",
              backgroundSize: "18px 18px, 26px 26px",
            }}
          />
        )}
        {paper.sheen && (
          <div
            className="absolute inset-0 animate-shine"
            style={{
              backgroundImage:
                "linear-gradient(115deg, transparent 20%, rgba(255,220,250,0.55) 38%, rgba(200,255,245,0.5) 50%, rgba(255,240,200,0.45) 60%, transparent 78%)",
              backgroundSize: "220% 100%",
            }}
          />
        )}
        <div className="absolute right-3 bottom-2 font-display text-sm font-semibold text-ink-900/40">{paper.weight}</div>
      </div>
    </div>
  );
}
