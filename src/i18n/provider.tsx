"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { fmt, localeTags, localizePath, tr, type L10n, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

type I18nValue = {
  locale: Locale;
  t: Dictionary;
  /** Prefix a path with the current locale. */
  href: (path: string) => string;
  /** Pick the right language from an `{ en, fr }` value. */
  l: (value: L10n) => string;
  fmt: typeof fmt;
  money: (value: number) => string;
  date: (value: number | Date, options?: Intl.DateTimeFormatOptions) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}) {
  const value = useMemo<I18nValue>(() => {
    const currency = new Intl.NumberFormat(localeTags[locale], { style: "currency", currency: "CAD" });
    return {
      locale,
      t: dictionary,
      href: (path) => localizePath(path, locale),
      l: (v) => tr(v, locale),
      fmt,
      money: (v) => currency.format(v),
      date: (v, options = { dateStyle: "medium" }) =>
        new Intl.DateTimeFormat(localeTags[locale], options).format(v),
    };
  }, [locale, dictionary]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
