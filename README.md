# Merry Mail 🎄✉️

A clickable, bilingual (EN / FR) prototype for **Merry Mail**: personalised Christmas cards and postcards that are printed, stamped and mailed to family across Ontario.

Built with **Next.js 16** (App Router, Cache Components), **HeroUI v3**, **Tailwind CSS v4**, **Motion** and **Zustand**.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. It redirects to `/en` or `/fr` based on the browser language.

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

### Demo account

The sign-in page has a **"Use demo account"** button (see `src/data/demo.ts`). The demo account already has three saved family addresses in its address book.

Test payments: use card `4242 4242 4242 4242`, any future expiry date and any CVC. Promo codes: `MERRY10` (10% off) and `NOEL15` (15% off).

Sample tracking numbers: `MM-7K2P-X9QD`, `MM-NOEL-2026`, `MM-SNOW-4FLK`. Orders you place get their own tracking number. In the prototype, the status moves forward every few minutes so the timeline visibly updates during a demo.

## What's in the prototype

| Area | Details |
| --- | --- |
| Home | Typewriter hero with an interactive 3D card, quick-start form (name / postal code / service), how it works, featured designs, 3D showcase, Christmas deadline countdown, paper options, pricing tiers, comparison, about, team, testimonials, FAQ, newsletter and contact |
| Card designs | 8 original SVG designs (illustrated, photo, minimal, Ontario), with catalog filters and detail pages |
| 3D card | Tilts with the cursor. Folded cards open to show the inside message, and postcards flip to show the stamp and the address. Paper textures are simulated (matte, cotton, pearl shimmer, kraft) and gold foil is supported |
| Card builder | 5 steps: design & format → personalise (photo upload, greeting, message suggestions, fonts) → paper & finish → recipients → review. Live preview and pricing throughout, and progress is saved automatically |
| Recipients | Up to 12 Ontario addresses per design, quick-add packs of 5 or 7, import from the address book, a personal note per family, and postal codes validated for Ontario (K/L/M/N/P). Alternatives: ship the bundle to me, or pick up at a studio |
| Pricing | Format + paper + finish, volume discounts (5+ cards: 10%, 7+: 15%, 12+: 20%), postage per card, free shipping over $50, and 13% Ontario HST |
| Checkout | Sign-in gate, billing form, card / PayPal / wallet tabs, Luhn and expiry validation, processing state, and a confirmation page with order and tracking numbers |
| Account | Overview, orders with live status, address book (add / edit / delete), profile and newsletter preference |
| Pages | About (Masood's story, values, timeline, team), Services (holiday, wedding, business, corporate + cleaning) with quote forms, Locations (live maps), Contact, FAQ, Paper guide, Shipping & deadlines, Legal, 404 |
| Site-wide | Top bar (announcements, order tracking, phone, EN/FR, sign in / sign up), sticky navbar with Services and Resources dropdowns, mobile drawer, footer, cookie banner with preferences, toasts, responsive layouts |

## What's mocked

There is **no backend yet**. Accounts, the cart, orders, addresses, newsletter signups and cookie consent are stored in the browser's `localStorage`. Payments, emails and quote requests are simulated.

To go live, the next steps would be:

- Auth: a real provider (e.g. Clerk, Auth.js or Supabase)
- Payments: Stripe (the checkout form is laid out so Stripe Elements can replace it)
- Database: orders, address book, newsletter
- Mailing: a print/mail partner or Canada Post API, with real tracking
- Email: order confirmations

## Content to replace

- **Photos**: free Unsplash images (`src/data/site.ts`). The founder and team portraits are stock placeholders.
- **Videos**: free Mixkit clips (`src/data/site.ts`).
- **Copy**: team names and bios, addresses, phone numbers, statistics and testimonials are placeholder data. Phone numbers use the reserved fictional 555-01xx range.
- **Translations**: `src/i18n/dictionaries/en.ts` and `fr.ts`. The French file is type-checked against the English one, so a missing key fails the build.

## Project structure

```
src/
  app/[lang]/…          routes (every page exists in /en and /fr)
  proxy.ts              locale detection & redirect (Next 16 "proxy", formerly middleware)
  components/
    builder/            the 5-step card builder
    cards/              SVG card designs, the 3D card, paper swatches
    home/               home page sections
    layout/             top bar, navbar, mobile menu, footer, cookie banner
    pages/              page-level client components
    forms/, ui/         form fields, logo, motion helpers, snowfall
  data/                 catalog (designs, papers, pricing rules), site content, demo seed
  i18n/                 config, dictionaries, provider
  lib/                  pricing, tracking simulation, utilities
  store/                Zustand stores (persisted to localStorage)
```
# merry-mail
