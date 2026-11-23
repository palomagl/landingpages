import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';

/**
 * Roteamento por hash, no formato "#colecao", "#colecao-espresso",
 * "#produto-pilar". Funciona em qualquer hospedagem estática (sem rewrites)
 * e dentro de iframes/artifacts. As trocas usam View Transitions quando o
 * navegador suporta.
 */
export type Route =
  | { name: 'home'; anchor?: string }
  | { name: 'collection'; category: string | null }
  | { name: 'product'; slug: string }
  | { name: 'privacy' }
  | { name: 'notfound'; hash: string };

/** Decodifica sem lançar erro: um "%" solto no endereço não pode derrubar o site. */
function safeDecode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export function parseHash(hash: string): Route {
  const h = safeDecode(hash.replace(/^#/, ''));
  if (!h || h === 'inicio') return { name: 'home' };
  if (h === 'contato') return { name: 'home', anchor: 'contato' };
  if (h === 'colecao') return { name: 'collection', category: null };
  if (h.startsWith('colecao-')) return { name: 'collection', category: h.slice(8) };
  if (h.startsWith('produto-')) return { name: 'product', slug: h.slice(8) };
  if (h === 'privacidade') return { name: 'privacy' };
  return { name: 'notfound', hash: h };
}

export const routes = {
  home: () => '#inicio',
  contact: () => '#contato',
  privacy: () => '#privacidade',
  collection: (category?: string | null) => (category ? `#colecao-${category}` : '#colecao'),
  product: (slug: string) => `#produto-${slug}`,
};

const RouterCtx = createContext<{ route: Route; navigate: (hash: string) => void } | null>(null);

type VT = { finished: Promise<void>; ready: Promise<void>; updateCallbackDone: Promise<void> };
type VTDocument = Document & { startViewTransition?: (cb: () => void) => VT };

export function withViewTransition(update: () => void) {
  const doc = document as VTDocument;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!doc.startViewTransition || reduce || document.visibilityState !== 'visible') return update();
  try {
    const t = doc.startViewTransition(() => flushSync(update));
    // transições podem ser abortadas (redimensionamento, aba oculta): não é erro
    const ignore = () => {};
    t.finished.catch(ignore);
    t.ready.catch(ignore);
    t.updateCallbackDone.catch(ignore);
  } catch {
    update();
  }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  const current = useRef(route);

  useEffect(() => {
    const onHash = () => {
      const next = parseHash(window.location.hash);
      const prev = current.current;
      current.current = next;
      const scrollAnchor = () => {
        const id = next.name === 'home' ? next.anchor : undefined;
        if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      if (prev.name === 'home' && next.name === 'home') {
        // âncoras dentro da página inicial: só rola, sem trocar de tela
        setRoute(next);
        if (next.anchor) scrollAnchor();
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      withViewTransition(() => {
        setRoute(next);
        // dentro da coleção, trocar de categoria mantém o contexto de leitura
        if (!(prev.name === 'collection' && next.name === 'collection')) window.scrollTo(0, 0);
      });
      window.setTimeout(scrollAnchor, 80);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((hash: string) => {
    if (window.location.hash === hash) return;
    window.location.hash = hash;
  }, []);

  // âncora na primeira carga (ex.: link direto para #contato)
  useEffect(() => {
    const r = current.current;
    if (r.name === 'home' && r.anchor) window.setTimeout(() => document.getElementById(r.anchor!)?.scrollIntoView(), 300);
  }, []);

  return <RouterCtx.Provider value={{ route, navigate }}>{children}</RouterCtx.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterCtx);
  if (!ctx) throw new Error('useRouter fora do RouterProvider');
  return ctx;
}
