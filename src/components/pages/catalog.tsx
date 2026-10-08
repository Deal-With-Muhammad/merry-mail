"use client";

import { Palette } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { designs, type DesignCategory } from "@/data/catalog";
import { useI18n } from "@/i18n/provider";
import { cx } from "@/lib/utils";
import { DesignTile } from "../cards/design-tile";
import { ButtonLink } from "../ui/locale-link";
import { Reveal } from "../ui/motion";

type Filter = "all" | DesignCategory;
const filters: Filter[] = ["all", "illustrated", "photo", "minimal", "ontario"];

export function Catalog() {
  const { t, fmt } = useI18n();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const raw = params.get("category");
  const active: Filter = filters.includes(raw as Filter) ? (raw as Filter) : "all";
  const list = active === "all" ? designs : designs.filter((d) => d.category === active);

  function select(filter: Filter) {
    const next = new URLSearchParams(params.toString());
    if (filter === "all") next.delete("category");
    else next.set("category", filter);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="container-site py-12 sm:py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0" role="tablist" aria-label={t.catalog.title}>
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={active === f}
              type="button"
              onClick={() => select(f)}
              className={cx(
                "relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
                active === f ? "text-cream-50" : "text-ink-700 hover:bg-cream-200",
              )}
            >
              {active === f && (
                <motion.span layoutId="catalog-filter" className="absolute inset-0 rounded-full bg-evergreen-800" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
              <span className="relative">{t.catalog.filters[f]}</span>
            </button>
          ))}
        </div>
        <p className="text-sm text-muted">{fmt(t.catalog.count, { n: list.length })}</p>
      </div>

      <motion.div layout className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((design) => (
            <motion.div
              key={design.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <DesignTile design={design} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Reveal className="mt-20">
        <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-dashed border-gold-400 bg-gold-100/60 p-8 text-center sm:flex-row sm:text-left">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-evergreen-800 text-gold-300">
            <Palette className="size-7" />
          </span>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-semibold text-ink-900">{t.catalog.customTitle}</h2>
            <p className="mt-1 text-muted">{t.catalog.customText}</p>
          </div>
          <ButtonLink href="/contact?topic=design" className="rounded-full">
            {t.catalog.customCta}
          </ButtonLink>
        </div>
      </Reveal>
    </div>
  );
}
