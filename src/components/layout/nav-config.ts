import {
  BookOpenText,
  Briefcase,
  Building2,
  CircleHelp,
  Gem,
  Gift,
  PackageSearch,
  SprayCan,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/en";

export type NavItem = { href: string; label: string; text?: string; icon?: LucideIcon };

export function serviceLinks(t: Dictionary): NavItem[] {
  const m = t.nav.servicesMenu;
  return [
    { href: "/services/holiday-cards", label: m.holiday.title, text: m.holiday.text, icon: Gift },
    { href: "/services/wedding-invitations", label: m.wedding.title, text: m.wedding.text, icon: Gem },
    { href: "/services/business-cards", label: m.business.title, text: m.business.text, icon: Briefcase },
    { href: "/services/corporate-cards", label: m.corporate.title, text: m.corporate.text, icon: Building2 },
  ];
}

export function cleaningLink(t: Dictionary): NavItem {
  const m = t.nav.servicesMenu.cleaning;
  return { href: "/services/cleaning", label: m.title, text: m.text, icon: SprayCan };
}

export function resourceLinks(t: Dictionary): NavItem[] {
  const m = t.nav.resourcesMenu;
  return [
    { href: "/track", label: m.track.title, text: m.track.text, icon: PackageSearch },
    { href: "/shipping", label: m.shipping.title, text: m.shipping.text, icon: Truck },
    { href: "/paper-guide", label: m.paper.title, text: m.paper.text, icon: BookOpenText },
    { href: "/faq", label: m.faq.title, text: m.faq.text, icon: CircleHelp },
  ];
}

export function mainLinks(t: Dictionary): NavItem[] {
  return [
    { href: "/", label: t.nav.home },
    { href: "/cards", label: t.nav.cards },
    { href: "/about", label: t.nav.about },
    { href: "/locations", label: t.nav.locations },
    { href: "/contact", label: t.nav.contact },
  ];
}
