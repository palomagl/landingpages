import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../core/cx';
import type { Facet, FilterState } from '../core/filters';
import { Icon } from './Icon';

/** Controle de um filtro (lista, recursos ou faixa). Atualiza a coleção ao vivo. */
export function FacetControl({
  facet,
  state,
  onChange,
}: {
  facet: Facet;
  state: FilterState;
  onChange: (s: FilterState) => void;
}) {
  if (facet.kind === 'range') {
    const [lo, hi] = state.ranges[facet.key] ?? [facet.min, facet.max];
    const set = (a: number, b: number) => {
      const ranges = { ...state.ranges };
      if (a <= facet.min && b >= facet.max) delete ranges[facet.key];
      else ranges[facet.key] = [a, b];
      onChange({ ...state, ranges });
    };
    const pct = (n: number) => ((n - facet.min) / (facet.max - facet.min)) * 100;
    return (
      <div>
        <div className="flex justify-between text-sm tabular-nums">
          <span>{facet.format(lo)}</span>
          <span>{facet.format(hi)}</span>
        </div>
        <div className="range-dual mt-3">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
          <div className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-accent" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
          <input
            type="range"
            min={facet.min}
            max={facet.max}
            step={facet.step}
            value={lo}
            onChange={(e) => set(Math.min(Number(e.target.value), hi - facet.step), hi)}
            aria-label={`${facet.label}: mínimo`}
          />
          <input
            type="range"
            min={facet.min}
            max={facet.max}
            step={facet.step}
            value={hi}
            onChange={(e) => set(lo, Math.max(Number(e.target.value), lo + facet.step))}
            aria-label={`${facet.label}: máximo`}
          />
        </div>
      </div>
    );
  }
  const isToggle = facet.kind === 'toggles';
  const selected = isToggle ? state.toggles : state.options[facet.key] ?? [];
  const toggle = (v: string) => {
    const next = selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v];
    onChange(isToggle ? { ...state, toggles: next } : { ...state, options: { ...state.options, [facet.key]: next } });
  };
  return (
    <ul className="space-y-1">
      {facet.values.map((v) => {
        const on = selected.includes(v.value);
        return (
          <li key={v.value}>
            <label className="group flex cursor-pointer items-center gap-3 py-1.5">
              <input type="checkbox" checked={on} onChange={() => toggle(v.value)} className="peer sr-only" />
              <span
                className={cx(
                  'grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent',
                  on ? 'border-dark bg-dark text-on-dark' : 'border-line bg-card group-hover:border-ink',
                )}
              >
                {on && <Icon name="check" size={14} strokeWidth={2} />}
              </span>
              <span className="flex-1 text-[0.9375rem]">{v.label}</span>
              <span className="text-sm tabular-nums text-muted">{v.count}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

/** Botão + painel flutuante (desktop). */
export function Popover({ label, badge, children }: { label: string; badge?: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button type="button" className="chip" aria-expanded={open} aria-pressed={!!badge} onClick={() => setOpen((o) => !o)}>
        {label}
        {!!badge && <span className="tabular-nums">({badge})</span>}
        <Icon name="chevronD" size={16} className={cx('transition-transform duration-300', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-72 rounded-[1rem] border hairline bg-card p-5 shadow-[0_24px_48px_-24px_rgb(60_35_15/0.45)] anim-fade-up [animation-duration:.4s]">
          {children}
        </div>
      )}
    </div>
  );
}
