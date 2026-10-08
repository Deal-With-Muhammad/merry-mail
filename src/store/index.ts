"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { DesignId } from "@/data/catalog";
import { demoAccount, demoAddresses } from "@/data/demo";
import type { Address, CardConfig, CartItem, Order, User } from "@/lib/types";
import { hash, uid } from "@/lib/utils";

const noopStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
// Never touch localStorage on the server (Node 26 exposes an experimental global that warns)
const storage = createJSONStorage(() => (typeof window === "undefined" ? noopStorage : window.localStorage));

/* ------------------------------------------------------------------ */
/*  Hydration                                                         */
/* ------------------------------------------------------------------ */

export const useHydration = create<{ ready: boolean }>(() => ({ ready: false }));
export const useHydrated = () => useHydration((s) => s.ready);

/* ------------------------------------------------------------------ */
/*  Card builder draft                                                */
/* ------------------------------------------------------------------ */

export function defaultConfig(design: DesignId = "evergreen"): CardConfig {
  return {
    design,
    format: "folded",
    paper: "premium",
    finish: "matte",
    greeting: "",
    familyName: "",
    message: "",
    signature: "",
    fontStyle: "script",
    photo: undefined,
    includePhoto: false,
    delivery: "mail",
    recipients: [],
    quantity: 10,
    shipTo: undefined,
    pickupLocation: "mississauga",
  };
}

type BuilderState = {
  draft: CardConfig;
  step: number;
  editingId: string | null;
  update: (patch: Partial<CardConfig>) => void;
  setStep: (step: number) => void;
  start: (design?: DesignId) => void;
  edit: (item: CartItem) => void;
  reset: () => void;
};

export const useBuilder = create<BuilderState>()(
  persist(
    (set) => ({
      draft: defaultConfig(),
      step: 0,
      editingId: null,
      update: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      setStep: (step) => set({ step }),
      start: (design) =>
        set((s) => ({
          // Keep personalisation & recipients when switching designs
          draft: { ...s.draft, design: design ?? s.draft.design },
          step: 0,
          editingId: null,
        })),
      edit: (item) => {
        const { id, addedAt, ...config } = item;
        void addedAt;
        set({ draft: config, step: 0, editingId: id });
      },
      reset: () => set({ draft: defaultConfig(), step: 0, editingId: null }),
    }),
    { name: "mm-builder", storage, skipHydration: true },
  ),
);

/* ------------------------------------------------------------------ */
/*  Cart                                                              */
/* ------------------------------------------------------------------ */

type CartState = {
  items: CartItem[];
  promoCode: string | null;
  add: (config: CardConfig) => string;
  replace: (id: string, config: CardConfig) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  setPromo: (code: string | null) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      promoCode: null,
      add: (config) => {
        const id = uid("item_");
        set((s) => ({ items: [...s.items, { ...config, id, addedAt: Date.now() }] }));
        return id;
      },
      replace: (id, config) =>
        set((s) => ({
          items: s.items.map((item) => (item.id === id ? { ...config, id, addedAt: item.addedAt } : item)),
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQuantity: (id, quantity) =>
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, quantity } : i)) })),
      setPromo: (promoCode) => set({ promoCode }),
      clear: () => set({ items: [], promoCode: null }),
    }),
    { name: "mm-cart", storage, skipHydration: true },
  ),
);

/* ------------------------------------------------------------------ */
/*  Auth (mock — browser only)                                        */
/* ------------------------------------------------------------------ */

type StoredUser = User & { passHash: string };

type AuthResult = { ok: true } | { ok: false; error: "exists" | "invalid" };

type AuthState = {
  users: StoredUser[];
  user: User | null;
  signUp: (input: { name: string; email: string; password: string; newsletter: boolean }) => AuthResult;
  signIn: (email: string, password: string) => AuthResult;
  signOut: () => void;
  updateProfile: (patch: Partial<Pick<User, "name" | "newsletter">>) => void;
};

const passHash = (email: string, password: string) => String(hash(`${email.toLowerCase()}::${password}`));

const seedUsers: StoredUser[] = [
  {
    name: demoAccount.name,
    email: demoAccount.email,
    newsletter: true,
    createdAt: Date.UTC(2024, 10, 2),
    passHash: passHash(demoAccount.email, demoAccount.password),
  },
];

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      users: seedUsers,
      user: null,
      signUp: ({ name, email, password, newsletter }) => {
        const normalized = email.trim().toLowerCase();
        if (get().users.some((u) => u.email === normalized)) return { ok: false, error: "exists" };
        const user: User = { name: name.trim(), email: normalized, newsletter, createdAt: Date.now() };
        set((s) => ({ users: [...s.users, { ...user, passHash: passHash(normalized, password) }], user }));
        return { ok: true };
      },
      signIn: (email, password) => {
        const normalized = email.trim().toLowerCase();
        const found = get().users.find((u) => u.email === normalized);
        if (!found || found.passHash !== passHash(normalized, password)) return { ok: false, error: "invalid" };
        const { passHash: _omit, ...user } = found;
        void _omit;
        set({ user });
        return { ok: true };
      },
      signOut: () => set({ user: null }),
      updateProfile: (patch) =>
        set((s) => {
          if (!s.user) return s;
          const user = { ...s.user, ...patch };
          return { user, users: s.users.map((u) => (u.email === user.email ? { ...u, ...patch } : u)) };
        }),
    }),
    {
      name: "mm-auth",
      storage,
      skipHydration: true,
      // Always use the current demo seed, even over older saved state
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AuthState>;
        const seedEmails = seedUsers.map((u) => u.email);
        const users = [...(p.users ?? []).filter((u) => !seedEmails.includes(u.email)), ...seedUsers];
        const seed = seedUsers.find((u) => u.email === p.user?.email);
        const user = p.user && seed ? { ...p.user, name: seed.name } : (p.user ?? null);
        return { ...current, ...p, users, user };
      },
    },
  ),
);

