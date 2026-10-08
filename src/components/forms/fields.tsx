"use client";

import {
  Checkbox,
  Description,
  FieldError,
  Input,
  InputGroup,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";
import type { Key, ReactNode } from "react";
import { cx } from "@/lib/utils";

type BaseProps = {
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  description?: ReactNode;
  placeholder?: string;
  name?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  className?: string;
  autoComplete?: string;
  autoFocus?: boolean;
};

export function TextInput({
  label,
  value,
  onChange,
  error,
  description,
  placeholder,
  name,
  isRequired,
  isReadOnly,
  className,
  autoComplete,
  autoFocus,
  type = "text",
  inputMode,
  maxLength,
  prefix,
  suffix,
  onBlur,
}: BaseProps & {
  type?: "text" | "email" | "password" | "tel" | "search" | "url" | "date" | "number";
  inputMode?: "text" | "numeric" | "tel" | "email" | "decimal";
  maxLength?: number;
  prefix?: ReactNode;
  suffix?: ReactNode;
  onBlur?: () => void;
}) {
  return (
    <TextField
      className={cx("w-full", className)}
      value={value}
      onChange={onChange}
      isInvalid={!!error}
      isRequired={isRequired}
      isReadOnly={isReadOnly}
      name={name}
      type={type}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      validationBehavior="aria"
      onBlur={onBlur}
    >
      <Label>{label}</Label>
      {prefix || suffix ? (
        <InputGroup>
          {prefix && <InputGroup.Prefix>{prefix}</InputGroup.Prefix>}
          <InputGroup.Input placeholder={placeholder} inputMode={inputMode} maxLength={maxLength} />
          {suffix && <InputGroup.Suffix>{suffix}</InputGroup.Suffix>}
        </InputGroup>
      ) : (
        <Input placeholder={placeholder} inputMode={inputMode} maxLength={maxLength} />
      )}
      {description && !error && <Description>{description}</Description>}
      <FieldError>{error}</FieldError>
    </TextField>
  );
}

export function TextAreaInput({
  label,
  value,
  onChange,
  error,
  description,
  placeholder,
  name,
  isRequired,
  className,
  rows = 4,
  maxLength,
}: BaseProps & { rows?: number; maxLength?: number }) {
  return (
    <TextField
      className={cx("w-full", className)}
      value={value}
      onChange={onChange}
      isInvalid={!!error}
      isRequired={isRequired}
      name={name}
      validationBehavior="aria"
    >
      <Label>{label}</Label>
      <TextArea placeholder={placeholder} rows={rows} maxLength={maxLength} className="resize-y" />
      {description && !error && <Description>{description}</Description>}
      <FieldError>{error}</FieldError>
    </TextField>
  );
}

export type Option = { id: string; label: ReactNode; textValue?: string; description?: ReactNode };

export function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  className,
  name,
  isRequired,
}: {
  label: ReactNode;
  value: string | null;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string | null;
  className?: string;
  name?: string;
  isRequired?: boolean;
}) {
  return (
    <Select
      className={cx("w-full", className)}
      value={value}
      onChange={(key: Key | Key[] | null) => {
        if (key != null && !Array.isArray(key)) onChange(String(key));
      }}
      placeholder={placeholder}
      isInvalid={!!error}
      isRequired={isRequired}
      name={name}
    >
      <Label>{label}</Label>
      <Select.Trigger className="min-w-0">
        <Select.Value className="truncate" />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((o) => (
            <ListBox.Item key={o.id} id={o.id} textValue={o.textValue ?? (typeof o.label === "string" ? o.label : o.id)}>
              <span className="flex flex-col">
                <span>{o.label}</span>
                {o.description && <span className="text-xs text-muted">{o.description}</span>}
              </span>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
      <FieldError>{error}</FieldError>
    </Select>
  );
}

export function CheckboxField({
  isSelected,
  onChange,
  children,
  description,
  error,
  className,
  value,
}: {
  isSelected?: boolean;
  onChange?: (selected: boolean) => void;
  children: ReactNode;
  description?: ReactNode;
  error?: string | null;
  className?: string;
  value?: string;
}) {
  return (
    <Checkbox isSelected={isSelected} onChange={onChange} isInvalid={!!error} className={className} value={value}>
      <Checkbox.Content>
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <span className="text-sm text-ink-700">{children}</span>
      </Checkbox.Content>
      {description && <Description>{description}</Description>}
      {error && <p className="mt-1 text-xs font-medium text-danger">{error}</p>}
    </Checkbox>
  );
}
