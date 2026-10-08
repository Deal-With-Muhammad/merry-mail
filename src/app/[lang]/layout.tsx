import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { TopBar } from "@/components/layout/top-bar";
import { Providers } from "@/components/providers";
import { localeTags, locales } from "@/i18n/config";
import { getDictionary, resolveLocale } from "@/i18n/get-dictionary";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});
const vibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-vibes", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const t = await getDictionary((await params).lang);
  return {
    metadataBase: new URL("https://merrymail.ca"),
    title: { default: t.meta.home.title, template: "%s · Merry Mail" },
    description: t.meta.home.description,
    applicationName: "Merry Mail",
    keywords: ["Christmas cards", "holiday postcards", "Ontario", "mailed for you", "photo cards", "cartes de Noël"],
  };
}

export const viewport: Viewport = {
  themeColor: "#0b2f24",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const locale = await resolveLocale(params);
  const dictionary = await getDictionary(locale);

  return (
    <html
      lang={localeTags[locale]}
      className={`light ${jakarta.variable} ${fraunces.variable} ${vibes.variable} ${caveat.variable}`}
      data-theme="light"
    >
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
        <Providers locale={locale} dictionary={dictionary}>
          <a
            href="#main"
            className="sr-only z-[100] rounded-full bg-evergreen-900 px-4 py-2 text-cream-50 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            {dictionary.common.skipToContent}
          </a>
          <TopBar />
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
