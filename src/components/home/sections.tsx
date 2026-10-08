"use client";

import { Accordion, Card, Chip } from "@heroui/react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  Palette,
  PenLine,
  Phone,
  Quote,
  Send,
  Star,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { designs, formats, papers } from "@/data/catalog";
import { contact, images, team, testimonials, unsplash } from "@/data/site";
import { useI18n } from "@/i18n/provider";
import { cx } from "@/lib/utils";
import { DesignTile } from "../cards/design-tile";
import { PaperSwatch } from "../cards/paper-swatch";
import { NewsletterForm } from "../forms/newsletter-form";
import { ButtonLink, LocaleLink } from "../ui/locale-link";
import { Reveal } from "../ui/motion";
import { SectionHeading } from "../ui/section";

/* ------------------------------------------------------------------ */

export function Stats() {
  const { t } = useI18n();
  return (
    <section className="container-site py-14 sm:py-16">
      <dl className="mx-auto grid max-w-4xl grid-cols-3">
        {t.home.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06} className={cx("px-2 text-center sm:px-4", i > 0 && "border-l border-border")}>
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-display text-4xl font-semibold text-evergreen-800 sm:text-5xl">{s.value}</dd>
            <dd className="mt-1 text-xs leading-snug text-muted sm:text-sm">{s.label}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function HowItWorks() {
  const { t } = useI18n();
  const icons = [Palette, PenLine, Users, Send];
  return (
    <section className="relative overflow-hidden bg-cream-50 py-20 sm:py-28">
      <div className="bg-festive-dots absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
      <div className="container-site relative">
        <SectionHeading eyebrow={t.home.how.eyebrow} title={t.home.how.title} subtitle={t.home.how.subtitle} />
        <ol className="relative mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div aria-hidden className="absolute top-9 right-[12%] left-[12%] hidden h-px border-t-2 border-dashed border-gold-300 lg:block" />
          {t.home.how.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <Reveal as="li" key={step.title} delay={i * 0.1} className="relative">
                <div className="flex h-full flex-col items-center rounded-3xl px-4 text-center">
                  <span className="relative flex size-[4.5rem] items-center justify-center rounded-[1.4rem] bg-evergreen-800 text-cream-50 shadow-[0_14px_30px_-12px_rgba(14,59,46,0.7)]">
                    <Icon className="size-7" />
                    <span className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-cranberry-600 text-xs font-bold text-white ring-4 ring-cream-50">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-6 font-display text-xl font-semibold text-ink-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
        <Reveal className="mt-14 flex justify-center">
          <ButtonLink href="/create" size="lg" className="rounded-full px-7">
            {t.home.how.cta}
            <ArrowRight className="size-4" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function FeaturedDesigns() {
  const { t } = useI18n();
  const featured = designs.slice(0, 6);
  return (
    <section className="container-site py-20 sm:py-28">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading align="left" eyebrow={t.home.featured.eyebrow} title={t.home.featured.title} subtitle={t.home.featured.subtitle} />
        <Reveal>
          <ButtonLink href="/cards" variant="outline" className="rounded-full">
            {t.home.featured.viewAll}
            <ArrowRight className="size-4" />
          </ButtonLink>
        </Reveal>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((design, i) => (
          <Reveal key={design.slug} delay={(i % 3) * 0.08}>
            <DesignTile design={design} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function PaperOptions() {
  const { t, l, money, fmt } = useI18n();
  return (
    <section className="container-site py-20 sm:py-28">
      <SectionHeading eyebrow={t.home.papers.eyebrow} title={t.home.papers.title} subtitle={t.home.papers.subtitle} />
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {papers.map((paper, i) => (
          <Reveal key={paper.id} delay={i * 0.07}>
            <Card className={cx("h-full overflow-visible", paper.popular && "ring-2 ring-cranberry-600")}>
              {paper.popular && (
                <Chip color="accent" size="sm" className="absolute -top-3 left-1/2 -translate-x-1/2 font-semibold shadow">
                  {t.common.mostPopular}
                </Chip>
              )}
              <PaperSwatch paper={paper} className="-mt-2" />
              <Card.Header>
                <div className="flex items-baseline justify-between gap-2">
                  <Card.Title className="font-display text-lg">{l(paper.name)}</Card.Title>
                  <span className="text-xs font-bold text-gold-700">{paper.weight}</span>
                </div>
                <Card.Description>{l(paper.description)}</Card.Description>
              </Card.Header>
              <Card.Footer className="mt-auto text-sm font-semibold text-ink-900">
                {paper.price === 0 ? t.common.included : fmt(t.home.papers.add, { price: money(paper.price) })}
              </Card.Footer>
            </Card>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 flex justify-center">
        <ButtonLink href="/paper-guide" variant="ghost" className="rounded-full">
          {t.home.papers.learnMore}
          <ArrowRight className="size-4" />
        </ButtonLink>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Pricing() {
  const { t, money, fmt } = useI18n();
  const p = t.home.pricing;
  return (
    <section className="relative overflow-hidden bg-evergreen-900 py-20 text-cream-50 sm:py-28">
      <div aria-hidden className="absolute -top-40 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-evergreen-600/30 blur-[100px]" />
      <div className="container-site relative">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <span className="eyebrow text-gold-400">{p.eyebrow}</span>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl lg:text-5xl">{p.title}</h2>
          <p className="text-lg text-cream-50/70">{p.subtitle}</p>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {p.tiers.map((tier, i) => {
            const featured = i === 0;
            return (
              <Reveal key={tier.name} delay={i * 0.08}>
                <div
                  className={cx(
                    "relative flex h-full flex-col rounded-[2rem] p-8",
                    featured ? "bg-cream-50 text-ink-900 shadow-2xl" : "bg-white/6 ring-1 ring-white/12",
                  )}
                >
                  {featured && (
                    <span className="absolute -top-3 left-8 rounded-full bg-cranberry-600 px-3 py-1 text-xs font-bold text-white">
                      {t.common.mostPopular}
                    </span>
                  )}
                  <p className={cx("text-sm font-semibold", featured ? "text-cranberry-700" : "text-gold-400")}>{tier.cards}</p>
                  <h3 className="mt-1 font-display text-2xl font-semibold">{tier.name}</h3>
                  <p className={cx("mt-4 font-display text-4xl font-semibold", featured ? "text-evergreen-800" : "text-cream-50")}>
                    {tier.save}
                  </p>
                  <p className={cx("mt-3 text-sm", featured ? "text-muted" : "text-cream-50/65")}>{tier.text}</p>
                  <ul className="mt-6 space-y-3 text-sm">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span className={cx("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full", featured ? "bg-evergreen-100 text-evergreen-700" : "bg-white/10 text-gold-300")}>
                          <Check className="size-3.5" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink
                    href="/cards"
                    className={cx("mt-8 rounded-full", !featured && "bg-white/10 text-cream-50 hover:bg-white/20")}
                    variant={featured ? "primary" : "secondary"}
                    fullWidth
                  >
                    {p.cta}
                  </ButtonLink>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-10 text-center text-sm text-cream-50/60">{fmt(p.note, { price: money(formats.postcard.price) })}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Compare() {
  const { t } = useI18n();
  const c = t.home.compare;
  return (
    <section className="container-site py-20 sm:py-28">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
            <Image src={unsplash(images.mailboxSnow, 1000)} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </Reveal>
        </div>
        <div>
          <SectionHeading align="left" eyebrow={c.eyebrow} title={c.title} />
          <Reveal className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-secondary text-left">
                  <th className="p-4 font-semibold text-muted" />
                  <th className="p-4 text-center font-display text-base font-semibold text-cranberry-700">{c.us}</th>
                  <th className="p-4 text-center font-semibold text-muted">{c.diy}</th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((row, i) => (
                  <tr key={row} className="border-t border-border">
                    <td className="p-4 font-medium text-ink-900">{row}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex size-7 items-center justify-center rounded-full bg-evergreen-100 text-evergreen-700">
                        <Check className="size-4" />
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {i === 0 ? (
                        <span className="text-xs text-muted">~</span>
                      ) : (
                        <span className="inline-flex size-7 items-center justify-center rounded-full bg-cranberry-50 text-cranberry-500">
                          <X className="size-4" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function AboutSnippet() {
  const { t } = useI18n();
  const a = t.home.about;
  return (
    <section className="bg-cream-50 py-20 sm:py-28">
      <div className="container-site grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="grid grid-cols-5 gap-4">
            <div className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-[2rem] shadow-xl">
              <Image src={unsplash(images.handsWriting, 900)} alt="" fill sizes="(min-width:1024px) 30vw, 60vw" className="object-cover" />
            </div>
            <div className="col-span-2 flex flex-col gap-4 pt-12">
              <div className="relative aspect-square overflow-hidden rounded-[1.5rem] shadow-lg">
                <Image src={unsplash(images.printingPress, 600)} alt="" fill sizes="20vw" className="object-cover" />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] shadow-lg">
                <Image src={unsplash(images.envelopeMessage, 600)} alt="" fill sizes="20vw" className="object-cover" />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 left-6 max-w-xs rounded-2xl bg-evergreen-900 p-5 text-cream-50 shadow-2xl">
            <Quote className="size-5 text-gold-400" />
            <p className="mt-2 font-display text-lg leading-snug italic">{a.quote}</p>
            <p className="mt-2 text-xs font-semibold text-gold-300">— {t.common.brand}</p>
          </div>
        </Reveal>
        <div>
          <SectionHeading align="left" eyebrow={a.eyebrow} title={a.title} subtitle={a.text} />
          <Reveal className="mt-8">
            <ButtonLink href="/about" variant="outline" className="rounded-full">
              {a.cta}
              <ArrowRight className="size-4" />
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function TeamGrid({ limit }: { limit?: number }) {
  const { l } = useI18n();
  const members = limit ? team.slice(0, limit) : team;
  return (
    <div className={cx("grid gap-6 sm:grid-cols-2", members.length > 4 ? "lg:grid-cols-5" : "lg:grid-cols-4")}>
      {members.map((m, i) => (
        <Reveal key={m.name} delay={i * 0.07}>
          <article className="group h-full">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-cream-200">
              <Image
                src={unsplash(m.image, 700)}
                alt={m.name}
                fill
                sizes="(min-width:1024px) 20vw, (min-width:640px) 45vw, 90vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-evergreen-950/80 via-evergreen-950/0 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              <p className="absolute right-4 bottom-4 left-4 translate-y-3 text-sm leading-snug text-cream-50 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {l(m.bio)}
              </p>
              <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink-700">
                <MapPin className="size-3" /> {m.city}
              </span>
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold text-ink-900">{m.name}</h3>
            <p className="text-sm text-cranberry-700">{l(m.role)}</p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export function TeamSection() {
  const { t } = useI18n();
  return (
    <section className="container-site py-20 sm:py-28">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading align="left" eyebrow={t.home.team.eyebrow} title={t.home.team.title} subtitle={t.home.team.subtitle} />
        <Reveal>
          <ButtonLink href="/about#team" variant="outline" className="rounded-full">
            {t.home.team.cta}
            <ArrowRight className="size-4" />
          </ButtonLink>
        </Reveal>
      </div>
      <div className="mt-12">
        <TeamGrid limit={4} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Testimonials() {
  const { t, l } = useI18n();
  return (
    <section className="relative overflow-hidden bg-cranberry-700 py-20 text-cream-50 sm:py-28">
      <div aria-hidden className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(#fff 1.2px, transparent 1.6px)", backgroundSize: "26px 26px" }} />
      <div className="container-site relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="eyebrow text-gold-300">{t.home.testimonials.eyebrow}</span>
          <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl lg:text-5xl">{t.home.testimonials.title}</h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.1}>
              <figure className="flex h-full flex-col rounded-[1.75rem] bg-cream-50 p-7 text-ink-900 shadow-xl">
                <div className="flex text-gold-500" aria-label={`${item.rating}/5`}>
                  {Array.from({ length: item.rating }, (_, k) => (
                    <Star key={k} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 font-display text-lg leading-relaxed">“{l(item.quote)}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <span className="flex size-10 items-center justify-center rounded-full bg-evergreen-800 font-display font-semibold text-cream-50">
                    {item.name[0]}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{item.name}</span>
                    <span className="block text-xs text-muted">{item.city}, ON</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Accordion variant="surface" className="w-full">
      {items.map((item, i) => (
        <Accordion.Item key={item.q} id={`faq-${i}`}>
          <Accordion.Heading>
            <Accordion.Trigger className="py-4 text-left font-semibold text-ink-900">
              {item.q}
              <Accordion.Indicator>
                <ChevronDown />
              </Accordion.Indicator>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body className="leading-relaxed text-ink-500">{item.a}</Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export function FaqPreview() {
  const { t } = useI18n();
  const items = [
    t.faqPage.categories[0].items[0],
    t.faqPage.categories[1].items[1],
    t.faqPage.categories[1].items[2],
    t.faqPage.categories[2].items[0],
    t.faqPage.categories[1].items[0],
  ];
  return (
    <section className="bg-cream-50 py-20 sm:py-28">
      <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading align="left" eyebrow={t.home.faq.eyebrow} title={t.home.faq.title} />
          <Reveal className="mt-8">
            <ButtonLink href="/faq" variant="outline" className="rounded-full">
              {t.home.faq.cta}
              <ArrowRight className="size-4" />
            </ButtonLink>
          </Reveal>
        </div>
        <Reveal>
          <FaqAccordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function NewsletterSection() {
  const { t } = useI18n();
  const n = t.newsletter;
  return (
    <section className="container-site py-20 sm:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-evergreen-800 px-6 py-14 text-cream-50 sm:px-12 lg:px-16">
          <Image src={unsplash(images.snowyPines, 1600)} alt="" fill sizes="100vw" className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-evergreen-900 via-evergreen-900/85 to-evergreen-900/40" />
          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="eyebrow text-gold-300">{n.eyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{n.title}</h2>
              <p className="mt-3 max-w-lg text-cream-50/75">{n.subtitle}</p>
            </div>
            <div>
              <NewsletterForm tone="dark" />
              <p className="mt-3 pl-4 text-xs text-cream-50/55">{n.consent}</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function ContactStrip() {
  const { t, l } = useI18n();
  const c = t.home.contact;
  const items = [
    { icon: Phone, title: c.call, value: contact.phone, href: contact.phoneHref },
    { icon: Mail, title: c.write, value: contact.email, href: `mailto:${contact.email}` },
    { icon: Clock, title: c.hours, value: l(contact.hours) },
    { icon: MapPin, title: c.visit, value: contact.address, href: "/locations" },
  ];
  return (
    <section className="container-site pb-20 sm:pb-28">
      <Reveal className="rounded-[2rem] border border-border bg-surface p-8 sm:p-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{c.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{c.text}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map(({ icon: Icon, title, value, href }) => {
              const content = (
                <>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cranberry-50 text-cranberry-700">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold tracking-wide text-muted uppercase">{title}</span>
                    <span className="block truncate font-semibold text-ink-900">{value}</span>
                  </span>
                </>
              );
              const cls = "flex items-center gap-3 rounded-2xl p-3 transition hover:bg-cream-100";
              if (!href) return <div key={title} className={cls}>{content}</div>;
              return href.startsWith("/") ? (
                <LocaleLink key={title} href={href} className={cls}>
                  {content}
                </LocaleLink>
              ) : (
                <a key={title} href={href} className={cls}>
                  {content}
                </a>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
