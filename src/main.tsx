import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // <--- Importamos esto aquí
import { AppContextProvider } from './context/AppContext.tsx';
import { LanguageProvider } from '@/context/LanguageContext';
import '@cloudscape-design/global-styles/index.css';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* El Router debe ser el padre supremo para que los Contextos puedan usar navigate() si lo necesitan */}
    <HashRouter>
      <AppContextProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </AppContextProvider>
    </HashRouter>
  </StrictMode>,
);
