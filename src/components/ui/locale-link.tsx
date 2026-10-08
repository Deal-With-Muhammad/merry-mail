"use client";

import { buttonVariants } from "@heroui/react";
import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useI18n } from "@/i18n/provider";
import { cx } from "@/lib/utils";

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & { href: string };

/** next/link that automatically prefixes the current locale. */
export function LocaleLink({ href, ...props }: LinkProps) {
  const { href: localize } = useI18n();
  return <NextLink href={localize(href)} {...props} />;
}

type ButtonLinkProps = LinkProps & {
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

/** A locale-aware link styled as a HeroUI button. */
export function ButtonLink({ variant = "primary", size = "md", fullWidth, className, ...props }: ButtonLinkProps) {
  return (
    <LocaleLink
      className={cx(buttonVariants({ variant, size, fullWidth }), "no-underline", className)}
      {...props}
    />
  );
}
