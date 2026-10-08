import { AboutPage } from "@/components/pages/about";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]/about">) {
  return pageMetadata(params, "about", "/about");
}

export default function Page() {
  return <AboutPage />;
}
