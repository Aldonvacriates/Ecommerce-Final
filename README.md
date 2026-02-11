# Ecommerce Front-End (React + Vite + Firebase)

Modern ecommerce UI built with React, TypeScript, and Vite. Products come from Fake Store API; authentication uses Firebase email/password with Login, Register, Profile, and Logout flows.

## Live Demo
- https://ecommerce-final-henna.vercel.app/

## Features
- Product catalog from `https://fakestoreapi.com` with category filter, responsive cards, and cart page.
- Firebase Auth: register, login, logout, profile overview, display-name update, account deletion with confirmation modals and friendly error messaging.
- React Router v7 routing; contexts for auth/products; React Query for fetching; Bootstrap UI styling.

## Tech Stack
- React 19, TypeScript, Vite
- Firebase Auth, Axios, React Router v7, React Query, Bootstrap

## Requirements
- Node.js 20.19+ (or 22.12+) and npm.

## Quick Start
```bash
npm ci            # or npm install
npm run dev
```
Open the URL Vite prints (default http://localhost:5173).

## Scripts
- `npm run dev` - start dev server with HMR
- `npm run build` - type-check then build to `dist`
- `npm run preview` - serve the production build locally
- `npm run lint` - run ESLint
- `npm test` - run Jest tests (ts-jest + Testing Library)

## Firebase Configuration
Update `src/lib/firebase/firebase.ts` with my Firebase project values. For production, moving secrets to environment variables and avoid committing them.

## CI/CD
- GitHub Actions workflow `ci-cd.yml` runs install/test/build on pushes/PRs to `main`/`master`.
- Deploy job (pushes only) builds and deploys to Vercel using `VERCEL_TOKEN_1` secret.

## Key Files
- `src/pages/Home/Home.tsx` - product fetch + category filter UI
- `src/pages/Login.tsx`, `Register.tsx`, `Profile.tsx`, `Logout.tsx`, `Cart.tsx` - auth and cart flows
- `src/context/AuthContext.tsx` - Firebase auth state
- `src/context/ProductContext.tsx` - product state and filters
- `src/api/api.ts` - Fake Store API client
- `src/lib/firebase/firebase.ts` - Firebase app/auth setup
- `src/styles/auth-styles.ts`, `src/pages/Home/Home.css` - UI styling

## Project Structure (excerpt)
```
src/
  api/
  commponents/          # shared UI (Navbar, ProductCard)
  context/
  hooks/
  lib/firebase/
  pages/
    Home/
    Cart.tsx
    Login.tsx
    Register.tsx
    Profile.tsx
    Logout.tsx
  styles/
```

## Notes
- Build may warn about large chunks; consider code-splitting if desired.
- Account deletion requires a recent login per Firebase rules; re-authenticate if prompted.
