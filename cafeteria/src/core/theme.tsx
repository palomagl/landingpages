import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { ThemeDefinition } from '../config/schema';
import { storage } from './hooks';
import { withViewTransition } from './router';

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

/** Aplica o tema como variáveis CSS (--c-*), lidas pelo Tailwind em index.css. */
export function applyTheme(theme: ThemeDefinition) {
  const root = document.documentElement;
  for (const [k, v] of Object.entries(theme.colors)) root.style.setProperty(`--c-${kebab(k)}`, v);
  root.style.colorScheme = theme.scheme;
  root.dataset.theme = theme.id;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.colors.bg);
}

const KEY = 'catalogo.tema';

export function initialTheme(themes: ThemeDefinition[], fallback: string, allowStored: boolean) {
  const stored = allowStored ? storage.get<string | null>(KEY, null) : null;
  return themes.find((t) => t.id === stored) ?? themes.find((t) => t.id === fallback) ?? themes[0];
}

const Ctx = createContext<{ theme: ThemeDefinition; themes: ThemeDefinition[]; setTheme: (id: string) => void } | null>(null);

export function ThemeProvider({ themes, initial, children }: { themes: ThemeDefinition[]; initial: ThemeDefinition; children: ReactNode }) {
  const [theme, set] = useState(initial);
  const setTheme = useCallback(
    (id: string) => {
      const next = themes.find((t) => t.id === id);
      if (!next) return;
      storage.set(KEY, id);
      withViewTransition(() => {
        applyTheme(next);
        set(next);
      });
    },
    [themes],
  );
  return <Ctx.Provider value={{ theme, themes, setTheme }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme fora do ThemeProvider');
  return ctx;
}
