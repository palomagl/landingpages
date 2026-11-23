import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

// Política de segurança de conteúdo: só carrega o que é do próprio site (scripts, estilos, fontes e
// fotos). frame-src libera só o Google Maps, usado quando mapEmbedUrl estiver preenchido no config.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "font-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://www.google.com https://maps.google.com",
  "manifest-src 'self'",
  "worker-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "upgrade-insecure-requests",
].join("; ");

// Coloca a mesma política no index.html gerado pelo build, para valer em qualquer hospedagem (na
// Vercel ela também vai no cabeçalho, pelo vercel.json). Fica fora do modo dev porque o Vite injeta
// estilos inline enquanto você desenvolve.
const cspMeta = (): Plugin => ({
  name: "csp-meta",
  apply: "build",
  // Entra no começo do <head>, antes de qualquer script ou estilo, para valer para todos eles.
  transformIndexHtml: () => [{ tag: "meta", attrs: { "http-equiv": "Content-Security-Policy", content: CSP }, injectTo: "head-prepend" }],
});

export default defineConfig({
  plugins: [react(), cspMeta()],
  build: { sourcemap: false },
});
