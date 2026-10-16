import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './home.css'
import './audit.css'

// StrictMode sengaja tidak dipakai: engine portal (preloader + canvas)
// dijalankan sekali saat mount dan tidak boleh di-mount dua kali di mode dev.
createRoot(document.getElementById('root')).render(<App />)
