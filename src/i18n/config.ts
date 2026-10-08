export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

/** BCP-47 tags used for Intl formatting and <html lang>. */
export const localeTags: Record<Locale, string> = {
  en: "en-CA",
  fr: "fr-CA",
};

export function hasLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** A string that exists in both languages. */
export type L10n = { en: string; fr: string };

export function tr(value: L10n, locale: Locale) {
  return value[locale] ?? value.en;
}

/** Replace `{name}` tokens in a translated string. */
export function fmt(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in values ? String(values[key]) : `{${key}}`,
  );
}

/** Prefix an app path with the locale segment. */
export function localizePath(path: string, locale: Locale) {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Swap the locale segment of a pathname. */
export function switchLocalePath(pathname: string, next: Locale) {
  const parts = pathname.split("/");
  if (hasLocale(parts[1])) {
    parts[1] = next;
    return parts.join("/") || `/${next}`;
  }
  return localizePath(pathname, next);
}
