"use client";

import { Chip } from "@heroui/react";
import { finishes, papers, type FinishId } from "@/data/catalog";
import { useI18n } from "@/i18n/provider";
import { useBuilder } from "@/store";
import { PaperSwatch } from "../cards/paper-swatch";
import { OptionCard, StepHeading } from "./step-design";

export function StepPaper() {
  const { t, l, money, fmt } = useI18n();
  const draft = useBuilder((s) => s.draft);
  const update = useBuilder((s) => s.update);

  return (
    <div>
      <StepHeading title={t.builder.paperTitle} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label={t.builder.paperTitle}>
        {papers.map((p) => (
          <OptionCard key={p.id} selected={draft.paper === p.id} onSelect={() => update({ paper: p.id })} className="flex gap-4">
            <PaperSwatch paper={p} className="w-24 shrink-0" />
            <div className="min-w-0 pr-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-ink-900">{l(p.name)}</p>
                {p.popular && (
                  <Chip size="sm" color="accent" variant="soft">
                    {t.common.mostPopular}
                  </Chip>
                )}
              </div>
              <p className="text-xs font-bold text-gold-700">{p.weight}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{l(p.description)}</p>
              <p className="mt-2 text-sm font-semibold text-ink-900">
                {p.price === 0 ? t.common.included : fmt(t.home.papers.add, { price: money(p.price) })}
              </p>
            </div>
          </OptionCard>
        ))}
      </div>

      <div className="mt-10">
        <StepHeading title={t.builder.finishTitle} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="radiogroup" aria-label={t.builder.finishTitle}>
          {(Object.keys(finishes) as FinishId[]).map((f) => (
            <OptionCard key={f} selected={draft.finish === f} onSelect={() => update({ finish: f })}>
              <span
                className="mb-3 block h-10 rounded-lg ring-1 ring-black/10"
                style={{
                  background:
                    f === "foil"
                      ? "linear-gradient(115deg,#8a6a22,#e8d4a2 30%,#c9a24a 45%,#fff3c4 60%,#a8842f 80%)"
                      : f === "gloss"
                        ? "linear-gradient(135deg,#0e3b2e,#1c6650 45%,#7fb8a3 52%,#1c6650 60%,#0e3b2e)"
                        : "#0e3b2e",
                }}
              />
              <p className="pr-5 font-semibold text-ink-900">{l(finishes[f].name)}</p>
              <p className="mt-1 text-xs text-muted">{l(finishes[f].detail)}</p>
              <p className="mt-2 text-sm font-semibold text-ink-900">
                {finishes[f].price === 0 ? t.common.included : fmt(t.home.papers.add, { price: money(finishes[f].price) })}
              </p>
            </OptionCard>
          ))}
        </div>
      </div>
    </div>
  );
}
