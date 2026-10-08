import { CartPage } from "@/components/pages/cart";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]/cart">) {
  return pageMetadata(params, "cart", "/cart");
}

export default function Page() {
  return <CartPage />;
}
