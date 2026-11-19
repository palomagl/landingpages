import type { AttributeDefinition, AttributeValue, Category, DimensionsValue, Product } from '../config/schema';
import { formatNumber } from './format';

const isDims = (v: AttributeValue): v is DimensionsValue => typeof v === 'object' && v !== null && !Array.isArray(v) && 'w' in v;

/** Valor de atributo formatado para leitura ("2,5 L", "127 V / 220 V", "30 × 40 × 44 cm"). */
export function formatAttribute(def: AttributeDefinition, value: AttributeValue, locale: string): string {
  const unit = def.unit ? ` ${def.unit}` : '';
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  if (typeof value === 'number') return formatNumber(value, locale, def.decimals ?? 0) + unit;
  if (Array.isArray(value)) return value.map((v) => optionLabel(def, v)).join(' / ');
  if (isDims(value)) {
    const parts = [value.w, value.h, value.d].filter((n): n is number => typeof n === 'number');
    return parts.map((n) => formatNumber(n, locale, 1)).join(' × ') + unit;
  }
  return def.type === 'enum' ? optionLabel(def, value) : value;
}

export function optionLabel(def: AttributeDefinition, value: string) {
  return def.options?.find((o) => o.value === value)?.label ?? value;
}

/** Valores "planos" para filtros (listas viram vários valores). */
export function filterValues(value: AttributeValue | undefined): string[] {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return [];
  return [String(value)];
}

export interface KeySpec {
  key: string;
  label: string;
  value: string;
  numeric: boolean;
}

/** Atributos de destaque do produto (para cards e hero). */
export function keySpecs(
  product: Product,
  category: Category | undefined,
  defs: AttributeDefinition[],
  locale: string,
  opts: { limit?: number; numericOnly?: boolean } = {},
): KeySpec[] {
  const { limit = 3, numericOnly = false } = opts;
  const preferred = product.keySpecs ?? category?.keySpecs ?? [];
  const order = [...preferred, ...defs.map((d) => d.key).filter((k) => !preferred.includes(k))];
  const out: KeySpec[] = [];
  for (const key of order) {
    const def = defs.find((d) => d.key === key);
    const value = product.attributes[key];
    if (!def || value === undefined || def.hideInSpecs) continue;
    const numeric = typeof value === 'number';
    if (numericOnly && !numeric) continue;
    if (typeof value === 'boolean') continue;
    out.push({ key, label: def.label, value: formatAttribute(def, value, locale), numeric });
    if (out.length >= limit) break;
  }
  return out;
}

/** Ficha técnica agrupada. */
export function specGroups(product: Product, defs: AttributeDefinition[], locale: string) {
  const groups = new Map<string, { label: string; value: string }[]>();
  for (const def of defs) {
    const value = product.attributes[def.key];
    // recursos ausentes (false) não entram na ficha: só o que o produto tem
    if (value === undefined || value === false || def.hideInSpecs) continue;
    const g = def.group ?? 'Especificações';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push({ label: def.label, value: formatAttribute(def, value, locale) });
  }
  return [...groups.entries()].map(([group, rows]) => ({ group, rows }));
}
