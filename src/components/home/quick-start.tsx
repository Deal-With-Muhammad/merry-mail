"use client";

import { Button } from "@heroui/react";
import { ArrowRight, MapPin, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { formatPostal } from "@/data/catalog";
import { useI18n } from "@/i18n/provider";
import { isOntarioPostal } from "@/lib/utils";
import { useBuilder } from "@/store";
import { SelectInput, TextInput } from "../forms/fields";
import { Reveal } from "../ui/motion";

type ServiceKey = "postcard" | "folded" | "photo" | "wedding" | "business";

export function QuickStart() {
  const { t, href, fmt } = useI18n();
  const q = t.home.quick;
  const router = useRouter();
  const update = useBuilder((s) => s.update);
  const [name, setName] = useState("");
  const [postal, setPostal] = useState("");
  const [service, setService] = useState<ServiceKey>("folded");
  const [errors, setErrors] = useState<{ name?: string; postal?: string }>({});

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = t.common.required;
    if (!isOntarioPostal(postal)) next.postal = t.common.ontarioOnly;
    setErrors(next);
    if (Object.keys(next).length) return;

    if (service === "wedding") return router.push(href("/services/wedding-invitations#quote"));
    if (service === "business") return router.push(href("/services/business-cards#quote"));

    const signature = fmt(t.builder.defaults.signatureFrom, { name: name.trim() });
    if (service === "photo") {
      update({ design: "family-photo", signature, format: "folded" });
    } else {
      update({ format: service, signature });
    }
    router.push(href("/create"));
  }

  return (
    <div className="relative z-20 container-site -mt-24 sm:-mt-28">
      <Reveal>
        <form
          onSubmit={submit}
          noValidate
          className="paper-grain grid grid-cols-1 gap-6 rounded-[2rem] border border-border bg-surface p-6 shadow-[0_30px_80px_-30px_rgba(40,25,10,0.35)] sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2.6fr)] lg:items-center lg:gap-10"
        >
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-900 sm:text-[1.7rem]">{q.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{q.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)_minmax(0,1.15fr)_auto] lg:items-start">
            <TextInput
              label={q.name}
              value={name}
              onChange={(v) => {
                setName(v);
                if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
              }}
              placeholder={q.namePlaceholder}
              autoComplete="name"
              error={errors.name}
              prefix={<UserRound className="size-4 text-muted" />}
            />
            <TextInput
              label={q.postal}
              value={postal}
              onChange={(v) => {
                setPostal(formatPostal(v));
                if (errors.postal) setErrors((e) => ({ ...e, postal: undefined }));
              }}
              placeholder="M5V 2T6"
              autoComplete="postal-code"
              maxLength={7}
              error={errors.postal}
              prefix={<MapPin className="size-4 text-muted" />}
            />
            <SelectInput
              label={q.service}
              value={service}
              onChange={(v) => setService(v as ServiceKey)}
              options={(Object.keys(q.services) as ServiceKey[]).map((key) => ({ id: key, label: q.services[key] }))}
            />
            <Button type="submit" size="lg" className="mt-auto h-11 rounded-full px-6 sm:col-span-2 lg:col-span-1 lg:mt-[1.6rem]">
              {q.cta}
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <p className="text-xs text-muted lg:col-start-2">📍 {q.note}</p>
        </form>
      </Reveal>
    </div>
  );
}
