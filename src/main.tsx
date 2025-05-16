import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './quiz.css'
import './boardgame.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