/* ------------------------------------------------------------------ */
/*  Orders                                                            */
/* ------------------------------------------------------------------ */

type OrdersState = {
  orders: Order[];
  add: (order: Order) => void;
};

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      add: (order) => set((s) => ({ orders: [order, ...s.orders] })),
    }),
    { name: "mm-orders", storage, skipHydration: true },
  ),
);

/* ------------------------------------------------------------------ */
/*  Address book                                                      */
/* ------------------------------------------------------------------ */

type AddressBookState = {
  book: Record<string, Address[]>;
  save: (email: string, address: Address) => void;
  saveMany: (email: string, addresses: Address[]) => number;
  remove: (email: string, id: string) => void;
};

const sameAddress = (a: Address, b: Address) =>
  a.name.trim().toLowerCase() === b.name.trim().toLowerCase() &&
  a.line1.trim().toLowerCase() === b.line1.trim().toLowerCase() &&
  a.postal.replace(/\s/g, "").toUpperCase() === b.postal.replace(/\s/g, "").toUpperCase();

export const useAddressBook = create<AddressBookState>()(
  persist(
    (set, get) => ({
      book: { [demoAccount.email]: demoAddresses },
      save: (email, address) =>
        set((s) => {
          const list = s.book[email] ?? [];
          const exists = list.some((a) => a.id === address.id);
          return {
            book: {
              ...s.book,
              [email]: exists ? list.map((a) => (a.id === address.id ? address : a)) : [...list, address],
            },
          };
        }),
      saveMany: (email, addresses) => {
        const list = get().book[email] ?? [];
        const fresh = addresses
          .filter((a) => !list.some((b) => sameAddress(a, b)))
          .map((a) => ({ ...a, id: uid("addr_") }));
        set((s) => ({ book: { ...s.book, [email]: [...list, ...fresh] } }));
        return fresh.length;
      },
      remove: (email, id) =>
        set((s) => ({ book: { ...s.book, [email]: (s.book[email] ?? []).filter((a) => a.id !== id) } })),
    }),
    {
      name: "mm-addresses",
      storage,
      skipHydration: true,
      // Keep the demo account's sample addresses in sync with the seed
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AddressBookState>;
        const book = { ...(p.book ?? {}) };
        const saved = (book[demoAccount.email] ?? []).filter((a) => !a.id.startsWith("demo-"));
        book[demoAccount.email] = [...demoAddresses, ...saved];
        return { ...current, ...p, book };
      },
    },
  ),
);

/* ------------------------------------------------------------------ */
/*  Cookie consent & newsletter                                       */
/* ------------------------------------------------------------------ */

export type Consent = { analytics: boolean; marketing: boolean; decidedAt: number };

type ConsentState = {
  consent: Consent | null;
  prefsOpen: boolean;
  decide: (choice: Omit<Consent, "decidedAt">) => void;
  openPrefs: (open: boolean) => void;
};

export const useConsent = create<ConsentState>()(
  persist(
    (set) => ({
      consent: null,
      prefsOpen: false,
      decide: (choice) => set({ consent: { ...choice, decidedAt: Date.now() }, prefsOpen: false }),
      openPrefs: (prefsOpen) => set({ prefsOpen }),
    }),
    {
      name: "mm-consent",
      storage,
      skipHydration: true,
      partialize: (s) => ({ consent: s.consent }),
    },
  ),
);

type NewsletterState = {
  emails: string[];
  subscribe: (email: string) => "new" | "exists";
};

export const useNewsletter = create<NewsletterState>()(
  persist(
    (set, get) => ({
      emails: [],
      subscribe: (email) => {
        const normalized = email.trim().toLowerCase();
        if (get().emails.includes(normalized)) return "exists";
        set((s) => ({ emails: [...s.emails, normalized] }));
        return "new";
      },
    }),
    { name: "mm-newsletter", storage, skipHydration: true },
  ),
);

/** Rehydrate every persisted store once on the client. */
export async function rehydrateStores() {
  await Promise.all([
    useBuilder.persist.rehydrate(),
    useCart.persist.rehydrate(),
    useAuth.persist.rehydrate(),
    useOrders.persist.rehydrate(),
    useAddressBook.persist.rehydrate(),
    useConsent.persist.rehydrate(),
    useNewsletter.persist.rehydrate(),
  ]);
  useHydration.setState({ ready: true });
}
