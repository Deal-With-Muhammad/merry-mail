import { Suspense } from "react";
import { TrackPage } from "@/components/pages/track";
import { PageHero } from "@/components/ui/section";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]/track">) {
  return pageMetadata(params, "track", "/track");
}

export default async function Page({ params }: PageProps<"/[lang]/track">) {
  const t = await getDictionary((await params).lang);
  return (
    <>
      <PageHero eyebrow={t.topbar.trackOrder} title={t.track.title} subtitle={t.track.subtitle} />
      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <TrackPage />
      </Suspense>
    </>
  );
}
