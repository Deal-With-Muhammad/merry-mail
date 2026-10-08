"use client";

import { ArrowRight, Hand } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { Card3D } from "../cards/card-3d";
import { CardArt } from "../cards/card-art";
import { ButtonLink } from "../ui/locale-link";

export function Hero() {
  const { t } = useI18n();
  const h = t.home.hero;
  const [open, setOpen] = useState(false);

  return (
    <section className="relative isolate overflow-hidden bg-evergreen-900 text-cream-50">
      {/* atmosphere */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[42rem] w-[70rem] -translate-x-1/2 rounded-full bg-evergreen-600/35 blur-[120px]" />
        <div className="absolute right-[-10rem] bottom-[-12rem] h-[30rem] w-[30rem] rounded-full bg-cranberry-700/30 blur-[110px]" />
        <div className="absolute top-1/3 left-[-8rem] h-[22rem] w-[22rem] rounded-full bg-gold-500/15 blur-[100px]" />
        <div className="bg-festive-dots absolute inset-0 opacity-[0.12]" />
      </div>

      <div className="container-site relative grid grid-cols-1 items-center gap-12 pt-10 pb-36 sm:gap-14 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-24 lg:pb-44">
        <div className="relative z-10 max-w-2xl">
          <span
            style={{ animationDelay: "0ms" }}
            className="motion-safe:animate-rise inline-flex items-center gap-2 rounded-full bg-white/8 py-1.5 pr-4 pl-3 text-xs font-semibold text-cream-50/90 ring-1 ring-white/15 backdrop-blur"
          >
            <span className="size-2 rounded-full bg-cranberry-500" />
            {h.eyebrow}
          </span>

          <h1
            style={{ animationDelay: "80ms" }}
            className="motion-safe:animate-rise mt-6 font-display text-[2.15rem] leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.05] lg:text-[4.1rem]"
          >
            {h.titleLead} <span className="font-normal text-gold-300 italic">{h.titleAccent}</span>
          </h1>

          <p
            style={{ animationDelay: "160ms" }}
            className="motion-safe:animate-rise mt-5 max-w-xl text-base leading-relaxed text-cream-50/75 sm:mt-6 sm:text-lg"
          >
            {h.subtitle}
          </p>

          <div
            style={{ animationDelay: "240ms" }}
            className="motion-safe:animate-rise mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap"
          >
            <ButtonLink
              href="/create"
              size="lg"
              className="w-full rounded-full px-7 shadow-[0_12px_32px_-10px_rgba(200,55,61,0.8)] sm:w-auto"
            >
              {h.primary}
            </ButtonLink>
            <ButtonLink
              href="/cards"
              size="lg"
              variant="outline"
              className="w-full rounded-full border-white/25 px-7 text-cream-50 hover:bg-white/10 sm:w-auto"
            >
              {h.secondary}
              <ArrowRight className="size-4.5" />
            </ButtonLink>
          </div>
        </div>

        {/* Card composition */}
        <div
          style={{ animationDelay: "200ms" }}
          className="motion-safe:animate-rise relative mx-auto w-full max-w-[22rem] sm:max-w-[25rem] lg:mr-0 lg:max-w-[27rem]"
        >
          <div className="absolute top-8 -left-16 hidden w-[62%] rotate-[-11deg] overflow-hidden rounded-lg opacity-90 shadow-2xl ring-1 ring-black/10 sm:block lg:-left-24">
            <div className="aspect-[5/7]">
              <CardArt design="family-photo" className="h-full w-full" />
            </div>
          </div>
          <div className="absolute -right-6 bottom-10 hidden w-[52%] rotate-[9deg] overflow-hidden rounded-lg opacity-80 shadow-2xl ring-1 ring-black/10 md:block lg:-right-14">
            <div className="aspect-[5/7]">
              <CardArt design="northern-lights" className="h-full w-full" />
            </div>
          </div>

          <div
            className={
              open
                ? "relative z-10 mx-auto w-[50%] transition-all duration-700"
                : "relative z-10 mx-auto w-[76%] transition-all duration-700"
            }
          >
            <Card3D design="evergreen" format="folded" paper="premium" foil open={open} onToggleOpen={() => setOpen((v) => !v)} float />
          </div>

          <div className="relative z-20 mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-cream-50 ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
            >
              <Hand className="size-4 animate-bounce" />
              {open ? t.home.showcase.close : h.chipOpen}
            </button>
          </div>
        </div>
      </div>

      {/* scalloped edge */}
      <svg
        aria-hidden
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -bottom-px h-10 w-full text-background sm:h-14"
      >
        <path
          fill="currentColor"
          d="M0 60V30c40 0 40-24 80-24s40 24 80 24 40-24 80-24 40 24 80 24 40-24 80-24 40 24 80 24 40-24 80-24 40 24 80 24 40-24 80-24 40 24 80 24 40-24 80-24 40 24 80 24 40-24 80-24 40 24 80 24 40-24 80-24 40 24 80 24 40-24 80-24 40 24 80 24 40-24 80-24 40 24 80 24v30Z"
        />
      </svg>
    </section>
  );
}
