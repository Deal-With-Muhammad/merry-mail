"use client";

import { useId, type ReactNode } from "react";
import { getDesign, type DesignId } from "@/data/catalog";
import { images, unsplash } from "@/data/site";
import { useI18n } from "@/i18n/provider";
import { fitFontSize, seeded, snowflakePath, splitLines, starPath, treelinePath } from "./svg-utils";

export type CardArtProps = {
  design: DesignId;
  greeting?: string;
  familyName?: string;
  photo?: string;
  /** What to show on photo designs when no photo was uploaded. */
  photoFallback?: "sample" | "placeholder";
  foil?: boolean;
  className?: string;
};

const r2 = (n: number) => Math.round(n * 100) / 100;

const W = 500;
const H = 700;
const GOLD = "#c9a24a";
const CREAM = "#fbf6ec";

const fonts = {
  script: "var(--font-vibes), cursive",
  display: "var(--font-fraunces), Georgia, serif",
  sans: "var(--font-jakarta), system-ui, sans-serif",
  hand: "var(--font-caveat), cursive",
};

type TextBlockProps = {
  lines: string[];
  cx: number;
  cy: number;
  size: number;
  lineHeight?: number;
  fill: string;
  family: string;
  weight?: number;
  italic?: boolean;
  letterSpacing?: number;
  stroke?: string;
  strokeWidth?: number;
};

