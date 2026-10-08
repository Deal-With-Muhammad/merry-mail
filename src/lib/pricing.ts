import {
  deliveryOptions,
  finishes,
  formats,
  FREE_SHIPPING_THRESHOLD,
  HST_RATE,
  papers,
  PROMO_CODES,
  volumeDiscountRate,
} from "@/data/catalog";
import type { CardConfig } from "./types";

const round = (n: number) => Math.round(n * 100) / 100;

export function cardCount(config: Pick<CardConfig, "delivery" | "recipients" | "quantity">) {
  return config.delivery === "mail" ? config.recipients.length : Math.max(1, config.quantity);
}

export function unitPrice(config: Pick<CardConfig, "format" | "paper" | "finish">) {
  const paper = papers.find((p) => p.id === config.paper);
  return round(formats[config.format].price + (paper?.price ?? 0) + finishes[config.finish].price);
}

export type ItemPrice = {
  cards: number;
  unit: number;
  subtotal: number;
  discountRate: number;
  discount: number;
  /** Per-card postage (mail) or flat per-order fee (ship / pickup). */
  delivery: number;
  total: number;
};

export function priceItem(config: CardConfig): ItemPrice {
  const cards = cardCount(config);
  const unit = unitPrice(config);
  const subtotal = round(unit * cards);
  const discountRate = volumeDiscountRate(cards);
  const discount = round(subtotal * discountRate);
  const option = deliveryOptions[config.delivery];
  const delivery = option.per === "card" ? round(option.price * cards) : option.price;
  return {
    cards,
    unit,
    subtotal,
    discountRate,
    discount,
    delivery,
    total: round(subtotal - discount + delivery),
  };
}

export type CartTotals = {
  cards: number;
  subtotal: number;
  discount: number;
  promo: number;
  promoRate: number;
  delivery: number;
  freeShipping: boolean;
  tax: number;
  total: number;
};

export function priceCart(items: CardConfig[], promoCode?: string): CartTotals {
  let cards = 0;
  let subtotal = 0;
  let discount = 0;
  let postage = 0;
  let hasShipped = false;

  for (const item of items) {
    const p = priceItem(item);
    cards += p.cards;
    subtotal += p.subtotal;
    discount += p.discount;
    if (item.delivery === "mail") postage += p.delivery;
    if (item.delivery === "ship") hasShipped = true;
  }

  const merchandise = subtotal - discount;
  const promoRate = promoCode ? (PROMO_CODES[promoCode.toUpperCase()] ?? 0) : 0;
  const promo = round(merchandise * promoRate);
  // One shipping fee per order, waived above the free-shipping threshold
  const freeShipping = hasShipped && merchandise - promo >= FREE_SHIPPING_THRESHOLD;
  const shipping = hasShipped && !freeShipping ? deliveryOptions.ship.price : 0;
  const delivery = round(postage + shipping);
  const tax = round((merchandise - promo + delivery) * HST_RATE);

  return {
    cards,
    subtotal: round(subtotal),
    discount: round(discount),
    promo,
    promoRate,
    delivery,
    freeShipping,
    tax,
    total: round(merchandise - promo + delivery + tax),
  };
}
