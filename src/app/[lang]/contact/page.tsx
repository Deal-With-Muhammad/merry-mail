import { Suspense } from "react";
import { ContactPage } from "@/components/pages/content";
import { PageHero } from "@/components/ui/section";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]/contact">) {
  return pageMetadata(params, "contact", "/contact");
}

export default async function Page({ params }: PageProps<"/[lang]/contact">) {
  const t = await getDictionary((await params).lang);
  const c = t.contactPage;
  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <ContactPage />
      </Suspense>
    </>
  );
}
