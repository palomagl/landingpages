import { useEffect, useMemo, useState } from 'react';
import { useUi } from '../App';
import { useCatalog } from '../core/catalog';
import { cx } from '../core/cx';
import { useDialog, useLockBody, usePresence } from '../core/hooks';
import { useQuote } from '../core/quote';
import { routes, useRouter } from '../core/router';
import { searchProducts } from '../core/search';
import { useTheme } from '../core/theme';
import { Img } from '../media/Img';
import { Icon } from './Icon';
import { Price } from './ProductBits';

/** Busca global com resultados instantâneos. Atalho: "/" ou Ctrl/⌘+K. */
export function SearchOverlay() {
  const { config, categories, products } = useCatalog();
  const ui = useUi();
  const { navigate } = useRouter();
  const [q, setQ] = useState('');
  const { mounted, visible } = usePresence(ui.searchOpen, 400);
  const ref = useDialog<HTMLDivElement>(ui.searchOpen, ui.closeSearch);
  useLockBody(ui.searchOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /input|textarea|select/i.test((e.target as HTMLElement).tagName);
      if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        ui.openSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ui]);
  useEffect(() => {
    if (ui.searchOpen) setQ(ui.query);
  }, [ui.searchOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const scores = searchProducts(config, q);
    return products.filter((p) => scores.has(p.id)).sort((a, b) => scores.get(b.id)! - scores.get(a.id)!);
  }, [config, products, q]);

  if (!mounted) return null;
  const submit = () => {
    ui.setQuery(q);
    ui.closeSearch();
    navigate(routes.collection());
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Buscar produtos">
      <div className={cx('scrim absolute inset-0', visible ? 'opacity-100' : 'opacity-0')} onClick={ui.closeSearch} />
      <div
        ref={ref}
        tabIndex={-1}
        className={cx(
          'absolute inset-x-0 top-0 max-h-[100svh] overflow-y-auto bg-bg outline-none transition-[transform,opacity] duration-500 ease-expo',
          visible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0',
        )}
      >
        <div className="wrap pb-10 pt-5 lg:pb-14 lg:pt-8">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex items-center gap-4 border-b border-ink pb-3"
          >
            <Icon name="search" size={26} className="shrink-0 text-muted" />
            <label className="sr-only" htmlFor="busca-global">
              Buscar produtos
            </label>
            <input
              id="busca-global"
              data-autofocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="O que você procura?"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-none tracking-[-0.035em] outline-none placeholder:text-muted/50"
            />
            <button type="button" onClick={ui.closeSearch} className="grid h-11 w-11 shrink-0 place-items-center" aria-label="Fechar busca">
              <Icon name="close" />
            </button>
          </form>

          {!q.trim() ? (
            <div className="mt-8">
              <p className="text-sm font-semibold text-muted">Categorias</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <li key={c.id}>
                    <a href={routes.collection(c.id)} onClick={ui.closeSearch} className="chip">
                      {c.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : results.length ? (
            <div className="mt-8">
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6" aria-live="polite">
                {results.slice(0, 6).map((p) => (
                  <li key={p.id}>
                    <a href={routes.product(p.slug)} onClick={ui.closeSearch} className="group block">
                      <span className="block aspect-square overflow-hidden rounded-[0.875rem]">
                        {p.images[0] && <Img image={p.images[0]} sizes="200px" className="transition-transform duration-700 group-hover:scale-105" />}
                      </span>
                      <span className="mt-2.5 block font-semibold leading-tight tracking-[-0.02em] group-hover:underline">{p.name}</span>
                      <Price product={p} className="mt-1 block text-sm text-muted" />
                    </a>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={submit} className="btn btn-outline mt-8">
                Ver {results.length === 1 ? 'o resultado' : `os ${results.length} resultados`} na coleção
              </button>
            </div>
          ) : (
            <p className="mt-8 max-w-[48ch] text-muted" aria-live="polite">
              Nenhum produto encontrado para “{q}”. Tente o nome de um modelo, uma categoria ou um recurso, como “moedor” ou “leite”.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Confirmação discreta ao adicionar itens ao orçamento. */
export function Toast() {
  const quote = useQuote();
  const { byId } = useCatalog();
  const item = quote.lastAdded ? quote.items.find((i) => i.key === quote.lastAdded) : undefined;
  const product = item ? byId(item.productId) : undefined;
  const { mounted, visible } = usePresence(!!product && !quote.isOpen, 400);
  const [last, setLast] = useState(product);
  useEffect(() => {
    if (product) setLast(product);
  }, [product]);
  if (!mounted || !last) return null;
  return (
    <div
      role="status"
      className={cx(
        'fixed inset-x-4 top-[4.75rem] z-40 mx-auto flex max-w-md items-center gap-4 rounded-[1rem] bg-dark py-3 pl-5 pr-3 text-on-dark shadow-2xl transition-[transform,opacity] duration-500 ease-expo sm:inset-x-auto sm:top-auto sm:right-6 sm:bottom-6',
        visible ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0 sm:translate-y-4',
      )}
    >
      <Icon name="check" size={18} />
      <p className="flex-1 text-[0.9375rem] leading-snug">
        Adicionado ao orçamento
        <span className="block font-medium">{last.name}</span>
      </p>
      <button type="button" onClick={quote.open} className="rounded-full bg-on-dark/10 px-4 py-2 text-sm font-semibold hover:bg-on-dark/20">
        Ver orçamento
      </button>
    </div>
  );
}

/**
 * Seletor de identidade visual — ferramenta de demonstração.
 * Desligue em `features.themeSwitcher` na versão entregue ao cliente.
 */
export function ThemeSwitcher() {
  const { theme, themes, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const { mounted, visible } = usePresence(open, 400);
  const ref = useDialog<HTMLDivElement>(open, () => setOpen(false));
  return (
    <div className="fixed right-0 top-1/2 z-40 -translate-y-1/2">
      {mounted && (
        <div
          ref={ref}
          tabIndex={-1}
          role="dialog"
          aria-label="Identidade visual"
          className={cx(
            'absolute right-full top-1/2 mr-3 w-[min(22rem,calc(100vw-4.5rem))] -translate-y-1/2 rounded-[1rem] border hairline bg-bg p-2 text-ink shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)] outline-none transition-[transform,opacity] duration-400 ease-expo',
            visible ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0',
          )}
        >
          <div className="flex items-baseline justify-between px-3 pb-2 pt-3">
            <p className="text-lg font-bold tracking-[-0.02em]">Identidade visual</p>
            <span className="text-xs text-muted">Demonstração</span>
          </div>
          <ul role="radiogroup" aria-label="Temas">
            {themes.map((t) => {
              const on = t.id === theme.id;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={on}
                    data-autofocus={on || undefined}
                    onClick={() => setTheme(t.id)}
                    className={cx('flex w-full items-center gap-3 rounded-[0.75rem] px-3 py-2.5 text-left transition-colors', on ? 'bg-bg-alt' : 'hover:bg-bg-alt/60')}
                  >
                    <span className="flex shrink-0 overflow-hidden rounded-full ring-1 ring-black/10">
                      {[t.colors.bg, t.colors.heroVia, t.colors.accent, t.colors.dark].map((c, i) => (
                        <span key={i} className="h-7 w-3.5" style={{ background: c }} />
                      ))}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9375rem] font-medium">{t.name}</span>
                      <span className="block truncate text-xs text-muted">{t.description}</span>
                    </span>
                    {on && <Icon name="check" size={16} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Identidade visual (demonstração)"
        className="glass flex flex-col items-center gap-3 rounded-l-[6px] px-2 py-3 text-ink shadow-[0_10px_30px_-12px_rgb(0_0_0/0.4)] ring-1 ring-black/5 transition-[padding] duration-300 hover:pr-3"
      >
        <span className="flex flex-col overflow-hidden rounded-full">
          {[theme.colors.bg, theme.colors.heroVia, theme.colors.accent].map((c, i) => (
            <span key={i} className="h-[0.6rem] w-5" style={{ background: c }} />
          ))}
        </span>
        <span className="hidden text-xs font-medium [writing-mode:vertical-rl] sm:block">Identidade visual</span>
      </button>
    </div>
  );
}
