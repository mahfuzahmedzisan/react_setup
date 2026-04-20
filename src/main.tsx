import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@/i18n';
import App from './App';
import { startWebVitals } from '@/performance/webVitals';

startWebVitals();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
