import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LegalPage } from "@/components/pages/content";
import { PageHero } from "@/components/ui/section";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/metadata";

const docs = ["privacy", "terms", "cookies"] as const;
type Doc = (typeof docs)[number];
const isDoc = (slug: string): slug is Doc => (docs as readonly string[]).includes(slug);

export function generateStaticParams() {
  return docs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/legal/[slug]">) {
  const { slug } = await params;
  if (!isDoc(slug)) return {};
  return pageMetadata(params, slug, `/legal/${slug}`);
}

type Params = PageProps<"/[lang]/legal/[slug]">["params"];

export default function Page({ params }: PageProps<"/[lang]/legal/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <Legal params={params} />
    </Suspense>
  );
}

async function Legal({ params }: { params: Params }) {
  const { lang, slug } = await params;
  if (!isDoc(slug)) notFound();
  const t = await getDictionary(lang);
  return (
    <>
      <PageHero eyebrow="Merry Mail" title={t.legal[slug].title} />
      <LegalPage doc={slug} />
    </>
  );
}
