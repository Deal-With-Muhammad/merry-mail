import type { L10n } from "@/i18n/config";

/* ------------------------------------------------------------------ */
/*  Card designs                                                      */
/* ------------------------------------------------------------------ */

export const designIds = [
  "evergreen",
  "northern-lights",
  "cranberry-joy",
  "family-photo",
  "toronto-snowfall",
  "golden-wreath",
  "gingerbread-lane",
  "polaroid-garland",
] as const;
export type DesignId = (typeof designIds)[number];

export type DesignCategory = "illustrated" | "photo" | "minimal" | "ontario";

export type Design = {
  slug: DesignId;
  name: L10n;
  tagline: L10n;
  description: L10n;
  category: DesignCategory;
  /** Whether the front of the card is built around a customer photo. */
  photo: boolean;
  /** Two colours used for swatches / backgrounds around the card. */
  swatch: [string, string];
  greeting: L10n;
};

export const designs: Design[] = [
  {
    slug: "evergreen",
    name: { en: "Evergreen Wishes", fr: "Vœux de sapin" },
    tagline: { en: "Gold pines on deep forest green", fr: "Sapins dorés sur vert forêt" },
    description: {
      en: "A timeless forest of hand-drawn pines with gold-foil-ready stars. Classic, warm and perfect for every family on your list.",
      fr: "Une forêt intemporelle de sapins dessinés à la main et d'étoiles prêtes pour la dorure. Classique, chaleureuse et parfaite pour toute la famille.",
    },
    category: "illustrated",
    photo: false,
    swatch: ["#0e3b2e", "#c9a24a"],
    greeting: { en: "Merry Christmas", fr: "Joyeux Noël" },
  },
  {
    slug: "northern-lights",
    name: { en: "Northern Lights", fr: "Aurores boréales" },
    tagline: { en: "Aurora skies over Ontario pines", fr: "Ciel boréal sur les pins de l'Ontario" },
    description: {
      en: "Dancing aurora ribbons over a quiet northern treeline. A love letter to Canadian winter nights.",
      fr: "Des rubans d'aurore au-dessus d'une forêt nordique silencieuse. Une lettre d'amour aux nuits d'hiver canadiennes.",
    },
    category: "ontario",
    photo: false,
    swatch: ["#0b1a3a", "#4fd1a5"],
    greeting: { en: "Season's Greetings", fr: "Meilleurs vœux" },
  },
  {
    slug: "cranberry-joy",
    name: { en: "Cranberry Joy", fr: "Joie canneberge" },
    tagline: { en: "Snowflakes on rich cranberry red", fr: "Flocons sur rouge canneberge" },
    description: {
      en: "Bold, cheerful and unmistakably festive — crisp white snowflakes and a sprig of holly on cranberry red.",
      fr: "Audacieuse et festive — des flocons blancs et une branche de houx sur un rouge canneberge profond.",
    },
    category: "illustrated",
    photo: false,
    swatch: ["#9b1c24", "#fffdf8"],
    greeting: { en: "Joy", fr: "Joie" },
  },
  {
    slug: "family-photo",
    name: { en: "Merry & Bright Photo", fr: "Photo Joyeuse & Lumineuse" },
    tagline: { en: "Your family photo, beautifully framed", fr: "Votre photo de famille, joliment encadrée" },
    description: {
      en: "Put your favourite family moment front and centre with a soft cream frame and festive ribbon details.",
      fr: "Mettez votre plus beau moment en famille à l'honneur avec un cadre crème et des détails de ruban festifs.",
    },
    category: "photo",
    photo: true,
    swatch: ["#fbf6ec", "#b3262e"],
    greeting: { en: "Merry & Bright", fr: "Joyeuses Fêtes" },
  },
  {
    slug: "toronto-snowfall",
    name: { en: "Toronto Snowfall", fr: "Neige sur Toronto" },
    tagline: { en: "The city skyline on a snowy night", fr: "La ville sous la neige, la nuit" },
    description: {
      en: "The CN Tower and city lights under a gentle snowfall — made for proud Ontarians near and far.",
      fr: "La Tour CN et les lumières de la ville sous une douce neige — pour les fiers Ontariens d'ici et d'ailleurs.",
    },
    category: "ontario",
    photo: false,
    swatch: ["#13233f", "#f2e7cb"],
    greeting: { en: "Warmest Wishes", fr: "Chaleureux vœux" },
  },
  {
    slug: "golden-wreath",
    name: { en: "Golden Wreath", fr: "Couronne dorée" },
    tagline: { en: "Minimal wreath, bilingual greeting", fr: "Couronne minimaliste, vœux bilingues" },
    description: {
      en: "An elegant laurel wreath with a bilingual greeting. Stunning with gold foil on our pearl shimmer stock.",
      fr: "Une élégante couronne de laurier avec des vœux bilingues. Magnifique en dorure sur papier nacré.",
    },
    category: "minimal",
    photo: false,
    swatch: ["#fffdf8", "#c9a24a"],
    greeting: { en: "Noël", fr: "Noël" },
  },
  {
    slug: "gingerbread-lane",
    name: { en: "Gingerbread Lane", fr: "Rue des pains d'épices" },
    tagline: { en: "Sweet little houses, iced with care", fr: "De jolies maisons glacées avec soin" },
    description: {
      en: "A playful row of gingerbread houses and candy canes. The card kids (and grandparents) love the most.",
      fr: "Une rangée ludique de maisons en pain d'épices et de cannes de Noël. La préférée des enfants (et des grands-parents).",
    },
    category: "illustrated",
    photo: false,
    swatch: ["#f5ecdb", "#8b5a2b"],
    greeting: { en: "Sweet Holidays", fr: "Douces Fêtes" },
  },
  {
    slug: "polaroid-garland",
    name: { en: "Polaroid Garland", fr: "Guirlande Polaroid" },
    tagline: { en: "A string of lights and your memories", fr: "Une guirlande lumineuse et vos souvenirs" },
    description: {
      en: "Your photo hangs from a twinkling garland like a keepsake polaroid. Casual, nostalgic and full of heart.",
      fr: "Votre photo suspendue à une guirlande scintillante comme un polaroid souvenir. Décontractée, nostalgique et pleine de cœur.",
    },
    category: "photo",
    photo: true,
    swatch: ["#0e3b2e", "#f9f3e4"],
    greeting: { en: "Peace, Love & Joy", fr: "Paix, amour et joie" },
  },
];

