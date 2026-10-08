"use client";

import { Button, Skeleton } from "@heroui/react";
import { Check, Copy, Package, PartyPopper, Printer, ScanSearch, Send } from "lucide-react";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { useHydrated, useOrders } from "@/store";
import { ButtonLink } from "../ui/locale-link";
import { Snowfall } from "../ui/snowfall";
import { MiniItems } from "./order-summary";

export function CopyButton({ value }: { value: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size="sm"
      variant="ghost"
      className="rounded-full"
      onPress={async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          /* clipboard unavailable */
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? t.common.copied : t.common.copy}
    </Button>
  );
}

export function SuccessPage() {
  const { t, fmt, money, date } = useI18n();
  const params = useSearchParams();
  const hydrated = useHydrated();
  const id = params.get("order");
  const order = useOrders((s) => s.orders.find((o) => o.id === id));
  const s = t.success;
  const icons = [ScanSearch, Printer, Send];

  if (!hydrated) {
    return (
      <div className="container-site py-16">
        <Skeleton className="mx-auto h-96 max-w-3xl rounded-[2rem]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-site py-24 text-center">
        <p className="text-lg text-muted">{s.notFound}</p>
        <ButtonLink href="/track" className="mt-6 rounded-full">
          {t.track.title}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden bg-evergreen-900 pt-16 pb-28 text-center text-cream-50">
        <Snowfall density={60} />
        <motion.span
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="relative mx-auto flex size-20 items-center justify-center rounded-[1.75rem] bg-gold-400 text-evergreen-950 shadow-2xl"
        >
          <PartyPopper className="size-9" />
        </motion.span>
        <h1 className="relative mt-6 font-display text-4xl font-semibold sm:text-5xl">{fmt(s.title, { name: order.name.split(" ")[0] })}</h1>
        <p className="relative mx-auto mt-3 max-w-xl px-4 text-cream-50/75">{fmt(s.subtitle, { email: order.email })}</p>
      </section>

      <div className="container-site relative -mt-16">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-surface p-6 shadow-xl sm:p-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-cream-100 p-4">
              <p className="text-xs font-bold tracking-wider text-muted uppercase">{s.orderNumber}</p>
              <p className="mt-1 font-display text-2xl font-semibold text-ink-900">{order.id}</p>
              <p className="text-xs text-muted">{date(order.createdAt, { dateStyle: "long", timeStyle: "short" })}</p>
            </div>
            <div className="rounded-2xl bg-evergreen-50 p-4">
              <p className="text-xs font-bold tracking-wider text-evergreen-700 uppercase">{s.tracking}</p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="font-mono text-xl font-bold tracking-wide text-evergreen-900">{order.tracking}</p>
                <CopyButton value={order.tracking} />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <MiniItems items={order.items} />
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold text-ink-900">{s.total}</span>
            <span className="font-display text-2xl font-semibold text-ink-900">{money(order.totals.total)}</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={`/track?code=${order.tracking}`} className="rounded-full">
              <Package className="size-4" /> {s.track}
            </ButtonLink>
            <ButtonLink href="/account?tab=orders" variant="outline" className="rounded-full">
              {s.account}
            </ButtonLink>
            <ButtonLink href="/create" variant="ghost" className="rounded-full">
              {s.another}
            </ButtonLink>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink-900">{s.nextTitle}</h2>
          <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {s.next.map((step, i) => {
              const Icon = icons[i];
              return (
                <li key={step.title} className="rounded-2xl border border-border bg-surface p-5">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-cranberry-50 text-cranberry-700">
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-3 font-semibold text-ink-900">
                    {i + 1}. {step.title}
                  </p>
                  <p className="mt-1 text-sm text-muted">{step.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
