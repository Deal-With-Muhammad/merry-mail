"use client";

import { Alert, Button } from "@heroui/react";
import { Pencil, ShoppingBag } from "lucide-react";
import { deliveryOptions, finishes, formats, getDesign, papers } from "@/data/catalog";
import { locations } from "@/data/site";
import { useI18n } from "@/i18n/provider";
import { cx, formatAddress } from "@/lib/utils";
import { useBuilder } from "@/store";
import { CardArt } from "../cards/card-art";
import { StepHeading } from "./step-design";

export function StepReview({
  valid,
  onEdit,
  onSubmit,
  pending,
}: {
  valid: boolean[];
  onEdit: (step: number) => void;
  onSubmit: () => void;
  pending: boolean;
}) {
  const { t, l, fmt } = useI18n();
  const draft = useBuilder((s) => s.draft);
  const editingId = useBuilder((s) => s.editingId);
  const design = getDesign(draft.design);
  const paper = papers.find((p) => p.id === draft.paper);
  const r = t.builder.review;
  const ready = valid[4];

  const deliveryDetail =
    draft.delivery === "mail"
      ? draft.recipients.length === 1
        ? t.cart.recipient
        : fmt(t.cart.recipients, { n: draft.recipients.length })
      : draft.delivery === "ship"
        ? draft.shipTo
          ? formatAddress(draft.shipTo)
          : "—"
        : locations.find((x) => x.id === draft.pickupLocation)?.address;

  const rows: { label: string; value: React.ReactNode; step: number; ok: boolean }[] = [
    { label: r.design, value: design ? l(design.name) : draft.design, step: 0, ok: valid[0] },
    { label: r.format, value: `${l(formats[draft.format].name)} · ${formats[draft.format].size}`, step: 0, ok: true },
    { label: r.paper, value: `${paper ? `${l(paper.name)} ${paper.weight}` : ""} · ${l(finishes[draft.finish].name)}`, step: 2, ok: true },
    {
      label: r.message,
      value: <span className="line-clamp-2 italic">{draft.message || t.builder.defaults.message}</span>,
      step: 1,
      ok: valid[1],
    },
    { label: r.delivery, value: `${l(deliveryOptions[draft.delivery].name)} — ${deliveryDetail}`, step: 3, ok: valid[3] },
  ];

  return (
    <div>
      <StepHeading title={t.builder.reviewTitle} />
      <div className="flex gap-5 rounded-3xl border border-border bg-surface p-4 sm:p-5">
        <div className="hidden w-28 shrink-0 self-start overflow-hidden rounded-lg shadow-md sm:block">
          <div className="aspect-[5/7]">
            <CardArt
              design={draft.design}
              greeting={draft.greeting}
              familyName={draft.familyName}
              photo={draft.photo}
              photoFallback="placeholder"
              foil={draft.finish === "foil"}
              className="h-full w-full"
            />
          </div>
        </div>
        <dl className="min-w-0 flex-1 divide-y divide-border">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
              <dt className={cx("w-28 shrink-0 text-xs font-bold tracking-wide uppercase", row.ok ? "text-muted" : "text-danger")}>{row.label}</dt>
              <dd className="min-w-0 flex-1 text-sm text-ink-900">{row.value}</dd>
              <button
                type="button"
                onClick={() => onEdit(row.step)}
                className="shrink-0 rounded-full p-1.5 text-muted transition hover:bg-cream-200 hover:text-ink-900"
                aria-label={`${t.common.edit} ${row.label}`}
              >
                <Pencil className="size-3.5" />
              </button>
            </div>
          ))}
        </dl>
      </div>

      {draft.delivery === "mail" && draft.recipients.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-xs font-bold tracking-wide text-muted uppercase">{r.recipients}</p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {draft.recipients.map((rec, i) => (
              <li key={rec.id} className="rounded-2xl bg-cream-100 px-4 py-3 text-sm">
                <p className="font-semibold text-ink-900">
                  {i + 1}. {rec.name || "—"}
                </p>
                <p className="truncate text-xs text-muted">{rec.line1 ? formatAddress(rec) : "—"}</p>
                {rec.note && <p className="mt-1 truncate font-hand text-base text-evergreen-700">“{rec.note}”</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!ready && (
        <Alert status="warning" className="mt-6">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{t.builder.incomplete}</Alert.Title>
          </Alert.Content>
        </Alert>
      )}

      <Button size="lg" fullWidth className="mt-6 rounded-full" isDisabled={!ready} isPending={pending} onPress={onSubmit}>
        <ShoppingBag className="size-5" />
        {editingId ? t.builder.updateCart : t.builder.addToCart}
      </Button>
    </div>
  );
}
