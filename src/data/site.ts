import type { L10n } from "@/i18n/config";

/** Free stock imagery (Unsplash licence) used as placeholders for the prototype. */
export function unsplash(id: string, width = 1200, quality = 75) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

export const images = {
  heroCards: "photo-1512440929676-9dfaadc6891c",
  greetingCards: "photo-1577201867028-6d7a8a243bd8",
  cardsPile: "photo-1481011784351-b0227b9f4a80",
  envelopeMessage: "photo-1734014938178-295a6fa14a36",
  cardAndEnvelope: "photo-1765483470022-60293c79927d",
  festiveCards: "photo-1765483469917-2b032f1518dc",
  mailboxSnow: "photo-1482386383748-b78a9840bec9",
  handsWriting: "photo-1760720962365-6ae03435c02a",
  writingPaper: "photo-1608804375369-498a4b601e42",
  familyTree: "photo-1639178952543-1c0ea3cbacaa",
  familyReading: "photo-1549227082-0ea18ce30397",
  gingerbreadBaking: "photo-1577721174006-98a67a796931",
  cozyLivingRoom: "photo-1640505933280-82074a4836d6",
  cozyArmchair: "photo-1764425172379-a34539a22af7",
  giftsTable: "photo-1640116682712-94bf1c17abe2",
  kraftGift: "photo-1764764138587-189f22804ec4",
  printingPress: "photo-1503694978374-8a2fa686963a",
  paperShelves: "photo-1750537735437-847075c29538",
  envelopes: "photo-1526554850534-7c78330d5f90",
  snowyPines: "photo-1642638966040-547114e05439",
  winterVillage: "photo-1517320964276-a002fa203177",
  christmasStreet: "photo-1636975033611-935e3f5efaa1",
  weddingStationery: "photo-1632610992723-82d7c212f6d7",
  weddingFlatlay: "photo-1721176487015-5408ae0e9bc2",
  businessCards: "photo-1718670013921-2f144aba173a",
  businessCardHand: "photo-1628891439478-c613e85af7d6",
  cleaning: "photo-1686178827149-6d55c72d81df",
  cleaningSpray: "photo-1563453392212-326f5e854473",
  teamWork: "photo-1610387853988-7a1623efb207",
  toronto: "photo-1515983206477-c0df29b37a27",
  ottawa: "photo-1674110172298-4a8798170d0e",
  hamilton: "photo-1474502602016-93ddf42348aa",
  mississauga: "photo-1581141117898-2be4de754b12",
  london: "photo-1571173699456-a55fbd01faa5",
} as const;

/** Free stock footage (Mixkit licence) used as placeholders. */
export const videos = {
  canadaSnow: {
    src: "https://assets.mixkit.co/videos/3323/3323-720.mp4",
    poster: "https://assets.mixkit.co/videos/3323/3323-thumb-720-0.jpg",
  },
  fireplace: {
    src: "https://assets.mixkit.co/videos/2707/2707-720.mp4",
    poster: "https://assets.mixkit.co/videos/2707/2707-thumb-720-0.jpg",
  },
  handwriting: {
    src: "https://assets.mixkit.co/videos/49557/49557-720.mp4",
    poster: "https://assets.mixkit.co/videos/49557/49557-thumb-720-0.jpg",
  },
  pines: {
    src: "https://assets.mixkit.co/videos/3358/3358-720.mp4",
    poster: "https://assets.mixkit.co/videos/3358/3358-thumb-720-0.jpg",
  },
  tree: {
    src: "https://assets.mixkit.co/videos/44579/44579-720.mp4",
    poster: "https://assets.mixkit.co/videos/44579/44579-thumb-720-0.jpg",
  },
} as const;

export const contact = {
  phone: "(905) 555-0142",
  phoneHref: "tel:+19055550142",
  email: "hello@merrymail.ca",
  hours: { en: "Mon–Sat · 9 am – 7 pm ET", fr: "Lun–sam · 9 h – 19 h HE" } satisfies L10n,
  address: "245 Evergreen Way, Mississauga, ON L5B 0A1",
};

/* ------------------------------------------------------------------ */
/*  Team                                                              */
/* ------------------------------------------------------------------ */

export type TeamMember = {
  name: string;
  role: L10n;
  bio: L10n;
  image: string;
  city: string;
};