export function getDesign(slug: string | null | undefined) {
  return designs.find((d) => d.slug === slug);
}

/* ------------------------------------------------------------------ */
/*  Formats, paper, finishes                                          */
/* ------------------------------------------------------------------ */

export type FormatId = "postcard" | "folded";
export type PaperId = "classic" | "premium" | "pearl" | "kraft";
export type FinishId = "matte" | "gloss" | "foil";
export type FontStyleId = "script" | "hand" | "serif";
export type DeliveryId = "mail" | "ship" | "pickup";

export const formats: Record<FormatId, { name: L10n; size: string; price: number; detail: L10n }> = {
  postcard: {
    name: { en: "Flat postcard", fr: "Carte postale" },
    size: '5" × 7"',
    price: 3.49,
    detail: {
      en: "Design on the front, your message and their address on the back.",
      fr: "Le design au recto, votre message et leur adresse au verso.",
    },
  },
  folded: {
    name: { en: "Folded card + envelope", fr: "Carte pliée + enveloppe" },
    size: '5" × 7"',
    price: 4.99,
    detail: {
      en: "Opens like a real greeting card, sealed in a matching envelope.",
      fr: "S'ouvre comme une vraie carte de vœux, scellée dans une enveloppe assortie.",
    },
  },
};

export type Paper = {
  id: PaperId;
  name: L10n;
  weight: string;
  price: number;
  description: L10n;
  bestFor: L10n;
  /** Visual treatment used by the 3D card and swatches */
  tint: string;
  sheen: boolean;
  popular?: boolean;
};

