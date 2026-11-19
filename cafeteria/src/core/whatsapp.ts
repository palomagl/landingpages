import type { CatalogConfig, Product } from '../config/schema';
import { formatPrice } from './format';
import { priceFor, selectedValues, type Selection } from './selection';

export interface QuoteLine {
  product: Product;
  selection: Selection;
  quantity: number;
  note?: string;
}

/**
 * Monta a mensagem do pedido de orçamento. O formato usa *negrito* do
 * WhatsApp e é legível também se copiado para e-mail.
 */
export function buildQuoteMessage(
  config: CatalogConfig,
  lines: QuoteLine[],
  customer: Record<string, string>,
  notes: string,
): string {
  const { copy, brand, features } = config;
  const out: string[] = [copy.quote.greeting.replace('{brand}', brand.name), ''];
  let total = 0;
  let allPriced = true;
  lines.forEach((l, i) => {
    const cat = config.categories.find((c) => c.id === l.product.category);
    out.push(`*${i + 1}. ${l.product.name}*${cat ? ` (${cat.name})` : ''}`);
    for (const s of selectedValues(l.product, l.selection)) out.push(`   ${s.label}: ${s.value.label}`);
    out.push(`   Quantidade: ${l.quantity}`);
    const unit = priceFor(l.product, l.selection);
    if (features.prices && features.pricesInMessage && unit != null) {
      out.push(`   Valor de referência: ${formatPrice(unit, brand)}${l.quantity > 1 ? ' cada' : ''}`);
      total += unit * l.quantity;
    } else allPriced = false;
    if (l.note?.trim()) out.push(`   Observação: ${l.note.trim()}`);
    out.push('');
  });
  if (features.prices && features.pricesInMessage && lines.length && total > 0) {
    out.push(`Total de referência${allPriced ? '' : ' (itens com preço)'}: ${formatPrice(total, brand)}`, '');
  }
  if (notes.trim()) out.push(`*${copy.quote.notesLabel}:* ${notes.trim()}`, '');
  const who = config.quoteFields
    .map((f) => [f.messageLabel ?? f.label, customer[f.id]?.trim()] as const)
    .filter(([, v]) => v);
  if (who.length) {
    for (const [label, v] of who) out.push(`${label}: ${v}`);
    out.push('');
  }
  out.push(copy.quote.closing);
  return out.join('\n');
}

/** Link do WhatsApp. Sem número configurado, o app pede para escolher o contato. */
export function whatsappUrl(number: string, text: string) {
  const digits = number.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
