import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ServiceDetail } from "@/components/pages/services";
import { serviceSlugs, type ServiceSlug } from "@/data/site";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/metadata";

const isService = (slug: string): slug is ServiceSlug => (serviceSlugs as readonly string[]).includes(slug);

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/services/[slug]">) {
  const { lang, slug } = await params;
  if (!isService(slug)) return {};
  const t = await getDictionary(lang);
  const item = t.servicesPage.items[slug];
  return pageMetadata(params, "services", `/services/${slug}`, { title: item.name, description: item.tagline });
}

type Params = PageProps<"/[lang]/services/[slug]">["params"];

async function Service({ params }: { params: Params }) {
  const { slug } = await params;
  if (!isService(slug)) notFound();
  return <ServiceDetail slug={slug} />;
}

export default function Page({ params }: PageProps<"/[lang]/services/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[80vh] animate-pulse bg-evergreen-950/90" />}>
      <Service params={params} />
    </Suspense>
  );
}
