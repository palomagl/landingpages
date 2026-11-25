import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useCatalog } from './catalog';
import { storage } from './hooks';
import { normalizeSelection, priceFor, selectionKey, type Selection } from './selection';
import type { QuoteLine } from './whatsapp';
import type { Product } from '../config/schema';

export interface QuoteItem {
  key: string;
  productId: string;
  selection: Selection;
  quantity: number;
  note: string;
}

interface QuoteState {
  items: QuoteItem[];
  customer: Record<string, string>;
  notes: string;
}

interface QuoteApi extends QuoteState {
  lines: (QuoteLine & { key: string })[];
  count: number;
  total: number | null;
  isOpen: boolean;
  lastAdded: string | null;
  open: () => void;
  close: () => void;
  add: (productId: string, selection: Selection, quantity?: number, note?: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  setNote: (key: string, note: string) => void;
  remove: (key: string) => void;
  clear: () => void;
  /** Apaga tudo o que o catálogo guardou neste aparelho (itens, dados e observações). */
  forget: () => void;
  setCustomer: (id: string, value: string) => void;
  setNotes: (notes: string) => void;
  has: (productId: string) => boolean;
}

const Ctx = createContext<QuoteApi | null>(null);

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const strings = (v: unknown): Record<string, string> =>
  isRecord(v) ? Object.fromEntries(Object.entries(v).filter((e): e is [string, string] => typeof e[1] === 'string')) : {};

/**
 * Restaura o orçamento salvo no navegador sem confiar no formato: dados de uma
 * versão antiga do catálogo ou corrompidos viram um orçamento válido (ou vazio),
 * nunca uma tela em branco.
 */
function restore(saved: unknown, byId: (id: string) => Product | undefined): QuoteState {
  const empty: QuoteState = { items: [], customer: {}, notes: '' };
  if (!isRecord(saved) || !Array.isArray(saved.items)) return empty;
  const items: QuoteItem[] = [];
  for (const raw of saved.items) {
    if (!isRecord(raw) || typeof raw.productId !== 'string') continue;
    const product = byId(raw.productId);
    if (!product) continue; // produto saiu do catálogo
    const selection = normalizeSelection(product, strings(raw.selection));
    const key = selectionKey(product.id, selection);
    const q = Math.round(Number(raw.quantity));
    const quantity = Number.isFinite(q) ? Math.max(1, Math.min(99, q)) : 1;
    const note = typeof raw.note === 'string' ? raw.note : '';
    const same = items.find((i) => i.key === key);
    if (same) same.quantity = Math.min(99, same.quantity + quantity);
    else items.push({ key, productId: product.id, selection, quantity, note });
  }
  return { items, customer: strings(saved.customer), notes: typeof saved.notes === 'string' ? saved.notes : '' };
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const { config, byId } = useCatalog();
  const KEY = `catalogo.orcamento.${config.brand.name}`;
  const [state, setState] = useState<QuoteState>(() => restore(storage.get<unknown>(KEY, null), byId));
  const [isOpen, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  useEffect(() => storage.set(KEY, state), [KEY, state]);
  useEffect(() => {
    if (!lastAdded) return;
    const t = window.setTimeout(() => setLastAdded(null), 2200);
    return () => window.clearTimeout(t);
  }, [lastAdded]);

  const add = useCallback(
    (productId: string, selection: Selection, quantity = 1, note = '') => {
      const product = byId(productId);
      if (!product) return;
      const sel = normalizeSelection(product, selection);
      const key = selectionKey(productId, sel);
      setState((s) => {
        const existing = s.items.find((i) => i.key === key);
        const items = existing
          ? s.items.map((i) => (i.key === key ? { ...i, quantity: Math.min(99, i.quantity + quantity), note: note || i.note } : i))
          : [...s.items, { key, productId, selection: sel, quantity, note }];
        return { ...s, items };
      });
      setLastAdded(key);
    },
    [byId],
  );

  const api = useMemo<QuoteApi>(() => {
    const lines = state.items.flatMap((i) => {
      const product = byId(i.productId);
      return product ? [{ key: i.key, product, selection: i.selection, quantity: i.quantity, note: i.note }] : [];
    });
    const priced = lines.map((l) => priceFor(l.product, l.selection));
    const total = config.features.prices && priced.some((p) => p != null) ? lines.reduce((s, l, i) => s + (priced[i] ?? 0) * l.quantity, 0) : null;
    return {
      ...state,
      lines,
      count: state.items.reduce((n, i) => n + i.quantity, 0),
      total,
      isOpen,
      lastAdded,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      setQuantity: (key, quantity) =>
        setState((s) => ({ ...s, items: s.items.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, Math.min(99, quantity)) } : i)) })),
      setNote: (key, note) => setState((s) => ({ ...s, items: s.items.map((i) => (i.key === key ? { ...i, note } : i)) })),
      remove: (key) => setState((s) => ({ ...s, items: s.items.filter((i) => i.key !== key) })),
      clear: () => setState((s) => ({ ...s, items: [], notes: '' })),
      forget: () => setState({ items: [], customer: {}, notes: '' }),
      setCustomer: (id, value) => setState((s) => ({ ...s, customer: { ...s.customer, [id]: value } })),
      setNotes: (notes) => setState((s) => ({ ...s, notes })),
      has: (productId) => state.items.some((i) => i.productId === productId),
    };
  }, [state, isOpen, lastAdded, add, byId, config.features.prices]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useQuote() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useQuote fora do QuoteProvider');
  return ctx;
}
