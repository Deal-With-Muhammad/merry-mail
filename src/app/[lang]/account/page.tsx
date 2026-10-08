import { Suspense } from "react";
import { AccountPage } from "@/components/pages/account";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]/account">) {
  return pageMetadata(params, "account", "/account");
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <AccountPage />
    </Suspense>
  );
}
