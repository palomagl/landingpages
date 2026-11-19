import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { catalogConfig } from './config/catalog.config';
import { applyTheme, initialTheme } from './core/theme';
import { App } from './App';

const config = catalogConfig;

// Marca: fontes, título e descrição vêm da configuração central.
const root = document.documentElement;
root.style.setProperty('--f-display', config.brand.fonts.display);
root.style.setProperty('--f-text', config.brand.fonts.text);
root.style.setProperty('--f-logo', config.brand.fonts.logo);
root.lang = config.brand.locale;
document.title = `${config.brand.name} | ${config.brand.tagline}`;
document.querySelector('meta[name="description"]')?.setAttribute('content', config.brand.description);
if (config.brand.fonts.stylesheet) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = config.brand.fonts.stylesheet;
  document.head.appendChild(link);
}

// Tema aplicado antes do primeiro render, sem "piscar".
const theme = initialTheme(config.theme.available, config.theme.default, config.features.themeSwitcher);
applyTheme(theme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App config={config} initialTheme={theme} />
  </StrictMode>,
);
