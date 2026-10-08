"use client";

import { Button, Description, Dropdown, Header, Label } from "@heroui/react";
import { ChevronDown, Menu, ShoppingBag } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { cx } from "@/lib/utils";
import { useCart, useHydrated } from "@/store";
import { ButtonLink, LocaleLink } from "../ui/locale-link";
import { Logo } from "../ui/logo";
import { MobileMenu } from "./mobile-menu";
import { cleaningLink, mainLinks, resourceLinks, serviceLinks, type NavItem } from "./nav-config";

function useActivePath() {
  const pathname = usePathname();
  const path = pathname.replace(/^\/(en|fr)(?=\/|$)/, "") || "/";
  return (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));
}

function MenuEntry({ item }: { item: NavItem }) {
  const { href } = useI18n();
  const Icon = item.icon;
  return (
    <Dropdown.Item id={item.href} href={href(item.href)} textValue={item.label} className="items-start gap-3 py-2.5">
      {Icon && (
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-evergreen-50 text-evergreen-700 ring-1 ring-evergreen-100">
          <Icon className="size-4.5" />
        </span>
      )}
      <span className="flex flex-col gap-0.5">
        <Label className="font-semibold">{item.label}</Label>
        {item.text && <Description className="text-xs">{item.text}</Description>}
      </span>
    </Dropdown.Item>
  );
}

function NavDropdown({
  label,
  items,
  extra,
  extraTitle,
  footer,
  active,
}: {
  label: string;
  items: NavItem[];
  extra?: NavItem;
  extraTitle?: string;
  footer?: NavItem;
  active?: boolean;
}) {
  return (
    <Dropdown>
      <Dropdown.Trigger
        className={cx(
          "group inline-flex h-10 items-center gap-1 rounded-full px-3.5 text-[0.95rem] font-semibold outline-none transition-colors",
          "data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-accent",
          active ? "text-cranberry-700" : "text-ink-700 hover:bg-cream-200/70 hover:text-ink-900",
        )}
      >
        {label}
        <ChevronDown className="size-4 transition-transform group-data-[pressed=true]:rotate-180 group-aria-expanded:rotate-180" />
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom start" className="w-[22rem] p-1.5">
        <Dropdown.Menu aria-label={label}>
          <Dropdown.Section>
            {items.map((item) => (
              <MenuEntry key={item.href} item={item} />
            ))}
          </Dropdown.Section>
          {footer ? (
            <Dropdown.Section>
              <Dropdown.Item id={footer.href} href={footer.href} textValue={footer.label} className="justify-center text-sm font-semibold text-cranberry-700">
                <Label>{footer.label} →</Label>
              </Dropdown.Item>
            </Dropdown.Section>
          ) : null}
          {extra ? (
            <Dropdown.Section className="mt-1 rounded-xl bg-gold-100/70">
              <Header className="px-3 pt-2 text-[11px] font-bold tracking-[0.14em] text-gold-700 uppercase">{extraTitle}</Header>
              <MenuEntry item={extra} />
            </Dropdown.Section>
          ) : null}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

export function Navbar() {
  const { t, href, fmt } = useI18n();
  const isActive = useActivePath();
  const hydrated = useHydrated();
  const count = useCart((s) => s.items.length);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 48));

  const links = mainLinks(t);
  const services = serviceLinks(t);
  const resources = resourceLinks(t);

  return (
    <header
      className={cx(
        "sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300",
        scrolled
          ? "border-b border-border/80 bg-cream-50/88 shadow-[0_8px_30px_-12px_rgba(40,25,10,0.18)] backdrop-blur-xl"
          : "border-b border-transparent bg-background",
      )}
    >
      <nav className="container-site flex h-[4.5rem] items-center justify-between gap-4" aria-label="Main">
        <LocaleLink href="/" className="shrink-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Merry Mail — home">
          <Logo />
        </LocaleLink>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {links.slice(0, 2).map((link) => (
            <li key={link.href}>
              <NavLink item={link} active={isActive(link.href)} />
            </li>
          ))}
          <li>
            <NavDropdown
              label={t.nav.services}
              items={services}
              footer={{ href: href("/services"), label: t.nav.servicesMenu.allServices }}
              extra={cleaningLink(t)}
              extraTitle={t.nav.servicesMenu.alsoTitle}
              active={isActive("/services")}
            />
          </li>
          <li>
            <NavDropdown
              label={t.nav.resources}
              items={resources}
              active={["/track", "/shipping", "/paper-guide", "/faq"].some(isActive)}
            />
          </li>
          {links.slice(2).map((link) => (
            <li key={link.href}>
              <NavLink item={link} active={isActive(link.href)} />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LocaleLink
            href="/cart"
            aria-label={fmt(t.nav.cartCount, { n: hydrated ? count : 0 })}
            className="relative inline-flex size-11 items-center justify-center rounded-full text-ink-900 transition hover:bg-cream-200/80 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <ShoppingBag className="size-5.5" />
            {hydrated && count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 flex min-w-[1.15rem] items-center justify-center rounded-full bg-cranberry-600 px-1 text-[10px] leading-[1.15rem] font-bold text-white ring-2 ring-background"
              >
                {count}
              </motion.span>
            )}
          </LocaleLink>
          <ButtonLink href="/create" size="md" className="hidden rounded-full px-5 shadow-[0_6px_18px_-6px_rgba(179,38,46,0.6)] sm:inline-flex">
            {t.common.createCard}
          </ButtonLink>
          <Button
            isIconOnly
            variant="ghost"
            aria-label={t.nav.openMenu}
            className="rounded-full lg:hidden"
            onPress={() => setMenuOpen(true)}
          >
            <Menu className="size-6" />
          </Button>
        </div>
      </nav>
      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </header>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <LocaleLink
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cx(
        "relative inline-flex h-10 items-center rounded-full px-3.5 text-[0.95rem] font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent",
        active ? "text-cranberry-700" : "text-ink-700 hover:bg-cream-200/70 hover:text-ink-900",
      )}
    >
      {item.label}
      {active && (
        <motion.span
          layoutId="nav-underline"
          className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-cranberry-600"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
    </LocaleLink>
  );
}
