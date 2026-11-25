import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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
import { PrivacyPage } from './pages/PrivacyPage';

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

/** Título da aba por página: ajuda no histórico, nos favoritos e ao compartilhar. */
function useDocumentTitle() {
  const { route } = useRouter();
  const { config, bySlug, category, group } = useCatalog();
  useEffect(() => {
    const brand = config.brand.name;
    let title = `${brand} | ${config.brand.tagline}`;
    if (route.name === 'collection') {
      const name = route.category ? category(route.category)?.name ?? group(route.category)?.name : config.copy.collectionTitle;
      title = `${name ?? 'Categoria não encontrada'} | ${brand}`;
    } else if (route.name === 'product') {
      title = `${bySlug(route.slug)?.name ?? 'Produto não encontrado'} | ${brand}`;
    } else if (route.name === 'privacy') {
      title = `${config.copy.privacy?.title ?? 'Privacidade'} | ${brand}`;
    } else if (route.name === 'notfound') {
      title = `Página não encontrada | ${brand}`;
    }
    document.title = title;
  }, [route, config, bySlug, category, group]);
}

function Shell() {
  const { route } = useRouter();
  const { config } = useCatalog();
  useRevealObserver(route);
  useDocumentTitle();
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
    case 'privacy':
      page = <PrivacyPage />;
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
