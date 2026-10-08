"use client";

import { Button, Checkbox, Label, Modal, NumberField } from "@heroui/react";
import { BookUser, Check, ChevronDown, Mailbox, MapPin, Plus, Store, Trash2, Truck, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { deliveryOptions, MAX_RECIPIENTS, type DeliveryId } from "@/data/catalog";
import { locations } from "@/data/site";
import { useI18n } from "@/i18n/provider";
import type { Address } from "@/lib/types";
import { cx, formatAddress, uid } from "@/lib/utils";
import { useAddressBook, useAuth, useBuilder, useHydrated } from "@/store";
import { AddressFields } from "../forms/address-fields";
import { CheckboxField } from "../forms/fields";
import { LocaleLink } from "../ui/locale-link";
import { OptionCard, StepHeading } from "./step-design";
import { isAddressValid } from "./validation";

const EMPTY: Address[] = [];

const blank = (): Address => ({ id: uid("rcp_"), name: "", line1: "", line2: "", city: "", province: "ON", postal: "", note: "" });

function RecipientCard({
  index,
  value,
  expanded,
  onToggle,
  onChange,
  onRemove,
  showErrors,
}: {
  index: number;
  value: Address;
  expanded: boolean;
  onToggle: () => void;
  onChange: (patch: Partial<Address>) => void;
  onRemove: () => void;
  showErrors: boolean;
}) {
  const { t, fmt } = useI18n();
  const valid = isAddressValid(value);
  const invalid = showErrors && !valid;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      className={cx("overflow-hidden rounded-2xl border bg-surface", invalid ? "border-danger/60" : "border-border")}
    >
      <div className="flex items-center gap-3 p-3 pl-4">
        <span
          className={cx(
            "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            valid ? "bg-evergreen-800 text-cream-50" : invalid ? "bg-danger/10 text-danger" : "bg-cream-200 text-ink-700",
          )}
        >
          {valid ? <Check className="size-4" /> : index + 1}
        </span>
        <button type="button" onClick={onToggle} className="min-w-0 flex-1 text-left" aria-expanded={expanded}>
          <span className="block truncate font-semibold text-ink-900">{value.name || fmt(t.builder.recipient, { n: index + 1 })}</span>
          <span className="block truncate text-xs text-muted">{valid ? formatAddress(value) : value.line1 || "—"}</span>
        </button>
        <Button isIconOnly size="sm" variant="ghost" aria-label={t.builder.removeRecipient} onPress={onRemove} className="text-muted hover:text-danger">
          <Trash2 className="size-4" />
        </Button>
        <Button isIconOnly size="sm" variant="ghost" aria-label={expanded ? t.common.close : t.common.edit} onPress={onToggle}>
          <ChevronDown className={cx("size-4 transition", expanded && "rotate-180")} />
        </Button>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="border-t border-border p-4">
              <AddressFields value={value} onChange={onChange} showErrors={showErrors} withNote idPrefix={value.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AddressBookPicker({ onAdd, disabled }: { onAdd: (addresses: Address[]) => void; disabled: boolean }) {
  const { t } = useI18n();
  const hydrated = useHydrated();
  const user = useAuth((s) => s.user);
  const book = useAddressBook((s) => (user ? s.book[user.email] ?? EMPTY : EMPTY));
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <>
      <Button size="sm" variant="secondary" className="rounded-full" onPress={() => setOpen(true)} isDisabled={disabled}>
        <BookUser className="size-4" />
        {t.builder.fromBook}
      </Button>
      <Modal.Backdrop isOpen={open} onOpenChange={setOpen}>
        <Modal.Container placement="center">
          <Modal.Dialog className="sm:max-w-lg">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-evergreen-50 text-evergreen-700">
                <BookUser className="size-5" />
              </Modal.Icon>
              <Modal.Heading>{t.builder.bookTitle}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              {!hydrated || !user ? (
                <div className="rounded-2xl bg-cream-100 p-4 text-sm text-ink-700">
                  {t.builder.bookSignIn}{" "}
                  <LocaleLink href="/signin?next=/create" className="font-semibold text-cranberry-700 underline">
                    {t.nav.signIn}
                  </LocaleLink>
                </div>
              ) : book.length === 0 ? (
                <p className="rounded-2xl bg-cream-100 p-4 text-sm text-ink-700">{t.builder.bookEmpty}</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {book.map((a) => (
                    <Checkbox
                      key={a.id}
                      isSelected={selected.includes(a.id)}
                      onChange={(on) => setSelected((s) => (on ? [...s, a.id] : s.filter((x) => x !== a.id)))}
                      className="rounded-2xl border border-border p-3"
                    >
                      <Checkbox.Content>
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <span className="flex flex-col">
                          <Label className="font-semibold">{a.name}</Label>
                          <span className="text-xs text-muted">{formatAddress(a)}</span>
                        </span>
                      </Checkbox.Content>
                    </Checkbox>
                  ))}
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="ghost" className="rounded-full">
                {t.common.cancel}
              </Button>
              <Button
                className="rounded-full"
                isDisabled={!selected.length}
                onPress={() => {
                  onAdd(book.filter((a) => selected.includes(a.id)).map((a) => ({ ...a, id: uid("rcp_"), province: "ON" })));
                  setSelected([]);
                  setOpen(false);
                }}
              >
                {t.builder.bookAdd} {selected.length ? `(${selected.length})` : ""}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}

export function StepRecipients({
  showErrors,
  saveToBook,
  onSaveToBook,
}: {
  showErrors: boolean;
  saveToBook: boolean;
  onSaveToBook: (v: boolean) => void;
}) {
  const { t, l, money, fmt } = useI18n();
  const draft = useBuilder((s) => s.draft);
  const update = useBuilder((s) => s.update);
  const hydrated = useHydrated();
  const user = useAuth((s) => s.user);
  const [expanded, setExpanded] = useState<string | null>(draft.recipients.find((r) => !isAddressValid(r))?.id ?? null);

  const recipients = draft.recipients;
  const done = recipients.filter(isAddressValid).length;
  const atMax = recipients.length >= MAX_RECIPIENTS;
  const deliveryIcons: Record<DeliveryId, typeof Mailbox> = { mail: Mailbox, ship: Truck, pickup: Store };

  function setRecipients(next: Address[]) {
    update({ recipients: next.slice(0, MAX_RECIPIENTS) });
  }
  function addBlank(count = 1) {
    const extra = Array.from({ length: Math.max(0, Math.min(count, MAX_RECIPIENTS - recipients.length)) }, blank);
    if (!extra.length) return;
    setRecipients([...recipients, ...extra]);
    setExpanded(extra[0].id);
  }
  function fillTo(n: number) {
    addBlank(n - recipients.length);
  }

  return (
    <div>
      <StepHeading title={t.builder.deliveryTitle} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="radiogroup" aria-label={t.builder.deliveryTitle}>
        {(Object.keys(deliveryOptions) as DeliveryId[]).map((id) => {
          const option = deliveryOptions[id];
          const Icon = deliveryIcons[id];
          return (
            <OptionCard key={id} selected={draft.delivery === id} onSelect={() => update({ delivery: id })}>
              <Icon className="size-6 text-cranberry-700" />
              <p className="mt-3 pr-5 text-sm font-semibold text-ink-900">{l(option.name)}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{l(option.detail)}</p>
              <p className="mt-2 text-sm font-bold text-evergreen-800">
                {option.price === 0 ? t.common.free : `${money(option.price)}${option.per === "card" ? ` ${t.common.perCard}` : ""}`}
              </p>
            </OptionCard>
          );
        })}
      </div>

      {draft.delivery === "mail" && (
        <div className="mt-10">
          <StepHeading title={t.builder.recipientsTitle} subtitle={t.builder.recipientsHelp} />
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-bold tracking-wider text-muted uppercase">{t.builder.quickAdd}</span>
            <Button size="sm" variant="outline" className="rounded-full" onPress={() => fillTo(5)} isDisabled={recipients.length >= 5}>
              <Users className="size-4" /> {t.builder.familyPack}
            </Button>
            <Button size="sm" variant="outline" className="rounded-full" onPress={() => fillTo(7)} isDisabled={recipients.length >= 7}>
              <Users className="size-4" /> {t.builder.bigFamily}
            </Button>
            <AddressBookPicker disabled={atMax} onAdd={(list) => setRecipients([...recipients.filter((r) => r.name || r.line1), ...list])} />
          </div>

          {recipients.length > 0 && (
            <div className="mb-3 flex items-center justify-between text-xs font-semibold">
              <span className={done === recipients.length ? "text-evergreen-700" : "text-muted"}>
                {fmt(t.builder.complete, { done, total: recipients.length })}
              </span>
              <span className="text-muted">
                {recipients.length}/{MAX_RECIPIENTS}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {recipients.map((r, i) => (
                <RecipientCard
                  key={r.id}
                  index={i}
                  value={r}
                  expanded={expanded === r.id || (showErrors && !isAddressValid(r) && expanded === null)}
                  onToggle={() => setExpanded((cur) => (cur === r.id ? null : r.id))}
                  onChange={(patch) => setRecipients(recipients.map((x) => (x.id === r.id ? { ...x, ...patch } : x)))}
                  onRemove={() => setRecipients(recipients.filter((x) => x.id !== r.id))}
                  showErrors={showErrors}
                />
              ))}
            </AnimatePresence>
          </div>

          {recipients.length === 0 && showErrors && (
            <p className="mb-3 rounded-2xl bg-danger/8 p-3 text-sm font-medium text-danger">{t.builder.noRecipients}</p>
          )}

          {atMax ? (
            <p className="mt-4 rounded-2xl bg-gold-100 p-3 text-sm text-gold-700">{fmt(t.builder.maxReached, { max: MAX_RECIPIENTS })}</p>
          ) : (
            <button
              type="button"
              onClick={() => addBlank()}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-4 font-semibold text-ink-700 transition hover:border-cranberry-400 hover:text-cranberry-700"
            >
              <Plus className="size-4" /> {t.builder.addRecipient}
            </button>
          )}

          {hydrated && user && recipients.length > 0 && (
            <CheckboxField isSelected={saveToBook} onChange={onSaveToBook} className="mt-5">
              {t.builder.saveToBook}
            </CheckboxField>
          )}
          <p className="mt-4 flex items-start gap-2 text-xs text-muted">
            <MapPin className="mt-0.5 size-3.5 shrink-0" /> {t.common.ontarioOnly}
          </p>
        </div>
      )}

      {draft.delivery !== "mail" && (
        <div className="mt-10 space-y-8">
          <NumberField
            value={draft.quantity}
            onChange={(v) => update({ quantity: Number.isFinite(v) ? Math.max(1, Math.min(250, v)) : 1 })}
            minValue={1}
            maxValue={250}
            className="max-w-56"
          >
            <Label>{t.builder.quantity}</Label>
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input />
              <NumberField.IncrementButton />
            </NumberField.Group>
            <p className="mt-1 text-xs text-muted">{t.builder.quantityHelp}</p>
          </NumberField>

          {draft.delivery === "ship" ? (
            <div>
              <StepHeading title={t.builder.shipTo} />
              <AddressFields
                value={draft.shipTo ?? { province: "ON" }}
                onChange={(patch) => update({ shipTo: { ...(draft.shipTo ?? blank()), ...patch } })}
                showErrors={showErrors}
              />
            </div>
          ) : (
            <div>
              <StepHeading title={t.builder.pickupAt} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label={t.builder.pickupAt}>
                {locations.map((loc) => (
                  <OptionCard key={loc.id} selected={draft.pickupLocation === loc.id} onSelect={() => update({ pickupLocation: loc.id })}>
                    <p className="pr-6 font-semibold text-ink-900">{loc.city}</p>
                    <p className="text-xs text-cranberry-700">{l(loc.label)}</p>
                    <p className="mt-2 text-xs text-muted">{loc.address}</p>
                    <p className="text-xs text-muted">{l(loc.hours)}</p>
                  </OptionCard>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
