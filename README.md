# Ecommerce Front-End (React + Vite + Firebase)

Modern ecommerce UI built with React, TypeScript, and Vite. Products come from Fake Store API, and authentication uses Firebase (email/password) with Login, Register, Profile, and Logout flows.

## Features
- Product catalog from `https://fakestoreapi.com` with category filter and responsive cards.
- Firebase Auth (email/password): register, login, logout, profile overview, display-name update, account deletion with confirmation.
- Profile modals for delete confirmation/success; friendly auth error messaging.
- React Router v7 routing; contexts for auth and products; inline glassmorphism styling.

## Tech Stack
- React 19, TypeScript, Vite
- Firebase Auth, Axios, React Router v7, React Query, Bootstrap

## Quick Start
Prerequisites: Node.js 18+ and npm.

```bash
npm install
npm run dev
```
Open the URL Vite prints (usually http://localhost:5173).

## Scripts
- `npm run dev` – start dev server with HMR
- `npm run build` – type-check then build to `dist`
- `npm run preview` – serve the production build locally
- `npm run lint` – run ESLint

## Key Files
- `src/pages/Home/Home.tsx` – product fetch + category filter UI
- `src/pages/Login.tsx`, `src/pages/Register.tsx`, `src/pages/Profile.tsx`, `src/pages/Logout.tsx` – auth flows and profile management
- `src/context/AuthContext.tsx` – Firebase auth state
- `src/context/ProductContext.tsx` – product state and filters
- `src/api/api.ts` – Fake Store API client
- `src/lib/firebase/firebase.ts` – Firebase app/auth setup (update keys if you use your own project)
- `src/styles/auth-styles.ts`, `src/pages/Home/Home.css` – UI styling

## Firebase Configuration
Firebase credentials live in `src/lib/firebase/firebase.ts`. Replace with your own project values if needed; for production, move secrets to environment variables and avoid committing them.

## Project Structure (excerpt)
```
src/
  api/
  commponents/          # shared UI (e.g., Navbar, ProductCard)
  context/
  hooks/
  lib/firebase/
  pages/
    Home/
    Login.tsx
    Register.tsx
    Profile.tsx
    Logout.tsx
  styles/
```

## Notes
- Build may warn about large chunks; consider code-splitting if desired.
- Account deletion requires a recent login per Firebase rules; re-authenticate if prompted.
