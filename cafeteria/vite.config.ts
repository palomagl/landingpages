import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// `base: './'` gera caminhos relativos: o build funciona em qualquer hospedagem
// estática ou subpasta (o roteamento é por hash, sem necessidade de rewrites).
// As fontes (src/assets/fonts) entram no build com nome versionado em dist/assets.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    assetsInlineLimit: 8192,
  },
});
