"use client";

import { Lock, Mail, MapPin, Phone } from "lucide-react";
import { contact, socials } from "@/data/site";
import { useI18n } from "@/i18n/provider";
import { useConsent } from "@/store";
import { NewsletterForm } from "../forms/newsletter-form";
import { PaymentBadges, socialIcons } from "../ui/icons";
import { LocaleLink } from "../ui/locale-link";
import { Logo } from "../ui/logo";
import { LanguageSwitch } from "./language-switch";

export function Footer() {
  const { t, l, fmt } = useI18n();
  const openPrefs = useConsent((s) => s.openPrefs);
  const f = t.footer.links;

  const columns = [
    {
      title: t.footer.shop,
      links: [
        { href: "/cards", label: f.allDesigns },
        { href: "/cards?category=photo", label: f.photoCards },
        { href: "/cards?category=ontario", label: f.ontarioCards },
        { href: "/create", label: f.create },
      ],
    },
    {
      title: t.footer.services,
      links: [
        { href: "/services/holiday-cards", label: f.holiday },
        { href: "/services/wedding-invitations", label: f.wedding },
        { href: "/services/business-cards", label: f.business },
        { href: "/services/corporate-cards", label: f.corporate },
        { href: "/services/cleaning", label: f.cleaning },
      ],
    },
    {
      title: t.footer.help,
      links: [
        { href: "/track", label: f.track },
        { href: "/shipping", label: f.shipping },
        { href: "/paper-guide", label: f.paper },
        { href: "/faq", label: f.faq },
        { href: "/contact", label: f.contact },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { href: "/about", label: f.about },
        { href: "/about#team", label: f.team },
        { href: "/locations", label: f.locations },
        { href: "/account", label: f.account },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-evergreen-950 text-cream-50">
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 size-[28rem] rounded-full bg-evergreen-700/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-48 -left-32 size-[26rem] rounded-full bg-cranberry-800/25 blur-3xl" />

      <div className="container-site relative">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 py-14 lg:grid-cols-[1.25fr_2fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <LocaleLink href="/" aria-label="Merry Mail — home" className="w-fit">
              <Logo inverted />
            </LocaleLink>
            <p className="max-w-sm text-sm leading-relaxed text-cream-50/70">{t.footer.tagline}</p>
            <div>
              <p className="font-display text-lg font-semibold">{t.newsletter.footerTitle}</p>
              <p className="mt-1 mb-3 text-sm text-cream-50/60">{t.newsletter.footerText}</p>
              <NewsletterForm tone="dark" className="max-w-sm" />
            </div>
            <div className="flex gap-2">
              {socials.map((s) => {
                const Icon = socialIcons[s.id];
                return (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex size-10 items-center justify-center rounded-full bg-white/8 text-cream-50/80 ring-1 ring-white/10 transition hover:bg-gold-400 hover:text-evergreen-950"
                  >
                    <Icon className="size-4.5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="mb-4 text-xs font-bold tracking-[0.16em] text-gold-400 uppercase">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <LocaleLink href={link.href} className="text-sm text-cream-50/75 transition hover:text-cream-50">
                        {link.label}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 flex flex-col gap-3 rounded-2xl bg-white/5 p-5 text-sm ring-1 ring-white/10 sm:col-span-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
              <a href={contact.phoneHref} className="flex items-center gap-2 text-cream-50/85 hover:text-cream-50">
                <Phone className="size-4 text-gold-400" /> {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-cream-50/85 hover:text-cream-50">
                <Mail className="size-4 text-gold-400" /> {contact.email}
              </a>
              <span className="flex items-center gap-2 text-cream-50/70">
                <MapPin className="size-4 text-gold-400" /> {contact.address}
              </span>
              <span className="text-cream-50/60">{l(contact.hours)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-b border-white/10 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-cream-50/70">
              <Lock className="size-3.5" /> {t.footer.payments}
            </span>
            <PaymentBadges className="flex flex-wrap gap-1.5" />
          </div>
          <p className="text-xs font-medium text-cream-50/70">🍁 {t.footer.madeIn}</p>
        </div>

        <div className="flex flex-col gap-4 py-6 text-xs text-cream-50/55 md:flex-row md:items-center md:justify-between">
          <p>{fmt(t.footer.rights, { year: 2026 })}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <LocaleLink href="/legal/privacy" className="hover:text-cream-50">
              {t.footer.privacy}
            </LocaleLink>
            <LocaleLink href="/legal/terms" className="hover:text-cream-50">
              {t.footer.terms}
            </LocaleLink>
            <LocaleLink href="/legal/cookies" className="hover:text-cream-50">
              {t.footer.cookies}
            </LocaleLink>
            <button type="button" onClick={() => openPrefs(true)} className="underline-offset-4 hover:text-cream-50 hover:underline">
              {t.footer.cookiePrefs}
            </button>
            <LanguageSwitch />
          </div>
        </div>
        <p className="pb-6 text-[11px] text-cream-50/35">{t.common.prototype}</p>
      </div>
    </footer>
  );
}
