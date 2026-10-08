import { PaperGuidePage } from "@/components/pages/content";
import { PageHero } from "@/components/ui/section";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]/paper-guide">) {
  return pageMetadata(params, "paper", "/paper-guide");
}

export default async function Page({ params }: PageProps<"/[lang]/paper-guide">) {
  const t = await getDictionary((await params).lang);
  const p = t.paperPage;
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />
      <PaperGuidePage />
    </>
  );
}
