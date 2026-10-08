import type { Metadata } from "next";
import { localeTags, locales, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";
import { getDictionary } from "./get-dictionary";

type MetaKey = keyof Dictionary["meta"];

/** Build localized metadata (title, description, hreflang alternates) for a page. */
export async function pageMetadata(
  params: Promise<{ lang: string }>,
  key: MetaKey,
  path = "",
  override?: { title?: string; description?: string },
): Promise<Metadata> {
  const { lang } = await params;
  const t = await getDictionary(lang);
  const meta = t.meta[key];
  const title = override?.title ?? meta.title;
  const description = override?.description ?? meta.description;
  return {
    title: key === "home" ? { absolute: title } : title,
    description,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: Object.fromEntries(locales.map((l) => [localeTags[l], `/${l}${path}`])),
    },
    openGraph: {
      title,
      description,
      locale: localeTags[lang as Locale]?.replace("-", "_"),
      siteName: "Merry Mail",
      type: "website",
    },
  };
}
