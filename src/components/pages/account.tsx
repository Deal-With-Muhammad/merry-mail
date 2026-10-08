"use client";

import { Avatar, Button, Chip, Modal, Skeleton, Switch, Tabs, toast } from "@heroui/react";
import { BookUser, LogOut, Mail, MapPin, Package, PackageSearch, Pencil, Plus, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { trackOrder } from "@/lib/tracking";
import type { Address, Order, User } from "@/lib/types";
import { useNow } from "@/lib/use-now";
import { formatAddress, uid } from "@/lib/utils";
import { useAddressBook, useAuth, useHydrated, useOrders } from "@/store";
import { isAddressValid } from "../builder/validation";
import { AddressFields } from "../forms/address-fields";
import { TextInput } from "../forms/fields";
import { initials } from "../layout/user-menu";
import { ButtonLink } from "../ui/locale-link";
import { MiniItems } from "./order-summary";

type Tab = "overview" | "orders" | "addresses" | "profile";
const tabs: Tab[] = ["overview", "orders", "addresses", "profile"];
const EMPTY_ADDRESSES: Address[] = [];

function OrderCard({ order, now }: { order: Order; now: number | null }) {
  const { t, money, date, fmt } = useI18n();
  const [open, setOpen] = useState(false);
  const status = now ? trackOrder(order, now).status : "received";
  const delivered = status === "delivered";
  return (
    <div className="rounded-[1.5rem] border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">#{order.id}</p>
          <p className="text-xs text-muted">{fmt(t.account.placed, { date: date(order.createdAt, { dateStyle: "long" }) })}</p>
        </div>
        <Chip color={delivered ? "success" : "accent"} variant="soft" size="sm">
          {t.track.statuses[status].title}
        </Chip>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="text-muted">
          {fmt(t.account.items, { n: order.items.length })} · <span className="font-mono text-xs font-bold text-ink-700">{order.tracking}</span>
        </span>
        <span className="font-semibold text-ink-900">
          {t.account.total}: {money(order.totals.total)}
        </span>
      </div>
      {open && (
        <div className="mt-3 border-t border-border">
          <MiniItems items={order.items} />
        </div>
      )}
      <div className="mt-4 flex gap-2">
        <ButtonLink href={`/track?code=${order.tracking}`} size="sm" className="rounded-full">
          <PackageSearch className="size-4" /> {t.account.track}
        </ButtonLink>
        <Button size="sm" variant="ghost" className="rounded-full" onPress={() => setOpen((v) => !v)}>
          {open ? t.common.close : t.common.learnMore}
        </Button>
      </div>
    </div>
  );
}

function AddressModal({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial: Address | null;
  onClose: () => void;
  onSave: (a: Address) => void;
}) {
  const { t } = useI18n();
  const [value, setValue] = useState<Address>(initial ?? { id: uid("addr_"), name: "", line1: "", city: "", province: "ON", postal: "" });
  const [showErrors, setShowErrors] = useState(false);

  return (
    <Modal.Backdrop isOpen={open} onOpenChange={(o) => !o && onClose()}>
      <Modal.Container placement="center" scroll="inside">
        <Modal.Dialog className="sm:max-w-xl">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-evergreen-50 text-evergreen-700">
              <MapPin className="size-5" />
            </Modal.Icon>
            <Modal.Heading>{initial ? t.account.editAddress : t.account.newAddress}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <AddressFields value={value} onChange={(patch) => setValue((v) => ({ ...v, ...patch }))} showErrors={showErrors} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" className="rounded-full" onPress={onClose}>
              {t.common.cancel}
            </Button>
            <Button
              className="rounded-full"
              onPress={() => {
                if (!isAddressValid(value)) {
                  setShowErrors(true);
                  return;
                }
                onSave(value);
              }}
            >
              {t.common.save}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

function ProfileForm({ user, onSave }: { user: User; onSave: (patch: Partial<Pick<User, "name" | "newsletter">>) => void }) {
  const { t } = useI18n();
  const [name, setName] = useState(user.name);
  return (
    <div className="max-w-xl space-y-5 rounded-[1.5rem] border border-border bg-surface p-6">
      <TextInput label={t.account.profileName} value={name} onChange={setName} autoComplete="name" />
      <TextInput label={t.account.profileEmail} value={user.email} onChange={() => {}} isReadOnly />
      <Switch isSelected={user.newsletter} onChange={(v) => onSave({ newsletter: v })}>
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <span className="text-sm text-ink-700">{t.account.profileNewsletter}</span>
        </Switch.Content>
      </Switch>
      <Button
        className="rounded-full"
        isDisabled={!name.trim() || name.trim() === user.name}
        onPress={() => {
          onSave({ name: name.trim() });
          toast.success(t.account.profileSaved);
        }}
      >
        {t.common.save}
      </Button>
    </div>
  );
}

export function AccountPage() {
  const { t, fmt, date, href } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const hydrated = useHydrated();
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const updateProfile = useAuth((s) => s.updateProfile);
  const allOrders = useOrders((s) => s.orders);
  const addresses = useAddressBook((s) => (user ? s.book[user.email] ?? EMPTY_ADDRESSES : EMPTY_ADDRESSES));
  const saveAddress = useAddressBook((s) => s.save);
  const removeAddress = useAddressBook((s) => s.remove);
  const now = useNow();
  const [editing, setEditing] = useState<Address | null | "new">(null);

  const raw = params.get("tab") as Tab | null;
  const tab: Tab = raw && tabs.includes(raw) ? raw : "overview";
  const orders = user ? allOrders.filter((o) => o.email === user.email) : [];
  const cardsSent = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + (i.delivery === "mail" ? i.recipients.length : i.quantity), 0),
    0,
  );

  useEffect(() => {
    if (hydrated && !user) router.replace(href(`/signin?next=${encodeURIComponent("/account")}`));
  }, [hydrated, user, router, href]);

  function setTab(next: Tab) {
    router.replace(next === "overview" ? pathname : `${pathname}?tab=${next}`, { scroll: false });
  }

  if (!hydrated || !user) {
    return (
      <div className="container-site space-y-6 py-12">
        <Skeleton className="h-32 rounded-[2rem]" />
        <Skeleton className="h-80 rounded-[2rem]" />
      </div>
    );
  }

  return (
    <div className="container-site py-10 sm:py-14">
      <div className="relative overflow-hidden rounded-[2rem] bg-evergreen-900 p-6 text-cream-50 sm:p-8">
        <div aria-hidden className="absolute -top-20 -right-10 size-64 rounded-full bg-cranberry-600/25 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16 bg-gold-400 text-xl text-evergreen-950">
              <Avatar.Fallback>{initials(user.name)}</Avatar.Fallback>
            </Avatar>
            <div>
              <p className="text-xs font-bold tracking-wider text-gold-300 uppercase">{t.account.title}</p>
              <h1 className="font-display text-3xl font-semibold">{fmt(t.account.hello, { name: user.name.split(" ")[0] })}</h1>
              <p className="text-sm text-cream-50/70">{fmt(t.account.memberSince, { date: date(user.createdAt, { month: "long", year: "numeric" }) })}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/create" className="rounded-full">
              {t.common.createCard}
            </ButtonLink>
            <Button
              variant="outline"
              className="rounded-full border-white/25 text-cream-50 hover:bg-white/10"
              onPress={() => {
                signOut();
                toast(t.nav.userMenu.signedOut);
                router.push(href("/"));
              }}
            >
              <LogOut className="size-4" /> {t.account.signOut}
            </Button>
          </div>
        </div>
      </div>

      <Tabs selectedKey={tab} onSelectionChange={(k) => setTab(k as Tab)} className="mt-8">
        <Tabs.ListContainer>
          <Tabs.List aria-label={t.account.title}>
            {tabs.map((key) => (
              <Tabs.Tab key={key} id={key}>
                {t.account.tabs[key]}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="overview" className="pt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: t.account.stats.orders, value: orders.length, icon: Package },
              { label: t.account.stats.cards, value: cardsSent, icon: Mail },
              { label: t.account.stats.addresses, value: addresses.length, icon: BookUser },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-4 rounded-[1.5rem] border border-border bg-surface p-5">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-cranberry-50 text-cranberry-700">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-display text-3xl font-semibold text-ink-900">{value}</p>
                  <p className="text-sm text-muted">{label}</p>
                </div>
              </div>
            ))}
          </div>
          <h2 className="mt-10 mb-4 font-display text-2xl font-semibold text-ink-900">{t.account.recent}</h2>
          {orders.length ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {orders.slice(0, 2).map((o) => (
                <OrderCard key={o.id} order={o} now={now} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-border p-8 text-center">
              <p className="text-muted">{t.account.noOrders}</p>
              <ButtonLink href="/create" className="mt-4 rounded-full">
                {t.account.noOrdersCta}
              </ButtonLink>
            </div>
          )}
        </Tabs.Panel>

        <Tabs.Panel id="orders" className="pt-8">
          {orders.length ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {orders.map((o) => (
                <OrderCard key={o.id} order={o} now={now} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-border p-8 text-center">
              <p className="text-muted">{t.account.noOrders}</p>
              <ButtonLink href="/create" className="mt-4 rounded-full">
                {t.account.noOrdersCta}
              </ButtonLink>
            </div>
          )}
        </Tabs.Panel>

        <Tabs.Panel id="addresses" className="pt-8">
          <div className="mb-5 flex justify-end">
            <Button className="rounded-full" onPress={() => setEditing("new")}>
              <Plus className="size-4" /> {t.account.addAddress}
            </Button>
          </div>
          {addresses.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {addresses.map((a) => (
                <div key={a.id} className="flex flex-col rounded-[1.5rem] border border-border bg-surface p-5">
                  <MapPin className="size-5 text-cranberry-700" />
                  <p className="mt-3 font-semibold text-ink-900">{a.name}</p>
                  <p className="mt-1 flex-1 text-sm text-muted">{formatAddress(a)}</p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="ghost" className="rounded-full" onPress={() => setEditing(a)}>
                      <Pencil className="size-4" /> {t.common.edit}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full text-danger"
                      onPress={() => {
                        removeAddress(user.email, a.id);
                        toast(t.account.addressDeleted);
                      }}
                    >
                      <Trash2 className="size-4" /> {t.account.deleteAddress}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-[1.5rem] border border-dashed border-border p-8 text-center text-muted">{t.account.addressesEmpty}</p>
          )}
          {editing && (
            <AddressModal
              key={editing === "new" ? "new" : editing.id}
              open
              initial={editing === "new" ? null : editing}
              onClose={() => setEditing(null)}
              onSave={(a) => {
                saveAddress(user.email, a);
                setEditing(null);
                toast.success(t.account.addressSaved);
              }}
            />
          )}
        </Tabs.Panel>

        <Tabs.Panel id="profile" className="pt-8">
          <ProfileForm key={user.email} user={user} onSave={updateProfile} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
