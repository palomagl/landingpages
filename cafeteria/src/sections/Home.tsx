import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from 'react';
import { useCatalog } from '../core/catalog';
import { cx } from '../core/cx';
import { useMediaQuery, useReducedMotion } from '../core/hooks';
import { Steam, useScrollProgress } from '../core/motion';
import { routes } from '../core/router';
import { whatsappUrl } from '../core/whatsapp';
import type { Product } from '../config/schema';
import { Icon } from '../components/Icon';
import { ProductCard } from '../components/ProductCard';
import { Img } from '../media/Img';

/* ============================================================== Hero */

/**
 * Hero do mockup: fotografia arquitetônica em tela cheia (composição panorâmica
 * no desktop, 4:3 no tablet e retrato no celular), texto claro sobre a parede
 * escura à esquerda e indicador "01 — — 03". Os slides fazem fusão suave e a
 * foto se desloca levemente com o cursor.
 */
export function Hero() {
  const { config } = useCatalog();
  const slides = config.home.slides;
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const delay = config.features.heroAutoplay;
  const sectionRef = useRef<HTMLElement>(null);

  const go = useCallback(
    (i: number) => {
      setIndex((cur) => {
        const next = (i + slides.length) % slides.length;
        if (next !== cur) setPrev(cur);
        return next;
      });
    },
    [slides.length],
  );

  useEffect(() => {
    if (prev === null) return;
    const t = window.setTimeout(() => setPrev(null), 1300);
    return () => window.clearTimeout(t);
  }, [prev, index]);

  useEffect(() => {
    if (!delay || reduced || paused || slides.length < 2) return;
    const t = window.setTimeout(() => go(index + 1), delay);
    return () => window.clearTimeout(t);
  }, [delay, reduced, paused, index, go, slides.length]);

  useEffect(() => {
    const onVis = () => setPaused(document.visibilityState !== 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // profundidade: a foto acompanha discretamente o cursor e a rolagem
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        el.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      });
    };
    const onScroll = () => el.style.setProperty('--sy', Math.min(1, window.scrollY / el.offsetHeight).toFixed(3));
    el.addEventListener('pointermove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, [reduced]);

  // gesto de arrastar (toque)
  const startX = useRef<number | null>(null);
  const onDown = (e: RPointerEvent) => (startX.current = e.clientX);
  const onUp = (e: RPointerEvent) => {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
  };

  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(max-width: 1023px)');
  const variant = isMobile ? 'mobile' : isTablet ? 'tablet' : 'wide';
  const art = {
    mobile: { aspect: 900 / 1820, position: [0.5, 1] as [number, number] },
    tablet: { aspect: 1536 / 1200, position: [1, 1] as [number, number] },
    wide: { aspect: 2, position: [0.5, 0.5] as [number, number] },
  }[variant];

  const s = slides[index];
  if (!s) return null;
  const wa = whatsappUrl(config.contact.whatsapp, s.secondary?.whatsapp ?? config.contact.whatsappGreeting);
  const pad = (n: number) => String(n).padStart(2, '0');
  const running = !(paused || reduced || !delay);

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carrossel"
      aria-label="Destaques"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="hero grain relative isolate overflow-hidden bg-[var(--c-hero-from)] select-none touch-pan-y"
        onPointerDown={onDown}
        onPointerUp={onUp}
      >
        {/* fotografias (Ken Burns no slide ativo, fusão na troca, parallax com o cursor) */}
        <div className="absolute inset-0 -z-10">
          {prev !== null && slides[prev] && (
            <div key={`p${prev}`} className="absolute inset-0 overflow-hidden" aria-hidden="true">
              <div className="hero-layer absolute inset-0">
                <Img image={slides[prev].image} sizes="100vw" className="hero-img" />
              </div>
            </div>
          )}
          <div key={index} className={cx('absolute inset-0 overflow-hidden', prev !== null && 'anim-hero-in')}>
            <div className="kenburns absolute inset-0" style={{ animationDuration: `${(delay || 9000) + 2500}ms` }}>
              <div className="hero-layer absolute inset-0">
                <Img image={s.image} sizes="100vw" priority={index === 0} className="hero-img" />
                {s.steam?.[variant] && <Steam point={s.steam[variant]!} aspect={art.aspect} position={art.position} rise={1.6} className="steam-on-light" />}
              </div>
            </div>
          </div>
        </div>
        {/* luz que atravessa a parede e leitura do texto */}
        <div className="hero-sweep pointer-events-none absolute -inset-x-1/4 inset-y-0 -z-10" />
        <div className="hero-shade pointer-events-none absolute inset-0 -z-10" />

        <div className="wrap hero-content relative">
          <div key={index} className="max-w-[34rem]">
            <p className="eyebrow anim-fade-up text-light/90" style={{ animationDelay: '80ms' }}>
              {s.eyebrow}
            </p>
            <h1
              className="t-hero hero-lines lines mt-[1.1rem] text-light [text-shadow:0_2px_24px_rgb(30_15_5/0.25)] max-sm:!text-[clamp(2.25rem,11.4vw,2.85rem)] max-sm:!leading-[0.92]"
            >
              {s.title.split('\n').map((line, i) => (
                <span key={i}>
                  <span style={{ '--l': i } as CSSProperties}>{line}</span>
                </span>
              ))}
            </h1>
            <p
              className="anim-fade-up mt-4 max-w-[17.5rem] text-[0.9375rem] leading-[1.5] text-light/85 sm:mt-6 sm:max-w-[20.75rem] sm:text-[1.0625rem] lg:mt-[1.7rem] lg:text-[1.125rem] lg:leading-[1.42]"
              style={{ animationDelay: '240ms' }}
            >
              {s.description}
            </p>
            <div className="anim-fade-up mt-6 flex flex-wrap items-center gap-4 sm:mt-8 lg:mt-[2.2rem]" style={{ animationDelay: '320ms' }}>
              <a href={`#${s.primary.to}`} className="btn btn-dark max-sm:!min-h-[3.25rem] max-sm:!px-8 lg:!min-h-[3.4rem] lg:!px-[1.75rem] lg:!text-[1rem]">
                {s.primary.label} <Icon name="arrowR" size={18} className="btn-arrow" />
              </a>
              {s.secondary && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-cream !gap-2.5 max-lg:!hidden lg:!min-h-[3.4rem] lg:!px-[1.75rem] lg:!text-[1rem]">
                  <Icon name="whatsapp" size={18} /> {s.secondary.label}
                </a>
              )}
            </div>
          </div>

          {/* indicador 01 — — 03 (desktop) */}
          <div className="hero-indicator hidden items-center gap-3 text-[0.8125rem] font-medium tabular-nums text-light lg:flex">
            <span>{pad(index + 1)}</span>
            {slides.map((sl, i) => (
              <button
                key={i}
                type="button"
                className="group py-3"
                onClick={() => go(i)}
                aria-label={`${sl.eyebrow}: slide ${i + 1} de ${slides.length}`}
                aria-current={i === index ? 'true' : undefined}
              >
                <span className="relative block h-[2px] w-[2.6rem] overflow-hidden rounded-full bg-light/30 transition-colors group-hover:bg-light/55">
                  {i === index && (
                    <span
                      key={index}
                      className="anim-progress absolute inset-0 rounded-full bg-light"
                      style={{ animationDuration: `${delay || 1}ms`, animationPlayState: running ? 'running' : 'paused' }}
                    />
                  )}
                  {i < index && <span className="absolute inset-0 rounded-full bg-light/80" />}
                </span>
              </button>
            ))}
            <span className="text-light/55">{pad(slides.length)}</span>
          </div>
        </div>
      </div>

      {/* pontos (celular e tablet) */}
      <div className="flex justify-center gap-1 pb-1 pt-4 lg:hidden" role="tablist" aria-label="Escolher destaque">
        {slides.map((sl, i) => (
          <button key={i} type="button" role="tab" aria-selected={i === index} aria-label={sl.eyebrow} onClick={() => go(i)} className="grid h-8 w-7 place-items-center">
            <span className={cx('block h-2 rounded-full transition-all duration-500', i === index ? 'w-2 bg-ink' : 'w-2 bg-ink/25')} />
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {s.title.replace(/\n/g, ' ')}, {index + 1} de {slides.length}
      </p>
    </section>
  );
}

/* ============================================================== Diferenciais */

export function Benefits() {
  const { config } = useCatalog();
  const items = config.home.benefits;
  return (
    <section aria-label="Diferenciais" className="relative">
      {/* tablet e desktop: faixa com ícones, títulos e textos */}
      <div className="wrap hidden md:block">
        <ul className="grid grid-cols-2 gap-y-5 py-7 lg:grid-cols-4 lg:gap-y-0 lg:py-[2.1rem]">
          {items.map((b, i) => (
            <li
              key={b.title}
              data-reveal
              style={{ '--i': i } as CSSProperties}
              className={cx(
                'group flex items-center gap-3.5 hairline xl:gap-[1.15rem]',
                i % 2 === 1 && 'border-l hairline pl-6',
                i > 0 && 'lg:border-l lg:pl-5 xl:pl-7',
              )}
            >
              <span className="relative grid shrink-0 place-items-center">
                <span className="absolute inset-[-30%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--c-accent)_30%,transparent),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <Icon name={b.icon} size={44} strokeWidth={1.3} className="relative h-9 w-9 text-ink transition-transform duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:scale-110 xl:h-11 xl:w-11" />
              </span>
              <div className="min-w-0">
                <h3 className="text-[1rem] font-semibold leading-tight tracking-[-0.02em] lg:text-[0.9375rem] xl:text-[1.125rem]">{b.title}</h3>
                <p className="mt-1 text-[0.8125rem] leading-snug text-muted lg:text-[0.78125rem] xl:text-[0.875rem]">{b.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* celular: blocos com ícone e rótulo curto */}
      <ul className="wrap grid grid-cols-4 gap-3 pb-2 pt-4 md:hidden">
        {items.map((b, i) => (
          <li key={b.title} data-reveal style={{ '--i': i } as CSSProperties} className="text-center">
            <span
              className="grid aspect-[1.06] place-items-center rounded-[0.875rem] bg-[linear-gradient(160deg,color-mix(in_oklab,var(--c-card)_85%,white),color-mix(in_oklab,var(--c-card)_55%,var(--c-bg)))] shadow-[0_10px_20px_-14px_rgb(80_50_25/0.55),inset_0_1px_0_rgb(255_255_255/0.7)]"
              title={`${b.title}: ${b.text}`}
            >
              <Icon name={b.icon} size={28} strokeWidth={1.5} />
            </span>
            <span className="mt-1.5 block truncate text-[0.6875rem] font-medium text-muted">{b.short ?? b.title}</span>
            <span className="sr-only">
              {b.title}. {b.text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ============================================================== Carrossel genérico */

function useRail() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ start: true, end: false, progress: 0, active: 0 });
  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const item = el.querySelector<HTMLElement>(':scope > *');
    const step = item ? item.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0') : el.clientWidth;
    setState({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft >= max - 4,
      progress: max > 0 ? el.scrollLeft / max : 0,
      active: Math.round(el.scrollLeft / step),
    });
  }, []);
  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>(':scope > *');
    const step = item ? item.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0') : el.clientWidth * 0.8;
    // no fim volta ao início (as setas nunca ficam "mortas")
    if (dir > 0 && el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) el.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir < 0 && el.scrollLeft <= 4) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    else el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };
  const go = (i: number) => {
    const el = ref.current;
    const item = el?.children[i] as HTMLElement | undefined;
    if (el && item) el.scrollTo({ left: item.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft || '0'), behavior: 'smooth' });
  };
  return { ref, ...state, update, scroll, go };
}

/** Título de seção com linhas que sobem ao entrar na tela. */
function RevealTitle({ id, text, className }: { id: string; text: string; className: string }) {
  return (
    <h2 id={id} data-reveal="lines" className={cx('lines', className)}>
      {text.split('\n').map((line, i) => (
        <span key={i}>
          <span style={{ '--l': i } as CSSProperties}>{line}</span>
        </span>
      ))}
    </h2>
  );
}

/* ============================================================== Nossos modelos */

export function FeaturedModels() {
  const { config, byId } = useCatalog();
  const f = config.home.featured;
  const products = f.products.map(byId).filter((p): p is Product => !!p);
  const rail = useRail();
  return (
    <section aria-labelledby="modelos" className="relative overflow-x-clip pt-[clamp(2.25rem,4vw,2.9rem)]">
      <div className="glow -right-40 top-10 h-[28rem] w-[40rem] opacity-70" aria-hidden="true" />
      <div className="glow -left-56 bottom-0 h-[22rem] w-[34rem] opacity-50" aria-hidden="true" />
      <div className="wrap relative">
        <p className="eyebrow text-ink" data-reveal="fade">
          {f.eyebrow}
        </p>
        <div className="mt-[0.7rem] flex items-end justify-between gap-6 md:mt-[0.9rem]">
          <RevealTitle id="modelos" text={f.title} className="t-section" />
          <a href={routes.collection()} className="group mb-2 hidden items-center gap-3 text-[0.9375rem] font-medium md:inline-flex">
            <span className="link-underline">{f.linkLabel}</span>
            <Icon name="arrowR" size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
      <div className="wrap relative mt-5 md:mt-[1.9rem]">
        <div
          ref={rail.ref}
          onScroll={rail.update}
          className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] pb-7 pt-2 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-2 lg:gap-5"
        >
          {products.map((p, i) => (
            <div key={p.id} data-reveal style={{ '--i': i } as CSSProperties} className="w-[86%] shrink-0 snap-start sm:w-[60%] md:w-auto">
              <ProductCard product={p} priority={i === 0} transition={false} sizes="(min-width: 768px) 33vw, 86vw" className="h-full" />
            </div>
          ))}
        </div>
        {/* indicador do carrossel (celular) */}
        <div className="-mt-2 flex items-center justify-between md:hidden">
          <div className="flex gap-1.5" aria-hidden="true">
            {products.map((p, i) => (
              <button
                key={p.id}
                type="button"
                tabIndex={-1}
                onClick={() => rail.go(i)}
                className={cx('h-1.5 rounded-full transition-all duration-500', i === rail.active ? 'w-6 bg-ink' : 'w-1.5 bg-ink/25')}
              />
            ))}
          </div>
          <a href={routes.collection()} className="inline-flex items-center gap-2 text-sm font-medium">
            <span className="link-underline">{f.linkLabel}</span>
            <Icon name="arrowR" size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================== Explore por categoria */

export function CategoryRail() {
  const { config, categories } = useCatalog();
  const rail = useRail();
  return (
    <section aria-labelledby="categorias" className="pt-[clamp(1.75rem,3.3vw,2.6rem)]">
      <div className="wrap">
        <div className="flex items-center justify-between gap-4">
          <RevealTitle id="categorias" text={config.home.categoriesTitle} className="t-subsection" />
          <div className="flex gap-3">
            <button type="button" className="arrow-round hidden md:grid" onClick={() => rail.scroll(-1)} aria-label="Categorias anteriores">
              <Icon name="arrowL" size={20} />
            </button>
            <button type="button" className="arrow-round max-md:!h-14 max-md:!w-14" onClick={() => rail.scroll(1)} aria-label="Próximas categorias">
              <Icon name="arrowR" size={20} />
            </button>
          </div>
        </div>
        <div
          ref={rail.ref}
          onScroll={rail.update}
          className="no-scrollbar -mx-[var(--gutter)] mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] pb-3 md:mx-0 md:mt-[1.35rem] md:gap-[0.7rem] md:px-0"
        >
          {categories.map((c, i) => (
            <a
              key={c.id}
              href={routes.collection(c.id)}
              data-reveal
              style={{ '--i': i } as CSSProperties}
              className="group relative isolate aspect-[1/1.12] w-[44%] shrink-0 snap-start overflow-hidden rounded-[0.875rem] card-shadow sm:w-[31%] md:aspect-[312/160] md:w-[calc((100%-2.1rem)/4)]"
            >
              <span className="reveal-zoom absolute inset-0 -z-10 block">
                {c.image && (
                  <Img image={c.image} sizes="(min-width: 768px) 25vw, 45vw" className="transition-transform duration-[1.4s] ease-expo group-hover:scale-[1.08]" />
                )}
              </span>
              <span className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(42_25_13/0.55)_0%,rgb(42_25_13/0.12)_55%,transparent_80%),linear-gradient(0deg,rgb(34_20_10/0.55)_0%,transparent_50%)] transition-opacity duration-700 group-hover:opacity-80 max-md:bg-[linear-gradient(0deg,rgb(34_20_10/0.7)_0%,transparent_58%)]" />
              <span className="absolute inset-0 -z-10 bg-[radial-gradient(70%_90%_at_80%_20%,rgb(255_200_140/0.28),transparent_70%)] opacity-0 mix-blend-soft-light transition-opacity duration-700 group-hover:opacity-100" />
              <span className="absolute bottom-3.5 left-3.5 right-3 flex max-w-[11rem] items-end gap-2 text-[0.96875rem] font-semibold leading-[1.15] tracking-[-0.02em] text-white [text-shadow:0_1px_12px_rgb(0_0_0/0.35)] transition-transform duration-500 ease-expo group-hover:-translate-y-1 md:bottom-[1.05rem] md:left-5 md:text-[1rem] lg:bottom-[1.15rem] lg:left-6 lg:text-[1.1875rem]">
                <span className="max-w-[8.5rem]">{c.name}</span>
                <Icon
                  name="arrowR"
                  size={16}
                  className="mb-0.5 shrink-0 -translate-x-2 opacity-0 transition-all duration-500 ease-expo group-hover:translate-x-0 group-hover:opacity-100 max-md:hidden"
                />
              </span>
            </a>
          ))}
        </div>
        {/* barra de progresso (celular) */}
        <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-ink/10 md:hidden" aria-hidden="true">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${Math.max(30, 30 + rail.progress * 70)}%` }}
          />
        </div>
      </div>
    </section>
  );
}

/* ============================================================== Banner */

export function Banner() {
  const { config } = useCatalog();
  const b = config.home.banner;
  const href = whatsappUrl(config.contact.whatsapp, b.message ?? config.contact.whatsappGreeting);
  const [l1, l2] = b.title.split('\n');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const parallax = useScrollProgress<HTMLDivElement>();
  const steam = isMobile ? b.steam?.mobile : b.steam?.wide;
  return (
    <section aria-labelledby="banner" className="wrap pt-[clamp(2rem,3.2vw,2.9rem)]">
      <div
        ref={parallax}
        data-reveal
        className="banner-bg grain relative isolate overflow-hidden rounded-[1.125rem] text-light card-shadow md:-mx-[clamp(0rem,calc((100vw-1250px)/2),2.9rem)]"
      >
        {/* foto: panorâmica com transparência própria no desktop, quadrada no celular */}
        <div className="absolute inset-x-0 top-0 -z-10 h-72 overflow-hidden md:inset-0 md:h-auto">
          <div className="parallax absolute inset-0 [--px-amount:22px]">
            <Img image={b.image} sizes="100vw" className="max-md:!object-[50%_15%]" />
            {steam && <Steam point={steam} aspect={isMobile ? 1 : 2400 / 620} position={isMobile ? [0.5, 0.15] : [1, 0.5]} rise={isMobile ? 0.75 : 0.85} />}
          </div>
          <span className="absolute inset-0 bg-[linear-gradient(0deg,var(--c-banner)_3%,transparent_55%)] md:hidden" />
        </div>
        {/* brilho quente que respira atrás da xícara */}
        <div className="pointer-events-none absolute -z-10 hidden h-[140%] w-[36%] animate-[breathe_6s_ease-in-out_infinite] rounded-full bg-[radial-gradient(closest-side,rgb(255_190_120/0.22),transparent)] md:block md:right-[10%] md:top-[-20%]" />
        <div className="relative px-6 pb-8 pt-[16.5rem] md:py-[clamp(2.25rem,3.4vw,2.9rem)] md:pl-[clamp(2.25rem,6.4vw,5.8rem)] md:pr-0">
          <h2 id="banner" className="text-[clamp(1.75rem,2.5vw,2.2rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
            {l1}
            {l2 && (
              <>
                <br />
                {l2}
              </>
            )}
          </h2>
          <p className="mt-3 max-w-[27rem] text-[1rem] leading-[1.5] text-light/85 md:text-[1.0625rem]">
            {b.text.split('\n').map((line, i) => (
              <span key={i}>
                {i > 0 && <br className="max-md:hidden" />}
                {i > 0 && ' '}
                {line}
              </span>
            ))}
          </p>
          <div className="mt-6">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent !min-h-12 gap-3 !px-7 !font-medium shadow-[0_12px_26px_-14px_rgb(0_0_0/0.65)] max-sm:w-full max-sm:!gap-2 max-sm:!px-4"
            >
              {b.cta} <Icon name="whatsapp" size={19} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
