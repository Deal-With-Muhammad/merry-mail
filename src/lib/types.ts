import type {
  DeliveryId,
  DesignId,
  FinishId,
  FontStyleId,
  FormatId,
  PaperId,
} from "@/data/catalog";

export type Address = {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postal: string;
  note?: string;
};

/** Everything that describes one personalised card design + where it goes. */
export type CardConfig = {
  design: DesignId;
  format: FormatId;
  paper: PaperId;
  finish: FinishId;
  greeting: string;
  familyName: string;
  message: string;
  signature: string;
  fontStyle: FontStyleId;
  /** Downscaled data URL of the customer photo, if any. */
  photo?: string;
  /** For illustrated designs: also print the photo inside / on the back. */
  includePhoto: boolean;
  delivery: DeliveryId;
  recipients: Address[];
  /** Used when delivery is ship / pickup. */
  quantity: number;
  shipTo?: Address;
  pickupLocation?: string;
};

export type CartItem = CardConfig & { id: string; addedAt: number };

export type OrderStatus = "received" | "printing" | "quality" | "shipped" | "out" | "delivered";

export type Order = {
  id: string;
  tracking: string;
  email: string;
  name: string;
  items: CartItem[];
  totals: {
    subtotal: number;
    discount: number;
    promo: number;
    delivery: number;
    tax: number;
    total: number;
  };
  promoCode?: string;
  paymentLast4: string;
  paymentBrand: string;
  createdAt: number;
};

export type User = {
  name: string;
  email: string;
  createdAt: number;
  newsletter: boolean;
};
