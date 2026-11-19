import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { keySpecs, specGroups } from '../core/attributes';
import { useCatalog } from '../core/catalog';
import { cx } from '../core/cx';
import { routes } from '../core/router';
import { defaultSelection, type Selection } from '../core/selection';
import { buildQuoteMessage, whatsappUrl } from '../core/whatsapp';
import { Icon } from '../components/Icon';
import { ProductCard } from '../components/ProductCard';
import { AddToQuoteButton, OptionPicker, Price, QuantityStepper } from '../components/ProductBits';
import { Img, galleryFor } from '../media/Img';
import { NotFoundPage } from './NotFoundPage';

export function ProductPage({ slug }: { slug: string }) {
  const { config, bySlug, category, related } = useCatalog();
  const product = bySlug(slug);
  const [sel, setSel] = useState<Selection>(() => (product ? defaultSelection(product) : {}));
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [stickyBar, setStickyBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // barra fixa (celular) aparece depois que o botão principal sai da tela
  useEffect(() => {
    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ctaRef.current;
        if (el) setStickyBar(el.getBoundingClientRect().bottom < 0);
      });
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', check);
    };
  }, []);

  if (!product) return <NotFoundPage title="Produto não encontrado" />;

  const cat = category(product.category);
  const gallery = galleryFor(product, sel);
  const current = Math.min(active, gallery.length - 1);
  const groups = specGroups(product, config.attributes, config.brand.locale);
  const specs = keySpecs(product, cat, config.attributes, config.brand.locale);
  const rel = config.features.relatedProducts ? related(product, 3) : [];
  const waText = buildQuoteMessage(config, [{ product, selection: sel, quantity: qty }], {}, '');
  const vt = { viewTransitionName: `produto-${product.id}` } as CSSProperties;

  const goTo = (i: number) => {
    setActive(i);
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <article className="pt-24 lg:pt-32">
      <div className="wrap">
        <nav aria-label="Você está em" className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <a href={routes.collection()} className="hover:text-ink">
            Coleção
          </a>
          <span aria-hidden="true">/</span>
          {cat && (
            <a href={routes.collection(cat.id)} className="hover:text-ink">
              {cat.name}
            </a>
          )}
          <span aria-hidden="true">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>
      </div>

      <div className="wrap mt-5 grid grid-cols-[minmax(0,1fr)] gap-8 lg:mt-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
        {/* galeria */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative overflow-hidden rounded-[1.25rem] bg-bg-alt card-shadow" style={vt}>
            <div ref={scrollerRef} onScroll={(e) => setActive(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))} className="no-scrollbar flex aspect-square snap-x snap-mandatory overflow-x-auto lg:aspect-[1/0.92]">
              {gallery.map((g, i) => (
                <div key={g.src + i} className="h-full w-full shrink-0 snap-center">
                  <Img image={g} sizes="(min-width: 1024px) 680px, 100vw" priority={i === 0} />
                </div>
              ))}
            </div>
            {product.badge && <span className="absolute left-4 top-4 rounded-full bg-dark/80 px-3 py-1 text-xs font-semibold text-on-dark">{product.badge}</span>}
            {gallery.length > 1 && (
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 lg:hidden" aria-hidden="true">
                {gallery.map((_, i) => (
                  <span key={i} className={cx('h-2 w-2 rounded-full transition-colors', i === current ? 'bg-light' : 'bg-light/45')} />
                ))}
              </div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 hidden grid-cols-5 gap-3 lg:grid" role="tablist" aria-label="Fotos do produto">
              {gallery.map((g, i) => (
                <button
                  key={g.src + i}
                  type="button"
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Foto ${i + 1}: ${g.alt}`}
                  onClick={() => goTo(i)}
                  className={cx(
                    'aspect-square overflow-hidden rounded-[0.75rem] ring-offset-2 ring-offset-bg transition',
                    i === current ? 'ring-2 ring-accent' : 'opacity-70 hover:opacity-100',
                  )}
                >
                  <Img image={g} sizes="120px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* informações */}
        <div className="lg:pt-2">
          {cat && <p className="eyebrow text-muted">{cat.name}</p>}
          <h1 className="t-section mt-3">{product.name}</h1>
          <p className="mt-4 max-w-[30rem] text-[1.125rem] leading-relaxed text-muted">{product.summary}</p>
          <p className="mt-6 text-[1.375rem] tracking-[-0.02em]">
            <Price product={product} selection={sel} strong />
          </p>

          {(product.options ?? []).length > 0 && (
            <div className="mt-7 space-y-6 border-t hairline pt-7">
              {product.options!.map((o) => (
                <OptionPicker key={o.id} option={o} value={sel[o.id]} onChange={(v) => setSel((s) => ({ ...s, [o.id]: v }))} />
              ))}
            </div>
          )}

          {config.features.quote && (
            <div ref={ctaRef} className="mt-8 border-t hairline pt-7">
              <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                <QuantityStepper value={qty} onChange={setQty} label="Quantidade" />
                <AddToQuoteButton
                  product={product}
                  selection={sel}
                  quantity={qty}
                  className="!min-h-[3.25rem] max-sm:!gap-2 max-sm:!whitespace-normal max-sm:!px-4 max-sm:!text-center max-sm:!leading-tight"
                />
              </div>
              <a href={whatsappUrl(config.contact.whatsapp, waText)} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-3 w-full !min-h-[3.25rem] gap-2.5">
                <Icon name="whatsapp" size={19} />
                <span className="sm:hidden">Orçamento pelo WhatsApp</span>
                <span className="max-sm:hidden">Pedir orçamento pelo WhatsApp</span>
              </a>
              <p className="mt-3.5 text-sm text-muted">Sem compromisso: respondemos com valores, prazos de entrega e condições de pagamento.</p>
            </div>
          )}

          {specs.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {specs.map((s) => (
                <div key={s.key} className="rounded-[0.875rem] bg-card px-4 py-3.5 card-shadow">
                  <dt className="text-xs text-muted">{s.label}</dt>
                  <dd className="mt-1 font-semibold leading-snug tracking-[-0.01em]">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {/* descrição e destaques */}
      <section className="wrap mt-[clamp(3.5rem,7vw,6rem)] grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-14" aria-labelledby="sobre">
        <div>
          <p className="eyebrow text-muted">Em detalhe</p>
          <h2 id="sobre" className="t-subsection mt-3">
            Sobre o produto
          </h2>
        </div>
        <div>
          <p className="max-w-[44rem] text-[1.0625rem] leading-relaxed">{product.description}</p>
          {product.highlights?.length ? (
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {product.highlights.map((h) => (
                <li key={h.title} className="rounded-[1rem] bg-card p-5 card-shadow" data-reveal>
                  <h3 className="font-semibold tracking-[-0.015em]">{h.title}</h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-snug text-muted">{h.text}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {/* ficha técnica */}
      {groups.length > 0 && (
        <section className="wrap mt-[clamp(3.5rem,7vw,6rem)] grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-14" aria-labelledby="ficha">
          <div>
            <p className="eyebrow text-muted">Especificações</p>
            <h2 id="ficha" className="t-subsection mt-3">
              Ficha técnica
            </h2>
          </div>
          <div className="gap-x-10 rounded-[1.25rem] bg-card p-6 card-shadow sm:columns-2 md:p-8">
            {groups.map((g) => (
              <div key={g.group} className="mb-6 break-inside-avoid last:mb-0">
                <h3 className="text-sm font-semibold text-muted">{g.group}</h3>
                <dl className="mt-2">
                  {g.rows.map((r) => (
                    <div key={r.label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-4 border-b hairline py-2.5 text-[0.9375rem] last:border-b-0">
                      <dt className="text-muted">{r.label}</dt>
                      <dd className="font-medium">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* relacionados */}
      {rel.length > 0 && (
        <section className="wrap mt-[clamp(3.5rem,7vw,6rem)]" aria-labelledby="rel">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-muted">Combina com</p>
              <h2 id="rel" className="t-subsection mt-3">
                Você também pode gostar
              </h2>
            </div>
            {cat && (
              <a href={routes.collection(cat.id)} className="group hidden items-center gap-3 text-[0.9375rem] font-medium sm:inline-flex">
                <span className="link-underline">Ver {cat.name.toLowerCase()}</span>
                <Icon name="arrowR" size={18} />
              </a>
            )}
          </div>
          <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rel.map((p, i) => (
              <li key={p.id} className="min-w-0" data-reveal style={{ '--i': i } as CSSProperties}>
                <ProductCard product={p} className="h-full" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* barra fixa no celular */}
      {config.features.quote && (
        <div
          className={cx(
            'glass fixed inset-x-0 bottom-0 z-30 border-t hairline px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-transform duration-500 ease-expo lg:hidden',
            stickyBar ? 'translate-y-0' : 'translate-y-full',
          )}
          aria-hidden={!stickyBar}
        >
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold tracking-[-0.02em]">{product.name}</p>
              <p className="text-sm">
                <Price product={product} selection={sel} strong />
              </p>
            </div>
            <AddToQuoteButton product={product} selection={sel} quantity={qty} label="Adicionar" className="!min-h-12 !px-5" />
          </div>
        </div>
      )}
    </article>
  );
}
