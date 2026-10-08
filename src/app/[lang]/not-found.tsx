"use client";

import { Search } from "lucide-react";
import { CardArt } from "@/components/cards/card-art";
import { ButtonLink } from "@/components/ui/locale-link";
import { useI18n } from "@/i18n/provider";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="container-site flex flex-col items-center gap-10 py-20 text-center lg:flex-row lg:text-left">
      <div className="mx-auto w-48 shrink-0 rotate-[-8deg] overflow-hidden rounded-lg shadow-2xl ring-1 ring-black/10 lg:mx-0 lg:w-64">
        <div className="aspect-[5/7]">
          <CardArt design="toronto-snowfall" greeting="404" className="h-full w-full" />
        </div>
      </div>
      <div className="max-w-xl">
        <p className="eyebrow justify-center lg:justify-start">
          <Search className="size-4" /> 404
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-ink-900 sm:text-5xl">{t.notFound.title}</h1>
        <p className="mt-3 text-lg text-muted">{t.notFound.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
          <ButtonLink href="/" className="rounded-full">
            {t.notFound.home}
          </ButtonLink>
          <ButtonLink href="/cards" variant="outline" className="rounded-full">
            {t.notFound.cards}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
