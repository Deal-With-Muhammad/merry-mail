"use client";

import { Button, Modal, Skeleton, Spinner, Tabs, toast } from "@heroui/react";
import { CreditCard, Lock, LogIn, ShieldCheck, Smartphone, UserPlus, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { formatPostal } from "@/data/catalog";
import { demoAccount } from "@/data/demo";
import { useI18n } from "@/i18n/provider";
import { priceCart } from "@/lib/pricing";
import type { Order } from "@/lib/types";
import {
  cardBrand,
  expiryIsValid,
  formatCardNumber,
  formatExpiry,
  isCanadianPostal,
  isEmail,
  luhn,
  newOrderNumber,
  newTrackingNumber,
} from "@/lib/utils";
import { useAuth, useCart, useHydrated, useOrders } from "@/store";
import { SelectInput, TextInput } from "../forms/fields";
import { ButtonLink, LocaleLink } from "../ui/locale-link";
import { MiniItems, TotalsRows } from "./order-summary";

const provinces = ["ON", "QC", "BC", "AB", "MB", "SK", "NS", "NB", "NL", "PE", "YT", "NT", "NU"];

type Method = "card" | "paypal" | "wallet";

function BrandMark({ brand }: { brand: ReturnType<typeof cardBrand> }) {
  if (brand === "unknown") return <CreditCard className="size-4 text-muted" />;
  const label = brand === "visa" ? "VISA" : brand === "mastercard" ? "MC" : "AMEX";
  return <span className="rounded bg-evergreen-900 px-1.5 py-0.5 text-[10px] font-black tracking-wider text-cream-50">{label}</span>;
}

export function CheckoutPage() {
  const { t, money, fmt, href } = useI18n();
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useAuth((s) => s.user);
  const signIn = useAuth((s) => s.signIn);
  const items = useCart((s) => s.items);
  const promoCode = useCart((s) => s.promoCode);
  const clearCart = useCart((s) => s.clear);
  const addOrder = useOrders((s) => s.add);
  const c = t.checkout;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    city: "",
    province: "ON",
    postal: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [prefilled, setPrefilled] = useState(false);
  const [method, setMethod] = useState<Method>("card");
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (hydrated && user && !prefilled) {
    setPrefilled(true);
    setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email, cardName: f.cardName || user.name }));
  }

  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));
  const totals = priceCart(items, promoCode ?? undefined);
  const brand = cardBrand(form.cardNumber);

  const errors = {
    name: !form.name.trim() ? t.common.required : null,
    email: !isEmail(form.email) ? t.common.invalidEmail : null,
    line1: !form.line1.trim() ? t.common.required : null,
    city: !form.city.trim() ? t.common.required : null,
    postal: !isCanadianPostal(form.postal) ? c.postalInvalid : null,
    cardName: method === "card" && !form.cardName.trim() ? t.common.required : null,
    cardNumber: method === "card" && !luhn(form.cardNumber) ? c.cardInvalid : null,
    expiry: method === "card" && !expiryIsValid(form.expiry) ? c.expiryInvalid : null,
    cvc: method === "card" && !/^\d{3,4}$/.test(form.cvc) ? c.cvcInvalid : null,
  };
  const show = (key: keyof typeof errors) => (submitted ? errors[key] : null);

  async function placeOrder(e?: FormEvent) {
    e?.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) {
      toast.danger(c.failed);
      return;
    }
    if (!user) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1900));
    const digits = form.cardNumber.replace(/\D/g, "");
    const order: Order = {
      id: newOrderNumber(),
      tracking: newTrackingNumber(),
      email: user.email,
      name: form.name.trim(),
      items,
      totals: {
        subtotal: totals.subtotal,
        discount: totals.discount,
        promo: totals.promo,
        delivery: totals.delivery,
        tax: totals.tax,
        total: totals.total,
      },
      promoCode: promoCode ?? undefined,
      paymentLast4: method === "card" ? digits.slice(-4) : "",
      paymentBrand: method === "card" ? brand : method,
      createdAt: Date.now(),
    };
    addOrder(order);
    clearCart();
    router.push(href(`/checkout/success?order=${order.id}`));
  }

  if (!hydrated) {
    return (
      <div className="container-site grid grid-cols-1 gap-8 py-12 lg:grid-cols-[1fr_24rem]">
        <Skeleton className="h-[40rem] rounded-[1.75rem]" />
        <Skeleton className="h-96 rounded-[1.75rem]" />
      </div>
    );
  }

  if (!items.length && !processing) {
    return (
      <div className="container-site py-24 text-center">
        <p className="text-lg text-muted">{c.empty}</p>
        <ButtonLink href="/create" className="mt-6 rounded-full">
          {t.common.createCard}
        </ButtonLink>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-site py-16">
        <div className="mx-auto max-w-lg rounded-[2rem] border border-border bg-surface p-8 text-center shadow-sm">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-evergreen-800 text-gold-300">
            <Lock className="size-6" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold text-ink-900">{c.signInTitle}</h1>
          <p className="mt-2 text-muted">{c.signInText}</p>
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ButtonLink href="/signin?next=/checkout" className="rounded-full">
              <LogIn className="size-4" /> {t.nav.signIn}
            </ButtonLink>
            <ButtonLink href="/signup?next=/checkout" variant="outline" className="rounded-full">
              <UserPlus className="size-4" /> {t.auth.createOne}
            </ButtonLink>
          </div>
          <Button
            variant="ghost"
            className="mt-3 rounded-full"
            onPress={() => {
              signIn(demoAccount.email, demoAccount.password);
              toast.success(fmt(t.auth.welcome, { name: demoAccount.name }));
            }}
          >
            {t.auth.demo}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-site py-10 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl font-semibold text-ink-900">{c.title}</h1>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-evergreen-50 px-3 py-1.5 text-xs font-semibold text-evergreen-700">
          <ShieldCheck className="size-4" /> SSL · 256-bit
        </span>
      </div>

      <form onSubmit={placeOrder} noValidate className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-6">
          <fieldset className="rounded-[1.75rem] border border-border bg-surface p-6">
            <legend className="sr-only">{c.contact}</legend>
            <h2 className="mb-5 font-display text-xl font-semibold text-ink-900">1. {c.contact}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextInput label={c.name} value={form.name} onChange={set("name")} error={show("name")} autoComplete="name" />
              <TextInput label={c.email} type="email" value={form.email} onChange={set("email")} error={show("email")} autoComplete="email" />
              <TextInput label={`${c.phone} (${t.common.optional})`} type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" className="sm:col-span-2" />
            </div>
          </fieldset>

          <fieldset className="rounded-[1.75rem] border border-border bg-surface p-6">
            <legend className="sr-only">{c.billing}</legend>
            <h2 className="mb-5 font-display text-xl font-semibold text-ink-900">2. {c.billing}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              <TextInput className="sm:col-span-6" label={c.address} value={form.line1} onChange={set("line1")} error={show("line1")} autoComplete="street-address" />
              <TextInput className="sm:col-span-3" label={c.city} value={form.city} onChange={set("city")} error={show("city")} autoComplete="address-level2" />
              <SelectInput
                className="sm:col-span-1"
                label={c.province}
                value={form.province}
                onChange={set("province")}
                options={provinces.map((p) => ({ id: p, label: p }))}
              />
              <TextInput
                className="sm:col-span-2"
                label={c.postal}
                value={form.postal}
                onChange={(v) => set("postal")(formatPostal(v))}
                error={show("postal")}
                maxLength={7}
                autoComplete="postal-code"
              />
            </div>
          </fieldset>

          <fieldset className="rounded-[1.75rem] border border-border bg-surface p-6">
            <legend className="sr-only">{c.payment}</legend>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold text-ink-900">3. {c.payment}</h2>
              <Lock className="size-4 text-evergreen-600" />
            </div>
            <Tabs selectedKey={method} onSelectionChange={(k) => setMethod(k as Method)}>
              <Tabs.ListContainer>
                <Tabs.List aria-label={c.payment}>
                  <Tabs.Tab id="card">
                    <CreditCard className="size-4" /> {c.methods.card}
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="paypal">
                    <Wallet className="size-4" /> {c.methods.paypal}
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="wallet">
                    <Smartphone className="size-4" /> {c.methods.wallet}
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
              <Tabs.Panel id="card" className="pt-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <TextInput className="sm:col-span-4" label={c.cardName} value={form.cardName} onChange={set("cardName")} error={show("cardName")} autoComplete="cc-name" />
                  <TextInput
                    className="sm:col-span-4"
                    label={c.cardNumber}
                    value={form.cardNumber}
                    onChange={(v) => set("cardNumber")(formatCardNumber(v))}
                    error={show("cardNumber")}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="4242 4242 4242 4242"
                    suffix={<BrandMark brand={brand} />}
                  />
                  <TextInput
                    className="sm:col-span-2"
                    label={c.expiry}
                    value={form.expiry}
                    onChange={(v) => set("expiry")(formatExpiry(v))}
                    error={show("expiry")}
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="12/28"
                    maxLength={5}
                  />
                  <TextInput
                    className="sm:col-span-2"
                    label={c.cvc}
                    value={form.cvc}
                    onChange={(v) => set("cvc")(v.replace(/\D/g, "").slice(0, 4))}
                    error={show("cvc")}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    type="password"
                  />
                </div>
                <p className="mt-4 rounded-2xl bg-gold-100 px-4 py-3 text-xs leading-relaxed text-gold-700">🧪 {c.testHint}</p>
              </Tabs.Panel>
              <Tabs.Panel id="paypal" className="pt-5">
                <div className="flex flex-col items-center gap-4 rounded-2xl bg-cream-100 p-6 text-center">
                  <span className="font-display text-2xl font-bold text-[#003087] italic">
                    Pay<span className="text-[#009cde]">Pal</span>
                  </span>
                  <p className="text-sm text-muted">{c.paypalText}</p>
                </div>
              </Tabs.Panel>
              <Tabs.Panel id="wallet" className="pt-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex h-12 items-center justify-center rounded-xl bg-black font-semibold text-white"> Pay</div>
                  <div className="flex h-12 items-center justify-center rounded-xl border border-border bg-white font-semibold text-ink-900">G Pay</div>
                </div>
                <p className="mt-4 text-center text-sm text-muted">{c.walletText}</p>
              </Tabs.Panel>
            </Tabs>
            <p className="mt-5 flex items-start gap-2 text-xs text-muted">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-evergreen-600" /> {c.secure}
            </p>
          </fieldset>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[1.75rem] border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ink-900">{c.summary}</h2>
              <LocaleLink href="/cart" className="text-sm font-semibold text-cranberry-700 hover:underline">
                {c.edit}
              </LocaleLink>
            </div>
            <div className="mt-2 max-h-72 overflow-y-auto">
              <MiniItems items={items} />
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <TotalsRows totals={totals} promoCode={promoCode} />
            </div>
            <Button type="submit" size="lg" fullWidth className="mt-6 rounded-full" isPending={processing}>
              <Lock className="size-4" />
              {fmt(c.place, { amount: money(totals.total) })}
            </Button>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-muted">{c.agree}</p>
          </div>
        </aside>
      </form>

      <Modal.Backdrop isOpen={processing} isDismissable={false}>
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog className="items-center py-10 text-center">
            <Spinner size="lg" />
            <Modal.Heading className="mt-5">{c.processing}</Modal.Heading>
            <p className="mt-1 text-sm text-muted">{c.processingText}</p>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </div>
  );
}
