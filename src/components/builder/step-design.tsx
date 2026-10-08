"use client";

import { Check, ImagePlus } from "lucide-react";
import { useState } from "react";
import { designs, formats, type DesignCategory, type FormatId } from "@/data/catalog";
import { useI18n } from "@/i18n/provider";
import { cx } from "@/lib/utils";
import { useBuilder } from "@/store";
import { CardArt } from "../cards/card-art";

export function StepHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}

export function OptionCard({
  selected,
  onSelect,
  children,
  className,
  label,
}: {
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      onClick={onSelect}
      className={cx(
        "relative rounded-2xl border p-4 text-left transition outline-none focus-visible:ring-2 focus-visible:ring-accent",
        selected ? "border-evergreen-800 bg-evergreen-50/70 ring-1 ring-evergreen-800" : "border-border bg-surface hover:border-ink-400",
        className,
      )}
    >
      {selected && (
        <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-evergreen-800 text-cream-50">
          <Check className="size-3.5" />
        </span>
      )}
      {children}
    </button>
  );
}

function FormatIllustration({ format }: { format: FormatId }) {
  return format === "folded" ? (
    <svg viewBox="0 0 80 56" className="h-12 w-auto" aria-hidden>
      <path d="M40 6 L70 2 L70 50 L40 54 Z" fill="#fffdf8" stroke="#c9a24a" strokeWidth="1.5" />
      <path d="M40 6 L12 10 L12 52 L40 54 Z" fill="#0e3b2e" />
      <path d="M26 20 l4 -6 l4 6 z M24 30 l6 -9 l6 9 z" fill="#c9a24a" />
    </svg>
  ) : (
    <svg viewBox="0 0 80 56" className="h-12 w-auto" aria-hidden>
      <rect x="18" y="4" width="44" height="48" rx="3" fill="#9b1c24" />
      <path d="M40 16 l3 6 l6 1 l-5 4 l1 6 l-5 -3 l-5 3 l1 -6 l-5 -4 l6 -1 z" fill="#fffdf8" />
    </svg>
  );
}

export function StepDesign() {
  const { t, l, money } = useI18n();
  const draft = useBuilder((s) => s.draft);
  const update = useBuilder((s) => s.update);
  const [filter, setFilter] = useState<"all" | DesignCategory>("all");
  const list = filter === "all" ? designs : designs.filter((d) => d.category === filter);

  return (
    <div>
      <StepHeading title={t.builder.format} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label={t.builder.format}>
        {(Object.keys(formats) as FormatId[]).map((f) => (
          <OptionCard key={f} selected={draft.format === f} onSelect={() => update({ format: f })}>
            <div className="flex items-center gap-4">
              <FormatIllustration format={f} />
              <div>
                <p className="font-semibold text-ink-900">{l(formats[f].name)}</p>
                <p className="text-xs text-muted">
                  {formats[f].size} · {money(formats[f].price)}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">{l(formats[f].detail)}</p>
          </OptionCard>
        ))}
      </div>

      <div className="mt-10">
        <StepHeading title={t.builder.chooseDesign} />
        <div className="no-scrollbar -mx-1 mb-5 flex gap-2 overflow-x-auto px-1">
          {(["all", "illustrated", "photo", "minimal", "ontario"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cx(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition",
                filter === f ? "bg-evergreen-800 text-cream-50" : "bg-surface text-ink-700 ring-1 ring-border hover:ring-ink-400",
              )}
            >
              {t.catalog.filters[f]}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4" role="radiogroup" aria-label={t.builder.chooseDesign}>
          {list.map((d) => {
            const selected = draft.design === d.slug;
            return (
              <button
                key={d.slug}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => update({ design: d.slug })}
                className="group text-left outline-none"
              >
                <div
                  className={cx(
                    "relative overflow-hidden rounded-xl p-3 transition",
                    selected ? "bg-evergreen-50 ring-2 ring-evergreen-800" : "bg-cream-200/60 ring-1 ring-border group-hover:ring-ink-400",
                    "group-focus-visible:ring-2 group-focus-visible:ring-accent",
                  )}
                >
                  <div className="aspect-[5/7] overflow-hidden rounded-md shadow-md transition group-hover:-translate-y-0.5">
                    <CardArt
                      design={d.slug}
                      className="h-full w-full"
                      photo={d.photo ? draft.photo : undefined}
                      familyName={draft.familyName}
                      greeting={selected ? draft.greeting : undefined}
                    />
                  </div>
                  {selected && (
                    <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-evergreen-800 text-cream-50 shadow">
                      <Check className="size-4" />
                    </span>
                  )}
                  {d.photo && (
                    <span className="absolute bottom-2 left-2 flex size-6 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow">
                      <ImagePlus className="size-3.5" />
                    </span>
                  )}
                </div>
                <p className="mt-2 truncate text-sm font-semibold text-ink-900">{l(d.name)}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
