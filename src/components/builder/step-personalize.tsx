"use client";

import { Button, Spinner, Switch } from "@heroui/react";
import { ImagePlus, Lightbulb, Trash2, Upload } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { getDesign, type FontStyleId } from "@/data/catalog";
import { useI18n } from "@/i18n/provider";
import { cx, downscaleImage } from "@/lib/utils";
import { useBuilder } from "@/store";
import { TextAreaInput, TextInput } from "../forms/fields";
import { StepHeading } from "./step-design";

export type PreviewFace = "front" | "inside";

function PhotoUpload({ required, showError }: { required: boolean; showError: boolean }) {
  const { t } = useI18n();
  const photo = useBuilder((s) => s.draft.photo);
  const update = useBuilder((s) => s.update);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(t.builder.photoError);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      update({ photo: await downscaleImage(file) });
    } catch {
      setError(t.builder.photoError);
    } finally {
      setBusy(false);
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    void handle(e.dataTransfer.files?.[0]);
  }

  const missing = required && !photo && showError;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink-900">{t.builder.photo}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        aria-label={t.builder.upload}
        onChange={(e) => {
          void handle(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {photo ? (
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" className="size-20 rounded-xl object-cover shadow" />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" className="rounded-full" onPress={() => inputRef.current?.click()}>
              <Upload className="size-4" />
              {t.builder.replace}
            </Button>
            <Button size="sm" variant="ghost" className="rounded-full text-danger" onPress={() => update({ photo: undefined })}>
              <Trash2 className="size-4" />
              {t.builder.removePhoto}
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cx(
            "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition",
            dragging ? "border-cranberry-500 bg-cranberry-50" : missing ? "border-danger bg-danger/5" : "border-gold-300 bg-gold-100/40 hover:border-gold-500",
          )}
        >
          {busy ? (
            <Spinner size="md" />
          ) : (
            <span className="flex size-12 items-center justify-center rounded-2xl bg-cream-50 text-cranberry-700 shadow-sm">
              <ImagePlus className="size-6" />
            </span>
          )}
          <span className="font-semibold text-ink-900">{t.builder.upload}</span>
          <span className="text-xs text-muted">{t.builder.dropHint}</span>
        </button>
      )}
      <p className={cx("mt-2 text-xs", missing || error ? "font-medium text-danger" : "text-muted")}>
        {error ?? (missing ? t.builder.photoRequired : t.builder.photoHelp)}
      </p>
    </div>
  );
}

export function StepPersonalize({ onFace, showErrors }: { onFace: (face: PreviewFace) => void; showErrors: boolean }) {
  const { t, l, fmt } = useI18n();
  const draft = useBuilder((s) => s.draft);
  const update = useBuilder((s) => s.update);
  const design = getDesign(draft.design);
  const designNeedsPhoto = !!design?.photo;
  const fonts: { id: FontStyleId; className: string }[] = [
    { id: "script", className: "font-script text-2xl" },
    { id: "hand", className: "font-hand text-2xl" },
    { id: "serif", className: "font-display italic text-lg" },
  ];

  return (
    <div className="space-y-7">
      <StepHeading title={t.builder.personalizeTitle} />

      {designNeedsPhoto ? (
        <div onFocus={() => onFace("front")}>
          <PhotoUpload required showError={showErrors} />
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-4" onFocus={() => onFace("inside")}>
          <Switch isSelected={draft.includePhoto} onChange={(v) => { update({ includePhoto: v }); onFace("inside"); }}>
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <span className="flex flex-col">
                <span className="font-semibold text-ink-900">
                  {draft.format === "folded" ? t.builder.includePhoto : t.builder.includePhotoPostcard}
                </span>
                <span className="text-xs text-muted">{t.builder.includePhotoHelp}</span>
              </span>
            </Switch.Content>
          </Switch>
          {draft.includePhoto && (
            <div className="mt-4">
              <PhotoUpload required showError={showErrors} />
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" onFocus={() => onFace("front")}>
        <TextInput
          label={t.builder.greeting}
          value={draft.greeting}
          onChange={(v) => update({ greeting: v })}
          placeholder={design ? l(design.greeting) : ""}
          description={fmt(t.builder.greetingHelp, { greeting: design ? l(design.greeting) : "" })}
          maxLength={40}
        />
        <TextInput
          label={t.builder.familyName}
          value={draft.familyName}
          onChange={(v) => update({ familyName: v })}
          placeholder={t.builder.familyPlaceholder}
          maxLength={32}
        />
      </div>

      <div onFocus={() => onFace("inside")} className="space-y-3">
        <TextAreaInput
          label={t.builder.message}
          value={draft.message}
          onChange={(v) => update({ message: v })}
          placeholder={t.builder.messagePlaceholder}
          rows={4}
          maxLength={320}
          description={`${draft.message.length}/320`}
        />
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted">
            <Lightbulb className="size-3.5 text-gold-600" /> {t.builder.suggestions}
          </p>
          <div className="flex flex-col gap-2">
            {t.builder.suggestionList.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  update({ message: s });
                  onFace("inside");
                }}
                className="rounded-xl border border-border bg-surface px-3 py-2 text-left text-xs leading-relaxed text-ink-700 transition hover:border-gold-400 hover:bg-gold-100/50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <TextInput
          label={t.builder.signature}
          value={draft.signature}
          onChange={(v) => update({ signature: v })}
          placeholder={
            draft.familyName.trim()
              ? fmt(t.builder.defaults.signature, { family: draft.familyName.trim() })
              : t.builder.signaturePlaceholder
          }
          maxLength={60}
        />
        <div>
          <p className="mb-2 text-sm font-medium text-ink-900">{t.builder.fontStyle}</p>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={t.builder.fontStyle}>
            {fonts.map((f) => (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={draft.fontStyle === f.id}
                onClick={() => {
                  update({ fontStyle: f.id });
                  onFace("inside");
                }}
                className={cx(
                  "flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 transition",
                  draft.fontStyle === f.id ? "border-evergreen-800 bg-evergreen-50 ring-1 ring-evergreen-800" : "border-border bg-surface hover:border-ink-400",
                )}
              >
                <span className={cx(f.className, "leading-tight text-ink-900")}>Joy</span>
                <span className="text-[11px] font-semibold text-muted">{t.builder.fonts[f.id]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