export const team: TeamMember[] = [
  {
    name: "Masood",
    role: { en: "Founder & Creative Director", fr: "Fondateur et directeur de création" },
    bio: {
      en: "Masood started Merry Mail at his kitchen table to help families stay close over the holidays. He still signs off on every new design.",
      fr: "Masood a lancé Merry Mail à sa table de cuisine pour aider les familles à rester proches pendant les Fêtes. Il approuve encore chaque nouveau design.",
    },
    image: "photo-1560250097-0b93528c311a",
    city: "Mississauga",
  },
  {
    name: "Amélie Tremblay",
    role: { en: "Head of Design", fr: "Cheffe du design" },
    bio: {
      en: "Illustrator behind our bestselling Evergreen and Golden Wreath collections. Fluent in watercolour and French puns.",
      fr: "Illustratrice derrière nos collections Sapin et Couronne dorée. Experte en aquarelle et en jeux de mots.",
    },
    image: "photo-1581065178047-8ee15951ede6",
    city: "Ottawa",
  },
  {
    name: "Daniel Okafor",
    role: { en: "Print Studio Lead", fr: "Responsable de l'atelier d'impression" },
    bio: {
      en: "Fifteen years on presses big and small. Daniel makes sure every card leaves the studio crisp, centred and perfect.",
      fr: "Quinze ans d'expérience en impression. Daniel veille à ce que chaque carte quitte l'atelier impeccable.",
    },
    image: "photo-1500648767791-00dcc994a43e",
    city: "Mississauga",
  },
  {
    name: "Priya Sharma",
    role: { en: "Customer Happiness", fr: "Bonheur client" },
    bio: {
      en: "Priya and her team answer every message within a day — and personally check orders before the holiday rush.",
      fr: "Priya et son équipe répondent à chaque message en moins d'un jour et vérifient les commandes avant la cohue des Fêtes.",
    },
    image: "photo-1562337404-3044c84ac061",
    city: "Toronto",
  },
  {
    name: "Liam Chen",
    role: { en: "Logistics & Delivery", fr: "Logistique et livraison" },
    bio: {
      en: "Liam coordinates our daily Canada Post hand-offs so cards land in mailboxes across Ontario right on time.",
      fr: "Liam coordonne nos dépôts quotidiens chez Postes Canada pour que les cartes arrivent à temps partout en Ontario.",
    },
    image: "photo-1507003211169-0a1dd7228f2d",
    city: "Hamilton",
  },
];

/* ------------------------------------------------------------------ */
/*  Locations                                                         */
/* ------------------------------------------------------------------ */

export type Location = {
  id: string;
  city: string;
  label: L10n;
  address: string;
  phone: string;
  hours: L10n;
  image: string;
  coords: [number, number];
  services: L10n[];
  hq?: boolean;
};

export const locations: Location[] = [
  {
    id: "mississauga",
    city: "Mississauga",
    label: { en: "Headquarters & print studio", fr: "Siège social et atelier d'impression" },
    address: "245 Evergreen Way, Mississauga, ON L5B 0A1",
    phone: "(905) 555-0142",
    hours: { en: "Mon–Sat 9 am – 7 pm", fr: "Lun–sam 9 h – 19 h" },
    image: images.mississauga,
    coords: [43.5933, -79.6441],
    services: [
      { en: "Print studio", fr: "Atelier d'impression" },
      { en: "Pickup", fr: "Ramassage" },
      { en: "Design consults", fr: "Consultations design" },
    ],
    hq: true,
  },
  {
    id: "toronto",
    city: "Toronto",
    label: { en: "Downtown pickup studio", fr: "Studio de ramassage du centre-ville" },
    address: "88 Frost Street, Toronto, ON M5V 2T6",
    phone: "(416) 555-0187",
    hours: { en: "Mon–Fri 10 am – 7 pm · Sat 10 am – 4 pm", fr: "Lun–ven 10 h – 19 h · sam 10 h – 16 h" },
    image: images.toronto,
    coords: [43.6426, -79.3871],
    services: [
      { en: "Pickup", fr: "Ramassage" },
      { en: "Paper samples", fr: "Échantillons" },
    ],
  },
  {
    id: "ottawa",
    city: "Ottawa",
    label: { en: "Eastern Ontario studio", fr: "Studio de l'Est ontarien" },
    address: "17 Maple Crescent, Ottawa, ON K1P 5G4",
    phone: "(613) 555-0120",
    hours: { en: "Tue–Sat 10 am – 6 pm", fr: "Mar–sam 10 h – 18 h" },
    image: images.ottawa,
    coords: [45.4215, -75.6972],
    services: [
      { en: "Pickup", fr: "Ramassage" },
      { en: "Bilingual service", fr: "Service bilingue" },
    ],
  },
  {
    id: "hamilton",
    city: "Hamilton",
    label: { en: "Golden Horseshoe hub", fr: "Centre du Golden Horseshoe" },
    address: "402 Bayview Road, Hamilton, ON L8P 4R5",
    phone: "(905) 555-0168",
    hours: { en: "Mon–Fri 9 am – 5 pm", fr: "Lun–ven 9 h – 17 h" },
    image: images.hamilton,
    coords: [43.2557, -79.8711],
    services: [
      { en: "Pickup", fr: "Ramassage" },
      { en: "Canada Post hand-off", fr: "Dépôt Postes Canada" },
    ],
  },
  {
    id: "london",
    city: "London",
    label: { en: "Southwestern Ontario studio", fr: "Studio du Sud-Ouest ontarien" },
    address: "55 Pine Ridge Drive, London, ON N6A 3K7",
    phone: "(519) 555-0133",
    hours: { en: "Wed–Sat 10 am – 6 pm", fr: "Mer–sam 10 h – 18 h" },
    image: images.london,
    coords: [42.9849, -81.2453],
    services: [{ en: "Pickup", fr: "Ramassage" }],
  },
];

