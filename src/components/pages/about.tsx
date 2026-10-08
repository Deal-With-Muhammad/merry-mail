"use client";

import { Award, HeartHandshake, Leaf, MapPinned, Quote } from "lucide-react";
import Image from "next/image";
import { images, team, unsplash, videos } from "@/data/site";
import { useI18n } from "@/i18n/provider";
import { Stats, TeamGrid } from "../home/sections";
import { VideoPanel } from "../home/video";
import { ButtonLink } from "../ui/locale-link";
import { Reveal } from "../ui/motion";
import { SectionHeading } from "../ui/section";

export function AboutPage() {
  const { t } = useI18n();
  const a = t.about;
  const valueIcons = [MapPinned, Award, Leaf, HeartHandshake];
  const founder = team[0];

  return (
    <>
      <section className="relative overflow-hidden bg-cream-50">
        <div className="bg-festive-dots absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_65%)]" />
        <div className="container-site relative grid grid-cols-1 items-center gap-12 py-16 sm:py-20 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow">{a.eyebrow}</span>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] font-semibold text-ink-900 sm:text-6xl">{a.title}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-500">{a.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/create" size="lg" className="rounded-full px-7">
                {t.common.createCard}
              </ButtonLink>
              <ButtonLink href="#team" size="lg" variant="outline" className="rounded-full px-7">
                {a.teamTitle}
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <VideoPanel video={videos.fireplace} label={t.common.playVideo} className="aspect-[4/3.2]" />
          </Reveal>
        </div>
      </section>

      <Stats />

      <section className="container-site py-16 sm:py-24">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal className="relative lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
              <Image src={unsplash(founder.image, 1000)} alt={founder.name} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-evergreen-950/80 via-transparent" />
              <div className="absolute right-6 bottom-6 left-6 text-cream-50">
                <p className="font-script text-5xl text-gold-300">{a.founderName}</p>
                <p className="text-sm text-cream-50/80">{a.founderRole}</p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-8 hidden w-40 rotate-6 overflow-hidden rounded-2xl border-4 border-cream-50 shadow-xl sm:block">
              <div className="relative aspect-square">
                <Image src={unsplash(images.gingerbreadBaking, 400)} alt="" fill sizes="160px" className="object-cover" />
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHeading align="left" eyebrow={a.storyTitle} title={t.home.about.title} />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-500">
              {a.story.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-10">
              <figure className="relative rounded-[2rem] bg-evergreen-900 p-8 text-cream-50">
                <Quote className="size-8 text-gold-400" />
                <blockquote className="mt-4 font-display text-2xl leading-snug italic">“{a.founderQuote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="relative size-11 overflow-hidden rounded-full ring-2 ring-gold-400">
                    <Image src={unsplash(founder.image, 120)} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                  <span>
                    <span className="block font-semibold">{a.founderName}</span>
                    <span className="block text-xs text-cream-50/70">{a.founderRole}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-16 sm:py-24">
        <div className="container-site">
          <SectionHeading eyebrow={a.eyebrow} title={a.valuesTitle} />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {a.values.map((v, i) => {
              const Icon = valueIcons[i];
              return (
                <Reveal key={v.title} delay={i * 0.07}>
                  <div className="h-full rounded-[1.75rem] border border-border bg-surface p-6">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-evergreen-800 text-gold-300">
                      <Icon className="size-6" />
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold text-ink-900">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-site py-16 sm:py-24">
        <SectionHeading eyebrow={a.storyTitle} title={a.timelineTitle} />
        <ol className="relative mx-auto mt-14 max-w-3xl">
          <span aria-hidden className="absolute top-2 bottom-2 left-[1.1rem] w-0.5 bg-gradient-to-b from-gold-400 via-cranberry-400 to-evergreen-600 sm:left-1/2 sm:-translate-x-1/2" />
          {a.timeline.map((item, i) => (
            <Reveal as="li" key={item.year} delay={i * 0.06} className="relative mb-10 last:mb-0 sm:grid sm:grid-cols-2 sm:gap-12">
              <span className="absolute top-1 left-0 flex size-9 items-center justify-center rounded-full bg-cream-50 ring-4 ring-gold-300 sm:left-1/2 sm:-translate-x-1/2">
                <span className="size-3 rounded-full bg-cranberry-600" />
              </span>
              <div className={i % 2 === 0 ? "pl-14 sm:pl-0 sm:text-right" : "pl-14 sm:col-start-2 sm:pl-0"}>
                <p className="font-display text-3xl font-semibold text-cranberry-700">{item.year}</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section id="team" className="bg-cream-50 py-16 sm:py-24">
        <div className="container-site">
          <SectionHeading eyebrow={t.home.team.eyebrow} title={a.teamTitle} subtitle={a.teamSubtitle} />
          <div className="mt-12">
            <TeamGrid />
          </div>
        </div>
      </section>

      <section className="container-site py-16 sm:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-cranberry-700 px-6 py-14 text-center text-cream-50 sm:px-12">
            <Image src={unsplash(images.christmasStreet, 1600)} alt="" fill sizes="100vw" className="object-cover opacity-20 mix-blend-luminosity" />
            <div className="relative">
              <h2 className="font-display text-3xl font-semibold sm:text-5xl">{a.ctaTitle}</h2>
              <p className="mx-auto mt-3 max-w-xl text-cream-50/80">{a.ctaText}</p>
              <ButtonLink href="/create" size="lg" className="mt-8 rounded-full bg-cream-50 px-8 text-cranberry-700 hover:bg-white">
                {t.common.createCard}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
