import type { CatalogConfig, Product } from '../config/schema';
import { formatAttribute } from './attributes';

/** Minúsculas e sem acentos: "Rosácea" → "rosacea". */
export function normalize(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

type Indexed = { product: Product; fields: [string, number][] };
const indexCache = new WeakMap<CatalogConfig, Indexed[]>();

function buildIndex(config: CatalogConfig): Indexed[] {
  const cached = indexCache.get(config);
  if (cached) return cached;
  const idx = config.products.map((p) => {
    const cat = config.categories.find((c) => c.id === p.category);
    const attrs = config.attributes
      .filter((d) => p.attributes[d.key] !== undefined && typeof p.attributes[d.key] !== 'boolean')
      .map((d) => formatAttribute(d, p.attributes[d.key], config.brand.locale))
      .join(' ');
    const options = (p.options ?? []).flatMap((o) => o.values.map((v) => v.label)).join(' ');
    const fields: [string, number][] = [
      [p.name, 8],
      [cat?.name ?? '', 3],
      [(p.keywords ?? []).join(' '), 3],
      [p.summary, 2],
      [options, 1.5],
      [attrs, 1],
      [p.description, 0.5],
    ];
    return { product: p, fields: fields.map(([t, w]) => [normalize(t), w] as [string, number]) };
  });
  indexCache.set(config, idx);
  return idx;
}

/** Busca por termos: todos os termos precisam aparecer; o nome pesa mais. */
export function searchProducts(config: CatalogConfig, query: string): Map<string, number> {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const scores = new Map<string, number>();
  if (!terms.length) return scores;
  for (const { product, fields } of buildIndex(config)) {
    let total = 0;
    let ok = true;
    for (const t of terms) {
      let best = 0;
      for (const [text, w] of fields) {
        const i = text.indexOf(t);
        if (i >= 0) best = Math.max(best, w * (i === 0 || text[i - 1] === ' ' ? 1.5 : 1));
      }
      if (!best) {
        ok = false;
        break;
      }
      total += best;
    }
    if (ok) scores.set(product.id, total);
  }
  return scores;
}
