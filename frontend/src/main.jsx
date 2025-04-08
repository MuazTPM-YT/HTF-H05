import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GoogleAuthProvider from './components/GoogleAuthProvider'
import Toaster from './components/ui/toaster.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleAuthProvider>
      <App />
      <Toaster />
    </GoogleAuthProvider>
  </StrictMode>,
)