export const papers: Paper[] = [
  {
    id: "classic",
    name: { en: "Classic Matte", fr: "Mat classique" },
    weight: "80 lb",
    price: 0,
    description: {
      en: "Smooth, bright white cover stock with a soft matte touch.",
      fr: "Carton blanc éclatant et lisse au toucher mat et doux.",
    },
    bestFor: { en: "Large mailing lists", fr: "Les grandes listes d'envoi" },
    tint: "#ffffff",
    sheen: false,
  },
  {
    id: "premium",
    name: { en: "Premium Cotton", fr: "Coton de luxe" },
    weight: "100 lb",
    price: 0.75,
    description: {
      en: "Our signature heavyweight stock — thick, velvety and made to keep.",
      fr: "Notre carton épais signature — velouté, robuste et fait pour être conservé.",
    },
    bestFor: { en: "Keepsakes & family cards", fr: "Souvenirs et cartes familiales" },
    tint: "#fffaf0",
    sheen: false,
    popular: true,
  },
  {
    id: "pearl",
    name: { en: "Pearl Shimmer", fr: "Nacré scintillant" },
    weight: "110 lb",
    price: 1.25,
    description: {
      en: "A luminous pearlescent finish that catches the light as the card moves.",
      fr: "Un fini nacré lumineux qui capte la lumière à chaque mouvement.",
    },
    bestFor: { en: "Foil designs & special occasions", fr: "Dorure et grandes occasions" },
    tint: "#fbf7ff",
    sheen: true,
  },
  {
    id: "kraft",
    name: { en: "Recycled Kraft", fr: "Kraft recyclé" },
    weight: "100 lb",
    price: 0.5,
    description: {
      en: "100% recycled fibres with natural flecks and a rustic, earthy feel.",
      fr: "Fibres 100 % recyclées, mouchetures naturelles et toucher rustique.",
    },
    bestFor: { en: "Eco-friendly senders", fr: "Les expéditeurs écoresponsables" },
    tint: "#d9bf98",
    sheen: false,
  },
];

export const finishes: Record<FinishId, { name: L10n; price: number; detail: L10n }> = {
  matte: {
    name: { en: "Soft matte", fr: "Mat doux" },
    price: 0,
    detail: { en: "Elegant, glare-free, easy to write on.", fr: "Élégant, sans reflets, facile à écrire." },
  },
  gloss: {
    name: { en: "Satin gloss", fr: "Satiné brillant" },
    price: 0,
    detail: { en: "Rich colour that makes photos pop.", fr: "Des couleurs riches qui subliment les photos." },
  },
  foil: {
    name: { en: "Gold foil accents", fr: "Accents dorés" },
    price: 1.5,
    detail: { en: "Real metallic foil pressed on highlights.", fr: "Vraie dorure métallique pressée sur les détails." },
  },
};

export const deliveryOptions: Record<
  DeliveryId,
  { name: L10n; detail: L10n; price: number; per: "card" | "order" }
> = {
  mail: {
    name: { en: "We mail each card for you", fr: "Nous postons chaque carte pour vous" },
    detail: {
      en: "Printed, addressed, stamped and mailed via Canada Post. 2–5 business days within Ontario.",
      fr: "Imprimée, adressée, timbrée et postée via Postes Canada. 2 à 5 jours ouvrables en Ontario.",
    },
    price: 1.95,
    per: "card",
  },
  ship: {
    name: { en: "Ship the bundle to me", fr: "Expédier le lot chez moi" },
    detail: {
      en: "Receive all cards and envelopes at one address. Free on orders over $50.",
      fr: "Recevez toutes les cartes et enveloppes à une adresse. Gratuit dès 50 $.",
    },
    price: 7.99,
    per: "order",
  },
  pickup: {
    name: { en: "Pick up at a studio", fr: "Ramassage en studio" },
    detail: {
      en: "Collect from one of our Ontario studios — usually ready in 48 hours.",
      fr: "Récupérez votre commande dans l'un de nos studios ontariens — prête en 48 h.",
    },
    price: 0,
    per: "order",
  },
};

/* ------------------------------------------------------------------ */
/*  Business rules                                                    */
/* ------------------------------------------------------------------ */

export const MAX_RECIPIENTS = 12;
export const HST_RATE = 0.13; // Ontario HST
export const FREE_SHIPPING_THRESHOLD = 50;
export const PROMO_CODES: Record<string, number> = { MERRY10: 0.1, NOEL15: 0.15 };

/** Ontario forward sortation areas start with K, L, M, N or P. */
export const ONTARIO_POSTAL = /^[KLMNP]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;
export const CANADA_POSTAL = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

export function formatPostal(value: string) {
  const v = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  return v.length > 3 ? `${v.slice(0, 3)} ${v.slice(3)}` : v;
}

export const volumeTiers = [
  { min: 12, rate: 0.2 },
  { min: 7, rate: 0.15 },
  { min: 5, rate: 0.1 },
];

export function volumeDiscountRate(cards: number) {
  return volumeTiers.find((tier) => cards >= tier.min)?.rate ?? 0;
}
