import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DesignDetail } from "@/components/pages/design-detail";
import { designIds, getDesign } from "@/data/catalog";
import { tr, type Locale } from "@/i18n/config";
import { pageMetadata } from "@/i18n/metadata";

export function generateStaticParams() {
  return designIds.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/cards/[slug]">) {
  const { lang, slug } = await params;
  const design = getDesign(slug);
  if (!design) return {};
  return pageMetadata(params, "cards", `/cards/${slug}`, {
    title: tr(design.name, lang as Locale),
    description: tr(design.description, lang as Locale),
  });
}

type Params = PageProps<"/[lang]/cards/[slug]">["params"];

async function Design({ params }: { params: Params }) {
  const { slug } = await params;
  const design = getDesign(slug);
  if (!design) notFound();
  return <DesignDetail slug={design.slug} />;
}

export default function DesignPage({ params }: PageProps<"/[lang]/cards/[slug]">) {
  return (
    <Suspense fallback={<div className="container-site min-h-[80vh] py-12"><div className="h-[36rem] animate-pulse rounded-[2.5rem] bg-cream-200" /></div>}>
      <Design params={params} />
    </Suspense>
  );
}
