import { ShippingPage } from "@/components/pages/content";
import { PageHero } from "@/components/ui/section";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]/shipping">) {
  return pageMetadata(params, "shipping", "/shipping");
}

export default async function Page({ params }: PageProps<"/[lang]/shipping">) {
  const t = await getDictionary((await params).lang);
  const s = t.shippingPage;
  return (
    <>
      <PageHero eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />
      <ShippingPage />
    </>
  );
}
