"use client";

import { CalendarClock } from "lucide-react";
import { useNow } from "@/lib/use-now";
import { useI18n } from "@/i18n/provider";
import { ButtonLink } from "../ui/locale-link";
import { Reveal } from "../ui/motion";

/** Standard-mail order deadline for Christmas 2026 (11:59 pm Eastern). */
export const CHRISTMAS_DEADLINE = Date.UTC(2026, 11, 13, 4, 59, 0);

function parts(ms: number) {
  const clamp = Math.max(0, ms);
  return {
    days: Math.floor(clamp / 86_400_000),
    hours: Math.floor(clamp / 3_600_000) % 24,
    minutes: Math.floor(clamp / 60_000) % 60,
    seconds: Math.floor(clamp / 1000) % 60,
  };
}

export function DeadlineBanner() {
  const { t, fmt, date } = useI18n();
  const d = t.home.deadline;
  const now = useNow(1000);

  const left = now === null ? null : parts(CHRISTMAS_DEADLINE - now);
  const units = [
    { label: d.days, value: left?.days },
    { label: d.hours, value: left?.hours },
    { label: d.minutes, value: left?.minutes },
    { label: d.seconds, value: left?.seconds },
  ];
  const deadlineLabel = date(Date.UTC(2026, 11, 12, 12), { month: "long", day: "numeric", timeZone: "America/Toronto" });

  return (
    <section className="container-site py-6">
      <Reveal>
        <div className="paper-grain relative overflow-hidden rounded-[2rem] border border-gold-300 bg-gold-100 px-6 py-8 sm:px-10">
          <div aria-hidden className="absolute -top-16 -right-10 size-56 rounded-full bg-cranberry-600/10 blur-2xl" />
          <div className="relative flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
            <div className="flex flex-col items-center gap-4 lg:flex-row">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-cranberry-600 text-white shadow-lg">
                <CalendarClock className="size-7" />
              </span>
              <div>
                <p className="font-display text-2xl font-semibold text-ink-900">{d.title}</p>
                <p className="mt-1 text-ink-500">{fmt(d.text, { date: deadlineLabel })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4" aria-live="off">
              {units.map((u) => (
                <div key={u.label} className="flex w-16 flex-col items-center rounded-2xl bg-cream-50 py-3 shadow-sm ring-1 ring-gold-200 sm:w-20">
                  <span className="font-display text-2xl font-semibold text-evergreen-800 tabular-nums sm:text-3xl">
                    {u.value === undefined ? "--" : String(u.value).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider text-muted uppercase">{u.label}</span>
                </div>
              ))}
            </div>
            <ButtonLink href="/shipping" variant="outline" className="rounded-full border-ink-900/20">
              {d.cta}
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
