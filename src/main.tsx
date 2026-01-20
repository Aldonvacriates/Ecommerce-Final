import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "@smastrom/react-rating/style.css";

// Standard Vite entrypoint; leaving StrictMode on to surface lifecycle warnings while I iterate.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
