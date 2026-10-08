import { Suspense } from "react";
import { ForgotForm } from "@/components/pages/auth";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]/forgot-password">) {
  return pageMetadata(params, "forgot", "/forgot-password");
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <ForgotForm />
    </Suspense>
  );
}
