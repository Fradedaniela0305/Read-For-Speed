import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import "./App.css";
import { AuthContextProvider } from './context/AuthContext.jsx'
import "./styles/global.css";
import "./styles/themes.css";
import "./styles/layout.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider> 
    <BrowserRouter> 
    <App />
    </BrowserRouter>
    </AuthContextProvider>
  </StrictMode>,
)
