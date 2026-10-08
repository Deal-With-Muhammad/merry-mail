"use client";

import { Button, Separator, toast } from "@heroui/react";
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, Mail, UserRound } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { demoAccount } from "@/data/demo";
import { images, unsplash } from "@/data/site";
import { useI18n } from "@/i18n/provider";
import { isEmail } from "@/lib/utils";
import { useAuth, useHydrated, useNewsletter } from "@/store";
import { CheckboxField, TextInput } from "../forms/fields";
import { LocaleLink } from "../ui/locale-link";
import { Logo } from "../ui/logo";

function useNext() {
  const params = useSearchParams();
  const next = params.get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-1 min-h-[calc(100dvh-7rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <Image src={unsplash(images.cozyArmchair, 1400)} alt="" fill sizes="50vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-evergreen-950/90 via-evergreen-950/30 to-evergreen-950/10" />
        <div className="absolute top-8 left-8 rounded-2xl bg-cream-50/90 px-4 py-2 backdrop-blur">
          <Logo />
        </div>
        <figure className="absolute right-10 bottom-10 left-10 text-cream-50">
          <blockquote className="font-display text-3xl leading-snug">{t.auth.sideQuote}</blockquote>
          <figcaption className="mt-3 text-sm text-cream-50/75">{t.auth.sideAuthor}</figcaption>
        </figure>
      </div>
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <h1 className="font-display text-4xl font-semibold text-ink-900">{title}</h1>
          <p className="mt-2 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  error,
  description,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  description?: string;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <TextInput
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      description={description}
      type={visible ? "text" : "password"}
      autoComplete={autoComplete}
      prefix={<Lock className="size-4 text-muted" />}
      suffix={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="rounded-full p-1 text-muted hover:text-ink-900"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
    />
  );
}

function SocialButtons() {
  const { t } = useI18n();
  return (
    <>
      <div className="my-6 flex items-center gap-3 text-xs font-semibold text-muted uppercase">
        <Separator className="flex-1" />
        {t.common.or}
        <Separator className="flex-1" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button variant="outline" className="rounded-full" onPress={() => toast.info(t.auth.socialSoon)}>
          <span className="font-bold text-[#4285F4]">G</span> {t.auth.google}
        </Button>
        <Button variant="outline" className="rounded-full" onPress={() => toast.info(t.auth.socialSoon)}>
           {t.auth.apple}
        </Button>
      </div>
    </>
  );
}

export function SignInForm() {
  const { t, fmt, href } = useI18n();
  const router = useRouter();
  const next = useNext();
  const hydrated = useHydrated();
  const user = useAuth((s) => s.user);
  const signIn = useAuth((s) => s.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (hydrated && user && !pending) router.replace(href(next));
  }, [hydrated, user, pending, router, href, next]);

  async function attempt(e: string, p: string) {
    setPending(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 600));
    const result = signIn(e, p);
    if (!result.ok) {
      setPending(false);
      setError(t.auth.invalid);
      return;
    }
    const name = useAuth.getState().user?.name ?? "";
    toast.success(fmt(t.auth.welcome, { name: name.split(" ")[0] }));
    router.push(href(next));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isEmail(email) || !password) {
      setError(t.auth.invalid);
      return;
    }
    void attempt(email, password);
  }

  return (
    <AuthShell title={t.auth.signInTitle} subtitle={t.auth.signInSubtitle}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <TextInput
          label={t.auth.email}
          type="email"
          value={email}
          onChange={(v) => {
            setEmail(v);
            setError(null);
          }}
          autoComplete="email"
          prefix={<Mail className="size-4 text-muted" />}
        />
        <PasswordInput label={t.auth.password} value={password} onChange={(v) => { setPassword(v); setError(null); }} autoComplete="current-password" />
        {error && <p className="rounded-xl bg-danger/8 px-3 py-2 text-sm font-medium text-danger">{error}</p>}
        <div className="flex items-center justify-between gap-3">
          <CheckboxField isSelected={remember} onChange={setRemember}>
            {t.auth.remember}
          </CheckboxField>
          <LocaleLink href="/forgot-password" className="text-sm font-semibold text-cranberry-700 hover:underline">
            {t.auth.forgot}
          </LocaleLink>
        </div>
        <Button type="submit" size="lg" fullWidth className="rounded-full" isPending={pending}>
          {t.auth.submitSignIn}
        </Button>
      </form>

      <div className="mt-4 rounded-2xl border border-dashed border-gold-400 bg-gold-100/60 p-4">
        <p className="text-xs text-gold-700">{fmt(t.auth.demoHint, { email: demoAccount.email })}</p>
        <Button
          size="sm"
          variant="secondary"
          className="mt-2 rounded-full"
          onPress={() => {
            setEmail(demoAccount.email);
            setPassword(demoAccount.password);
            void attempt(demoAccount.email, demoAccount.password);
          }}
        >
          {t.auth.demo}
        </Button>
      </div>

      <SocialButtons />

      <p className="mt-8 text-center text-sm text-muted">
        {t.auth.noAccount}{" "}
        <LocaleLink href={`/signup${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-cranberry-700 hover:underline">
          {t.auth.createOne}
        </LocaleLink>
      </p>
    </AuthShell>
  );
}

export function SignUpForm() {
  const { t, fmt, href } = useI18n();
  const router = useRouter();
  const next = useNext();
  const signUp = useAuth((s) => s.signUp);
  const subscribe = useNewsletter((s) => s.subscribe);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [terms, setTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [exists, setExists] = useState(false);
  const [pending, setPending] = useState(false);

  const set = (key: keyof typeof form) => (v: string) => {
    setForm((f) => ({ ...f, [key]: v }));
    if (key === "email") setExists(false);
  };
  const errors = {
    name: !form.name.trim() ? t.common.required : null,
    email: !isEmail(form.email) ? t.common.invalidEmail : exists ? t.auth.exists : null,
    password: form.password.length < 8 || !/\d/.test(form.password) ? t.auth.passwordShort : null,
    confirm: form.confirm !== form.password || !form.confirm ? t.auth.passwordMismatch : null,
    terms: !terms ? t.auth.termsRequired : null,
  };
  const show = (k: keyof typeof errors) => (submitted || (k === "email" && exists) ? errors[k] : null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    setPending(true);
    await new Promise((r) => setTimeout(r, 700));
    const result = signUp({ name: form.name, email: form.email, password: form.password, newsletter });
    setPending(false);
    if (!result.ok) {
      setExists(true);
      return;
    }
    if (newsletter) subscribe(form.email);
    toast.success(fmt(t.auth.created, { name: form.name.trim().split(" ")[0] }));
    router.push(href(next));
  }

  return (
    <AuthShell title={t.auth.signUpTitle} subtitle={t.auth.signUpSubtitle}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <TextInput label={t.auth.name} value={form.name} onChange={set("name")} error={show("name")} autoComplete="name" prefix={<UserRound className="size-4 text-muted" />} />
        <TextInput label={t.auth.email} type="email" value={form.email} onChange={set("email")} error={show("email")} autoComplete="email" prefix={<Mail className="size-4 text-muted" />} />
        <PasswordInput label={t.auth.password} value={form.password} onChange={set("password")} error={show("password")} description={t.auth.passwordHint} autoComplete="new-password" />
        <PasswordInput label={t.auth.confirmPassword} value={form.confirm} onChange={set("confirm")} error={show("confirm")} autoComplete="new-password" />
        <div className="space-y-2 pt-1">
          <CheckboxField isSelected={terms} onChange={setTerms} error={show("terms")}>
            {t.auth.terms}
          </CheckboxField>
          <CheckboxField isSelected={newsletter} onChange={setNewsletter}>
            {t.auth.newsletter}
          </CheckboxField>
        </div>
        <Button type="submit" size="lg" fullWidth className="rounded-full" isPending={pending}>
          {t.auth.submitSignUp}
        </Button>
      </form>
      <SocialButtons />
      <p className="mt-8 text-center text-sm text-muted">
        {t.auth.haveAccount}{" "}
        <LocaleLink href={`/signin${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-cranberry-700 hover:underline">
          {t.auth.signInLink}
        </LocaleLink>
      </p>
    </AuthShell>
  );
}

export function ForgotForm() {
  const { t, fmt } = useI18n();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) {
      setError(t.common.invalidEmail);
      return;
    }
    setPending(true);
    await new Promise((r) => setTimeout(r, 800));
    setPending(false);
    setSent(true);
    toast.success(fmt(t.auth.linkSent, { email }));
  }

  return (
    <AuthShell title={t.auth.forgotTitle} subtitle={t.auth.forgotText}>
      {sent ? (
        <div className="rounded-2xl bg-evergreen-50 p-5 text-evergreen-800">
          <KeyRound className="size-6" />
          <p className="mt-2 font-semibold">{fmt(t.auth.linkSent, { email })}</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <TextInput
            label={t.auth.email}
            type="email"
            value={email}
            onChange={(v) => {
              setEmail(v);
              setError(null);
            }}
            error={error}
            autoComplete="email"
            prefix={<Mail className="size-4 text-muted" />}
          />
          <Button type="submit" size="lg" fullWidth className="rounded-full" isPending={pending}>
            {t.auth.sendLink}
          </Button>
        </form>
      )}
      <LocaleLink href="/signin" className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-cranberry-700 hover:underline">
        <ArrowLeft className="size-4" /> {t.auth.backToSignIn}
      </LocaleLink>
    </AuthShell>
  );
}
