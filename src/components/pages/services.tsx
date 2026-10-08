"use client";

import { Button, toast } from "@heroui/react";
import { ArrowRight, Check, ClipboardList, FileCheck2, Send, SprayCan } from "lucide-react";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { serviceSlugs, services, unsplash, type ServiceSlug } from "@/data/site";
import { useI18n } from "@/i18n/provider";
import { cx, isEmail } from "@/lib/utils";
import { CardArt } from "../cards/card-art";
import { TextAreaInput, TextInput } from "../forms/fields";
import { ButtonLink, LocaleLink } from "../ui/locale-link";
import { Reveal } from "../ui/motion";
import { SectionHeading } from "../ui/section";

/* ------------------------------------------------------------------ */

export function QuoteForm({ service }: { service: ServiceSlug }) {
  const { t } = useI18n();
  const s = t.servicesPage;
  const f = s.quoteFields;
  const [form, setForm] = useState({ name: "", email: "", phone: "", quantity: "", date: "", details: "" });
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm((x) => ({ ...x, [k]: v }));
  const errors = {
    name: !form.name.trim() ? t.common.required : null,
    email: !isEmail(form.email) ? t.common.invalidEmail : null,
    details: !form.details.trim() ? t.common.required : null,
  };
  const show = (k: keyof typeof errors) => (submitted ? errors[k] : null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    setPending(true);
    await new Promise((r) => setTimeout(r, 800));
    setPending(false);
    setSubmitted(false);
    setForm({ name: "", email: "", phone: "", quantity: "", date: "", details: "" });
    toast.success(s.quoteSent);
  }

  return (
    <form id="quote" onSubmit={onSubmit} noValidate className="scroll-mt-32 rounded-[2rem] border border-border bg-surface p-6 sm:p-8">
      <h2 className="font-display text-2xl font-semibold text-ink-900">{s.quoteTitle}</h2>
      <p className="mt-1 text-sm text-muted">{s.quoteText}</p>
      <input type="hidden" name="service" value={service} />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput label={f.name} value={form.name} onChange={set("name")} error={show("name")} autoComplete="name" />
        <TextInput label={f.email} type="email" value={form.email} onChange={set("email")} error={show("email")} autoComplete="email" />
        <TextInput label={`${f.phone} (${t.common.optional})`} type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" />
        <TextInput label={f.quantity} value={form.quantity} onChange={set("quantity")} inputMode="numeric" placeholder="100" />
        <TextInput label={f.date} type="date" value={form.date} onChange={set("date")} className="sm:col-span-2" />
        <TextAreaInput
          className="sm:col-span-2"
          label={f.details}
          value={form.details}
          onChange={set("details")}
          error={show("details")}
          placeholder={f.detailsPlaceholder}
          rows={4}
        />
      </div>
      <Button type="submit" size="lg" className="mt-6 rounded-full" isPending={pending}>
        <Send className="size-4" />
        {s.quoteSubmit}
      </Button>
    </form>
  );
}

/* ------------------------------------------------------------------ */

function ServiceCard({ slug, large }: { slug: ServiceSlug; large?: boolean }) {
  const { t, money, fmt } = useI18n();
  const item = t.servicesPage.items[slug];
  const svc = services[slug];
  return (
    <LocaleLink
      href={`/services/${slug}`}
      className={cx(
        "group relative flex overflow-hidden rounded-[2rem] bg-evergreen-950 text-cream-50 shadow-lg",
        large ? "min-h-[26rem] lg:col-span-2" : "min-h-[22rem]",
      )}
    >
      <Image
        src={unsplash(svc.image, large ? 1400 : 800)}
        alt=""
        fill
        sizes={large ? "(min-width:1024px) 66vw, 100vw" : "(min-width:1024px) 33vw, 100vw"}
        className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-evergreen-950 via-evergreen-950/40 to-transparent" />
      <div className="relative mt-auto p-7">
        {large && (
          <span className="mb-3 inline-block rounded-full bg-gold-400 px-3 py-1 text-xs font-bold text-evergreen-950">{t.servicesPage.featured}</span>
        )}
        <h3 className={cx("font-display font-semibold", large ? "text-4xl" : "text-2xl")}>{item.name}</h3>
        <p className="mt-1 text-cream-50/75">{item.tagline}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          {svc.fromPrice ? <span className="text-sm font-semibold text-gold-300">{fmt(t.servicesPage.from, { price: money(svc.fromPrice) })}</span> : <span />}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-50 px-4 py-2 text-sm font-semibold text-ink-900 transition group-hover:bg-gold-300">
            {t.servicesPage.explore} <ArrowRight className="size-4" />
          </span>
        </div>
      </div>
    </LocaleLink>
  );
}

