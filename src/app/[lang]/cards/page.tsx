import { Suspense } from "react";
import { Catalog } from "@/components/pages/catalog";
import { PageHero } from "@/components/ui/section";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]/cards">) {
  return pageMetadata(params, "cards", "/cards");
}

function CatalogFallback() {
  return (
    <div className="container-site grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="aspect-[4/5] animate-pulse rounded-[1.75rem] bg-cream-200" />
      ))}
    </div>
  );
}

export default async function CardsPage({ params }: PageProps<"/[lang]/cards">) {
  const t = await getDictionary((await params).lang);
  return (
    <>
      <PageHero eyebrow={t.nav.cards} title={t.catalog.title} subtitle={t.catalog.subtitle} />
      <Suspense fallback={<CatalogFallback />}>
        <Catalog />
      </Suspense>
    </>
  );
}
