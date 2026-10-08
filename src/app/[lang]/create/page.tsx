import { Suspense } from "react";
import { Builder } from "@/components/builder/builder";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]/create">) {
  return pageMetadata(params, "create", "/create");
}

export default function CreatePage() {
  return (
    <div className="bg-[linear-gradient(to_bottom,var(--color-cream-50),var(--color-background)_40%)]">
      <Suspense fallback={<div className="min-h-[70vh]" />}>
        <Builder />
      </Suspense>
    </div>
  );
}
