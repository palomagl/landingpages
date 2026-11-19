import type { CatalogConfig, Product } from '../config/schema';
import { filterValues, optionLabel } from './attributes';
import { formatNumber, formatPrice } from './format';

export type SortKey = 'destaque' | 'preco-asc' | 'preco-desc' | 'nome';

export const SORT_LABELS: Record<SortKey, string> = {
  destaque: 'Em destaque',
  'preco-asc': 'Menor preço',
  'preco-desc': 'Maior preço',
  nome: 'Nome',
};

export interface FilterState {
  query: string;
  options: Record<string, string[]>;
  toggles: string[];
  ranges: Record<string, [number, number]>;
  sort: SortKey;
}

export const PRICE_KEY = '__preco';

export const emptyFilters = (): FilterState => ({ query: '', options: {}, toggles: [], ranges: {}, sort: 'destaque' });

export type Facet =
  | { kind: 'options'; key: string; label: string; values: { value: string; label: string; count: number }[] }
  | { kind: 'toggles'; key: string; label: string; values: { value: string; label: string; count: number }[] }
  | { kind: 'range'; key: string; label: string; min: number; max: number; step: number; format: (n: number) => string };

function numericValue(p: Product, key: string): number | undefined {
  if (key === PRICE_KEY) return p.price ?? undefined;
  const v = p.attributes[key];
  return typeof v === 'number' ? v : undefined;
}

/** Filtros gerados a partir do esquema de atributos — nada é específico do segmento. */
export function buildFacets(config: CatalogConfig, products: Product[]): Facet[] {
  const facets: Facet[] = [];
  const toggleGroups = new Map<string, Extract<Facet, { kind: 'toggles' }>>();
  for (const def of config.attributes) {
    if (!def.filter) continue;
    if (def.filter === 'options') {
      const counts = new Map<string, number>();
      for (const p of products) for (const v of filterValues(p.attributes[def.key])) counts.set(v, (counts.get(v) ?? 0) + 1);
      if (counts.size < 2) continue;
      const values = [...counts.entries()]
        .map(([value, count]) => ({
          value,
          count,
          label:
            def.type === 'number'
              ? formatNumber(Number(value), config.brand.locale) + (def.unit ? ` ${def.unit}` : '')
              : optionLabel(def, value),
        }))
        .sort((a, b) =>
          def.type === 'number'
            ? Number(a.value) - Number(b.value)
            : (def.options?.findIndex((o) => o.value === a.value) ?? 0) - (def.options?.findIndex((o) => o.value === b.value) ?? 0),
        );
      facets.push({ kind: 'options', key: def.key, label: def.filterLabel ?? def.label, values });
    } else if (def.filter === 'toggle') {
      const count = products.filter((p) => p.attributes[def.key] === true).length;
      if (!count || count === products.length) continue;
      const label = def.filterLabel ?? 'Recursos';
      if (!toggleGroups.has(label)) {
        const facet = { kind: 'toggles' as const, key: `toggles:${label}`, label, values: [] as { value: string; label: string; count: number }[] };
        toggleGroups.set(label, facet);
        facets.push(facet);
      }
      toggleGroups.get(label)!.values.push({ value: def.key, label: def.toggleLabel ?? def.label, count });
    } else if (def.filter === 'range') {
      const nums = products.map((p) => numericValue(p, def.key)).filter((n): n is number => n !== undefined);
      if (nums.length < 2) continue;
      const min = Math.min(...nums);
      const max = Math.max(...nums);
      if (min === max) continue;
      facets.push({
        kind: 'range',
        key: def.key,
        label: def.filterLabel ?? def.label,
        min,
        max,
        step: niceStep(max - min),
        format: (n) => formatNumber(n, config.brand.locale, def.decimals ?? 0) + (def.unit ? ` ${def.unit}` : ''),
      });
    }
  }
  if (config.features.prices) {
    const prices = products.map((p) => p.price).filter((n): n is number => typeof n === 'number');
    if (prices.length > 1) {
      const step = niceStep(Math.max(...prices) - Math.min(...prices));
      facets.push({
        kind: 'range',
        key: PRICE_KEY,
        label: 'Faixa de preço',
        min: Math.floor(Math.min(...prices) / step) * step,
        max: Math.ceil(Math.max(...prices) / step) * step,
        step,
        format: (n) => formatPrice(n, config.brand),
      });
    }
  }
  return facets;
}

