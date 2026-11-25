import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useUi } from '../App';
import { useCatalog } from '../core/catalog';
import { cx } from '../core/cx';
import { SORT_LABELS, activeChips, applyFilters, buildFacets, countActive, emptyFilters, type FilterState, type SortKey } from '../core/filters';
import { pluralize } from '../core/format';
import { useDialog, useLockBody, usePresence } from '../core/hooks';
import { routes } from '../core/router';
import { searchProducts } from '../core/search';
import { FacetControl, Popover } from '../components/Filters';
import { Icon } from '../components/Icon';
import { ProductCard } from '../components/ProductCard';

export function CollectionPage({ category }: { category: string | null }) {
  const { config, products, categories, category: getCategory, group: getGroup, productsIn } = useCatalog();
  const ui = useUi();
  const cat = category ? getCategory(category) : undefined;
  const grp = category ? getGroup(category) : undefined;
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [sheet, setSheet] = useState(false);

  // trocar de categoria limpa filtros específicos, mantendo busca e ordenação
  useEffect(() => setFilters((f) => ({ ...emptyFilters(), sort: f.sort })), [category]);

  const base = useMemo(() => (category && (cat || grp) ? productsIn(category) : products), [category, cat, grp, products, productsIn]);
  const facets = useMemo(() => buildFacets(config, base), [config, base]);
  const scores = useMemo(() => (ui.query.trim() ? searchProducts(config, ui.query) : null), [config, ui.query]);
  const list = useMemo(() => applyFilters(config, base, filters, scores), [config, base, filters, scores]);
  const chips = activeChips(config, filters, facets);
  const active = countActive(filters);
  const unknown = !!category && !cat && !grp;
  const title = unknown ? 'Categoria não encontrada' : cat?.name ?? grp?.name ?? config.copy.collectionTitle;
  const intro = unknown ? 'Escolha uma das categorias abaixo para continuar.' : cat?.description ?? grp?.description ?? config.copy.collectionIntro;

  const clearAll = () => {
    setFilters((f) => ({ ...emptyFilters(), sort: f.sort }));
    ui.setQuery('');
  };

  const tabs = [
    { id: null as string | null, name: 'Todos', count: products.length },
    ...config.groups.map((g) => ({ id: g.id, name: g.name, count: productsIn(g.id).length })),
    ...categories.map((c) => ({ id: c.id, name: c.name, count: c.count })),
  ];

  return (
    <div className="pb-4 pt-28 lg:pt-36">
      <div className="wrap">
        <header className="grid items-end gap-5 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow text-muted">{category && !unknown ? config.copy.collectionTitle : config.copy.collectionEyebrow}</p>
            <h1 className="t-section mt-3">{title}</h1>
          </div>
          <p className="max-w-[28rem] text-[1.0625rem] leading-relaxed text-muted lg:pb-1.5 lg:text-right">{intro}</p>
        </header>

        <nav aria-label="Categorias" className="no-scrollbar -mx-[var(--gutter)] mt-8 overflow-x-auto px-[var(--gutter)] lg:mt-10">
          <ul className="flex gap-2">
            {tabs.map((t) => (
              <li key={t.id ?? 'todos'}>
                <a href={routes.collection(t.id)} className="chip" aria-current={(category ?? null) === t.id ? 'page' : undefined}>
                  {t.name} <span className="tabular-nums opacity-55">{t.count}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* barra de ferramentas */}
      <div className="glass sticky top-16 z-20 mt-6 border-y hairline lg:top-[4.75rem]">
        <div className="wrap flex items-center gap-3 py-3">
          {config.features.search && (
            <label className="relative flex min-w-0 flex-1 items-center lg:max-w-[19rem]">
              <Icon name="search" size={18} className="pointer-events-none absolute left-3.5 text-muted" />
              <span className="sr-only">Buscar na coleção</span>
              <input
                type="search"
                value={ui.query}
                onChange={(e) => ui.setQuery(e.target.value)}
                placeholder="Buscar produtos"
                className="field !rounded-full !py-2.5 pl-10 pr-9 [&::-webkit-search-cancel-button]:hidden"
              />
              {ui.query && (
                <button type="button" onClick={() => ui.setQuery('')} className="absolute right-3 p-1 text-muted hover:text-ink" aria-label="Limpar busca">
                  <Icon name="close" size={16} />
                </button>
              )}
            </label>
          )}
          {config.features.filters && (
            <>
              <div className="hidden items-center gap-2 lg:flex">
                {facets.map((f) => (
                  <Popover
                    key={f.key}
                    label={f.label}
                    badge={
                      f.kind === 'options'
                        ? filters.options[f.key]?.length
                        : f.kind === 'toggles'
                          ? f.values.filter((v) => filters.toggles.includes(v.value)).length
                          : filters.ranges[f.key]
                            ? 1
                            : 0
                    }
                  >
                    <FacetControl facet={f} state={filters} onChange={setFilters} />
                  </Popover>
                ))}
              </div>
              <button type="button" className="chip shrink-0 lg:hidden" onClick={() => setSheet(true)} aria-pressed={active > 0}>
                <Icon name="filter" size={16} /> Filtros {active > 0 && <span className="tabular-nums">({active})</span>}
              </button>
            </>
          )}
          <label className="ml-auto hidden items-center gap-2 text-sm text-muted sm:flex">
            Ordenar
            <span className="relative">
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value as SortKey })}
                className="appearance-none bg-transparent py-2 pr-6 font-medium text-ink outline-none focus-visible:underline"
              >
                {(Object.keys(SORT_LABELS) as SortKey[])
                  .filter((k) => config.features.prices || !k.startsWith('preco'))
                  .map((k) => (
                    <option key={k} value={k}>
                      {SORT_LABELS[k]}
                    </option>
                  ))}
              </select>
              <Icon name="chevronD" size={16} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-ink" />
            </span>
          </label>
        </div>
      </div>

      <div className="wrap">
        <div className="flex min-h-14 flex-wrap items-center gap-2 py-4" aria-live="polite">
          <span className="mr-2 text-sm text-muted tabular-nums">{pluralize(list.length, 'produto', 'produtos')}</span>
          {chips.map((c) => (
            <button key={c.id} type="button" onClick={() => setFilters(c.remove(filters))} className="chip !h-8 !gap-1.5 !text-[0.8125rem]">
              {c.label} <Icon name="close" size={14} />
              <span className="sr-only">Remover filtro</span>
            </button>
          ))}
          {ui.query && (
            <button type="button" onClick={() => ui.setQuery('')} className="chip !h-8 !gap-1.5 !text-[0.8125rem]">
              “{ui.query}” <Icon name="close" size={14} />
              <span className="sr-only">Remover busca</span>
            </button>
          )}
          {(chips.length > 0 || ui.query) && (
            <button type="button" onClick={clearAll} className="link-underline ml-1 text-sm font-medium">
              Limpar tudo
            </button>
          )}
        </div>

        {list.length ? (
          <ul className="mt-2 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-7">
            {list.map((p, i) => (
              <li key={p.id} className="min-w-0" data-reveal style={{ '--i': i % 3 } as CSSProperties}>
                <ProductCard product={p} priority={i < 3} className="h-full" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid place-items-start gap-5 rounded-[1.25rem] bg-card px-6 py-14 card-shadow md:px-12">
            <p className="t-subsection">Nenhum produto com esses critérios.</p>
            <p className="max-w-[48ch] text-muted">
              {ui.query ? `A busca por “${ui.query}” não encontrou resultados${category && !unknown ? ` em ${title}` : ''}. ` : ''}
              Remova alguns filtros ou veja a coleção completa.
            </p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={clearAll} className="btn btn-dark">
                Limpar filtros e busca
              </button>
              {category && (
                <a href={routes.collection()} className="btn btn-outline">
                  Ver coleção completa
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <FilterSheet open={sheet} onClose={() => setSheet(false)} facets={facets} state={filters} onChange={setFilters} results={list.length} prices={config.features.prices} />
    </div>
  );
}

function FilterSheet({
  open,
  onClose,
  facets,
  state,
  onChange,
  results,
  prices,
}: {
  open: boolean;
  onClose: () => void;
  facets: ReturnType<typeof buildFacets>;
  state: FilterState;
  onChange: (s: FilterState) => void;
  results: number;
  prices: boolean;
}) {
  const { mounted, visible } = usePresence(open, 500);
  const ref = useDialog<HTMLDivElement>(open, onClose);
  useLockBody(open);
  if (!mounted) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby="filters-title">
      <div className={cx('scrim absolute inset-0', visible ? 'opacity-100' : 'opacity-0')} onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        className={cx('panel-b absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-[1.25rem] bg-bg outline-none', visible ? 'translate-y-0' : 'translate-y-full')}
      >
        <div className="flex items-center justify-between border-b hairline px-5 py-4">
          <h2 id="filters-title" className="text-xl font-bold tracking-[-0.02em]">
            Filtros
          </h2>
          <button type="button" onClick={onClose} className="-mr-2 grid h-10 w-10 place-items-center" aria-label="Fechar filtros" data-autofocus>
            <Icon name="close" />
          </button>
        </div>
        <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6">
          <fieldset>
            <legend className="pb-3 text-[0.9375rem] font-semibold">Ordenar por</legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(SORT_LABELS) as SortKey[])
                .filter((k) => prices || !k.startsWith('preco'))
                .map((k) => (
                  <button key={k} type="button" className="chip" aria-pressed={state.sort === k} onClick={() => onChange({ ...state, sort: k })}>
                    {SORT_LABELS[k]}
                  </button>
                ))}
            </div>
          </fieldset>
          {facets.map((f) => (
            <fieldset key={f.key}>
              <legend className="pb-3 text-[0.9375rem] font-semibold">{f.label}</legend>
              <FacetControl facet={f} state={state} onChange={onChange} />
            </fieldset>
          ))}
        </div>
        <div className="flex gap-3 border-t hairline px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button type="button" className="btn btn-outline" onClick={() => onChange({ ...emptyFilters(), sort: state.sort })}>
            Limpar
          </button>
          <button type="button" className="btn btn-dark flex-1" onClick={onClose}>
            Ver {pluralize(results, 'produto', 'produtos')}
          </button>
        </div>
      </div>
    </div>
  );
}
