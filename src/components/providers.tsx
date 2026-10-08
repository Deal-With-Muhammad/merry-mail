"use client";

import { I18nProvider as AriaI18nProvider, RouterProvider, Toast } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { localeTags, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { I18nProvider } from "@/i18n/provider";
import { rehydrateStores } from "@/store";

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

/**
 * Start each new page at the top. The shared layout and sticky header otherwise
 * keep the previous scroll offset. Back/forward and #hash links are left alone.
 */
function ScrollReset() {
  const pathname = usePathname();
  const popped = useRef(false);
  useEffect(() => {
    const onPop = () => {
      popped.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    if (popped.current) {
      popped.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export function Providers({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    void rehydrateStores();
  }, []);

  return (
    <RouterProvider navigate={router.push}>
      <AriaI18nProvider locale={localeTags[locale]}>
        <I18nProvider locale={locale} dictionary={dictionary}>
          <ScrollReset />
          {children}
          <Toast.Provider placement="bottom end" />
        </I18nProvider>
      </AriaI18nProvider>
    </RouterProvider>
  );
}
