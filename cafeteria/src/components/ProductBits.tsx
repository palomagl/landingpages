import { useEffect, useState } from 'react';
import type { Product, ProductOption } from '../config/schema';
import { useCatalog } from '../core/catalog';
import { cx } from '../core/cx';
import { formatPrice } from '../core/format';
import { useQuote } from '../core/quote';
import { priceFor, type Selection } from '../core/selection';
import { Icon } from './Icon';

/** "A partir de R$ 4.990" — prefixo regular, valor em negrito. */
export function Price({ product, selection, strong, className }: { product: Product; selection?: Selection; strong?: boolean; className?: string }) {
  const { config } = useCatalog();
  if (!config.features.prices) return null;
  const value = selection ? priceFor(product, selection) : product.price ?? null;
  if (value == null) return <span className={cx('text-muted', className)}>{config.copy.priceOnRequest}</span>;
  return (
    <span className={className}>
      {product.pricePrefix && <span>{product.pricePrefix} </span>}
      <span className={cx('tabular-nums', strong && 'font-bold')}>{formatPrice(value, config.brand)}</span>
    </span>
  );
}

export function QuantityStepper({ value, onChange, label, size = 'md' }: { value: number; onChange: (n: number) => void; label: string; size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 'h-9' : 'h-[3.25rem]';
  const w = size === 'sm' ? 'w-9' : 'w-11';
  return (
    <div className={cx('inline-flex items-center rounded-full border hairline bg-card', h)} role="group" aria-label={label}>
      <button
        type="button"
        className={cx('grid h-full place-items-center rounded-full transition-colors hover:bg-ink/5 disabled:opacity-35', w)}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Diminuir quantidade"
      >
        <Icon name="minus" size={16} />
      </button>
      <span className="min-w-7 text-center font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={cx('grid h-full place-items-center rounded-full transition-colors hover:bg-ink/5 disabled:opacity-35', w)}
        onClick={() => onChange(value + 1)}
        disabled={value >= 99}
        aria-label="Aumentar quantidade"
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

/** Seletor de variação: amostras de cor ou botões de texto. */
export function OptionPicker({ option, value, onChange }: { option: ProductOption; value: string; onChange: (id: string) => void }) {
  const selected = option.values.find((v) => v.id === value);
  return (
    <fieldset>
      <legend className="flex w-full items-baseline gap-2 pb-3 text-[0.9375rem]">
        <span className="font-semibold">{option.label}:</span>
        <span className="text-muted">{selected?.label}</span>
      </legend>
      {option.display === 'swatch' ? (
        <div className="flex flex-wrap gap-3">
          {option.values.map((v) => {
            const on = v.id === value;
            return (
              <label key={v.id} className="relative cursor-pointer" title={v.label}>
                <input type="radio" name={option.id} value={v.id} checked={on} onChange={() => onChange(v.id)} className="peer sr-only" />
                <span
                  className={cx(
                    'block h-10 w-10 rounded-full ring-offset-[3px] ring-offset-bg transition-[box-shadow,transform] duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-accent',
                    on ? 'ring-2 ring-accent' : 'hover:scale-105',
                  )}
                  style={{ background: v.swatch, boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / .12), inset 0 2px 3px rgb(255 255 255 / .25)' }}
                />
                <span className="sr-only">{v.label}</span>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {option.values.map((v) => (
            <label key={v.id} className="cursor-pointer">
              <input type="radio" name={option.id} value={v.id} checked={v.id === value} onChange={() => onChange(v.id)} className="peer sr-only" />
              <span className="chip peer-checked:border-dark peer-checked:bg-dark peer-checked:text-on-dark peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                {v.label}
              </span>
            </label>
          ))}
        </div>
      )}
      {option.display === 'swatch' && selected?.description && <p className="mt-2.5 text-sm text-muted">{selected.description}</p>}
    </fieldset>
  );
}

/** "Adicionar ao orçamento" com confirmação visual. */
export function AddToQuoteButton({
  product,
  selection,
  quantity = 1,
  className,
  label = 'Adicionar ao orçamento',
}: {
  product: Product;
  selection: Selection;
  quantity?: number;
  className?: string;
  label?: string;
}) {
  const quote = useQuote();
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setDone(false), 1800);
    return () => window.clearTimeout(t);
  }, [done]);
  return (
    <button
      type="button"
      onClick={() => {
        quote.add(product.id, selection, quantity);
        setDone(true);
      }}
      className={cx('btn btn-dark', className)}
    >
      {done ? (
        <>
          <Icon name="check" size={18} className="anim-fade" /> Adicionado
        </>
      ) : (
        <>
          {label} <Icon name="plus" size={18} />
        </>
      )}
    </button>
  );
}
