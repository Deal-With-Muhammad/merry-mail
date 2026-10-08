"use client";

import { Gift, PackageSearch, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { contact } from "@/data/site";
import { useI18n } from "@/i18n/provider";
import { normalizeTracking } from "@/lib/utils";
import { useAuth, useHydrated } from "@/store";
import { LocaleLink } from "../ui/locale-link";
import { Rotator } from "../ui/motion";
import { LanguageSwitch } from "./language-switch";
import { UserMenu } from "./user-menu";

export function TrackForm({ tone = "dark", onDone }: { tone?: "dark" | "light"; onDone?: () => void }) {
  const { t, href } = useI18n();
  const router = useRouter();
  const [code, setCode] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = normalizeTracking(code);
    router.push(href(value ? `/track?code=${encodeURIComponent(value)}` : "/track"));
    setCode("");
    onDone?.();
  }

  const dark = tone === "dark";
  return (
    <form onSubmit={submit} role="search" className="flex items-center" aria-label={t.topbar.trackOrder}>
      <label className="sr-only" htmlFor={`track-${tone}`}>
        {t.topbar.trackPlaceholder}
      </label>
      <div
        className={
          dark
            ? "flex h-7 items-center rounded-full bg-white/10 pl-2.5 ring-1 ring-white/15 focus-within:ring-gold-400"
            : "flex h-10 w-full items-center rounded-full bg-field-background pl-3 ring-1 ring-border focus-within:ring-2 focus-within:ring-accent"
        }
      >
        <PackageSearch className={dark ? "size-3.5 text-cream-50/70" : "size-4 text-muted"} aria-hidden />
        <input
          id={`track-${tone}`}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t.topbar.trackPlaceholder}
          className={
            dark
              ? "w-32 bg-transparent px-2 text-xs text-cream-50 placeholder:text-cream-50/55 focus:outline-none"
              : "w-full min-w-0 flex-1 bg-transparent px-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
          }
        />
        <button
          type="submit"
          className={
            dark
              ? "h-7 rounded-full bg-gold-400 px-3 text-xs font-bold text-evergreen-950 transition hover:bg-gold-300"
              : "mr-1 h-8 rounded-full bg-evergreen-800 px-4 text-sm font-semibold text-cream-50 hover:bg-evergreen-700"
          }
        >
          {t.topbar.track}
        </button>
      </div>
    </form>
  );
}

export function TopBar() {
  const { t } = useI18n();
  const hydrated = useHydrated();
  const user = useAuth((s) => s.user);

  return (
    <div className="relative z-50 bg-evergreen-900 text-cream-50">
      <div className="container-site flex h-10 items-center justify-between gap-4 text-xs">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Gift className="size-3.5 shrink-0 text-gold-400" aria-hidden />
          <Rotator items={t.topbar.announcements} className="min-w-0 flex-1 font-medium text-cream-50/90" />
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden lg:block">
            <TrackForm />
          </div>
          <a
            href={contact.phoneHref}
            className="hidden items-center gap-1.5 font-semibold text-cream-50/85 hover:text-cream-50 xl:inline-flex"
          >
            <Phone className="size-3.5" aria-hidden />
            {contact.phone}
          </a>
          <LanguageSwitch />
          <div className="hidden min-w-[9.5rem] items-center justify-end gap-3 md:flex">
            {hydrated && user ? (
              <UserMenu />
            ) : (
              <>
                <LocaleLink href="/signin" className="font-semibold text-cream-50/85 hover:text-cream-50">
                  {t.nav.signIn}
                </LocaleLink>
                <span className="h-3 w-px bg-white/25" aria-hidden />
                <LocaleLink
                  href="/signup"
                  className="rounded-full bg-cranberry-600 px-3 py-1 font-semibold text-cream-50 hover:bg-cranberry-500"
                >
                  {t.nav.signUp}
                </LocaleLink>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
