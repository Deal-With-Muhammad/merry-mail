import { CheckoutPage } from "@/components/pages/checkout";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]/checkout">) {
  return pageMetadata(params, "checkout", "/checkout");
}

export default function Page() {
  return <CheckoutPage />;
}