function niceStep(span: number) {
  const raw = span / 40;
  const pow = Math.pow(10, Math.floor(Math.log10(Math.max(raw, 1))));
  return [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? pow * 10;
}

export function applyFilters(
  config: CatalogConfig,
  products: Product[],
  state: FilterState,
  scores: Map<string, number> | null,
): Product[] {
  const list = products.filter((p) => {
    if (scores && !scores.has(p.id)) return false;
    for (const [key, selected] of Object.entries(state.options)) {
      if (!selected.length) continue;
      const vals = filterValues(p.attributes[key]);
      if (!selected.some((s) => vals.includes(s))) return false;
    }
    for (const key of state.toggles) if (p.attributes[key] !== true) return false;
    for (const [key, [lo, hi]] of Object.entries(state.ranges)) {
      const n = numericValue(p, key);
      if (n === undefined || n < lo || n > hi) return false;
    }
    return true;
  });
  const order = new Map(config.products.map((p, i) => [p.id, i]));
  const byOrder = (a: Product, b: Product) => order.get(a.id)! - order.get(b.id)!;
  const price = (p: Product, missing: number) => (typeof p.price === 'number' ? p.price : missing);
  switch (state.sort) {
    case 'preco-asc':
      return list.sort((a, b) => price(a, Infinity) - price(b, Infinity) || byOrder(a, b));
    case 'preco-desc':
      return list.sort((a, b) => price(b, -Infinity) - price(a, -Infinity) || byOrder(a, b));
    case 'nome':
      return list.sort((a, b) => a.name.localeCompare(b.name, config.brand.locale));
    default:
      if (scores) return list.sort((a, b) => scores.get(b.id)! - scores.get(a.id)! || byOrder(a, b));
      return list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || byOrder(a, b));
  }
}

export interface Chip {
  id: string;
  label: string;
  remove: (s: FilterState) => FilterState;
}

/** Filtros ativos como etiquetas removíveis. */
export function activeChips(config: CatalogConfig, state: FilterState, facets: Facet[]): Chip[] {
  const chips: Chip[] = [];
  for (const [key, values] of Object.entries(state.options)) {
    const facet = facets.find((f) => f.key === key);
    for (const v of values) {
      const label = facet?.kind === 'options' ? facet.values.find((x) => x.value === v)?.label ?? v : v;
      chips.push({
        id: `${key}:${v}`,
        label,
        remove: (s) => ({ ...s, options: { ...s.options, [key]: (s.options[key] ?? []).filter((x) => x !== v) } }),
      });
    }
  }
  for (const key of state.toggles) {
    const def = config.attributes.find((d) => d.key === key);
    chips.push({ id: `t:${key}`, label: def?.toggleLabel ?? def?.label ?? key, remove: (s) => ({ ...s, toggles: s.toggles.filter((x) => x !== key) }) });
  }
  for (const [key, [lo, hi]] of Object.entries(state.ranges)) {
    const facet = facets.find((f) => f.key === key);
    if (facet?.kind !== 'range') continue;
    chips.push({
      id: `r:${key}`,
      label: `${facet.format(lo)} a ${facet.format(hi)}`,
      remove: (s) => {
        const ranges = { ...s.ranges };
        delete ranges[key];
        return { ...s, ranges };
      },
    });
  }
  return chips;
}

export function countActive(state: FilterState) {
  return (
    Object.values(state.options).reduce((n, v) => n + v.length, 0) + state.toggles.length + Object.keys(state.ranges).length
  );
}
