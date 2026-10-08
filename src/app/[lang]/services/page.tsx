import { ServicesIndex } from "@/components/pages/services";
import { PageHero } from "@/components/ui/section";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]/services">) {
  return pageMetadata(params, "services", "/services");
}

export default async function Page({ params }: PageProps<"/[lang]/services">) {
  const t = await getDictionary((await params).lang);
  const s = t.servicesPage;
  return (
    <>
      <PageHero eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />
      <ServicesIndex />
    </>
  );
}
