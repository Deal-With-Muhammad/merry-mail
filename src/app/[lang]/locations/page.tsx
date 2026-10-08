import { LocationsPage } from "@/components/pages/content";
import { PageHero } from "@/components/ui/section";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]/locations">) {
  return pageMetadata(params, "locations", "/locations");
}

export default async function Page({ params }: PageProps<"/[lang]/locations">) {
  const t = await getDictionary((await params).lang);
  const p = t.locationsPage;
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />
      <LocationsPage />
    </>
  );
}
