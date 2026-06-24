import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App.jsx';
import { SiteProvider } from './context/SiteContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </SiteProvider>
  </StrictMode>
);