/* ------------------------------------------------------------------ */
/*  Testimonials                                                      */
/* ------------------------------------------------------------------ */

export const testimonials: { quote: L10n; name: string; city: string; rating: number }[] = [
  {
    quote: {
      en: "I sent cards to seven households in under ten minutes. My grandmother in Sudbury called the day hers arrived — she thought I'd written it by hand!",
      fr: "J'ai envoyé des cartes à sept foyers en moins de dix minutes. Ma grand-mère à Sudbury m'a appelée le jour même — elle croyait que je l'avais écrite à la main!",
    },
    name: "Sarah M.",
    city: "Ottawa",
    rating: 5,
  },
  {
    quote: {
      en: "The 100 lb paper feels incredibly premium. Being able to spin the card in 3D before ordering sealed the deal for us.",
      fr: "Le papier de 100 lb est d'une qualité incroyable. Pouvoir faire tourner la carte en 3D avant de commander nous a convaincus.",
    },
    name: "Jean-François L.",
    city: "Sudbury",
    rating: 5,
  },
  {
    quote: {
      en: "We ordered our company's client cards and our family cards in one go. Tracking every envelope was a lifesaver in December.",
      fr: "Nous avons commandé les cartes clients de l'entreprise et nos cartes familiales en une fois. Le suivi de chaque enveloppe nous a sauvés en décembre.",
    },
    name: "Aisha K.",
    city: "Brampton",
    rating: 5,
  },
];

/* ------------------------------------------------------------------ */
/*  Services                                                          */
/* ------------------------------------------------------------------ */

export const serviceSlugs = [
  "holiday-cards",
  "wedding-invitations",
  "business-cards",
  "corporate-cards",
  "cleaning",
] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];

export type Service = {
  slug: ServiceSlug;
  image: string;
  gallery: string[];
  fromPrice?: number;
  available: boolean;
};

export const services: Record<ServiceSlug, Service> = {
  "holiday-cards": {
    slug: "holiday-cards",
    image: images.festiveCards,
    gallery: [images.greetingCards, images.cardAndEnvelope, images.envelopeMessage],
    fromPrice: 3.49,
    available: true,
  },
  "wedding-invitations": {
    slug: "wedding-invitations",
    image: images.weddingStationery,
    gallery: [images.weddingFlatlay, images.envelopes, images.handsWriting],
    fromPrice: 2.95,
    available: true,
  },
  "business-cards": {
    slug: "business-cards",
    image: images.businessCards,
    gallery: [images.businessCardHand, images.paperShelves, images.printingPress],
    fromPrice: 39,
    available: true,
  },
  "corporate-cards": {
    slug: "corporate-cards",
    image: images.giftsTable,
    gallery: [images.cardsPile, images.kraftGift, images.teamWork],
    fromPrice: 2.99,
    available: true,
  },
  cleaning: {
    slug: "cleaning",
    image: images.cleaning,
    gallery: [images.cleaningSpray, images.cozyLivingRoom],
    available: true,
  },
};

export const socials = [
  { id: "instagram", label: "Instagram", href: "https://instagram.com" },
  { id: "facebook", label: "Facebook", href: "https://facebook.com" },
  { id: "pinterest", label: "Pinterest", href: "https://pinterest.com" },
  { id: "tiktok", label: "TikTok", href: "https://tiktok.com" },
] as const;
