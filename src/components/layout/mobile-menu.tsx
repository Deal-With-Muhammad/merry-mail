"use client";

import { Accordion, Drawer, Separator } from "@heroui/react";
import { ChevronDown, LogOut, Mail, Phone, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { contact } from "@/data/site";
import { useI18n } from "@/i18n/provider";
import { cx } from "@/lib/utils";
import { useAuth, useHydrated } from "@/store";
import { ButtonLink, LocaleLink } from "../ui/locale-link";
import { Logo } from "../ui/logo";
import { LanguageSwitch } from "./language-switch";
import { cleaningLink, mainLinks, resourceLinks, serviceLinks, type NavItem } from "./nav-config";
import { TrackForm } from "./top-bar";

export function MobileMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t, href } = useI18n();
  const hydrated = useHydrated();
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const router = useRouter();
  const close = () => onOpenChange(false);
  const links = mainLinks(t);

  const SubLink = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    return (
      <LocaleLink href={item.href} onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-cream-200/70">
        {Icon && (
          <span className="flex size-8 items-center justify-center rounded-lg bg-evergreen-50 text-evergreen-700">
            <Icon className="size-4" />
          </span>
        )}
        <span className="text-[0.95rem] font-medium text-ink-900">{item.label}</span>
      </LocaleLink>
    );
  };

  const rowClass =
    "flex w-full items-center justify-between rounded-xl px-3 py-3 text-base font-semibold text-ink-900 transition-colors hover:bg-cream-200/70";

  return (
    <Drawer.Backdrop isOpen={open} onOpenChange={onOpenChange}>
      <Drawer.Content placement="right">
        <Drawer.Dialog className="w-[min(22rem,88vw)] max-w-none bg-cream-50 p-0 sm:w-96">
          <Drawer.CloseTrigger className="top-3.5 end-4" />
          <Drawer.Header className="flex h-16 shrink-0 flex-row items-center border-b border-border px-5">
            <Drawer.Heading>
              <LocaleLink href="/" onClick={close}>
                <Logo />
              </LocaleLink>
            </Drawer.Heading>
          </Drawer.Header>
          <Drawer.Body className="mt-0! block space-y-5 px-4 py-5">
            <TrackForm tone="light" onDone={close} />

            <nav aria-label={t.nav.menu} className="flex flex-col">
              {links.slice(0, 2).map((link) => (
                <LocaleLink key={link.href} href={link.href} onClick={close} className={rowClass}>
                  {link.label}
                </LocaleLink>
              ))}
              <Accordion hideSeparator>
                {[
                  { id: "services", label: t.nav.services, items: [...serviceLinks(t), cleaningLink(t)] },
                  { id: "resources", label: t.nav.resources, items: resourceLinks(t) },
                ].map((group) => (
                  <Accordion.Item key={group.id} id={group.id}>
                    <Accordion.Heading className="font-sans tracking-normal">
                      <Accordion.Trigger className={rowClass}>
                        {group.label}
                        <Accordion.Indicator>
                          <ChevronDown className="size-4 text-muted" />
                        </Accordion.Indicator>
                      </Accordion.Trigger>
                    </Accordion.Heading>
                    <Accordion.Panel>
                      <Accordion.Body className="flex flex-col gap-0.5 pt-0 pb-2 pl-2">
                        {group.items.map((item) => (
                          <SubLink key={item.href} item={item} />
                        ))}
                        {group.id === "services" && (
                          <LocaleLink href="/services" onClick={close} className="px-3 py-2 text-sm font-semibold text-cranberry-700">
                            {t.nav.servicesMenu.allServices} →
                          </LocaleLink>
                        )}
                      </Accordion.Body>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
              {links.slice(2).map((link) => (
                <LocaleLink key={link.href} href={link.href} onClick={close} className={rowClass}>
                  {link.label}
                </LocaleLink>
              ))}
            </nav>

            <Separator />

            {hydrated && user ? (
              <div className="flex flex-col gap-1">
                <LocaleLink href="/account" onClick={close} className={rowClass}>
                  <span className="flex items-center gap-2">
                    <UserRound className="size-4" /> {t.nav.userMenu.account}
                  </span>
                </LocaleLink>
                <button
                  type="button"
                  className={cx(rowClass, "text-cranberry-700")}
                  onClick={() => {
                    signOut();
                    close();
                    router.push(href("/"));
                  }}
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="size-4" /> {t.nav.userMenu.signOut}
                  </span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-1">
                <ButtonLink href="/signin" onClick={close} variant="outline" fullWidth className="rounded-full">
                  {t.nav.signIn}
                </ButtonLink>
                <ButtonLink href="/signup" onClick={close} variant="secondary" fullWidth className="rounded-full">
                  {t.nav.signUp}
                </ButtonLink>
              </div>
            )}

            <div className="flex items-center justify-between px-3">
              <span className="text-sm font-semibold text-muted">{t.nav.language}</span>
              <LanguageSwitch tone="light" />
            </div>

            <div className="flex flex-col gap-2 rounded-2xl bg-evergreen-50 p-4 text-sm text-evergreen-800">
              <a href={contact.phoneHref} className="flex items-center gap-2 font-semibold">
                <Phone className="size-4" /> {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 font-semibold">
                <Mail className="size-4" /> {contact.email}
              </a>
            </div>
          </Drawer.Body>
          <Drawer.Footer className="mt-0! shrink-0 border-t border-border px-5 py-4">
            <ButtonLink href="/create" onClick={close} size="lg" fullWidth className="rounded-full">
              {t.common.createCard}
            </ButtonLink>
          </Drawer.Footer>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}
