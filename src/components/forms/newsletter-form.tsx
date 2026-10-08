"use client";

import { Button, toast } from "@heroui/react";
import { Check, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useI18n } from "@/i18n/provider";
import { cx, isEmail } from "@/lib/utils";
import { useNewsletter } from "@/store";

export function NewsletterForm({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const { t } = useI18n();
  const subscribe = useNewsletter((s) => s.subscribe);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) {
      setError(t.common.invalidEmail);
      return;
    }
    setError(null);
    setPending(true);
    await new Promise((r) => setTimeout(r, 650));
    const result = subscribe(email);
    setPending(false);
    setDone(true);
    setEmail("");
    if (result === "new") toast.success(t.newsletter.success);
    else toast.info(t.newsletter.exists);
  }

  const dark = tone === "dark";
  return (
    <form onSubmit={onSubmit} noValidate className={cx("w-full", className)}>
      <div
        className={cx(
          "flex items-center gap-1.5 rounded-full p-1.5 ring-1 transition focus-within:ring-2",
          dark
            ? "bg-white/10 ring-white/15 focus-within:ring-gold-400"
            : "bg-field-background shadow-sm ring-border focus-within:ring-accent",
          error && "ring-2 ring-danger!",
        )}
      >
        <Mail className={cx("ml-2.5 size-4 shrink-0", dark ? "text-cream-50/60" : "text-muted")} aria-hidden />
        <label htmlFor={`nl-${tone}`} className="sr-only">
          {t.common.email}
        </label>
        <input
          id={`nl-${tone}`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setDone(false);
            if (error) setError(null);
          }}
          placeholder={t.newsletter.placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `nl-${tone}-err` : undefined}
          className={cx(
            "min-w-0 flex-1 bg-transparent px-1 py-2 text-sm focus:outline-none",
            dark ? "text-cream-50 placeholder:text-cream-50/50" : "text-ink-900 placeholder:text-ink-400",
          )}
        />
        <Button
          type="submit"
          isPending={pending}
          size="sm"
          className={cx("h-9 shrink-0 rounded-full px-4", dark && "bg-gold-400 text-evergreen-950 hover:bg-gold-300")}
        >
          {done ? <Check className="size-4" /> : null}
          {t.newsletter.button}
        </Button>
      </div>
      {error && (
        <p id={`nl-${tone}-err`} className={cx("mt-2 pl-4 text-xs font-medium", dark ? "text-cranberry-200" : "text-danger")}>
          {error}
        </p>
      )}
    </form>
  );
}
