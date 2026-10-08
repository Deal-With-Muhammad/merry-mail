"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALE_COOKIE, locales, localeNames, switchLocalePath, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { cx } from "@/lib/utils";

function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

/** Segmented EN | FR switch. Keeps the current page, query string and hash. */
export function LanguageSwitch({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  function change(next: Locale) {
    if (next === locale) return;
    rememberLocale(next);
    router.push(switchLocalePath(pathname, next) + window.location.search + window.location.hash);
  }

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={cx(
        "inline-flex items-center rounded-full p-0.5 text-xs font-semibold",
        tone === "dark" ? "bg-white/10 ring-1 ring-white/15" : "bg-default ring-1 ring-border",
        className,
      )}
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => change(code)}
            aria-pressed={active}
            title={localeNames[code]}
            className={cx(
              "rounded-full px-2.5 py-1 uppercase transition-colors",
              active
                ? tone === "dark"
                  ? "bg-cream-50 text-evergreen-900"
                  : "bg-evergreen-800 text-cream-50"
                : tone === "dark"
                  ? "text-cream-50/75 hover:text-cream-50"
                  : "text-ink-500 hover:text-ink-900",
            )}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
