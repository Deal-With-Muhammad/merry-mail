"use client";

import { Breadcrumbs, Button, Chip, Separator } from "@heroui/react";
import { BookOpen, Check, FlipHorizontal, ImagePlus, Mailbox, Plus, Printer, ScanSearch } from "lucide-react";
import { useState } from "react";
import {
  designs,
  finishes,
  formats,
  getDesign,
  papers,
  type DesignId,
  type FormatId,
  type PaperId,
} from "@/data/catalog";
import { useI18n } from "@/i18n/provider";
import { cx } from "@/lib/utils";
import { useBuilder } from "@/store";
import { Card3D } from "../cards/card-3d";
import { DesignTile } from "../cards/design-tile";
import { ButtonLink } from "../ui/locale-link";
import { Reveal } from "../ui/motion";
import { useRouter } from "next/navigation";

export function DesignDetail({ slug }: { slug: DesignId }) {
  const { t, l, money, fmt, href } = useI18n();
  const router = useRouter();
  const start = useBuilder((s) => s.start);
  const update = useBuilder((s) => s.update);
  const design = getDesign(slug)!;
  const [format, setFormat] = useState<FormatId>("folded");
  const [paper, setPaper] = useState<PaperId>("premium");
  const [foil, setFoil] = useState(false);
  const [open, setOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const others = designs.filter((d) => d.slug !== slug);
  const related = [...others.filter((d) => d.category === design.category), ...others.filter((d) => d.category !== design.category)].slice(0, 3);
  const perkIcons = [ScanSearch, Printer, Mailbox];

  function personalize() {
    start(slug);
    update({ format, paper, finish: foil ? "foil" : "matte" });
    router.push(href("/create"));
  }

  return (
    <div className="container-site py-8 sm:py-12">
      <Breadcrumbs className="mb-8">
        <Breadcrumbs.Item href={href("/")}>{t.nav.home}</Breadcrumbs.Item>
        <Breadcrumbs.Item href={href("/cards")}>{t.design.breadcrumb}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{l(design.name)}</Breadcrumbs.Item>
      </Breadcrumbs>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div
            className="relative flex min-h-[32rem] flex-col items-center justify-center overflow-hidden rounded-[2.5rem] px-6 py-14 ring-1 ring-border sm:min-h-[40rem]"
            style={{
              background: `radial-gradient(90% 70% at 50% 20%, ${design.swatch[1]}30, transparent 70%), linear-gradient(160deg, ${design.swatch[0]}1f, #fbf6ec 60%)`,
            }}
          >
            <div className={cx("transition-all duration-700", format === "folded" && open ? "w-[44%]" : "w-[64%] sm:w-[56%]")}>
              <Card3D
                design={slug}
                format={format}
                paper={paper}
                foil={foil}
                open={open}
                flipped={flipped}
                onToggleOpen={() => setOpen((v) => !v)}
              />
            </div>
            <div className="mt-14 flex flex-wrap justify-center gap-2">
              {format === "folded" && (
                <Button size="sm" variant="secondary" className="rounded-full" onPress={() => { setFlipped(false); setOpen((v) => !v); }}>
                  <BookOpen className="size-4" />
                  {open ? t.home.showcase.close : t.home.showcase.open}
                </Button>
              )}
              <Button size="sm" variant="secondary" className="rounded-full" onPress={() => { setOpen(false); setFlipped((v) => !v); }}>
                <FlipHorizontal className="size-4" />
                {flipped ? t.home.showcase.flipBack : t.home.showcase.flip}
              </Button>
            </div>
            <p className="mt-4 text-center text-xs text-muted">{t.design.hint}</p>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            <Chip size="sm" variant="soft">{t.catalog.filters[design.category]}</Chip>
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold text-ink-900 sm:text-5xl">{l(design.name)}</h1>
          <p className="mt-2 text-lg text-cranberry-700">{l(design.tagline)}</p>
          <p className="mt-5 leading-relaxed text-ink-500">{l(design.description)}</p>
          <p className="mt-6 font-display text-2xl font-semibold text-evergreen-800">
            {fmt(t.design.from, { price: money(formats.postcard.price) })}
          </p>
          {design.photo && (
            <p className="mt-4 flex items-center gap-2 rounded-2xl bg-gold-100 px-4 py-3 text-sm text-gold-700">
              <ImagePlus className="size-4 shrink-0" />
              {t.design.photoNote}
            </p>
          )}

          <Separator className="my-8" />

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.14em] text-muted uppercase">{t.design.formats}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(Object.keys(formats) as FormatId[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setFormat(f);
                      setOpen(false);
                      setFlipped(false);
                    }}
                    aria-pressed={format === f}
                    className={cx(
                      "rounded-2xl border p-4 text-left transition",
                      format === f ? "border-evergreen-800 bg-evergreen-50 ring-1 ring-evergreen-800" : "border-border bg-surface hover:border-ink-400",
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-ink-900">{l(formats[f].name)}</span>
                      <span className="text-sm font-bold text-evergreen-800">{money(formats[f].price)}</span>
                    </span>
                    <span className="mt-1 block text-xs text-muted">{formats[f].size} · {l(formats[f].detail)}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.14em] text-muted uppercase">{t.home.showcase.paper}</p>
              <div className="flex flex-wrap gap-2">
                {papers.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaper(p.id)}
                    aria-pressed={paper === p.id}
                    className={cx(
                      "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition",
                      paper === p.id ? "border-evergreen-800 bg-evergreen-800 text-cream-50" : "border-border bg-surface text-ink-700 hover:border-ink-400",
                    )}
                  >
                    <span className="size-3.5 rounded-full ring-1 ring-black/15" style={{ background: p.tint }} />
                    {l(p.name)} · {p.weight}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFoil((v) => !v)}
              aria-pressed={foil}
              className={cx(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition",
                foil ? "border-gold-500 bg-gold-100 text-gold-700" : "border-border bg-surface text-ink-700",
              )}
            >
              {foil ? <Check className="size-4" /> : <Plus className="size-4" />}
              {l(finishes.foil.name)} (+{money(finishes.foil.price)})
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="rounded-full px-7" onPress={personalize}>
              {t.design.personalize}
            </Button>
            <ButtonLink href="/cards" size="lg" variant="ghost" className="rounded-full">
              {t.common.browseDesigns}
            </ButtonLink>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {t.design.perks.map((perk, i) => {
              const Icon = perkIcons[i];
              return (
                <div key={perk.title} className="rounded-2xl bg-cream-50 p-4 ring-1 ring-border">
                  <Icon className="size-5 text-cranberry-700" />
                  <p className="mt-2 text-sm font-semibold text-ink-900">{perk.title}</p>
                  <p className="text-xs text-muted">{perk.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink-900">{t.design.specs}</h2>
            <dl className="mt-4 divide-y divide-border rounded-2xl border border-border bg-surface text-sm">
              {[
                [t.design.specRows.size, '5" × 7" (127 × 178 mm)'],
                [t.design.specRows.paper, papers.map((p) => `${l(p.name)} ${p.weight}`).join(" · ")],
                [t.design.specRows.finish, Object.values(finishes).map((f) => l(f.name)).join(" · ")],
                [t.design.specRows.envelope, t.design.specRows.envelopeValue],
                [t.design.specRows.printing, t.design.specRows.printingValue],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 px-4 py-3">
                  <dt className="font-semibold text-ink-900">{k}</dt>
                  <dd className="text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <section className="mt-24">
        <h2 className="section-title text-3xl!">{t.design.related}</h2>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((d, i) => (
            <Reveal key={d.slug} delay={i * 0.08}>
              <DesignTile design={d} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
