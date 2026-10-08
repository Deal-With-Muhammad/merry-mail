"use client";

import { Separator } from "@heroui/react";
import { Info, TrendingDown } from "lucide-react";
import { volumeTiers } from "@/data/catalog";
import { useI18n } from "@/i18n/provider";
import { priceItem } from "@/lib/pricing";
import type { CardConfig } from "@/lib/types";
import { cx } from "@/lib/utils";

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cx("flex items-center justify-between gap-3 text-sm", accent ? "text-evergreen-700" : "text-ink-700")}>
      <span>{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}

export function PriceSummary({ config, className }: { config: CardConfig; className?: string }) {
  const { t, money, fmt } = useI18n();
  const s = t.builder.summary;
  const p = priceItem(config);
  const nextTier = [...volumeTiers].reverse().find((tier) => p.cards < tier.min);
  const deliveryLabel = config.delivery === "mail" ? s.postage : config.delivery === "ship" ? s.shipping : s.pickup;

  return (
    <div className={cx("rounded-3xl border border-border bg-surface p-5", className)}>
      <div className="flex items-baseline justify-between">
        <p className="font-display text-lg font-semibold text-ink-900">{s.title}</p>
        <p className="text-xs font-semibold text-muted">{p.cards === 1 ? t.common.card : fmt(t.common.cards, { n: p.cards })}</p>
      </div>
      <div className="mt-4 space-y-2">
        <Row label={s.unit} value={money(p.unit)} />
        <Row label={s.subtotal} value={money(p.subtotal)} />
        {p.discount > 0 && <Row accent label={fmt(s.volume, { pct: Math.round(p.discountRate * 100) })} value={`−${money(p.discount)}`} />}
        <Row label={deliveryLabel} value={p.delivery === 0 ? t.common.free : money(p.delivery)} />
      </div>
      <Separator className="my-4" />
      <div className="flex items-baseline justify-between">
        <span className="font-semibold text-ink-900">{s.estimate}</span>
        <span className="font-display text-2xl font-semibold text-ink-900 tabular-nums">{money(p.total)}</span>
      </div>
      <p className="mt-1 flex items-center gap-1 text-xs text-muted">
        <Info className="size-3" /> {s.taxNote}
      </p>
      {nextTier && p.cards > 0 && (
        <p className="mt-4 flex items-center gap-2 rounded-2xl bg-evergreen-50 px-3 py-2 text-xs font-semibold text-evergreen-700">
          <TrendingDown className="size-4 shrink-0" />
          {fmt(s.tierHint, { n: nextTier.min - p.cards, pct: Math.round(nextTier.rate * 100) })}
        </p>
      )}
    </div>
  );
}
