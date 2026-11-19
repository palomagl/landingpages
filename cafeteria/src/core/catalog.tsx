import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { CatalogConfig, Category, CollectionGroup, Product } from '../config/schema';

/**
 * Acesso ao catálogo. Hoje os dados vêm do arquivo de configuração; para um
 * painel administrativo ou CMS no futuro, basta carregar um `CatalogConfig`
 * (ou só `products`/`categories`) de uma API e passá-lo a este provider —
 * nenhum componente importa a configuração diretamente.
 */
export interface Catalog {
  config: CatalogConfig;
  products: Product[];
  categories: (Category & { count: number })[];
  byId: (id: string) => Product | undefined;
  bySlug: (slug: string) => Product | undefined;
  category: (id: string) => Category | undefined;
  group: (id: string) => CollectionGroup | undefined;
  /** Produtos de uma categoria ou de um grupo de categorias. */
  productsIn: (id: string) => Product[];
  related: (product: Product, limit?: number) => Product[];
}

const Ctx = createContext<Catalog | null>(null);

export function CatalogProvider({ config, children }: { config: CatalogConfig; children: ReactNode }) {
  const value = useMemo<Catalog>(() => {
    const byIdMap = new Map(config.products.map((p) => [p.id, p]));
    const bySlugMap = new Map(config.products.map((p) => [p.slug, p]));
    const catMap = new Map(config.categories.map((c) => [c.id, c]));
    const groupMap = new Map(config.groups.map((g) => [g.id, g]));
    return {
      config,
      products: config.products,
      categories: config.categories.map((c) => ({ ...c, count: config.products.filter((p) => p.category === c.id).length })),
      byId: (id) => byIdMap.get(id),
      bySlug: (slug) => bySlugMap.get(slug),
      category: (id) => catMap.get(id),
      group: (id) => groupMap.get(id),
      productsIn: (id) => {
        const g = groupMap.get(id);
        const ids = g ? g.categories : [id];
        return config.products.filter((p) => ids.includes(p.category));
      },
      related: (product, limit = 4) => {
        const explicit = (product.related ?? []).map((id) => byIdMap.get(id)).filter((p): p is Product => !!p);
        const same = config.products.filter((p) => p.category === product.category && p.id !== product.id && !explicit.includes(p));
        return [...explicit, ...same].slice(0, limit);
      },
    };
  }, [config]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalog() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCatalog fora do CatalogProvider');
  return ctx;
}
