import { createContext, useContext, useMemo, useState } from 'react';
import type { CatalogConfig, ThemeDefinition } from './config/schema';
import { CatalogProvider, useCatalog } from './core/catalog';
import { RouterProvider, useRouter } from './core/router';
import { useRevealObserver } from './core/motion';
import { ThemeProvider } from './core/theme';
import { QuoteProvider } from './core/quote';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuoteDrawer } from './components/QuoteDrawer';
import { SearchOverlay, ThemeSwitcher, Toast } from './components/Overlays';
import { HomePage } from './pages/HomePage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductPage } from './pages/ProductPage';
import { NotFoundPage } from './pages/NotFoundPage';

/** Estado de interface compartilhado (busca global e termo levado para a coleção). */
interface Ui {
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  query: string;
  setQuery: (q: string) => void;
}
const UiCtx = createContext<Ui | null>(null);
export function useUi() {
  const ctx = useContext(UiCtx);
  if (!ctx) throw new Error('useUi fora do App');
  return ctx;
}

export function App({ config, initialTheme }: { config: CatalogConfig; initialTheme: ThemeDefinition }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ui = useMemo<Ui>(
    () => ({ searchOpen, openSearch: () => setSearchOpen(true), closeSearch: () => setSearchOpen(false), query, setQuery }),
    [searchOpen, query],
  );
  return (
    <CatalogProvider config={config}>
      <ThemeProvider themes={config.theme.available} initial={initialTheme}>
        <RouterProvider>
          <QuoteProvider>
            <UiCtx.Provider value={ui}>
              <Shell />
            </UiCtx.Provider>
          </QuoteProvider>
        </RouterProvider>
      </ThemeProvider>
    </CatalogProvider>
  );
}

function Shell() {
  const { route } = useRouter();
  const { config } = useCatalog();
  useRevealObserver(route);
  let page;
  switch (route.name) {
    case 'home':
      page = <HomePage />;
      break;
    case 'collection':
      page = <CollectionPage key="collection" category={route.category} />;
      break;
    case 'product':
      page = <ProductPage key={route.slug} slug={route.slug} />;
      break;
    default:
      page = <NotFoundPage />;
  }
  return (
    <>
      <a
        href="#conteudo"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('conteudo')?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        {page}
      </main>
      <Footer />
      {config.features.quote && <QuoteDrawer />}
      {config.features.search && <SearchOverlay />}
      {config.features.quote && <Toast />}
      {config.features.themeSwitcher && <ThemeSwitcher />}
    </>
  );
}
