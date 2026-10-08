import { Suspense } from "react";
import { SignInForm } from "@/components/pages/auth";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]/signin">) {
  return pageMetadata(params, "signin", "/signin");
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <SignInForm />
    </Suspense>
  );
}
