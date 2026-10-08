"use client";

import { Button, ProgressBar } from "@heroui/react";
import {
  CheckCircle2,
  ClipboardCheck,
  Mailbox,
  MapPin,
  PackageCheck,
  PackageSearch,
  Printer,
  SearchX,
  Send,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useI18n } from "@/i18n/provider";
import { sampleTrackingCodes, statusOrder, trackCode, trackOrder, type TrackingResult } from "@/lib/tracking";
import type { OrderStatus } from "@/lib/types";
import { cx, formatAddress, normalizeTracking, TRACKING_PATTERN } from "@/lib/utils";
import { useNow } from "@/lib/use-now";
import { useHydrated, useOrders } from "@/store";
import { ButtonLink } from "../ui/locale-link";

const stageIcons: Record<OrderStatus, LucideIcon> = {
  received: ClipboardCheck,
  printing: Printer,
  quality: PackageCheck,
  shipped: Send,
  out: Truck,
  delivered: Mailbox,
};

function Result({ result }: { result: TrackingResult }) {
  const { t, date, fmt } = useI18n();
  const status = t.track.statuses[result.status];
  const progress = Math.round((result.stage / (statusOrder.length - 1)) * 100);
  const delivered = result.status === "delivered";
  const mail = result.order?.items.flatMap((i) => (i.delivery === "mail" ? i.recipients : [])) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mt-10 overflow-hidden rounded-[2rem] border border-border bg-surface shadow-sm"
    >
      <div className="bg-evergreen-900 p-6 text-cream-50 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-wider text-gold-300 uppercase">{t.track.current}</p>
            <h2 className="mt-1 font-display text-3xl font-semibold">{status.title}</h2>
            <p className="mt-1 text-cream-50/70">{status.text}</p>
          </div>
          <p className="rounded-full bg-white/10 px-3 py-1.5 font-mono text-sm font-bold tracking-wide">{result.code}</p>
        </div>
        <ProgressBar aria-label={status.title} value={progress} className="mt-6">
          <ProgressBar.Track className="h-2 bg-white/15">
            <ProgressBar.Fill className="bg-gold-400" />
          </ProgressBar.Track>
        </ProgressBar>
        <dl className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-cream-50/60">{delivered ? t.track.delivered : t.track.eta}</dt>
            <dd className="font-semibold">
              {date(delivered && result.events[5].at ? result.events[5].at : result.eta, { weekday: "long", month: "long", day: "numeric" })}
            </dd>
          </div>
          <div>
            <dt className="text-cream-50/60">{t.track.destination}</dt>
            <dd className="flex items-center gap-1 font-semibold">
              <MapPin className="size-4 text-gold-300" /> {result.city}, ON
            </dd>
          </div>
          <div>
            <dt className="text-cream-50/60">{t.track.cards}</dt>
            <dd className="font-semibold">{result.cards === 1 ? t.common.card : fmt(t.common.cards, { n: result.cards })}</dd>
          </div>
        </dl>
      </div>

      <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
        <ol className="relative">
          {statusOrder.map((s, i) => {
            const event = result.events[i];
            const done = i <= result.stage;
            const current = i === result.stage;
            const Icon = stageIcons[s];
            return (
              <li key={s} className="relative flex gap-4 pb-7 last:pb-0">
                {i < statusOrder.length - 1 && (
                  <span aria-hidden className={cx("absolute top-10 left-5 h-[calc(100%-2.5rem)] w-0.5", i < result.stage ? "bg-evergreen-600" : "bg-border")} />
                )}
                <span
                  className={cx(
                    "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full",
                    current ? "bg-cranberry-600 text-white ring-4 ring-cranberry-100" : done ? "bg-evergreen-700 text-cream-50" : "bg-cream-200 text-ink-400",
                  )}
                >
                  {done && !current ? <CheckCircle2 className="size-5" /> : <Icon className="size-5" />}
                </span>
                <div className="pt-1.5">
                  <p className={cx("font-semibold", done ? "text-ink-900" : "text-ink-400")}>{t.track.statuses[s].title}</p>
                  <p className="text-sm text-muted">{t.track.statuses[s].text}</p>
                  {event.at && <p className="mt-0.5 text-xs font-medium text-ink-500">{date(event.at, { dateStyle: "medium", timeStyle: "short" })}</p>}
                </div>
              </li>
            );
          })}
        </ol>
        <div className="space-y-4">
          {mail.length > 0 && (
            <div className="rounded-2xl bg-cream-100 p-5">
              <p className="text-xs font-bold tracking-wider text-muted uppercase">{t.track.recipients}</p>
              <ul className="mt-3 space-y-2.5">
                {mail.map((r) => (
                  <li key={r.id} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className={cx("mt-0.5 size-4 shrink-0", delivered ? "text-evergreen-600" : "text-ink-400")} />
                    <span>
                      <span className="font-semibold text-ink-900">{r.name}</span>
                      <span className="block text-xs text-muted">{formatAddress(r)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.simulated && <p className="rounded-2xl bg-gold-100 p-4 text-xs leading-relaxed text-gold-700">ℹ️ {t.track.demo}</p>}
          <div className="rounded-2xl border border-border p-5">
            <p className="font-semibold text-ink-900">{t.track.help}</p>
            <ButtonLink href={`/contact?topic=order&order=${result.order?.id ?? result.code}`} variant="outline" size="sm" className="mt-3 rounded-full">
              {t.track.contact}
            </ButtonLink>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TrackPage() {
  const { t } = useI18n();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHydrated();
  const orders = useOrders((s) => s.orders);
  const initial = params.get("code") ?? "";
  const [input, setInput] = useState(initial);
  const [code, setCode] = useState(initial ? normalizeTracking(initial) : "");
  const now = useNow(20_000);
  const [error, setError] = useState<string | null>(null);

  // Follow ?code= changes (e.g. the top-bar tracking form while already on this page)
  const paramCode = params.get("code");
  const [syncedParam, setSyncedParam] = useState(paramCode);
  if (paramCode !== syncedParam) {
    setSyncedParam(paramCode);
    if (paramCode) {
      const normalized = normalizeTracking(paramCode);
      setInput(normalized);
      setCode(normalized);
    }
  }

  function lookup(value: string) {
    const normalized = normalizeTracking(value);
    setInput(normalized);
    if (!TRACKING_PATTERN.test(normalized)) {
      setError(t.track.invalid);
      setCode("");
      return;
    }
    setError(null);
    setCode(normalized);
    router.replace(`${pathname}?code=${normalized}`, { scroll: false });
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    lookup(input);
  }

  const codeValid = TRACKING_PATTERN.test(code);
  const order = orders.find((o) => o.tracking === code);
  const result = !hydrated || now === null || !codeValid ? null : order ? trackOrder(order, now) : trackCode(code, now);

  return (
    <div className="container-site py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="tracking" className="sr-only">
            {t.track.label}
          </label>
          <div className="flex h-14 flex-1 items-center gap-3 rounded-2xl border border-field-border bg-field-background px-4 shadow-sm focus-within:ring-2 focus-within:ring-accent">
            <PackageSearch className="size-5 text-muted" />
            <input
              id="tracking"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              placeholder={t.track.placeholder}
              aria-invalid={!!error}
              className="min-w-0 flex-1 bg-transparent font-mono text-lg tracking-wide uppercase placeholder:font-sans placeholder:normal-case focus:outline-none"
            />
          </div>
          <Button type="submit" size="lg" className="h-14 rounded-2xl px-8">
            {t.track.button}
          </Button>
        </form>
        {error && <p className="mt-2 text-sm font-medium text-danger">{error}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">{t.track.samples}</span>
          {[...Object.keys(sampleTrackingCodes), ...(hydrated ? orders.slice(0, 1).map((o) => o.tracking) : [])].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => lookup(c)}
              className="rounded-full bg-cream-200 px-3 py-1 font-mono text-xs font-bold tracking-wide text-ink-700 transition hover:bg-gold-200"
            >
              {c}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {result ? (
            <Result key={result.code} result={result} />
          ) : code && !codeValid ? (
            <motion.div key="nf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 rounded-[2rem] border border-border bg-surface p-10 text-center">
              <SearchX className="mx-auto size-10 text-muted" />
              <p className="mt-4 font-display text-2xl font-semibold text-ink-900">{t.track.notFoundTitle}</p>
              <p className="mt-2 text-muted">{t.track.notFoundText}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
