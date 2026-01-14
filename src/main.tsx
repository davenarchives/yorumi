import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

import { AnimeProvider } from './context/AnimeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AnimeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AnimeProvider>
  </StrictMode>,
)