function TextBlock({
  lines,
  cx,
  cy,
  size,
  lineHeight = 1.05,
  fill,
  family,
  weight = 400,
  italic,
  letterSpacing,
  stroke,
  strokeWidth,
}: TextBlockProps) {
  const total = (lines.length - 1) * size * lineHeight;
  return (
    <text
      textAnchor="middle"
      fill={fill}
      fontFamily={family}
      fontWeight={weight}
      fontStyle={italic ? "italic" : undefined}
      letterSpacing={letterSpacing}
      stroke={stroke}
      strokeWidth={strokeWidth}
      paintOrder="stroke"
      strokeLinejoin="round"
      fontSize={size}
    >
      {lines.map((line, i) => (
        <tspan key={i} x={cx} y={cy - total / 2 + i * size * lineHeight + size * 0.33}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function SmallCaps({ text, cx, y, fill, size = 14, spacing = 4 }: { text: string; cx: number; y: number; fill: string; size?: number; spacing?: number }) {
  return (
    <text
      x={cx}
      y={y}
      textAnchor="middle"
      fill={fill}
      fontFamily={fonts.sans}
      fontWeight={600}
      fontSize={size}
      letterSpacing={spacing}
    >
      {text.toUpperCase()}
    </text>
  );
}

function PhotoSlot({
  id,
  x,
  y,
  w,
  h,
  r = 6,
  photo,
  label,
}: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  photo?: string;
  label: string;
}) {
  return (
    <g>
      <clipPath id={`${id}-clip`}>
        <rect x={x} y={y} width={w} height={h} rx={r} />
      </clipPath>
      {photo ? (
        <image
          href={photo}
          x={x}
          y={y}
          width={w}
          height={h}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${id}-clip)`}
        />
      ) : (
        <g clipPath={`url(#${id}-clip)`}>
          <rect x={x} y={y} width={w} height={h} fill="#ece0c7" />
          <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-ph)`} />
          <g transform={`translate(${x + w / 2} ${y + h / 2 - 16})`} fill="none" stroke="#8d847a" strokeWidth={3}>
            <rect x={-26} y={-18} width={52} height={38} rx={7} />
            <circle cx={0} cy={1} r={10} />
            <path d="M-10 -18 l5 -8 h10 l5 8" />
          </g>
          <text
            x={x + w / 2}
            y={y + h / 2 + 42}
            textAnchor="middle"
            fill="#6b6259"
            fontFamily={fonts.sans}
            fontWeight={600}
            fontSize={17}
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
}

function Defs({ id, children }: { id: string; children?: ReactNode }) {
  return (
    <defs>
      <linearGradient id={`${id}-foil`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8a6a22" />
        <stop offset="0.28" stopColor="#e8d4a2" />
        <stop offset="0.45" stopColor="#c9a24a" />
        <stop offset="0.62" stopColor="#fff3c4" />
        <stop offset="0.8" stopColor="#a8842f" />
        <stop offset="1" stopColor="#e8d4a2" />
      </linearGradient>
      <linearGradient id={`${id}-ph`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f5ecdb" />
        <stop offset="1" stopColor="#e3d6bf" />
      </linearGradient>
      {children}
    </defs>
  );
}

export function CardArt({
  design,
  greeting,
  familyName,
  photo,
  photoFallback = "sample",
  foil,
  className,
}: CardArtProps) {
  const rawId = useId();
  const id = `mm${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const { t, l, fmt } = useI18n();
  const meta = getDesign(design);
  const text = (greeting?.trim() || (meta ? l(meta.greeting) : "Merry Christmas")).slice(0, 48);
  const family = familyName?.trim();
  const fromLine = family ? fmt(t.builder.defaults.from, { family }) : t.builder.defaults.fromGeneric;
  const caption = family ? `${family} · 2026` : t.builder.defaults.caption;
  const gold = foil ? `url(#${id}-foil)` : GOLD;
  const photoSrc = photo ?? (photoFallback === "sample" ? unsplash(images.familyTree, 800) : undefined);
  const photoLabel = t.builder.defaults.photo;

  const svgProps = {
    viewBox: `0 0 ${W} ${H}`,
    preserveAspectRatio: "xMidYMid slice",
    className,
    role: "img" as const,
    "aria-label": `${meta ? l(meta.name) : design} — ${text}`,
  };

  switch (design) {
    case "evergreen": {
      const rand = seeded(11);
      const lines = splitLines(text, 13);
      const size = fitFontSize(lines, 430, 96, 0.42);
      const trees = [
        { x: 72, h: 150 },
        { x: 160, h: 205 },
        { x: 250, h: 255 },
        { x: 340, h: 200 },
        { x: 428, h: 145 },
      ];
      return (
        <svg {...svgProps}>
          <Defs id={id}>
            <radialGradient id={`${id}-glow`} cx="50%" cy="32%" r="65%">
              <stop offset="0" stopColor="#2b7f64" stopOpacity="0.55" />
              <stop offset="1" stopColor="#0e3b2e" stopOpacity="0" />
            </radialGradient>
          </Defs>
          <rect width={W} height={H} fill="#0e3b2e" />
          <rect width={W} height={H} fill={`url(#${id}-glow)`} />
          {Array.from({ length: 46 }, (_, i) => (
            <circle
              key={i}
              cx={rand() * W}
              cy={rand() * 430}
              r={0.8 + rand() * 1.8}
              fill={CREAM}
              opacity={0.25 + rand() * 0.6}
            />
          ))}
          <path d={starPath(250, 96, 20, 8)} fill={gold} />
          <TextBlock lines={lines} cx={250} cy={236} size={size} lineHeight={1} fill={gold} family={fonts.script} />
          <SmallCaps text={fromLine} cx={250} y={236 + (lines.length * size) / 2 + 38} fill={CREAM} size={13} />
          {trees.map(({ x, h }, i) => {
            const base = 640;
            const w = h * 0.62;
            const d = `M${x} ${base - h} L${x + w * 0.27} ${base - h * 0.6} L${x + w * 0.13} ${base - h * 0.6} L${x + w * 0.4} ${base - h * 0.28} L${x + w * 0.22} ${base - h * 0.28} L${x + w * 0.5} ${base} L${x - w * 0.5} ${base} L${x - w * 0.22} ${base - h * 0.28} L${x - w * 0.4} ${base - h * 0.28} L${x - w * 0.13} ${base - h * 0.6} L${x - w * 0.27} ${base - h * 0.6} Z`;
            return (
              <g key={i}>
                <path d={d} fill="#145040" stroke={gold} strokeWidth={2.4} strokeLinejoin="round" />
                {[0.42, 0.66, 0.84].map((p, j) => (
                  <circle key={j} cx={x + (j - 1) * w * 0.14} cy={base - h * (1 - p)} r={3.4} fill={j === 1 ? "#db5d60" : gold} />
                ))}
              </g>
            );
          })}
          <path d="M0 650 Q125 622 250 640 T500 632 L500 700 L0 700 Z" fill="#f5ecdb" />
        </svg>
      );
    }

    case "northern-lights": {
      const rand = seeded(23);
      const lines = splitLines(text, 14);
      const size = fitFontSize(lines, 420, 66, 0.5);
      return (
        <svg {...svgProps}>
          <Defs id={id}>
            <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0b1a3a" />
              <stop offset="0.45" stopColor="#102a52" />
              <stop offset="0.78" stopColor="#0f3a4a" />
              <stop offset="1" stopColor="#0e3b2e" />
            </linearGradient>
            <linearGradient id={`${id}-aur`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#4fd1a5" />
              <stop offset="0.5" stopColor="#2dd4bf" />
              <stop offset="1" stopColor="#a78bfa" />
            </linearGradient>
            <filter id={`${id}-blur`} x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </Defs>
          <rect width={W} height={H} fill={`url(#${id}-sky)`} />
          {Array.from({ length: 80 }, (_, i) => (
            <circle key={i} cx={rand() * W} cy={rand() * 520} r={0.5 + rand() * 1.4} fill="#fff" opacity={0.3 + rand() * 0.7} />
          ))}
          <g filter={`url(#${id}-blur)`} opacity={0.85}>
            <path
              d="M-20 250 C80 170 180 320 280 225 S460 160 540 230 L540 315 C440 255 330 355 230 295 S60 325 -20 335 Z"
              fill={`url(#${id}-aur)`}
            />
            <path d="M-20 170 C120 110 220 215 330 150 S480 100 540 140 L540 185 C430 150 330 235 220 200 S60 195 -20 215 Z" fill="#34d399" opacity={0.6} />
          </g>
          <TextBlock lines={lines} cx={250} cy={395} size={size} fill="#ffffff" family={fonts.display} italic weight={400} />
          <SmallCaps text={fromLine} cx={250} y={395 + (lines.length * size) / 2 + 30} fill="#bfe0d2" size={12} />
          <path d={treelinePath(7, W, 615, 70, 160)} fill="#06221a" />
          <path d="M0 640 Q120 610 260 632 T500 622 L500 700 L0 700 Z" fill="#e9f1f5" />
          <path d="M0 668 Q160 650 300 664 T500 656 L500 700 L0 700 Z" fill="#ffffff" opacity={0.85} />
        </svg>
      );
    }

    case "cranberry-joy": {
      const rand = seeded(5);
      const lines = splitLines(text, 9);
      const size = fitFontSize(lines, 400, 176, 0.55, 36);
      const flakes: ReactNode[] = [];
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 6; col++) {
          const x = 40 + col * 84 + (row % 2) * 40 + (rand() - 0.5) * 20;
          const y = 50 + row * 78 + (rand() - 0.5) * 18;
          if (x > 80 && x < 420 && y > 190 && y < 520) continue;
          flakes.push(
            <path
              key={`${row}-${col}`}
              d={snowflakePath(x, y, 7 + rand() * 9)}
              stroke={CREAM}
              strokeWidth={1.7}
              strokeLinecap="round"
              opacity={0.18 + rand() * 0.3}
            />,
          );
        }
      }
      return (
        <svg {...svgProps}>
          <Defs id={id}>
            <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="60%">
              <stop offset="0" stopColor="#c8373d" />
              <stop offset="1" stopColor="#8a1820" />
            </radialGradient>
          </Defs>
          <rect width={W} height={H} fill={`url(#${id}-glow)`} />
          {flakes}
          <rect x={22} y={22} width={456} height={656} rx={8} fill="none" stroke={CREAM} strokeWidth={2} opacity={0.9} />
          <rect x={32} y={32} width={436} height={636} rx={5} fill="none" stroke={foil ? gold : CREAM} strokeWidth={1} opacity={0.6} />
          <g transform="translate(250 228)">
            <path d="M0 0 C-14 -20 -42 -26 -74 -8 C-48 -2 -24 10 0 0 Z" fill="#1c6650" stroke={CREAM} strokeWidth={1.5} />
            <path d="M0 0 C14 -20 42 -26 74 -8 C48 -2 24 10 0 0 Z" fill="#1c6650" stroke={CREAM} strokeWidth={1.5} />
            <path d="M0 0 C-30 -8 -52 -10 -70 -8 M0 0 C30 -8 52 -10 70 -8" stroke="#0e3b2e" strokeWidth={1.2} fill="none" />
            {[
              [-10, 4],
              [10, 4],
              [0, -8],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r={9} fill="#e8414b" stroke={CREAM} strokeWidth={1.5} />
                <circle cx={x - 3} cy={y - 3} r={2.4} fill="#fff" opacity={0.75} />
              </g>
            ))}
          </g>
          <TextBlock lines={lines} cx={250} cy={372} size={size} lineHeight={0.95} fill={foil ? gold : CREAM} family={fonts.display} italic weight={600} />
          <SmallCaps text={fromLine} cx={250} y={372 + (lines.length * size * 0.95) / 2 + 40} fill={CREAM} size={13} spacing={5} />
        </svg>
      );
    }

    case "family-photo": {
      const lines = splitLines(text, 18);
      const size = fitFontSize(lines, 420, 74, 0.42);
      return (
        <svg {...svgProps}>
          <Defs id={id} />
          <rect width={W} height={H} fill={CREAM} />
          <PhotoSlot id={id} x={46} y={46} w={408} h={440} r={8} photo={photoSrc} label={photoLabel} />
          <rect x={38} y={38} width={424} height={456} rx={13} fill="none" stroke={gold} strokeWidth={2} />
          {/* ribbon bow */}
          <g transform="translate(250 40)">
            <path d="M0 0 C-30 -26 -66 -18 -58 4 C-52 20 -22 14 0 0 Z" fill="#b3262e" />
            <path d="M0 0 C30 -26 66 -18 58 4 C52 20 22 14 0 0 Z" fill="#b3262e" />
            <path d="M-4 4 L-26 46 L-16 42 L-10 52 L2 8 Z" fill="#9b1c24" />
            <path d="M4 4 L26 46 L16 42 L10 52 L-2 8 Z" fill="#9b1c24" />
            <circle r={9} fill="#9b1c24" />
          </g>
          <TextBlock lines={lines} cx={250} cy={570} size={size} lineHeight={1} fill="#9b1c24" family={fonts.script} />
          <SmallCaps text={fromLine} cx={250} y={655} fill="#145040" size={13} spacing={5} />
        </svg>
      );
    }

    case "toronto-snowfall": {
      const rand = seeded(42);
      const lines = splitLines(text, 13);
      const size = fitFontSize(lines, 420, 74, 0.5);
      const buildings: ReactNode[] = [];
      const windows: ReactNode[] = [];
      let x = -6;
      let i = 0;
      while (x < W) {
        const w = 26 + rand() * 30;
        const h = 70 + rand() * 150 * (x > 220 && x < 380 ? 1.25 : 0.85);
        if (!(x > 286 && x < 314)) {
          buildings.push(<rect key={`b${i}`} x={x} y={600 - h} width={w} height={h + 4} fill={i % 3 === 0 ? "#0b1426" : "#101c33"} />);
          for (let wy = 600 - h + 10; wy < 590; wy += 14) {
            for (let wx = x + 5; wx < x + w - 6; wx += 9) {
              if (rand() > 0.62) {
                windows.push(<rect key={`w${i}-${wx}-${wy}`} x={wx} y={wy} width={3.5} height={5} fill="#f2e7cb" opacity={0.5 + rand() * 0.45} />);
              }
            }
          }
        }
        x += w + 2;
        i++;
      }
      return (
        <svg {...svgProps}>
          <Defs id={id}>
            <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0f1d36" />
              <stop offset="0.6" stopColor="#1f3b63" />
              <stop offset="1" stopColor="#3a5884" />
            </linearGradient>
          </Defs>
          <rect width={W} height={H} fill={`url(#${id}-sky)`} />
          <circle cx={402} cy={104} r={74} fill="#f9f3e4" opacity={0.08} />
          <circle cx={402} cy={104} r={38} fill="#f9f3e4" />
          <circle cx={414} cy={96} r={34} fill="#1a3054" opacity={0.18} />
          <TextBlock lines={lines} cx={250} cy={214} size={size} fill="#f9f3e4" family={fonts.display} weight={500} />
          <SmallCaps text={fromLine} cx={250} y={214 + (lines.length * size) / 2 + 32} fill={foil ? gold : "#e8d4a2"} size={12} />
          {buildings}
          {/* CN Tower */}
          <g fill="#0b1426">
            <path d="M291 604 L297.5 330 L302.5 330 L309 604 Z" />
            <ellipse cx={300} cy={330} rx={17} ry={9} />
            <ellipse cx={300} cy={318} rx={11} ry={5} />
            <ellipse cx={300} cy={286} rx={6} ry={4} />
            <rect x={298.6} y={196} width={2.8} height={124} />
          </g>
          <circle cx={300} cy={198} r={2.6} fill="#ef4444" />
          {windows}
          {Array.from({ length: 110 }, (_, k) => (
            <circle key={k} cx={rand() * W} cy={rand() * 640} r={0.8 + rand() * 2.4} fill="#fff" opacity={0.35 + rand() * 0.6} />
          ))}
          <path d="M0 606 Q130 588 260 604 T500 596 L500 700 L0 700 Z" fill="#eef3f8" />
          <path d="M0 646 Q150 628 310 644 T500 638 L500 700 L0 700 Z" fill="#ffffff" />
        </svg>
      );
    }

    case "golden-wreath": {
      const lines = splitLines(text, 9);
      const size = fitFontSize(lines, 230, 124, 0.42, 30);
      const leaves: ReactNode[] = [];
      const cx = 250;
      const cy = 315;
      const R = 152;
      for (const side of [-1, 1]) {
        for (let k = 0; k < 24; k++) {
          const angle = Math.PI / 2 + side * (0.24 + (k / 23) * (Math.PI - 0.36));
          // Round trig output so server and browser render identical attributes
          const lx = r2(cx + R * Math.cos(angle));
          const ly = r2(cy + R * Math.sin(angle));
          const rot = r2((angle * 180) / Math.PI + (k % 2 === 0 ? 35 : -35) * side + 90);
          const off = k % 2 === 0 ? 10 : -10;
          const ex = r2(lx + off * Math.cos(angle));
          const ey = r2(ly + off * Math.sin(angle));
          leaves.push(
            <ellipse
              key={`${side}-${k}`}
              cx={ex}
              cy={ey}
              rx={15}
              ry={5.5}
              transform={`rotate(${rot} ${ex} ${ey})`}
              fill={gold}
              opacity={0.92}
            />,
          );
          if (k % 5 === 2) {
            leaves.push(<circle key={`b${side}-${k}`} cx={lx} cy={ly} r={4.2} fill="#b3262e" />);
          }
        }
      }
      return (
        <svg {...svgProps}>
          <Defs id={id} />
          <rect width={W} height={H} fill="#fffdf8" />
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={gold} strokeWidth={1.4} opacity={0.6} />
          {leaves}
          <g transform={`translate(${cx} ${cy + R + 6})`}>
            <path d="M0 0 C-22 -22 -50 -14 -44 4 C-40 16 -16 12 0 0 Z" fill="#b3262e" />
            <path d="M0 0 C22 -22 50 -14 44 4 C40 16 16 12 0 0 Z" fill="#b3262e" />
            <path d="M-3 3 L-18 40 L-10 36 L-6 44 L2 6 Z" fill="#9b1c24" />
            <path d="M3 3 L18 40 L10 36 L6 44 L-2 6 Z" fill="#9b1c24" />
            <circle r={7} fill="#9b1c24" />
          </g>
          <TextBlock lines={lines} cx={cx} cy={cy - 4} size={size} lineHeight={0.95} fill="#9b1c24" family={fonts.script} />
          <SmallCaps text="Merry Christmas · Joyeux Noël" cx={250} y={560} fill="#6b6259" size={12} spacing={4} />
          <line x1={200} x2={300} y1={585} y2={585} stroke={gold} strokeWidth={1.2} />
          <SmallCaps text={fromLine} cx={250} y={620} fill="#3b352f" size={13} spacing={4} />
        </svg>
      );
    }

    case "gingerbread-lane": {
      const rand = seeded(77);
      const lines = splitLines(text, 13);
      const size = fitFontSize(lines, 420, 76, 0.55);
      const houses = [
        { x: 36, w: 112, h: 128, roof: 74, body: "#a8692f" },
        { x: 178, w: 148, h: 168, roof: 94, body: "#b4743a" },
        { x: 352, w: 112, h: 120, roof: 70, body: "#a8692f" },
      ];
      return (
        <svg {...svgProps}>
          <Defs id={id} />
          <rect width={W} height={H} fill="#f5ecdb" />
          {Array.from({ length: 60 }, (_, k) => (
            <circle
              key={k}
              cx={rand() * W}
              cy={rand() * 380}
              r={2 + rand() * 3}
              fill={k % 3 === 0 ? "#b3262e" : k % 3 === 1 ? "#1c6650" : GOLD}
              opacity={0.18 + rand() * 0.22}
            />
          ))}
          <TextBlock lines={lines} cx={250} cy={196} size={size} fill="#7a4a20" family={fonts.display} weight={700} stroke="#fffdf8" strokeWidth={7} />
          <SmallCaps text={fromLine} cx={250} y={196 + (lines.length * size) / 2 + 38} fill="#b3262e" size={13} spacing={5} />
          {houses.map((h, k) => {
            const top = 604 - h.h;
            const midX = h.x + h.w / 2;
            return (
              <g key={k}>
                <rect x={h.x} y={top} width={h.w} height={h.h} fill={h.body} rx={4} />
                <path d={`M${h.x - 12} ${top + 4} L${midX} ${top - h.roof} L${h.x + h.w + 12} ${top + 4} Z`} fill="#7a4a20" />
                <path
                  d={`M${h.x - 12} ${top + 4} L${midX} ${top - h.roof} L${h.x + h.w + 12} ${top + 4}`}
                  fill="none"
                  stroke="#fffdf8"
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={Array.from({ length: Math.floor(h.w / 16) }, (_, j) => `M${h.x + 4 + j * 16} ${top + 8} q8 12 16 0`).join(" ")}
                  fill="none"
                  stroke="#fffdf8"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
                <rect x={midX - 14} y={604 - 46} width={28} height={46} rx={14} fill="#5a3415" stroke="#fffdf8" strokeWidth={3} />
                {[h.x + 14, h.x + h.w - 40].map((wx, j) => (
                  <g key={j}>
                    <rect x={wx} y={top + 30} width={26} height={26} rx={3} fill="#f6c453" stroke="#fffdf8" strokeWidth={3} />
                    <path d={`M${wx + 13} ${top + 30} v26 M${wx} ${top + 43} h26`} stroke="#fffdf8" strokeWidth={2} />
                  </g>
                ))}
                {[0, 1, 2].map((j) => (
                  <circle key={j} cx={h.x + 18 + j * ((h.w - 36) / 2)} cy={top + h.h - 66} r={5} fill={j === 1 ? "#1c6650" : "#e8414b"} />
                ))}
              </g>
            );
          })}
          {[160, 340].map((cx, k) => (
            <g key={k} strokeLinecap="round" fill="none" strokeWidth={8}>
              <path d={`M${cx} 606 V540 a12 12 0 0 1 24 0`} stroke="#fffdf8" />
              <path d={`M${cx} 606 V540 a12 12 0 0 1 24 0`} stroke="#e8414b" strokeDasharray="7 7" />
            </g>
          ))}
          <path d="M0 600 Q130 584 260 600 T500 594 L500 700 L0 700 Z" fill="#ffffff" />
          <path d="M0 640 Q150 628 320 642 T500 636 L500 700 L0 700 Z" fill="#f3efe7" />
        </svg>
      );
    }

    case "polaroid-garland": {
      const rand = seeded(91);
      const lines = splitLines(text, 18);
      const size = fitFontSize(lines, 430, 66, 0.42);
      const bulbColors = ["#f59e0b", "#ef4444", "#22c55e", "#60a5fa", "#facc15", "#f472b6"];
      const p0 = { x: -10, y: 86 };
      const p1 = { x: 250, y: 200 };
      const p2 = { x: 510, y: 76 };
      const bez = (tt: number) => ({
        x: (1 - tt) ** 2 * p0.x + 2 * (1 - tt) * tt * p1.x + tt ** 2 * p2.x,
        y: (1 - tt) ** 2 * p0.y + 2 * (1 - tt) * tt * p1.y + tt ** 2 * p2.y,
      });
      return (
        <svg {...svgProps}>
          <Defs id={id}>
            <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="10" stdDeviation="10" floodOpacity="0.35" />
            </filter>
          </Defs>
          <rect width={W} height={H} fill="#0e3b2e" />
          {Array.from({ length: 70 }, (_, k) => (
            <circle key={k} cx={rand() * W} cy={rand() * H} r={0.8 + rand() * 2} fill="#fff" opacity={0.15 + rand() * 0.4} />
          ))}
          <path d={`M${p0.x} ${p0.y} Q${p1.x} ${p1.y} ${p2.x} ${p2.y}`} stroke={gold} strokeWidth={2.2} fill="none" />
          {Array.from({ length: 9 }, (_, k) => {
            const pt = bez(0.06 + k * 0.11);
            const color = bulbColors[k % bulbColors.length];
            return (
              <g key={k} transform={`translate(${pt.x} ${pt.y})`}>
                <circle cy={16} r={16} fill={color} opacity={0.22} />
                <rect x={-4} y={-2} width={8} height={8} rx={1.5} fill="#3b352f" />
                <ellipse cy={15} rx={6.5} ry={10} fill={color} />
                <ellipse cx={-2} cy={11} rx={1.8} ry={3.5} fill="#fff" opacity={0.6} />
              </g>
            );
          })}
          <g transform="rotate(-4 250 330)" filter={`url(#${id}-shadow)`}>
            <rect x={112} y={176} width={276} height={316} rx={4} fill="#fffdf8" />
            <PhotoSlot id={id} x={128} y={192} w={244} h={226} r={2} photo={photoSrc} label={photoLabel} />
            <text x={250} y={462} textAnchor="middle" fontFamily={fonts.hand} fontSize={30} fill="#3b352f">
              {caption}
            </text>
          </g>
          <rect x={243} y={150} width={14} height={34} rx={3} fill="#d9bf98" stroke="#8a6a22" strokeWidth={1} transform="rotate(-4 250 167)" />
          <TextBlock lines={lines} cx={250} cy={574} size={size} lineHeight={1} fill={foil ? gold : CREAM} family={fonts.script} />
          <SmallCaps text={fromLine} cx={250} y={648} fill={GOLD} size={12} spacing={4} />
        </svg>
      );
    }
  }
}
