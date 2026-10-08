import { Suspense } from "react";
import { SignUpForm } from "@/components/pages/auth";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]/signup">) {
  return pageMetadata(params, "signup", "/signup");
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <SignUpForm />
    </Suspense>
  );
}
