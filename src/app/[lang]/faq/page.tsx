import { FaqPage } from "@/components/pages/content";
import { PageHero } from "@/components/ui/section";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]/faq">) {
  return pageMetadata(params, "faq", "/faq");
}

export default async function Page({ params }: PageProps<"/[lang]/faq">) {
  const t = await getDictionary((await params).lang);
  const f = t.faqPage;
  return (
    <>
      <PageHero eyebrow={f.eyebrow} title={f.title} subtitle={f.subtitle} />
      <FaqPage />
    </>
  );
}