export function ServicesIndex() {
  const { t } = useI18n();
  const s = t.servicesPage;
  const cleaning = s.items.cleaning;
  return (
    <div className="container-site py-12 sm:py-16">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <ServiceCard slug="holiday-cards" large />
        </Reveal>
        <Reveal delay={0.05}>
          <ServiceCard slug="wedding-invitations" />
        </Reveal>
        <Reveal delay={0.1}>
          <ServiceCard slug="business-cards" />
        </Reveal>
        <Reveal delay={0.15} className="lg:col-span-2">
          <ServiceCard slug="corporate-cards" />
        </Reveal>
      </div>

      <section className="mt-20">
        <SectionHeading eyebrow={s.howItWorks} title={s.whatsIncluded} />
        <ol className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {s.process.map((step, i) => {
            const Icon = [ClipboardList, FileCheck2, Send][i];
            return (
              <Reveal as="li" key={step.title} delay={i * 0.08}>
                <div className="h-full rounded-[1.75rem] border border-border bg-surface p-6">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-cranberry-50 text-cranberry-700">
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-4 font-display text-xl font-semibold text-ink-900">
                    {i + 1}. {step.title}
                  </p>
                  <p className="mt-1 text-sm text-muted">{step.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </section>

      <Reveal className="mt-20">
        <LocaleLink
          href="/services/cleaning"
          className="group flex flex-col items-start gap-5 rounded-[2rem] border border-dashed border-evergreen-300 bg-evergreen-50 p-6 transition hover:border-evergreen-500 sm:flex-row sm:items-center sm:p-8"
        >
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-evergreen-800 text-cream-50">
            <SprayCan className="size-6" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-bold tracking-wider text-evergreen-700 uppercase">{t.nav.servicesMenu.alsoTitle}</p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink-900">{cleaning.name}</p>
            <p className="text-sm text-muted">{cleaning.tagline}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 font-semibold text-evergreen-800">
            {t.common.learnMore} <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </span>
        </LocaleLink>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function ServiceDetail({ slug }: { slug: ServiceSlug }) {
  const { t, money, fmt } = useI18n();
  const s = t.servicesPage;
  const item = s.items[slug];
  const svc = services[slug];
  const isHoliday = slug === "holiday-cards";
  const others = serviceSlugs.filter((x) => x !== slug && x !== "cleaning");

  return (
    <>
      <section className="relative overflow-hidden bg-evergreen-950 text-cream-50">
        <Image src={unsplash(svc.image, 1800)} alt="" fill sizes="100vw" priority className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-evergreen-950 via-evergreen-950/75 to-evergreen-950/20" />
        <div className="container-site relative py-20 sm:py-28">
          <Reveal className="max-w-2xl">
            {slug === "cleaning" && (
              <span className="mb-4 inline-block rounded-full bg-gold-400 px-3 py-1 text-xs font-bold text-evergreen-950">{s.cleaningNote}</span>
            )}
            <LocaleLink href="/services" className="text-sm font-semibold text-gold-300 hover:underline">
              ← {t.nav.services}
            </LocaleLink>
            <h1 className="mt-3 font-display text-5xl leading-[1.05] font-semibold sm:text-6xl">{item.name}</h1>
            <p className="mt-3 text-xl text-cream-50/80">{item.tagline}</p>
            {svc.fromPrice && <p className="mt-4 font-semibold text-gold-300">{fmt(s.from, { price: money(svc.fromPrice) })}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              {isHoliday ? (
                <>
                  <ButtonLink href="/cards" size="lg" className="rounded-full px-7">
                    {item.cta}
                  </ButtonLink>
                  <ButtonLink href="/create" size="lg" variant="outline" className="rounded-full border-white/25 px-7 text-cream-50 hover:bg-white/10">
                    {t.common.createCard}
                  </ButtonLink>
                </>
              ) : (
                <ButtonLink href="#quote" size="lg" className="rounded-full px-7">
                  {item.cta}
                </ButtonLink>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container-site py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="text-lg leading-relaxed text-ink-500">{item.description}</p>
            </Reveal>
            <Reveal className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-ink-900">{s.whatsIncluded}</h2>
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {item.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 rounded-2xl bg-surface p-4 ring-1 ring-border">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-evergreen-100 text-evergreen-700">
                      <Check className="size-4" />
                    </span>
                    <span className="text-sm font-medium text-ink-900">{feature}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="mt-12">
              <h2 className="font-display text-2xl font-semibold text-ink-900">{s.howItWorks}</h2>
              <ol className="mt-5 space-y-4">
                {s.process.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cranberry-600 text-sm font-bold text-white">{i + 1}</span>
                    <div>
                      <p className="font-semibold text-ink-900">{step.title}</p>
                      <p className="text-sm text-muted">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <div className="space-y-6">
            {isHoliday ? (
              <Reveal>
                <div className="grid grid-cols-3 gap-3 rounded-[2rem] bg-cream-50 p-5 ring-1 ring-border">
                  {(["evergreen", "family-photo", "northern-lights", "cranberry-joy", "golden-wreath", "toronto-snowfall"] as const).map((d) => (
                    <LocaleLink key={d} href={`/cards/${d}`} className="block overflow-hidden rounded-md shadow-md transition hover:-translate-y-1">
                      <div className="aspect-[5/7]">
                        <CardArt design={d} className="h-full w-full" />
                      </div>
                    </LocaleLink>
                  ))}
                </div>
              </Reveal>
            ) : (
              <Reveal>
                <QuoteForm service={slug} />
              </Reveal>
            )}
            <Reveal>
              <p className="mb-3 text-xs font-bold tracking-wider text-muted uppercase">{s.gallery}</p>
              <div className="grid grid-cols-3 gap-3">
                {svc.gallery.map((img) => (
                  <div key={img} className="relative aspect-square overflow-hidden rounded-2xl">
                    <Image src={unsplash(img, 500)} alt="" fill sizes="(min-width:1024px) 14vw, 33vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <section className="mt-20">
          <h2 className="section-title text-3xl!">{s.otherServices}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {others.map((o, i) => (
              <Reveal key={o} delay={i * 0.06}>
                <ServiceCard slug={o} />
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
