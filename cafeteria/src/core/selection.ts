import type { OptionValue, Product } from '../config/schema';

/** Variação escolhida: { [optionId]: valueId } */
export type Selection = Record<string, string>;

export function defaultSelection(product: Product): Selection {
  const sel: Selection = {};
  for (const o of product.options ?? []) if (o.values[0]) sel[o.id] = o.values[0].id;
  return sel;
}

/** Garante que a seleção só tenha opções válidas para o produto. */
export function normalizeSelection(product: Product, sel: Selection | undefined): Selection {
  const base = defaultSelection(product);
  if (!sel) return base;
  for (const o of product.options ?? []) {
    if (sel[o.id] && o.values.some((v) => v.id === sel[o.id])) base[o.id] = sel[o.id];
  }
  return base;
}

export function selectedValues(product: Product, sel: Selection): { option: string; label: string; value: OptionValue }[] {
  return (product.options ?? []).flatMap((o) => {
    const v = o.values.find((x) => x.id === sel[o.id]);
    return v ? [{ option: o.id, label: o.label, value: v }] : [];
  });
}

export function priceFor(product: Product, sel: Selection): number | null {
  if (product.price == null) return null;
  return product.price + selectedValues(product, sel).reduce((sum, s) => sum + (s.value.priceDelta ?? 0), 0);
}

/** Chave estável para agrupar itens iguais no orçamento. */
export function selectionKey(productId: string, sel: Selection) {
  return (
    productId +
    '|' +
    Object.keys(sel)
      .sort()
      .map((k) => `${k}=${sel[k]}`)
      .join('&')
  );
}
