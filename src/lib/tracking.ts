import { hash } from "./utils";
import type { Order, OrderStatus } from "./types";

export const statusOrder: OrderStatus[] = [
  "received",
  "printing",
  "quality",
  "shipped",
  "out",
  "delivered",
];

/** Demo codes the client can try on the tracking page. */
export const sampleTrackingCodes: Record<string, { stage: number; city: string; cards: number }> = {
  "MM-7K2P-X9QD": { stage: 3, city: "Ottawa", cards: 7 },
  "MM-NOEL-2026": { stage: 5, city: "Toronto", cards: 5 },
  "MM-SNOW-4FLK": { stage: 1, city: "Hamilton", cards: 12 },
};

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

/**
 * Real orders placed in the prototype move through the pipeline on an
 * accelerated clock so the tracking page visibly updates during a demo.
 */
const demoStageOffsets = [0, 1, 3, 6, 10, 15].map((m) => m * MINUTE);
/** Realistic offsets (in days) used for sample / unknown codes. */
const realStageOffsets = [0, 0.6, 1.1, 1.6, 3.4, 3.8].map((d) => d * DAY);

export type TrackingResult = {
  code: string;
  stage: number;
  status: OrderStatus;
  events: { status: OrderStatus; at: number | null }[];
  eta: number;
  city: string;
  cards: number;
  order?: Order;
  simulated: boolean;
};

/** Canada Post doesn't deliver lettermail on weekends. */
function businessDay(ts: number) {
  const d = new Date(ts);
  const day = d.getDay();
  if (day === 6) return ts + 2 * DAY;
  if (day === 0) return ts + DAY;
  return ts;
}

function buildEvents(start: number, offsets: number[], stage: number) {
  return statusOrder.map((status, i) => ({
    status,
    at: i <= stage ? start + offsets[i] : null,
  }));
}

export function trackOrder(order: Order, now: number): TrackingResult {
  const elapsed = now - order.createdAt;
  let stage = 0;
  demoStageOffsets.forEach((offset, i) => {
    if (elapsed >= offset) stage = i;
  });
  const firstMail = order.items.find((i) => i.delivery === "mail")?.recipients[0];
  const cards = order.items.reduce(
    (sum, item) => sum + (item.delivery === "mail" ? item.recipients.length : item.quantity),
    0,
  );
  return {
    code: order.tracking,
    stage,
    status: statusOrder[stage],
    events: buildEvents(order.createdAt, demoStageOffsets, stage),
    eta: businessDay(order.createdAt + 4 * DAY),
    city: firstMail?.city ?? order.items[0]?.shipTo?.city ?? "Mississauga",
    cards,
    order,
    simulated: true,
  };
}

export function trackCode(code: string, now: number): TrackingResult {
  const sample = sampleTrackingCodes[code];
  const h = hash(code);
  const stage = sample?.stage ?? h % statusOrder.length;
  const start = now - realStageOffsets[stage] - ((h >> 4) % 300) * MINUTE;
  const cities = ["Toronto", "Ottawa", "Hamilton", "London", "Kitchener", "Barrie", "Kingston", "Windsor"];
  return {
    code,
    stage,
    status: statusOrder[stage],
    events: buildEvents(start, realStageOffsets, stage),
    eta: businessDay(start + 4 * DAY),
    city: sample?.city ?? cities[h % cities.length],
    cards: sample?.cards ?? 3 + (h % 9),
    simulated: false,
  };
}
