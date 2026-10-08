"use client";

import { Separator } from "@heroui/react";
import type { ReactNode } from "react";
import { formats, getDesign } from "@/data/catalog";
import { useI18n } from "@/i18n/provider";
import type { CartTotals } from "@/lib/pricing";
import { priceItem } from "@/lib/pricing";
import type { CartItem } from "@/lib/types";
import { cx } from "@/lib/utils";
import { CardArt } from "../cards/card-art";

function Row({ label, value, tone }: { label: ReactNode; value: string; tone?: "good" }) {
  return (
    <div className={cx("flex items-center justify-between gap-3 text-sm", tone === "good" ? "text-evergreen-700" : "text-ink-700")}>
      <span>{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}

export function TotalsRows({ totals, promoCode }: { totals: CartTotals; promoCode?: string | null }) {
  const { t, money } = useI18n();
  const s = t.cart.summary;
  return (
    <div className="space-y-2.5">
      <Row label={s.subtotal} value={money(totals.subtotal)} />
      {totals.discount > 0 && <Row tone="good" label={s.volume} value={`−${money(totals.discount)}`} />}
      {totals.promo > 0 && <Row tone="good" label={s.promo.replace("{code}", promoCode ?? "")} value={`−${money(totals.promo)}`} />}
      <Row label={s.delivery} value={totals.delivery === 0 ? t.common.free : money(totals.delivery)} />
      {totals.freeShipping && <p className="text-xs font-semibold text-evergreen-700">✓ {s.freeShipping}</p>}
      <Row label={s.hst} value={money(totals.tax)} />
      <Separator className="my-3!" />
      <div className="flex items-baseline justify-between">
        <span className="font-semibold text-ink-900">{s.total}</span>
        <span className="font-display text-3xl font-semibold text-ink-900 tabular-nums">{money(totals.total)}</span>
      </div>
    </div>
  );
}

/** Compact line items, used in the checkout sidebar and the confirmation page. */
export function MiniItems({ items }: { items: CartItem[] }) {
  const { t, l, money, fmt } = useI18n();
  return (
    <ul className="divide-y divide-border">
      {items.map((item) => {
        const design = getDesign(item.design);
        const p = priceItem(item);
        return (
          <li key={item.id} className="flex items-center gap-3 py-3">
            <div className="w-12 shrink-0 overflow-hidden rounded shadow-sm ring-1 ring-black/5">
              <div className="aspect-[5/7]">
                <CardArt
                  design={item.design}
                  greeting={item.greeting}
                  familyName={item.familyName}
                  photo={item.photo}
                  photoFallback="placeholder"
                  className="h-full w-full"
                />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900">{design ? l(design.name) : item.design}</p>
              <p className="truncate text-xs text-muted">
                {l(formats[item.format].name)} · {p.cards === 1 ? t.common.card : fmt(t.common.cards, { n: p.cards })}
              </p>
            </div>
            <p className="text-sm font-semibold text-ink-900 tabular-nums">{money(p.total)}</p>
          </li>
        );
      })}
    </ul>
  );
}
