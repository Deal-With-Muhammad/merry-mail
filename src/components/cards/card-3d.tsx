"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { DesignId, FontStyleId, FormatId, PaperId } from "@/data/catalog";
import { getDesign } from "@/data/catalog";
import { useI18n } from "@/i18n/provider";
import type { Address } from "@/lib/types";
import { cx } from "@/lib/utils";
import { CardArt } from "./card-art";

export type Card3DProps = {
  design: DesignId;
  format?: FormatId;
  paper?: PaperId;
  foil?: boolean;
  greeting?: string;
  familyName?: string;
  message?: string;
  signature?: string;
  fontStyle?: FontStyleId;
  photo?: string;
  photoFallback?: "sample" | "placeholder";
  includePhoto?: boolean;
  recipient?: Address;
  open?: boolean;
  flipped?: boolean;
  onToggleOpen?: () => void;
  /** Tilt the card with the pointer. */
  interactive?: boolean;
  /** Gentle idle bobbing. */
  float?: boolean;
  className?: string;
};

const fontClass: Record<FontStyleId, string> = {
  script: "font-script text-[6.4cqw] leading-[1.15]",
  hand: "font-hand text-[5.6cqw] leading-[1.2]",
  serif: "font-display italic text-[4.3cqw] leading-[1.45]",
};

