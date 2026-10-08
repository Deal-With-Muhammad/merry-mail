"use client";

import { Button, Chip, toast } from "@heroui/react";
import {
  Clock,
  ExternalLink,
  HelpCircle,
  Mail,
  Mailbox,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Send,
  Store,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { deliveryOptions, finishes, formatPostal, papers, type DeliveryId, type FinishId } from "@/data/catalog";
import { contact, locations, unsplash } from "@/data/site";
import { useI18n } from "@/i18n/provider";
import { cx, isEmail, isOntarioPostal } from "@/lib/utils";
import { PaperSwatch } from "../cards/paper-swatch";
import { NewsletterForm } from "../forms/newsletter-form";
import { SelectInput, TextAreaInput, TextInput } from "../forms/fields";
import { FaqAccordion } from "../home/sections";
import { ButtonLink, LocaleLink } from "../ui/locale-link";
import { Reveal } from "../ui/motion";

/* ------------------------------------------------------------------ */
/*  Locations                                                         */
/* ------------------------------------------------------------------ */

function osmEmbed([lat, lon]: [number, number]) {
  const d = 0.012;
  const bbox = [lon - d * 1.6, lat - d, lon + d * 1.6, lat + d].map((n) => n.toFixed(4)).join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
}

export function LocationsPage() {
  const { t, l, fmt } = useI18n();
  const p = t.locationsPage;
  const [active, setActive] = useState(locations[0].id);
  const loc = locations.find((x) => x.id === active) ?? locations[0];

  return (
    <div className="container-site py-12 sm:py-16">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ul className="flex flex-col gap-3">
          {locations.map((x) => (
            <li key={x.id} id={x.id} className="scroll-mt-32">
              <button
                type="button"
                onClick={() => setActive(x.id)}
                aria-pressed={active === x.id}
                className={cx(
                  "flex w-full gap-4 rounded-[1.5rem] border p-3 text-left transition",
                  active === x.id ? "border-evergreen-800 bg-evergreen-50 ring-1 ring-evergreen-800" : "border-border bg-surface hover:border-ink-400",
                )}
              >
                <span className="relative size-24 shrink-0 overflow-hidden rounded-2xl">
                  <Image src={unsplash(x.image, 300)} alt="" fill sizes="96px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1 py-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-xl font-semibold text-ink-900">{x.city}</span>
                    {x.hq && (
                      <Chip size="sm" color="warning" variant="soft">
                        {p.hq}
                      </Chip>
                    )}
                  </span>
                  <span className="block text-sm text-cranberry-700">{l(x.label)}</span>
                  <span className="mt-1 block truncate text-xs text-muted">{x.address}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-surface">
            <iframe
              key={loc.id}
              title={fmt(p.mapTitle, { city: loc.city })}
              src={osmEmbed(loc.coords)}
              className="h-72 w-full border-0 sm:h-80"
              loading="lazy"
            />
            <div className="p-6">
              <h2 className="font-display text-3xl font-semibold text-ink-900">{loc.city}</h2>
              <p className="text-cranberry-700">{l(loc.label)}</p>
              <dl className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted" />
                  <dd className="text-ink-900">{loc.address}</dd>
                </div>
                <div className="flex gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-muted" />
                  <dd className="text-ink-900">{l(loc.hours)}</dd>
                </div>
                <div className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-muted" />
                  <dd>
                    <a href={`tel:${loc.phone.replace(/\D/g, "")}`} className="font-semibold text-ink-900 hover:text-cranberry-700">
                      {loc.phone}
                    </a>
                  </dd>
                </div>
              </dl>
              <p className="mt-5 text-xs font-bold tracking-wider text-muted uppercase">{p.services}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {loc.services.map((s) => (
                  <Chip key={s.en} size="sm" variant="soft" color="success">
                    {l(s)}
                  </Chip>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-evergreen-800 px-5 text-sm font-semibold text-cream-50 hover:bg-evergreen-700"
                >
                  <Navigation className="size-4" /> {p.directions}
                </a>
                <a
                  href={`tel:${loc.phone.replace(/\D/g, "")}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-ink-900 hover:bg-cream-100"
                >
                  <Phone className="size-4" /> {p.call}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <Reveal className="max-w-2xl">
          <h2 className="section-title">{p.areaTitle}</h2>
          <p className="section-lead mt-3">{p.areaText}</p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {p.regions.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.06}>
              <div className="h-full rounded-[1.5rem] border border-border bg-surface p-5">
                <MapPin className="size-5 text-cranberry-700" />
                <p className="mt-3 font-semibold text-ink-900">{r.name}</p>
                <p className="mt-1 text-sm text-muted">{r.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 flex flex-col items-start gap-4 rounded-[1.75rem] bg-gold-100 p-6 sm:flex-row sm:items-center">
          <p className="flex-1 font-medium text-gold-700">{p.expansion}</p>
          <NewsletterForm className="max-w-md" />
        </Reveal>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact                                                           */
/* ------------------------------------------------------------------ */

const topics = ["order", "design", "corporate", "wedding", "other"] as const;
type Topic = (typeof topics)[number];

export function ContactPage() {
  const { t, l, fmt } = useI18n();
  const c = t.contactPage;
  const params = useSearchParams();
  const initialTopic = params.get("topic") as Topic | null;
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: (initialTopic && topics.includes(initialTopic) ? initialTopic : "order") as Topic,
    order: params.get("order") ?? "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const errors = {
    name: !form.name.trim() ? t.common.required : null,
    email: !isEmail(form.email) ? t.common.invalidEmail : null,
    message: form.message.trim().length < 5 ? t.common.required : null,
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
    toast.success(fmt(c.sent, { name: form.name.trim().split(" ")[0] }));
    setForm((f) => ({ ...f, message: "", order: "" }));
  }

  const info = [
    { icon: Phone, title: c.callTitle, value: contact.phone, href: contact.phoneHref },
    { icon: Mail, title: c.emailTitle, value: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPin, title: c.visitTitle, value: contact.address, href: "/locations" },
    { icon: Clock, title: c.hoursTitle, value: l(contact.hours) },
  ];

  return (
    <div className="container-site py-12 sm:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Reveal>
          <form onSubmit={onSubmit} noValidate className="rounded-[2rem] border border-border bg-surface p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink-900">
              <MessageCircle className="size-6 text-cranberry-700" /> {c.formTitle}
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextInput label={c.name} value={form.name} onChange={set("name")} error={show("name")} autoComplete="name" />
              <TextInput label={c.email} type="email" value={form.email} onChange={set("email")} error={show("email")} autoComplete="email" />
              <TextInput label={c.phone} type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" />
              <SelectInput
                label={c.topic}
                value={form.topic}
                onChange={(v) => set("topic")(v)}
                options={topics.map((id) => ({ id, label: c.topics[id] }))}
              />
              {form.topic === "order" && (
                <TextInput className="sm:col-span-2" label={c.orderNumber} value={form.order} onChange={set("order")} placeholder="MM26XXXXX / MM-XXXX-XXXX" />
              )}
              <TextAreaInput
                className="sm:col-span-2"
                label={c.message}
                value={form.message}
                onChange={set("message")}
                error={show("message")}
                placeholder={c.messagePlaceholder}
                rows={6}
              />
            </div>
            <Button type="submit" size="lg" className="mt-6 rounded-full px-7" isPending={pending}>
              <Send className="size-4" /> {c.send}
            </Button>
          </form>
        </Reveal>

        <div className="space-y-4">
          {info.map(({ icon: Icon, title, value, href }, i) => {
            const body = (
              <>
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-cranberry-50 text-cranberry-700">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold tracking-wider text-muted uppercase">{title}</span>
                  <span className="block font-semibold text-ink-900">{value}</span>
                </span>
              </>
            );
            const cls = "flex items-center gap-4 rounded-[1.5rem] border border-border bg-surface p-5 transition hover:border-ink-400";
            return (
              <Reveal key={title} delay={i * 0.05}>
                {!href ? (
                  <div className={cls}>{body}</div>
                ) : href.startsWith("/") ? (
                  <LocaleLink href={href} className={cls}>
                    {body}
                  </LocaleLink>
                ) : (
                  <a href={href} className={cls}>
                    {body}
                  </a>
                )}
              </Reveal>
            );
          })}
          <Reveal>
            <div className="rounded-[1.5rem] bg-evergreen-900 p-6 text-cream-50">
              <HelpCircle className="size-6 text-gold-300" />
              <p className="mt-3 font-display text-xl font-semibold">{c.faqTitle}</p>
              <p className="mt-1 text-sm text-cream-50/70">{c.faqText}</p>
              <ButtonLink href="/faq" size="sm" className="mt-4 rounded-full bg-cream-50 text-evergreen-900 hover:bg-white">
                {c.faqCta}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                               */
/* ------------------------------------------------------------------ */

export function FaqPage() {
  const { t } = useI18n();
  const f = t.faqPage;
  return (
    <div className="container-site py-12 sm:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <nav aria-label={f.title} className="lg:sticky lg:top-28 lg:self-start">
          <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:px-0">
            {f.categories.map((cat) => (
              <li key={cat.id} className="shrink-0">
                <a href={`#${cat.id}`} className="block rounded-full px-4 py-2 text-sm font-semibold text-ink-700 ring-1 ring-border hover:bg-cream-200 lg:rounded-xl lg:ring-0">
                  {cat.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-12">
          {f.categories.map((cat) => (
            <Reveal key={cat.id}>
              <section id={cat.id}>
                <h2 className="mb-4 font-display text-2xl font-semibold text-ink-900">{cat.title}</h2>
                <FaqAccordion items={cat.items} />
              </section>
            </Reveal>
          ))}
          <Reveal>
            <div className="flex flex-col items-start gap-4 rounded-[2rem] bg-cranberry-700 p-8 text-cream-50 sm:flex-row sm:items-center">
              <div className="flex-1">
                <p className="font-display text-2xl font-semibold">{f.stillTitle}</p>
                <p className="text-cream-50/80">{f.stillText}</p>
              </div>
              <ButtonLink href="/contact" className="rounded-full bg-cream-50 text-cranberry-700 hover:bg-white">
                {f.contact}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Paper guide                                                       */
/* ------------------------------------------------------------------ */

export function PaperGuidePage() {
  const { t, l, money, fmt } = useI18n();
  const p = t.paperPage;
  const [email, setEmail] = useState("");
  const [postal, setPostal] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const emailError = submitted && !isEmail(email) ? t.common.invalidEmail : null;
  const postalError = submitted && !isOntarioPostal(postal) ? t.common.postalInvalid : null;

  function requestSamples(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!isEmail(email) || !isOntarioPostal(postal)) return;
    toast.success(p.sampleSent);
    setEmail("");
    setPostal("");
    setSubmitted(false);
  }

  return (
    <div className="container-site py-12 sm:py-16">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {papers.map((paper, i) => (
          <Reveal key={paper.id} delay={(i % 2) * 0.06}>
            <article className={cx("flex h-full flex-col gap-6 rounded-[2rem] border bg-surface p-6 sm:flex-row", paper.popular ? "border-cranberry-300 ring-1 ring-cranberry-300" : "border-border")}>
              <div className="w-full shrink-0 rounded-[1.5rem] bg-cream-200/60 p-3 sm:w-48">
                <PaperSwatch paper={paper} />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl font-semibold text-ink-900">{l(paper.name)}</h2>
                  {paper.popular && (
                    <Chip size="sm" color="accent">
                      {t.common.mostPopular}
                    </Chip>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{l(paper.description)}</p>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs font-bold tracking-wider text-muted uppercase">{p.weight}</dt>
                    <dd className="font-semibold text-ink-900">{paper.weight}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold tracking-wider text-muted uppercase">{p.feel}</dt>
                    <dd className="font-semibold text-ink-900">{p.texture[paper.id]}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold tracking-wider text-muted uppercase">{p.bestFor}</dt>
                    <dd className="font-semibold text-ink-900">{l(paper.bestFor)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold tracking-wider text-muted uppercase">{p.price}</dt>
                    <dd className="font-semibold text-ink-900">
                      {paper.price === 0 ? t.common.included : fmt(t.home.papers.add, { price: money(paper.price) })}
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16">
        <h2 className="section-title text-3xl!">{p.compare}</h2>
        <div className="mt-6 overflow-x-auto rounded-[1.5rem] border border-border bg-surface">
          <table className="w-full min-w-[36rem] text-sm">
            <thead className="bg-surface-secondary text-left">
              <tr>
                {Object.values(p.columns).map((h) => (
                  <th key={h} className="p-4 font-semibold text-ink-900">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {papers.map((paper) => (
                <tr key={paper.id} className="border-t border-border">
                  <td className="p-4 font-semibold text-ink-900">
                    <span className="mr-2 inline-block size-3 rounded-full align-middle ring-1 ring-black/15" style={{ background: paper.tint }} />
                    {l(paper.name)}
                  </td>
                  <td className="p-4 text-muted">{paper.weight}</td>
                  <td className="p-4 text-muted">{p.thickness[paper.id]}</td>
                  <td className="p-4 text-muted">{p.texture[paper.id]}</td>
                  <td className="p-4 font-semibold text-ink-900">{paper.price === 0 ? t.common.included : `+${money(paper.price)}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal className="mt-16">
        <h2 className="section-title text-3xl!">{p.finishesTitle}</h2>
        <p className="section-lead mt-2">{p.finishesText}</p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(Object.keys(finishes) as FinishId[]).map((f) => (
            <div key={f} className="rounded-[1.5rem] border border-border bg-surface p-5">
              <span
                className="block h-16 rounded-xl ring-1 ring-black/10"
                style={{
                  background:
                    f === "foil"
                      ? "linear-gradient(115deg,#8a6a22,#e8d4a2 30%,#c9a24a 45%,#fff3c4 60%,#a8842f 80%)"
                      : f === "gloss"
                        ? "linear-gradient(135deg,#0e3b2e,#1c6650 45%,#7fb8a3 52%,#1c6650 60%,#0e3b2e)"
                        : "#0e3b2e",
                }}
              />
              <p className="mt-4 font-semibold text-ink-900">{l(finishes[f].name)}</p>
              <p className="text-sm text-muted">{l(finishes[f].detail)}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-16">
        <form onSubmit={requestSamples} noValidate className="grid grid-cols-1 items-start gap-6 rounded-[2rem] bg-evergreen-900 p-6 text-cream-50 sm:p-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold">{p.sampleTitle}</h2>
            <p className="mt-2 text-cream-50/75">{p.sampleText}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 rounded-[1.5rem] bg-cream-50 p-5 text-ink-900 sm:grid-cols-[1fr_0.7fr]">
            <TextInput label={t.common.email} type="email" value={email} onChange={setEmail} error={emailError} autoComplete="email" />
            <TextInput label={t.builder.fields.postal} value={postal} onChange={(v) => setPostal(formatPostal(v))} error={postalError} maxLength={7} placeholder="M5V 2T6" />
            <Button type="submit" className="rounded-full sm:col-span-2">
              <Mailbox className="size-4" /> {p.sampleCta}
            </Button>
          </div>
        </form>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shipping                                                          */
/* ------------------------------------------------------------------ */

export function ShippingPage() {
  const { t, l, money } = useI18n();
  const s = t.shippingPage;
  const icons: Record<DeliveryId, typeof Mailbox> = { mail: Mailbox, ship: Truck, pickup: Store };
  return (
    <div className="container-site py-12 sm:py-16">
      <Reveal>
        <h2 className="section-title text-3xl!">{s.deadlinesTitle}</h2>
        <div className="mt-6 overflow-x-auto rounded-[1.5rem] border border-border bg-surface">
          <table className="w-full min-w-[36rem] text-sm">
            <thead className="bg-evergreen-900 text-left text-cream-50">
              <tr>
                <th className="p-4 font-semibold">{s.columns.region}</th>
                <th className="p-4 font-semibold">{s.columns.mail}</th>
                <th className="p-4 font-semibold">{s.columns.ship}</th>
                <th className="p-4 font-semibold">{s.columns.pickup}</th>
              </tr>
            </thead>
            <tbody>
              {s.rows.map((row) => (
                <tr key={row.region} className="border-t border-border">
                  <td className="p-4 font-semibold text-ink-900">{row.region}</td>
                  <td className="p-4 font-display text-lg font-semibold text-cranberry-700">{row.mail}</td>
                  <td className="p-4 font-display text-lg font-semibold text-ink-700">{row.ship}</td>
                  <td className="p-4 font-display text-lg font-semibold text-ink-700">{row.pickup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal className="mt-16">
        <h2 className="section-title text-3xl!">{s.methodsTitle}</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {(Object.keys(deliveryOptions) as DeliveryId[]).map((id) => {
            const o = deliveryOptions[id];
            const Icon = icons[id];
            return (
              <div key={id} className="rounded-[1.5rem] border border-border bg-surface p-6">
                <Icon className="size-7 text-cranberry-700" />
                <p className="mt-4 font-display text-xl font-semibold text-ink-900">{l(o.name)}</p>
                <p className="mt-1 text-sm text-muted">{l(o.detail)}</p>
                <p className="mt-4 font-semibold text-evergreen-800">
                  {o.price === 0 ? t.common.free : `${money(o.price)}${o.per === "card" ? ` ${t.common.perCard}` : ""}`}
                </p>
              </div>
            );
          })}
        </div>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-[1.5rem] bg-cream-50 p-6 ring-1 ring-border">
            <h2 className="font-display text-2xl font-semibold text-ink-900">{s.notesTitle}</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-700">
              {s.notes.map((n) => (
                <li key={n} className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cranberry-600" /> {n}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal>
          <div className="h-full rounded-[1.5rem] bg-gold-100 p-6">
            <h2 className="font-display text-2xl font-semibold text-ink-900">{s.outside}</h2>
            <p className="mt-2 text-sm text-gold-700">{t.locationsPage.expansion}</p>
            <NewsletterForm className="mt-5" />
            <LocaleLink href="/track" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cranberry-700 hover:underline">
              {t.nav.resourcesMenu.track.title} <ExternalLink className="size-3.5" />
            </LocaleLink>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Legal                                                             */
/* ------------------------------------------------------------------ */

export function LegalPage({ doc }: { doc: "privacy" | "terms" | "cookies" }) {
  const { t } = useI18n();
  const content = t.legal[doc];
  return (
    <div className="container-site py-12 sm:py-16">
      <article className="prose-mm mx-auto max-w-3xl rounded-[2rem] border border-border bg-surface p-6 sm:p-10">
        <p className="text-sm text-muted">{t.legal.updated}</p>
        {content.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            <p>{s.p}</p>
          </section>
        ))}
        <p className="mt-8 rounded-2xl bg-gold-100 p-4 text-xs text-gold-700">{t.common.prototype}</p>
      </article>
    </div>
  );
}
