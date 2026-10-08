"use client";

import { AlertDialog, Button, Chip, NumberField, Skeleton, toast } from "@heroui/react";
import { ArrowRight, CalendarClock, Lock, Mailbox, Pencil, ShoppingBag, Store, Tag, Trash2, Truck, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { finishes, formats, FREE_SHIPPING_THRESHOLD, getDesign, papers, PROMO_CODES } from "@/data/catalog";
import { locations } from "@/data/site";
import { useI18n } from "@/i18n/provider";
import { priceCart, priceItem } from "@/lib/pricing";
import type { CartItem } from "@/lib/types";
import { useBuilder, useCart, useHydrated } from "@/store";
import { CardArt } from "../cards/card-art";
import { PaymentBadges } from "../ui/icons";
import { ButtonLink } from "../ui/locale-link";
import { TotalsRows } from "./order-summary";

function CartLine({ item, onRemove }: { item: CartItem; onRemove: () => void }) {
  const { t, l, money, fmt, href } = useI18n();
  const router = useRouter();
  const setQuantity = useCart((s) => s.setQuantity);
  const edit = useBuilder((s) => s.edit);
  const design = getDesign(item.design);
  const paper = papers.find((p) => p.id === item.paper);
  const p = priceItem(item);
  const Icon = item.delivery === "mail" ? Mailbox : item.delivery === "ship" ? Truck : Store;
  const pickup = locations.find((x) => x.id === item.pickupLocation);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
      className="flex flex-col gap-5 rounded-[1.75rem] border border-border bg-surface p-5 sm:flex-row"
    >
      <div className="w-28 shrink-0 self-start overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5 sm:w-32">
        <div className="aspect-[5/7]">
          <CardArt
            design={item.design}
            greeting={item.greeting}
            familyName={item.familyName}
            photo={item.photo}
            photoFallback="placeholder"
            foil={item.finish === "foil"}
            className="h-full w-full"
          />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold text-ink-900">{design ? l(design.name) : item.design}</h3>
            <p className="mt-0.5 text-sm text-muted">
              {l(formats[item.format].name)} · {paper ? `${l(paper.name)} ${paper.weight}` : ""} · {l(finishes[item.finish].name)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-xl font-semibold text-ink-900 tabular-nums">{money(p.total)}</p>
            {p.discount > 0 && (
              <Chip size="sm" color="success" variant="soft" className="mt-1">
                −{Math.round(p.discountRate * 100)}%
              </Chip>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink-700">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 px-3 py-1 font-medium">
            <Icon className="size-4 text-cranberry-700" />
            {item.delivery === "mail"
              ? item.recipients.length === 1
                ? t.cart.recipient
                : fmt(t.cart.recipients, { n: item.recipients.length })
              : item.delivery === "ship"
                ? fmt(t.cart.shipTo, { city: item.shipTo?.city ?? "" })
                : fmt(t.cart.pickup, { city: pickup?.city ?? "" })}
          </span>
          <span className="text-xs text-muted">
            {p.cards === 1 ? t.common.card : fmt(t.common.cards, { n: p.cards })} × {money(p.unit)}
          </span>
        </div>

        {item.delivery === "mail" && (
          <p className="mt-2 truncate text-xs text-muted">
            {t.cart.mailedTo}: {item.recipients.slice(0, 3).map((r) => r.name).join(", ")}
            {item.recipients.length > 3 ? ` ${fmt(t.cart.more, { n: item.recipients.length - 3 })}` : ""}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
          {item.delivery !== "mail" ? (
            <NumberField
              value={item.quantity}
              onChange={(v) => setQuantity(item.id, Number.isFinite(v) ? Math.max(1, Math.min(250, v)) : 1)}
              minValue={1}
              maxValue={250}
              aria-label={t.cart.quantity}
              className="w-36"
            >
              <NumberField.Group>
                <NumberField.DecrementButton />
                <NumberField.Input />
                <NumberField.IncrementButton />
              </NumberField.Group>
            </NumberField>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full"
              onPress={() => {
                edit(item);
                router.push(href("/create"));
              }}
            >
              <Pencil className="size-4" />
              {t.cart.editItem}
            </Button>
            <Button size="sm" variant="ghost" className="rounded-full text-danger" onPress={onRemove}>
              <Trash2 className="size-4" />
              {t.cart.removeItem}
            </Button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export function CartPage() {
  const { t, money, fmt, href } = useI18n();
  const router = useRouter();
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const promoCode = useCart((s) => s.promoCode);
  const setPromo = useCart((s) => s.setPromo);
  const remove = useCart((s) => s.remove);
  const [code, setCode] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const totals = priceCart(items, promoCode ?? undefined);
  const shipped = items.some((i) => i.delivery === "ship");
  const merchandise = totals.subtotal - totals.discount - totals.promo;

  function applyPromo(e: FormEvent) {
    e.preventDefault();
    const normalized = code.trim().toUpperCase();
    if (PROMO_CODES[normalized]) {
      setPromo(normalized);
      setPromoError(null);
      setCode("");
      toast.success(fmt(t.cart.promoApplied, { code: normalized, pct: Math.round(PROMO_CODES[normalized] * 100) }));
    } else {
      setPromoError(t.cart.promoInvalid);
    }
  }

  if (!hydrated) {
    return (
      <div className="container-site grid grid-cols-1 gap-8 py-12 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-4">
          <Skeleton className="h-48 rounded-[1.75rem]" />
          <Skeleton className="h-48 rounded-[1.75rem]" />
        </div>
        <Skeleton className="h-96 rounded-[1.75rem]" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container-site flex flex-col items-center py-24 text-center">
        <span className="flex size-20 items-center justify-center rounded-[1.75rem] bg-cream-200 text-cranberry-700">
          <ShoppingBag className="size-9" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">{t.cart.emptyTitle}</h1>
        <p className="mt-2 max-w-md text-muted">{t.cart.emptyText}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/create" size="lg" className="rounded-full px-7">
            {t.cart.emptyCta}
          </ButtonLink>
          <ButtonLink href="/cards" size="lg" variant="outline" className="rounded-full px-7">
            {t.common.browseDesigns}
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="container-site py-10 sm:py-14">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold text-ink-900">{t.cart.title}</h1>
          <p className="mt-1 text-muted">{t.cart.subtitle}</p>
        </div>
        <p className="flex items-center gap-2 text-sm font-medium text-cranberry-700">
          <CalendarClock className="size-4" /> {t.cart.deadline}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <ul className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <CartLine key={item.id} item={item} onRemove={() => setRemoving(item.id)} />
            ))}
          </AnimatePresence>
          <li>
            <ButtonLink href="/cards" variant="ghost" className="rounded-full">
              ← {t.cart.continue}
            </ButtonLink>
          </li>
        </ul>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[1.75rem] border border-border bg-surface p-6">
            <form onSubmit={applyPromo} className="mb-6">
              <label htmlFor="promo" className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink-900">
                <Tag className="size-4" /> {t.cart.promo}
              </label>
              {promoCode ? (
                <div className="flex items-center justify-between rounded-2xl bg-evergreen-50 px-4 py-2.5 text-sm font-semibold text-evergreen-700">
                  {promoCode}
                  <button type="button" onClick={() => setPromo(null)} aria-label={t.common.remove} className="rounded-full p-1 hover:bg-evergreen-100">
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    id="promo"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setPromoError(null);
                    }}
                    placeholder={t.cart.promoPlaceholder}
                    aria-invalid={!!promoError}
                    className="h-10 min-w-0 flex-1 rounded-xl border border-field-border bg-field-background px-3 text-sm uppercase placeholder:normal-case focus:ring-2 focus:ring-accent focus:outline-none"
                  />
                  <Button type="submit" variant="secondary" className="rounded-xl">
                    {t.common.apply}
                  </Button>
                </div>
              )}
              {promoError && <p className="mt-1.5 text-xs font-medium text-danger">{promoError}</p>}
            </form>

            <TotalsRows totals={totals} promoCode={promoCode} />

            {shipped && !totals.freeShipping && merchandise < FREE_SHIPPING_THRESHOLD && (
              <p className="mt-4 rounded-2xl bg-gold-100 px-3 py-2 text-xs font-semibold text-gold-700">
                {fmt(t.cart.freeShipHint, { amount: money(FREE_SHIPPING_THRESHOLD - merchandise) })}
              </p>
            )}

            <Button size="lg" fullWidth className="mt-6 rounded-full" onPress={() => router.push(href("/checkout"))}>
              <Lock className="size-4" />
              {t.cart.checkout}
              <ArrowRight className="size-4" />
            </Button>
            <p className="mt-3 text-center text-xs text-muted">{t.cart.secure}</p>
            <div className="mt-4 rounded-2xl bg-evergreen-900 p-3">
              <PaymentBadges className="flex flex-wrap justify-center gap-1.5" />
            </div>
          </div>
        </aside>
      </div>

      <AlertDialog.Backdrop isOpen={!!removing} onOpenChange={(open) => !open && setRemoving(null)}>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-sm">
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>{t.cart.removeTitle}</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>{t.cart.removeText}</p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                {t.common.cancel}
              </Button>
              <Button
                variant="danger"
                onPress={() => {
                  if (removing) remove(removing);
                  setRemoving(null);
                  toast(t.cart.removed);
                }}
              >
                {t.cart.removeItem}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </div>
  );
}
