import type { ReactNode } from "react";
import { cx } from "@/lib/utils";
import { Reveal } from "./motion";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  action,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <Reveal
      className={cx(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-3xl items-center text-center" : "max-w-2xl items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <span className="eyebrow">
          <span className="h-px w-6 bg-current opacity-60" />
          {eyebrow}
          {align === "center" && <span className="h-px w-6 bg-current opacity-60" />}
        </span>
      )}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-lead">{subtitle}</p>}
      {action}
    </Reveal>
  );
}

/** Page hero used by inner pages. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx("relative overflow-hidden border-b border-border bg-cream-50", className)}>
      <div className="bg-festive-dots absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="container-site relative py-14 sm:py-20">
        <SectionHeading eyebrow={eyebrow} title={<span className="text-4xl sm:text-5xl lg:text-6xl">{title}</span>} subtitle={subtitle} />
        {children}
      </div>
    </section>
  );
}
