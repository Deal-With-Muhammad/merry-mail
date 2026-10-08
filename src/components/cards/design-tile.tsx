"use client";

import { ArrowRight, ImagePlus } from "lucide-react";
import { formats, type Design } from "@/data/catalog";
import { useI18n } from "@/i18n/provider";
import { cx } from "@/lib/utils";
import { ButtonLink, LocaleLink } from "../ui/locale-link";
import { CardArt } from "./card-art";

export function DesignTile({ design, className }: { design: Design; className?: string }) {
  const { t, l, money, fmt } = useI18n();
  return (
    <article className={cx("group flex flex-col", className)}>
      <LocaleLink
        href={`/cards/${design.slug}`}
        className="relative block rounded-[1.75rem] p-5 outline-none focus-visible:ring-2 focus-visible:ring-accent sm:p-7"
        style={{
          background: `radial-gradient(120% 90% at 50% 10%, ${design.swatch[1]}22, transparent 60%), linear-gradient(160deg, ${design.swatch[0]}14, ${design.swatch[0]}06)`,
        }}
        aria-label={l(design.name)}
      >
        {design.photo && (
          <span className="absolute top-4 right-4 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink-700 shadow-sm backdrop-blur">
            <ImagePlus className="size-3.5" />
            {t.catalog.photoBadge}
          </span>
        )}
        <div className="perspective-[1000px]">
          <div
            className={cx(
              "mx-auto aspect-[5/7] w-[78%] overflow-hidden rounded-lg shadow-[0_18px_40px_-14px_rgba(30,20,10,0.45)] ring-1 ring-black/5",
              "transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] will-change-transform",
              "group-hover:[transform:rotateX(6deg)_rotateY(-10deg)_translateY(-8px)]",
            )}
          >
            <CardArt design={design.slug} className="h-full w-full" />
          </div>
        </div>
      </LocaleLink>
      <div className="mt-4 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-semibold text-ink-900">
            <LocaleLink href={`/cards/${design.slug}`} className="hover:text-cranberry-700">
              {l(design.name)}
            </LocaleLink>
          </h3>
          <p className="mt-0.5 truncate text-sm text-muted">{l(design.tagline)}</p>
        </div>
        <p className="shrink-0 pt-1 text-right text-xs text-muted">
          {t.common.from}
          <span className="block text-base font-bold text-ink-900">{money(formats.postcard.price)}</span>
        </p>
      </div>
      <div className="mt-3 flex gap-2 px-1">
        <ButtonLink href={`/create?design=${design.slug}`} size="sm" className="rounded-full">
          {t.home.featured.personalize}
        </ButtonLink>
        <ButtonLink href={`/cards/${design.slug}`} size="sm" variant="ghost" className="rounded-full">
          {t.home.featured.details}
          <ArrowRight className="size-3.5" />
        </ButtonLink>
      </div>
      <span className="sr-only">{fmt(t.design.from, { price: money(formats.postcard.price) })}</span>
    </article>
  );
}
