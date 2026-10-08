/** Deterministic PRNG so decorative SVG elements render identically on server and client. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function starPath(cx: number, cy: number, outer: number, inner: number, points = 5) {
  const step = Math.PI / points;
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = i * step - Math.PI / 2;
    d += `${i === 0 ? "M" : "L"}${(cx + r * Math.cos(angle)).toFixed(2)} ${(cy + r * Math.sin(angle)).toFixed(2)} `;
  }
  return `${d}Z`;
}

/** Split a greeting into at most `maxLines` balanced lines. */
export function splitLines(text: string, maxChars: number, maxLines = 2) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [""];
  if (text.length <= maxChars || words.length === 1) return [text.trim()];
  const lines: string[] = [];
  let current = "";
  const target = Math.ceil(text.length / Math.min(maxLines, Math.ceil(text.length / maxChars)));
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > target && current && lines.length < maxLines - 1) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  lines.push(current);
  return lines;
}

/** Pick a font size so the longest line fits `width` (approximate glyph width ratio). */
export function fitFontSize(lines: string[], width: number, base: number, ratio: number, min = 18) {
  const longest = Math.max(...lines.map((l) => l.length), 1);
  return Math.max(min, Math.min(base, width / (longest * ratio)));
}

/** Simple six-armed snowflake made of strokes. */
export function snowflakePath(cx: number, cy: number, r: number) {
  let d = "";
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    d += `M${cx} ${cy} L${x.toFixed(1)} ${y.toFixed(1)} `;
    // little branches
    const bx = cx + r * 0.55 * Math.cos(a);
    const by = cy + r * 0.55 * Math.sin(a);
    for (const s of [-1, 1]) {
      const ba = a + s * 0.7;
      d += `M${bx.toFixed(1)} ${by.toFixed(1)} L${(bx + r * 0.32 * Math.cos(ba)).toFixed(1)} ${(by + r * 0.32 * Math.sin(ba)).toFixed(1)} `;
    }
  }
  return d;
}

/** Jagged treeline silhouette spanning the full width. */
export function treelinePath(seed: number, width: number, baseY: number, minH: number, maxH: number) {
  const rand = seeded(seed);
  let d = `M0 ${baseY + 40} L0 ${baseY} `;
  let x = 0;
  while (x < width) {
    const w = 18 + rand() * 26;
    const h = minH + rand() * (maxH - minH);
    // three-tier pine
    d += `L${(x + w * 0.1).toFixed(1)} ${baseY} `;
    d += `L${(x + w * 0.32).toFixed(1)} ${(baseY - h * 0.35).toFixed(1)} L${(x + w * 0.22).toFixed(1)} ${(baseY - h * 0.35).toFixed(1)} `;
    d += `L${(x + w * 0.4).toFixed(1)} ${(baseY - h * 0.7).toFixed(1)} L${(x + w * 0.32).toFixed(1)} ${(baseY - h * 0.7).toFixed(1)} `;
    d += `L${(x + w * 0.5).toFixed(1)} ${(baseY - h).toFixed(1)} `;
    d += `L${(x + w * 0.68).toFixed(1)} ${(baseY - h * 0.7).toFixed(1)} L${(x + w * 0.6).toFixed(1)} ${(baseY - h * 0.7).toFixed(1)} `;
    d += `L${(x + w * 0.78).toFixed(1)} ${(baseY - h * 0.35).toFixed(1)} L${(x + w * 0.68).toFixed(1)} ${(baseY - h * 0.35).toFixed(1)} `;
    d += `L${(x + w * 0.9).toFixed(1)} ${baseY} `;
    x += w * 0.82;
  }
  d += `L${width} ${baseY} L${width} ${baseY + 40} Z`;
  return d;
}
