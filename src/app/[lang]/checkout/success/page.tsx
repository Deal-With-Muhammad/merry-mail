import { Suspense } from "react";
import { SuccessPage } from "@/components/pages/success";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]/checkout/success">) {
  return pageMetadata(params, "success", "/checkout/success");
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <SuccessPage />
    </Suspense>
  );
}
