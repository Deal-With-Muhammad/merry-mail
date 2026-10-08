"use client";

import { formatPostal } from "@/data/catalog";
import { useI18n } from "@/i18n/provider";
import type { Address } from "@/lib/types";
import { addressErrors } from "../builder/validation";
import { TextInput } from "./fields";

/** Ontario-only address form used for recipients, shipping and the address book. */
export function AddressFields({
  value,
  onChange,
  showErrors,
  withNote,
  idPrefix,
}: {
  value: Partial<Address>;
  onChange: (patch: Partial<Address>) => void;
  showErrors: boolean;
  withNote?: boolean;
  idPrefix?: string;
}) {
  const { t } = useI18n();
  const f = t.builder.fields;
  const errors = showErrors ? addressErrors(value) : {};
  const msg = (key: keyof typeof errors) =>
    errors[key] === "postal" ? t.common.postalInvalid : errors[key] ? t.common.required : null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
      <TextInput
        className="sm:col-span-6"
        label={f.name}
        value={value.name ?? ""}
        onChange={(v) => onChange({ name: v })}
        placeholder={f.namePlaceholder}
        error={msg("name")}
        autoComplete={idPrefix ? "off" : "name"}
      />
      <TextInput
        className="sm:col-span-4"
        label={f.line1}
        value={value.line1 ?? ""}
        onChange={(v) => onChange({ line1: v })}
        error={msg("line1")}
        autoComplete={idPrefix ? "off" : "address-line1"}
      />
      <TextInput
        className="sm:col-span-2"
        label={`${f.line2}`}
        value={value.line2 ?? ""}
        onChange={(v) => onChange({ line2: v })}
        placeholder={t.common.optional}
        autoComplete={idPrefix ? "off" : "address-line2"}
      />
      <TextInput
        className="sm:col-span-3"
        label={f.city}
        value={value.city ?? ""}
        onChange={(v) => onChange({ city: v })}
        error={msg("city")}
        autoComplete={idPrefix ? "off" : "address-level2"}
      />
      <TextInput className="sm:col-span-1" label={f.province} value="ON" onChange={() => {}} isReadOnly />
      <TextInput
        className="sm:col-span-2"
        label={f.postal}
        value={value.postal ?? ""}
        onChange={(v) => onChange({ postal: formatPostal(v) })}
        placeholder="K1A 0B1"
        maxLength={7}
        error={msg("postal")}
        autoComplete={idPrefix ? "off" : "postal-code"}
      />
      {withNote && (
        <TextInput
          className="sm:col-span-6"
          label={f.note}
          value={value.note ?? ""}
          onChange={(v) => onChange({ note: v })}
          placeholder={f.notePlaceholder}
          maxLength={90}
        />
      )}
    </div>
  );
}
