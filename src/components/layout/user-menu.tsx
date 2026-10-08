"use client";

import { Avatar, Dropdown, Label, Separator, toast } from "@heroui/react";
import { BookUser, ChevronDown, LogOut, Package, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/provider";
import { cx } from "@/lib/utils";
import { useAuth } from "@/store";

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function UserMenu({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { t, href, fmt } = useI18n();
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const router = useRouter();
  if (!user) return null;

  return (
    <Dropdown>
      <Dropdown.Trigger
        className={cx(
          "inline-flex items-center gap-2 rounded-full py-0.5 pr-2 pl-0.5 text-xs font-semibold outline-none",
          tone === "dark" ? "text-cream-50 hover:bg-white/10" : "text-ink-900 hover:bg-default",
        )}
        aria-label={t.nav.userMenu.account}
      >
        <Avatar className="size-6 bg-gold-400 text-[10px] text-evergreen-900">
          <Avatar.Fallback>{initials(user.name)}</Avatar.Fallback>
        </Avatar>
        <span className="max-w-28 truncate">{fmt(t.topbar.hi, { name: user.name.split(" ")[0] })}</span>
        <ChevronDown className="size-3.5 opacity-70" />
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end" className="min-w-56">
        <div className="px-3 pt-2.5 pb-2">
          <p className="text-sm font-semibold text-ink-900">{user.name}</p>
          <p className="truncate text-xs text-muted">{user.email}</p>
        </div>
        <Separator />
        <Dropdown.Menu
          onAction={(key) => {
            if (key === "signout") {
              signOut();
              toast(t.nav.userMenu.signedOut);
              router.push(href("/"));
            }
          }}
        >
          <Dropdown.Item id="account" href={href("/account")} textValue={t.nav.userMenu.account}>
            <UserRound className="size-4 text-muted" />
            <Label>{t.nav.userMenu.account}</Label>
          </Dropdown.Item>
          <Dropdown.Item id="orders" href={href("/account?tab=orders")} textValue={t.nav.userMenu.orders}>
            <Package className="size-4 text-muted" />
            <Label>{t.nav.userMenu.orders}</Label>
          </Dropdown.Item>
          <Dropdown.Item id="addresses" href={href("/account?tab=addresses")} textValue={t.nav.userMenu.addresses}>
            <BookUser className="size-4 text-muted" />
            <Label>{t.nav.userMenu.addresses}</Label>
          </Dropdown.Item>
          <Dropdown.Item id="signout" variant="danger" textValue={t.nav.userMenu.signOut}>
            <LogOut className="size-4" />
            <Label>{t.nav.userMenu.signOut}</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
