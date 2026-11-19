import type { CatalogConfig } from '../config/schema';

const cache = new Map<string, Intl.NumberFormat>();
function nf(locale: string, opts: Intl.NumberFormatOptions) {
  const key = locale + JSON.stringify(opts);
  if (!cache.has(key)) cache.set(key, new Intl.NumberFormat(locale, opts));
  return cache.get(key)!;
}

export function formatNumber(value: number, locale: string, decimals = 0) {
  return nf(locale, { maximumFractionDigits: decimals, minimumFractionDigits: 0 }).format(value);
}

export function formatPrice(value: number, brand: CatalogConfig['brand']) {
  return nf(brand.locale, { style: 'currency', currency: brand.currency, maximumFractionDigits: 0 }).format(value);
}

export function pluralize(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}
