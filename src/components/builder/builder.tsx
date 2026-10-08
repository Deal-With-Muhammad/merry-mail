"use client";

import { Button, Skeleton, toast } from "@heroui/react";
import { ArrowLeft, ArrowRight, BookOpen, Check, CloudCheck, FlipHorizontal, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { formats, getDesign, type DesignId } from "@/data/catalog";
import { useI18n } from "@/i18n/provider";
import { cx } from "@/lib/utils";
import { defaultConfig, useAddressBook, useAuth, useBuilder, useCart, useHydrated } from "@/store";
import { Card3D } from "../cards/card-3d";
import { PriceSummary } from "./price-summary";
import { StepDesign } from "./step-design";
import { StepPaper } from "./step-paper";
import { StepPersonalize, type PreviewFace } from "./step-personalize";
import { StepRecipients } from "./step-recipients";
import { StepReview } from "./step-review";
import { stepValidity } from "./validation";

function Stepper({
  steps,
  current,
  valid,
  visited,
  onSelect,
}: {
  steps: string[];
  current: number;
  valid: boolean[];
  visited: Set<number>;
  onSelect: (i: number) => void;
}) {
  return (
    <ol className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      {steps.map((label, i) => {
        const active = i === current;
        const complete = visited.has(i) && valid[i] && i !== current && i < 4;
        const problem = visited.has(i) && !valid[i] && i !== current && i < 4;
        return (
          <li key={label} className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={active ? "step" : undefined}
              className={cx(
                "flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-1.5 text-sm font-semibold transition",
                active ? "bg-evergreen-800 text-cream-50 shadow-md" : "text-ink-700 hover:bg-cream-200",
              )}
            >
              <span
                className={cx(
                  "flex size-7 items-center justify-center rounded-full text-xs font-bold",
                  active
                    ? "bg-cream-50 text-evergreen-900"
                    : complete
                      ? "bg-evergreen-100 text-evergreen-700"
                      : problem
                        ? "bg-danger/10 text-danger"
                        : "bg-cream-200 text-ink-500",
                )}
              >
                {complete ? <Check className="size-4" /> : problem ? "!" : i + 1}
              </span>
              {label}
            </button>
            {i < steps.length - 1 && <span aria-hidden className="mx-1 h-px w-4 bg-border sm:w-6" />}
          </li>
        );
      })}
    </ol>
  );
}

export function Builder() {
  const { t, l, fmt, href } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const hydrated = useHydrated();
  const draft = useBuilder((s) => s.draft);
  const step = useBuilder((s) => s.step);
  const setStep = useBuilder((s) => s.setStep);
  const editingId = useBuilder((s) => s.editingId);
  const user = useAuth((s) => s.user);
  const [face, setFace] = useState<PreviewFace>("front");
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  const [manualFlip, setManualFlip] = useState<boolean | null>(null);
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [attempted, setAttempted] = useState<Set<number>>(new Set());
  const [saveToBook, setSaveToBook] = useState(true);
  const [pending, setPending] = useState(false);
  const [direction, setDirection] = useState(1);
  const applied = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

  const valid = useMemo(() => stepValidity(draft), [draft]);
  const design = getDesign(draft.design);

  // Apply ?design= / ?format= / ?edit= once the persisted draft has loaded
  useEffect(() => {
    if (!hydrated || applied.current) return;
    applied.current = true;
    const d = params.get("design");
    const f = params.get("format");
    const e = params.get("edit");
    const { start, update, edit } = useBuilder.getState();
    if (e) {
      const item = useCart.getState().items.find((i) => i.id === e);
      if (item) edit(item);
    } else if (d && getDesign(d)) {
      start(d as DesignId);
    }
    if (f === "postcard" || f === "folded") update({ format: f });
    if (d || f || e) router.replace(href("/create"), { scroll: false });
  }, [hydrated, params, router, href]);

  const isFolded = draft.format === "folded";
  const autoInside = face === "inside";
  const open = isFolded && (manualOpen ?? (autoInside && manualFlip !== true));
  const flipped = manualFlip ?? (!isFolded && autoInside);
  const previewRecipient = draft.recipients.find((r) => r.name) ?? draft.recipients[0];

  function goTo(next: number) {
    // Reset manual preview overrides when the step changes
    setManualOpen(null);
    setManualFlip(null);
    setFace("front");
    setDirection(next > step ? 1 : -1);
    setVisited((v) => new Set(v).add(next).add(step));
    setStep(next);
    const top = topRef.current?.getBoundingClientRect().top ?? 0;
    if (window.innerWidth < 1024 || top < -40) topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function nextStep() {
    if (!valid[step]) {
      setAttempted((a) => new Set(a).add(step));
      toast.warning(step === 1 ? t.builder.photoRequired : t.builder.incomplete);
      return;
    }
    goTo(Math.min(4, step + 1));
  }

  async function submit() {
    if (!valid[4]) {
      setAttempted(new Set([1, 3]));
      return;
    }
    setPending(true);
    await new Promise((r) => setTimeout(r, 550));
    const cart = useCart.getState();
    if (editingId && cart.items.some((i) => i.id === editingId)) cart.replace(editingId, draft);
    else cart.add(draft);
    if (saveToBook && user && draft.delivery === "mail") {
      useAddressBook.getState().saveMany(user.email, draft.recipients);
    }
    toast.success(editingId ? t.builder.updated : t.builder.added, {
      actionProps: { children: t.builder.viewCart, onPress: () => router.push(href("/cart")), variant: "tertiary" },
    });
    // Keep the personal touches so the next design is quicker to make
    useBuilder.setState({
      draft: {
        ...defaultConfig(draft.design),
        familyName: draft.familyName,
        signature: draft.signature,
        message: draft.message,
        fontStyle: draft.fontStyle,
        photo: draft.photo,
      },
      step: 0,
      editingId: null,
    });
    setPending(false);
    router.push(href("/cart"));
  }

  if (!hydrated) {
    return (
      <div className="container-site grid grid-cols-1 gap-10 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Skeleton className="h-[34rem] rounded-[2rem]" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3 rounded-full" />
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-72 rounded-3xl" />
        </div>
      </div>
    );
  }

  const steps = [
    <StepDesign key="design" />,
    <StepPersonalize key="personalize" onFace={setFace} showErrors={attempted.has(1)} />,
    <StepPaper key="paper" />,
    <StepRecipients key="recipients" showErrors={attempted.has(3)} saveToBook={saveToBook} onSaveToBook={setSaveToBook} />,
    <StepReview
      key="review"
      valid={valid}
      onEdit={(i) => {
        setAttempted((a) => new Set(a).add(i));
        goTo(i);
      }}
      onSubmit={submit}
      pending={pending}
    />,
  ];

  return (
    <div className="container-site py-8 sm:py-10" ref={topRef}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {editingId && (
            <span className="mb-2 inline-block rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">{t.builder.editing}</span>
          )}
          <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">{t.builder.title}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <CloudCheck className="size-4 text-evergreen-600" /> {t.builder.subtitle}
          </p>
        </div>
        <Stepper steps={t.builder.steps} current={step} valid={valid} visited={visited} onSelect={goTo} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
        {/* Live preview */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div
            className="relative flex flex-col items-center overflow-hidden rounded-[2rem] px-4 pt-8 pb-6 ring-1 ring-border sm:pt-12"
            style={{
              background: `radial-gradient(80% 60% at 50% 15%, ${design?.swatch[1] ?? "#c9a24a"}33, transparent 70%), linear-gradient(170deg, ${design?.swatch[0] ?? "#0e3b2e"}1a, #fbf6ec 65%)`,
            }}
          >
            <p className="mb-6 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-ink-700 backdrop-blur">
              {design ? l(design.name) : ""} · {l(formats[draft.format].name)}
            </p>
            <div className={cx("transition-all duration-700", open ? "w-[42%] sm:w-[40%]" : "w-[56%] sm:w-[52%]")}>
              <Card3D
                design={draft.design}
                format={draft.format}
                paper={draft.paper}
                foil={draft.finish === "foil"}
                greeting={draft.greeting}
                familyName={draft.familyName}
                message={draft.message}
                signature={draft.signature}
                fontStyle={draft.fontStyle}
                photo={draft.photo}
                photoFallback="placeholder"
                includePhoto={draft.includePhoto}
                recipient={previewRecipient}
                open={open}
                flipped={flipped}
                onToggleOpen={() => setManualOpen(!open)}
              />
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-2">
              {isFolded && (
                <Button size="sm" variant="secondary" className="rounded-full bg-white/80" onPress={() => { setManualFlip(false); setManualOpen(!open); }}>
                  <BookOpen className="size-4" />
                  {open ? t.builder.preview.close : t.builder.preview.open}
                </Button>
              )}
              <Button size="sm" variant="secondary" className="rounded-full bg-white/80" onPress={() => { setManualOpen(false); setManualFlip(!flipped); }}>
                <FlipHorizontal className="size-4" />
                {flipped ? t.builder.preview.front : t.builder.preview.flip}
              </Button>
              {(manualOpen !== null || manualFlip !== null || face === "inside") && (
                <Button
                  size="sm"
                  isIconOnly
                  variant="ghost"
                  aria-label={t.builder.preview.front}
                  className="rounded-full"
                  onPress={() => {
                    setFace("front");
                    setManualOpen(false);
                    setManualFlip(false);
                  }}
                >
                  <RotateCcw className="size-4" />
                </Button>
              )}
            </div>
          </div>
          <PriceSummary config={draft} className="mt-5 hidden lg:block" />
        </aside>

        {/* Steps */}
        <section aria-live="polite">
          <p className="mb-4 text-xs font-bold tracking-[0.14em] text-muted uppercase">
            {fmt(t.builder.stepOf, { n: step + 1, total: 5 })}
          </p>
          <div className="relative">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction * 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -28 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {steps[step]}
              </motion.div>
            </AnimatePresence>
          </div>

          {step < 4 && (
            <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-6">
              <Button variant="ghost" className="rounded-full" isDisabled={step === 0} onPress={() => goTo(step - 1)}>
                <ArrowLeft className="size-4" />
                {t.common.back}
              </Button>
              <Button size="lg" className="rounded-full px-7" onPress={nextStep}>
                {step === 3 ? t.builder.steps[4] : t.common.next}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
          {step === 4 && (
            <Button variant="ghost" className="mt-4 rounded-full" onPress={() => goTo(3)}>
              <ArrowLeft className="size-4" />
              {t.common.back}
            </Button>
          )}
          <PriceSummary config={draft} className="mt-8 lg:hidden" />
        </section>
      </div>
    </div>
  );
}
