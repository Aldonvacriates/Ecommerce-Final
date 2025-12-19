# Ecommerce Front-End (React + Vite)

A lightweight ecommerce UI built with React, TypeScript, and Vite. The home page pulls live products from Fake Store API, presents them in responsive cards with pricing, category, description, and star ratings, and includes a simple profile route for future account features.

## Features
- Live product feed from `https://fakestoreapi.com/products` rendered with typed Product models.
- Responsive product cards (Bootstrap) showing price, category, description, and read-only ratings via `@smastrom/react-rating`.
- Client-side routing with React Router (`/` for the catalog, `/profile` placeholder for user info).
- Vite-powered DX with hot reload, TypeScript support, and lint/build scripts ready for deployment.

## Getting Started
Prerequisites: Node.js 18+ and npm.

Install dependencies:
```bash
npm install
```

Start the dev server:
```bash
npm run dev
```
Vite will print a local URL (usually http://localhost:5173) where you can interact with the catalog.

## Available Scripts
- `npm run dev` – start the Vite dev server with HMR.
- `npm run build` – type-check and create a production build in `dist`.
- `npm run preview` – serve the production build locally.
- `npm run lint` – run ESLint over the project.

## How It Works
- `src/pages/Home.tsx` fetches products on load and renders `ProductCard` for each result.
- `src/commponents/ProductCard.tsx` displays product details with image, price, uppercase category, rating widget, and description.
- `src/App.tsx` wires routing for the catalog and the placeholder profile page.
- `src/types/types.ts` defines the Product interface used across the app.

## Configuration Notes
- API endpoint: update the URL in `src/pages/Home.tsx` if you want to point to a different product feed or your own backend.
- Styling: the layout relies on Bootstrap utility classes; add global styles in `src/index.css` as needed.

## Project Structure
```
src/
  App.tsx               # Router and page registration
  main.tsx              # App bootstrap and global styles
  pages/                # Page-level views (Home, Profile)
  commponents/          # Reusable UI pieces (ProductCard)
  types/                # Shared TypeScript interfaces
public/                 # Static assets served as-is
```

## Next Steps
- Replace the Profile placeholder with real account data, orders, or saved items.
- Add filtering or category navigation on the catalog page.
- Connect to your own API for authenticated carts and checkout.
