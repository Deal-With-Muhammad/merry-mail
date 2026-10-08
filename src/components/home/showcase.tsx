"use client";

import { Button } from "@heroui/react";
import { BookOpen, Check, FlipHorizontal, Mouse } from "lucide-react";
import { useState } from "react";
import { designs, formats, papers, type DesignId, type FormatId, type PaperId } from "@/data/catalog";
import { useI18n } from "@/i18n/provider";
import { cx } from "@/lib/utils";
import { Card3D } from "../cards/card-3d";
import { CardArt } from "../cards/card-art";
import { ButtonLink } from "../ui/locale-link";
import { Reveal } from "../ui/motion";
import { SectionHeading } from "../ui/section";

export function Showcase() {
  const { t, l } = useI18n();
  const s = t.home.showcase;
  const [design, setDesign] = useState<DesignId>("northern-lights");
  const [paper, setPaper] = useState<PaperId>("pearl");
  const [format, setFormat] = useState<FormatId>("folded");
  const [open, setOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="absolute inset-x-0 top-1/4 -z-10 h-2/3 bg-gradient-to-b from-transparent via-gold-100/70 to-transparent" />
      <div className="container-site grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHeading align="left" eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />
          <Reveal className="mt-8 space-y-6">
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.14em] text-muted uppercase">{s.design}</p>
              <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label={s.design}>
                {designs.map((d) => (
                  <button
                    key={d.slug}
                    type="button"
                    role="radio"
                    aria-checked={design === d.slug}
                    aria-label={l(d.name)}
                    title={l(d.name)}
                    onClick={() => setDesign(d.slug)}
                    className={cx(
                      "h-[4.2rem] w-12 overflow-hidden rounded-md shadow-sm ring-offset-2 ring-offset-background transition",
                      design === d.slug ? "scale-105 ring-2 ring-cranberry-600" : "opacity-80 ring-1 ring-black/10 hover:opacity-100",
                    )}
                  >
                    <CardArt design={d.slug} className="h-full w-full" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.14em] text-muted uppercase">{s.paper}</p>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={s.paper}>
                {papers.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={paper === p.id}
                    onClick={() => setPaper(p.id)}
                    className={cx(
                      "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition",
                      paper === p.id ? "border-evergreen-800 bg-evergreen-800 text-cream-50" : "border-border bg-surface text-ink-700 hover:border-ink-400",
                    )}
                  >
                    <span className="size-3.5 rounded-full ring-1 ring-black/15" style={{ background: p.tint }} />
                    {l(p.name)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["folded", "postcard"] as FormatId[]).map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={format === f ? "secondary" : "ghost"}
                  className="rounded-full"
                  onPress={() => {
                    setFormat(f);
                    setOpen(false);
                    setFlipped(false);
                  }}
                >
                  {format === f && <Check className="size-3.5" />}
                  {l(formats[f].name)}
                </Button>
              ))}
            </div>
            <ul className="space-y-2 text-sm text-ink-700">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <Check className="size-4 text-evergreen-600" /> {b}
                </li>
              ))}
            </ul>
            <ButtonLink href={`/create?design=${design}`} size="lg" className="rounded-full px-7">
              {s.cta}
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal className="relative">
          <div className="relative mx-auto flex min-h-[30rem] max-w-xl flex-col items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-cream-200 via-cream-50 to-gold-100 px-6 py-12 shadow-inner ring-1 ring-border sm:min-h-[36rem]">
            <div className={cx("transition-all duration-700", format === "folded" && open ? "w-[45%]" : "w-[62%] sm:w-[58%]")}>
              <Card3D
                design={design}
                paper={paper}
                format={format}
                foil={paper === "pearl"}
                open={open}
                flipped={flipped}
                onToggleOpen={() => setOpen((v) => !v)}
              />
            </div>
            <div className="mt-14 flex flex-wrap justify-center gap-2">
              {format === "folded" && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full"
                  onPress={() => {
                    setFlipped(false);
                    setOpen((v) => !v);
                  }}
                >
                  <BookOpen className="size-4" />
                  {open ? s.close : s.open}
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full"
                onPress={() => {
                  setOpen(false);
                  setFlipped((v) => !v);
                }}
              >
                <FlipHorizontal className="size-4" />
                {flipped ? s.flipBack : s.flip}
              </Button>
            </div>
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted">
              <Mouse className="size-3.5" /> {s.hint}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
