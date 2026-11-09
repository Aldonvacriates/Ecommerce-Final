# Ecommerce Final: React + Firebase Storefront

A React 19 + TypeScript storefront front end that browses the Fake Store API catalog and handles the full Firebase email/password account lifecycle, with Jest tests and a GitHub Actions pipeline that deploys to Vercel.

Final project for the Coding Temple full-stack program, built December 2025 to February 2026.

**Live demo:** https://ecommerce-final-henna.vercel.app

## Features

- **Product catalog** loaded from [Fake Store API](https://fakestoreapi.com) (`/products` and `/products/categories`), shown as responsive cards with title, image, price, category and a read-only star rating.
- **Category filter** dropdown populated from the API, with a "Clear filter" button. Filtering happens on the client, so switching categories does not refetch.
- **Firebase Auth account lifecycle** (email/password):
  - Register with name, email and password; the name is saved as the Firebase display name.
  - Login with friendly messages for common Firebase error codes (unknown account, wrong password, invalid email, too many attempts).
  - Profile page that redirects guests to `/login`, shows account details and lets the user change their display name.
  - Account deletion behind a confirmation modal. If Firebase rejects it with `auth/requires-recent-login`, the page asks the user to sign in again before retrying.
  - Logout page with a "Stay logged in" option.
- **Auth-aware navigation**: one link config drives both the desktop navbar and an animated mobile menu (Framer Motion) that keeps keyboard focus inside while open. Guests see Login/Register; signed-in users see Profile/Logout.
- **Cart**: the `/cart` route and nav link exist, but the page is still a placeholder. There is no add-to-cart or checkout flow yet.

## Tech stack

- React 19, TypeScript, Vite 7
- React Router v7, TanStack React Query v5, Axios
- Firebase JS SDK v12 (Authentication)
- Bootstrap 5 / React Bootstrap, Framer Motion, `@smastrom/react-rating`
- Jest 30, ts-jest, React Testing Library, jsdom
- ESLint, Prettier
- GitHub Actions, Vercel

## How it works

- **Server state vs. UI state.** React Query fetches products and categories (`src/pages/Home/Home.tsx`) through a small typed Axios client (`src/api/api.ts`). The fetched products are copied into a `useReducer` store (`src/context/ProductContext.tsx`) that also holds the selected category, so filtering is a pure in-memory operation.
- **Auth state as a context.** `src/context/AuthContext.tsx` subscribes once to Firebase `onAuthStateChanged` and exposes the current user. The navbar filters its links by an `audience` field (`any` / `guest` / `authenticated`) defined in `src/commponents/Navbar/navLinks.ts`, and the profile page uses the same context to redirect guests.
- **Firebase edge cases on the profile page.** `src/pages/Profile.tsx` re-reads `auth.currentUser` after `updateProfile` so the context reflects the new name, reloads the user before `deleteUser`, and maps `auth/requires-recent-login` to a clear "sign in again" message.
- **Accessible mobile menu.** `src/commponents/Navbar/MobileMenu.tsx` moves focus into the menu when it opens and wraps Tab / Shift+Tab between the first and last focusable elements.

## Getting started

### Prerequisites

- Node.js 20.19+ (or 22.12+), as required by Vite 7. CI uses Node 20.19.0.
- npm

### Install and run

```bash
npm ci
npm run dev
```

Open the URL Vite prints (default http://localhost:5173).

### Configuration

No environment variables are needed. The Firebase web config lives in `src/lib/firebase/firebase.ts` and points at the project used by the live demo. To run against your own Firebase project, replace those values with your project's web app config and enable the Email/Password sign-in provider in the Firebase console.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Jest test suite |

## Testing

Jest runs with ts-jest and a jsdom environment (`jest.config.cjs`). `jest.setup.ts` polyfills `TextEncoder`/`TextDecoder` and `fetch` so the Firebase SDK can load under jsdom, and `@testing-library/jest-dom` is loaded for DOM matchers.

Coverage is minimal today: the suite has one snapshot test for the logout page (`src/test/Logout.test.tsx`).

```bash
npm test
```

## CI/CD

`.github/workflows/ci-cd.yml` defines two jobs:

1. **Install, Test, and Build** runs on every pull request targeting `main`/`master` and on every push to `main`/`master`: `npm ci`, `npm test`, `npm run build` on Node 20.19.0.
2. **Deploy to Vercel** runs only on pushes to `main`/`master`, after the build job passes. It reinstalls and rebuilds, then deploys with the Vercel CLI (`vercel --prod --yes`) using the `VERCEL_TOKEN_1` repository secret.

Pull requests therefore get test and build checks only; production deploys happen when changes land on `main`.

## Project structure

```
src/
  api/api.ts                 # Fake Store API client (Axios)
  commponents/
    Navbar/                  # navbar, mobile menu, shared link config
    ProductCard/             # product tile
  context/
    AuthContext.tsx          # Firebase auth state
    ProductContext.tsx       # products + selected category (useReducer)
  hooks/useMediaQuery.ts
  lib/firebase/firebase.ts   # Firebase app and auth setup
  pages/
    Home/                    # catalog + category filter
    Login.tsx  Register.tsx  Profile.tsx  Logout.tsx
    Cart.tsx                 # placeholder
  styles/                    # auth page style objects
  test/                      # Jest tests and snapshots
  types/types.ts             # API response types
```

## What I'd improve next

- Build the cart: add-to-cart from product cards, cart state in context, and a checkout summary.
- Move the Firebase config into `VITE_FIREBASE_*` environment variables with a committed `.env.example`.
- Add real tests for the product reducer, category filtering and the login/register forms.
- Rename `src/commponents` to `src/components`, and have the deploy job reuse the build job's output instead of rebuilding.
