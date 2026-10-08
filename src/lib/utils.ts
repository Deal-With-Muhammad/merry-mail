import { CANADA_POSTAL, ONTARIO_POSTAL } from "@/data/catalog";
import type { Address } from "./types";

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Client-side only: random ids for cart items, addresses and orders. */
export function uid(prefix = "") {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "")
      : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  return prefix + rand.slice(0, 12);
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomBlock(length: number) {
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return out;
}

export function newTrackingNumber() {
  return `MM-${randomBlock(4)}-${randomBlock(4)}`;
}

export function newOrderNumber() {
  return `MM${new Date().getFullYear() % 100}${randomBlock(5)}`;
}

export const TRACKING_PATTERN = /^MM-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export function normalizeTracking(value: string) {
  const v = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const body = v.startsWith("MM") ? v.slice(2) : v;
  if (body.length !== 8) return value.trim().toUpperCase();
  return `MM-${body.slice(0, 4)}-${body.slice(4)}`;
}

/** Small, stable string hash (FNV-1a). Used for mock data only. */
export function hash(value: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function isOntarioPostal(value: string) {
  return ONTARIO_POSTAL.test(value.trim());
}

export function isCanadianPostal(value: string) {
  return CANADA_POSTAL.test(value.trim());
}

export function addressIsComplete(a: Partial<Address> | undefined): a is Address {
  return !!a && !!a.name?.trim() && !!a.line1?.trim() && !!a.city?.trim() && isOntarioPostal(a.postal ?? "");
}

export function formatAddress(a: Address) {
  return [a.line1, a.line2, `${a.city}, ${a.province} ${a.postal}`].filter(Boolean).join(", ");
}

/* ------------------------------------------------------------------ */
/*  Payment (mock)                                                    */
/* ------------------------------------------------------------------ */

export function luhn(number: string) {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 13) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

export type CardBrand = "visa" | "mastercard" | "amex" | "unknown";

export function cardBrand(number: string): CardBrand {
  const n = number.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return "unknown";
}

export function formatCardNumber(value: string) {
  const n = value.replace(/\D/g, "").slice(0, 19);
  if (cardBrand(n) === "amex") return n.replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "));
  return n.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatExpiry(value: string) {
  const n = value.replace(/\D/g, "").slice(0, 4);
  return n.length > 2 ? `${n.slice(0, 2)}/${n.slice(2)}` : n;
}

export function expiryIsValid(value: string) {
  const m = value.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

/* ------------------------------------------------------------------ */
/*  Images                                                            */
/* ------------------------------------------------------------------ */

/** Downscale an uploaded photo so it fits comfortably in localStorage. */
export function downscaleImage(file: File, maxSize = 1000, quality = 0.84): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Unsupported image"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas unavailable"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