function Face({ children, style, className }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return (
    <div
      className={cx(
        "absolute inset-0 overflow-hidden rounded-[1.6cqw] backface-hidden",
        "shadow-[0_0_0_0.5px_rgba(60,40,20,0.18)]",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

function PaperOverlay({ paper, sheen }: { paper: PaperId; sheen: ReturnType<typeof useMotionTemplate> }) {
  return (
    <>
      {paper !== "classic" && (
        <div
          className={cx("paper-grain pointer-events-none absolute inset-0 mix-blend-multiply", paper === "kraft" ? "opacity-100" : "opacity-60")}
        />
      )}
      {paper === "kraft" && (
        <div className="pointer-events-none absolute inset-0 bg-[#c49a64] opacity-40 mix-blend-multiply" />
      )}
      {paper === "pearl" && (
        <motion.div
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            backgroundImage:
              "linear-gradient(115deg, transparent 25%, rgba(255,230,250,0.38) 40%, rgba(210,255,248,0.34) 52%, rgba(255,246,214,0.3) 60%, transparent 75%)",
            backgroundSize: "250% 250%",
            backgroundPosition: sheen,
          }}
        />
      )}
    </>
  );
}

export function Card3D({
  design,
  format = "folded",
  paper = "premium",
  foil,
  greeting,
  familyName,
  message,
  signature,
  fontStyle = "script",
  photo,
  photoFallback = "sample",
  includePhoto,
  recipient,
  open = false,
  flipped = false,
  onToggleOpen,
  interactive = true,
  float = false,
  className,
}: Card3DProps) {
  const { t, fmt } = useI18n();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const meta = getDesign(design);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springCfg = { stiffness: 140, damping: 18, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-18, 18]), springCfg);
  const rotateX = useSpring(useTransform(py, [0, 1], [12, -12]), springCfg);
  const glareX = useTransform(px, [0, 1], [10, 90]);
  const glareY = useTransform(py, [0, 1], [5, 95]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.32), rgba(255,255,255,0) 55%)`;
  const sheen = useMotionTemplate`${glareX}% ${glareY}%`;

  const isFolded = format === "folded";
  const family = familyName?.trim();
  const bodyText = message?.trim() || t.builder.defaults.message;
  const signOff =
    signature?.trim() || (family ? fmt(t.builder.defaults.signature, { family }) : t.builder.defaults.signatureGeneric);
  const showInnerPhoto = includePhoto && !meta?.photo;
  const innerPhoto = photo;

  function onPointerMove(e: React.PointerEvent) {
    if (!interactive || reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
    py.set(Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)));
  }
  function onPointerLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  const front = (
    <Face style={{ transform: "translateZ(1.5px)" }} className="bg-white">
      <CardArt
        design={design}
        greeting={greeting}
        familyName={familyName}
        photo={photo}
        photoFallback={photoFallback}
        foil={foil}
        className="h-full w-full"
      />
      <PaperOverlay paper={paper} sheen={sheen} />
      <motion.div className="pointer-events-none absolute inset-0" style={{ backgroundImage: glare }} />
    </Face>
  );

  const message_ = (
    <div className="flex h-full flex-col items-center justify-center gap-[3cqw] px-[9cqw] text-center text-ink-900">
      <svg viewBox="0 0 40 20" className="w-[12cqw] text-gold-500" aria-hidden>
        <path d="M20 2 L22 8 L28 8 L23 12 L25 18 L20 14 L15 18 L17 12 L12 8 L18 8 Z" fill="currentColor" />
        <path d="M2 10 H10 M30 10 H38" stroke="currentColor" strokeWidth="1" />
      </svg>
      <p className={cx(fontClass[fontStyle], "line-clamp-[9] whitespace-pre-line")}>{bodyText}</p>
      <p className={cx(fontClass[fontStyle], "text-cranberry-700")}>{signOff}</p>
      {recipient?.note && (
        <p className="font-hand text-[4.2cqw] leading-tight text-evergreen-700">“{recipient.note}”</p>
      )}
    </div>
  );

  const insideLeft = (
    <Face style={{ transform: "rotateY(180deg) translateZ(-0.5px)" }} className="bg-cream-50">
      {showInnerPhoto && innerPhoto ? (
        <div className="flex h-full items-center justify-center p-[8cqw]">
          <div className="w-full rotate-[-2deg] bg-white p-[3cqw] pb-[10cqw] shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={innerPhoto} alt="" className="aspect-square w-full object-cover" />
            <p className="mt-[2cqw] text-center font-hand text-[5cqw] text-ink-700">{family ? `${family} · 2026` : t.builder.defaults.caption}</p>
          </div>
        </div>
      ) : (
        <div
          className="flex h-full items-center justify-center"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${meta?.swatch[0] ?? "#0e3b2e"}14, transparent 60%), radial-gradient(circle at 80% 90%, ${meta?.swatch[1] ?? "#c9a24a"}22, transparent 55%)`,
          }}
        >
          <span className="font-display text-[7cqw] font-semibold tracking-tight text-ink-900 opacity-15">Merry Mail</span>
        </div>
      )}
      <PaperOverlay paper={paper} sheen={sheen} />
    </Face>
  );

  const insideRight = (
    <Face style={{ transform: "translateZ(-0.5px)" }} className="bg-cream-50">
      {message_}
      <PaperOverlay paper={paper} sheen={sheen} />
    </Face>
  );

  const backCover = (
    <Face style={{ transform: "rotateY(180deg) translateZ(1.5px)" }} className="bg-cream-50">
      <div className="flex h-full flex-col items-center justify-end gap-[1.5cqw] pb-[10cqw] text-ink-500">
        <p className="font-display text-[4.4cqw] font-semibold tracking-tight text-ink-700">Merry Mail</p>
        <p className="text-[2.4cqw] tracking-[0.2em] uppercase">{t.builder.defaults.returnLine}</p>
        <p className="text-[2.1cqw] text-ink-400">FSC® · merrymail.ca</p>
      </div>
      <PaperOverlay paper={paper} sheen={sheen} />
    </Face>
  );

  const postcardBack = (
    <Face style={{ transform: "rotateY(180deg) translateZ(1.5px)" }} className="bg-cream-50">
      <div className="grid h-full grid-cols-1 grid-rows-[1fr_auto] p-[6cqw]">
        <div className="flex min-h-0 flex-col gap-[3cqw] overflow-hidden">
          <div className="flex items-start justify-between gap-[3cqw]">
            <div className="min-w-0 flex-1">
              <p className={cx(fontClass[fontStyle], "line-clamp-[6] text-[5cqw]! text-ink-900")}>{bodyText}</p>
              <p className={cx(fontClass[fontStyle], "mt-[2cqw] text-[5cqw]! text-cranberry-700")}>{signOff}</p>
            </div>
            <div className="relative shrink-0">
              <div className="flex h-[22cqw] w-[18cqw] flex-col items-center justify-center rounded-[0.8cqw] border-[0.8cqw] border-dashed border-white bg-cranberry-700 text-cream-50 shadow-sm">
                <span className="text-[6cqw] leading-none">❄</span>
                <span className="mt-[1cqw] text-[2.2cqw] font-bold tracking-widest">CANADA</span>
              </div>
              <div className="absolute -bottom-[3cqw] -left-[8cqw] h-[13cqw] w-[13cqw] rounded-full border-[0.5cqw] border-ink-500/50 text-center text-[1.8cqw] leading-[13cqw] font-semibold tracking-wider text-ink-500/60">
                ONTARIO
              </div>
            </div>
          </div>
          {showInnerPhoto && innerPhoto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={innerPhoto} alt="" className="h-[24cqw] w-[32cqw] rotate-[-2deg] rounded-sm object-cover shadow" />
          )}
        </div>
        <div className="mt-[3cqw] border-t border-ink-400/40 pt-[3cqw]">
          <p className="text-[2.4cqw] font-semibold tracking-[0.25em] text-ink-400 uppercase">{t.builder.defaults.to}</p>
          <div className="mt-[1.5cqw] space-y-[1.2cqw] font-hand text-[5cqw] leading-tight text-ink-900">
            {recipient?.name ? (
              <>
                <p className="border-b border-ink-400/30">{recipient.name}</p>
                <p className="border-b border-ink-400/30">
                  {recipient.line1}
                  {recipient.line2 ? `, ${recipient.line2}` : ""}
                </p>
                <p className="border-b border-ink-400/30">
                  {recipient.city}, ON {recipient.postal}
                </p>
              </>
            ) : (
              [0, 1, 2].map((i) => <p key={i} className="h-[6cqw] border-b border-ink-400/30" />)
            )}
          </div>
          <p className="mt-[2.5cqw] text-center text-[2cqw] tracking-[0.2em] text-ink-400 uppercase">
            {t.builder.defaults.returnLine}
          </p>
        </div>
      </div>
      <PaperOverlay paper={paper} sheen={sheen} />
    </Face>
  );

  const spring = reduceMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 70, damping: 16, mass: 0.9 };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cx("relative touch-pan-y select-none perspective-[2000px]", className)}
    >
      <div className={cx(float && !reduceMotion && "animate-float")}>
        <motion.div style={{ rotateX, rotateY }} className="relative transform-3d">
          <motion.div
            className="@container relative aspect-[5/7] w-full transform-3d"
            animate={{ x: isFolded && open && !flipped ? "50%" : "0%", rotateY: flipped ? 180 : 0 }}
            transition={spring}
          >
            {isFolded ? (
              <>
                {insideRight}
                {backCover}
                <motion.div
                  className="absolute inset-0 origin-left transform-3d"
                  animate={{ rotateY: open && !flipped ? -178 : 0 }}
                  transition={spring}
                  onClick={onToggleOpen}
                  style={{ cursor: onToggleOpen ? "pointer" : undefined }}
                >
                  {front}
                  {insideLeft}
                </motion.div>
              </>
            ) : (
              <>
                {front}
                {postcardBack}
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
      {/* contact shadow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-[7%] left-1/2 h-[7%] rounded-[50%] bg-ink-900/25 blur-xl"
        style={{ x: "-50%" }}
        animate={{ width: isFolded && open && !flipped ? "190%" : "92%" }}
        transition={spring}
      />
    </div>
  );
}
