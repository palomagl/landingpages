import { useEffect, useState } from 'react';
import { useUi } from '../App';
import { useCatalog } from '../core/catalog';
import { cx } from '../core/cx';
import { useDialog, useLockBody, usePresence } from '../core/hooks';
import { useQuote } from '../core/quote';
import { routes, useRouter, type Route } from '../core/router';
import { whatsappUrl } from '../core/whatsapp';
import { Icon } from './Icon';

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  const { config } = useCatalog();
  return (
    <span className={cx('inline-flex flex-col items-center font-logo leading-none', className)}>
      <span className={cx('mr-[-0.34em] font-normal tracking-[0.34em]', compact ? 'text-[1.5rem]' : 'text-[1.5rem] md:text-[1.625rem] lg:text-[1.875rem]')}>
        {config.brand.wordmark}
      </span>
      {config.brand.wordmarkSub && (
        <span className={cx('mr-[-0.36em] mt-[0.32rem] font-medium uppercase tracking-[0.36em]', compact ? 'text-[0.4375rem]' : 'text-[0.4375rem] lg:text-[0.5625rem]')}>
          {config.brand.wordmarkSub}
        </span>
      )}
    </span>
  );
}

/** Item ativo do menu conforme a rota atual. */
function activeNav(route: Route) {
  if (route.name === 'home') return route.anchor === 'contato' ? 'contato' : 'inicio';
  if (route.name === 'collection') return route.category ? `colecao-${route.category}` : 'colecao';
  return '';
}

export function Header() {
  const { config } = useCatalog();
  const { route } = useRouter();
  const quote = useQuote();
  const ui = useUi();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const overHero = route.name === 'home' && !scrolled;
  const current = activeNav(route);
  const wa = whatsappUrl(config.contact.whatsapp, config.contact.whatsappGreeting);

  // fica translúcido ao rolar; esconde ao descer e volta ao subir
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 320);
        last = y;
      }
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setMenu(false), [route]);

  return (
    <>
      <header
        className={cx(
          'vt-header fixed inset-x-0 top-0 z-40 transition-[background-color,color,box-shadow,transform] duration-500 ease-expo',
          overHero ? 'text-light' : 'glass text-ink shadow-[0_1px_0_var(--c-line)]',
          hidden && !menu && !quote.isOpen && route.name !== 'collection' && 'header-hidden',
        )}
      >
        <div className={cx('wrap relative flex items-center transition-[height] duration-500', overHero ? 'h-[4.25rem] lg:h-24' : 'h-16 lg:h-[4.75rem]')}>
          <a href={routes.home()} className="shrink-0" aria-label={`${config.brand.name}, página inicial`}>
            <Logo />
          </a>

          <nav aria-label="Principal" className="absolute left-1/2 hidden -translate-x-1/2 md:block">
            <ul className="flex items-center gap-5 lg:gap-8 xl:gap-[3.15rem]">
              {config.navigation.map((n) => {
                const on = current === n.to;
                return (
                  <li key={n.to}>
                    <a
                      href={`#${n.to}`}
                      aria-current={on ? 'page' : undefined}
                      className={cx(
                        'relative block py-2.5 text-[0.8125rem] font-medium tracking-[-0.01em] transition-opacity lg:text-[0.875rem]',
                        on ? 'opacity-100' : 'opacity-90 hover:opacity-100',
                        "after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-[calc(100%+0.5rem)] after:-translate-x-1/2 after:rounded-full after:bg-current after:transition-transform after:duration-500 after:content-['']",
                        on ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100',
                      )}
                    >
                      {n.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2.5 lg:gap-3.5">
            {config.features.search && (
              <button
                type="button"
                onClick={ui.openSearch}
                className={cx(
                  'hidden h-11 w-11 place-items-center rounded-[0.875rem] transition-colors md:grid lg:h-[3.1rem] lg:w-[3.1rem]',
                  overHero ? 'bg-[rgb(255_236_214/0.16)] hover:bg-[rgb(255_236_214/0.26)]' : 'bg-card hover:bg-bg-alt',
                )}
                aria-label="Buscar produtos"
              >
                <Icon name="search" size={21} />
              </button>
            )}
            {config.features.quote && quote.count > 0 && (
              <button
                type="button"
                onClick={quote.open}
                className={cx(
                  'relative grid h-11 w-11 place-items-center rounded-[0.875rem] transition-colors lg:h-[3.125rem] lg:w-[3.125rem]',
                  overHero ? 'bg-[rgb(255_236_214/0.16)] hover:bg-[rgb(255_236_214/0.26)]' : 'bg-card hover:bg-bg-alt',
                )}
                aria-label={`Abrir orçamento, ${quote.count} ${quote.count === 1 ? 'item' : 'itens'}`}
              >
                <Icon name="bag" size={21} />
                <span key={quote.count} className="anim-bump absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.6875rem] font-semibold text-on-accent">
                  {quote.count}
                </span>
              </button>
            )}
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className={cx(
                'btn hidden !min-h-11 gap-2.5 !px-3 !text-[0.875rem] md:inline-flex lg:!min-h-[3.1rem] xl:!px-[1.45rem]',
                overHero ? 'bg-[rgb(35_22_13/0.72)] text-light hover:bg-[rgb(35_22_13/0.9)]' : 'btn-dark',
              )}
            >
              <Icon name="whatsapp" size={19} /> <span className="max-xl:sr-only">{config.contact.whatsappDisplay ?? 'Falar no WhatsApp'}</span>
            </a>
            <button
              type="button"
              className="-mr-2 grid h-11 w-11 place-items-center md:hidden"
              onClick={() => setMenu(true)}
              aria-label="Abrir menu"
              aria-expanded={menu}
            >
              <Icon name="menu" size={24} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menu} onClose={() => setMenu(false)} current={current} wa={wa} />
    </>
  );
}

function MobileMenu({ open, onClose, current, wa }: { open: boolean; onClose: () => void; current: string; wa: string }) {
  const { config } = useCatalog();
  const ui = useUi();
  const quote = useQuote();
  const { mounted, visible } = usePresence(open, 450);
  const ref = useDialog<HTMLDivElement>(open, onClose);
  useLockBody(open);
  if (!mounted) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div
        ref={ref}
        tabIndex={-1}
        className={cx(
          'absolute inset-0 flex flex-col bg-[linear-gradient(180deg,#2a1a0f,#4a3220_60%,#6d4d33)] text-light outline-none transition-[opacity,transform] duration-500 ease-expo',
          visible ? 'opacity-100' : '-translate-y-3 opacity-0',
        )}
      >
        <div className="wrap flex h-[4.25rem] items-center justify-between">
          <Logo />
          <button type="button" onClick={onClose} className="-mr-2 grid h-11 w-11 place-items-center" aria-label="Fechar menu" data-autofocus>
            <Icon name="close" size={24} />
          </button>
        </div>
        <nav aria-label="Menu" className="wrap flex-1 overflow-y-auto pt-8">
          <ul className="space-y-1">
            {config.navigation.map((n, i) => (
              <li key={n.to} className={visible ? 'anim-fade-up' : ''} style={{ animationDelay: `${60 + i * 45}ms` }}>
                <a
                  href={`#${n.to}`}
                  onClick={onClose}
                  aria-current={current === n.to ? 'page' : undefined}
                  className="flex items-center justify-between border-b border-light/15 py-4 text-[1.75rem] font-bold tracking-[-0.03em]"
                >
                  {n.label}
                  {current === n.to && <span className="h-2 w-2 rounded-full bg-light" />}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-cream">
              <Icon name="whatsapp" size={19} /> {config.contact.whatsappDisplay ?? 'Falar no WhatsApp'}
            </a>
            <div className="grid grid-cols-2 gap-3">
              {config.features.search && (
                <button
                  type="button"
                  className="btn !gap-2 border border-light/30 !px-3 text-light"
                  onClick={() => {
                    onClose();
                    ui.openSearch();
                  }}
                >
                  <Icon name="search" size={18} /> Buscar
                </button>
              )}
              {config.features.quote && (
                <button
                  type="button"
                  className="btn !gap-2 border border-light/30 !px-3 text-light"
                  onClick={() => {
                    onClose();
                    quote.open();
                  }}
                >
                  <Icon name="bag" size={18} /> Orçamento {quote.count > 0 && `(${quote.count})`}
                </button>
              )}
            </div>
          </div>
        </nav>
        <div className="wrap py-6 text-sm text-light/70">
          {config.contact.address && <p>{config.contact.address}</p>}
          {config.contact.hours && <p>{config.contact.hours}</p>}
        </div>
      </div>
    </div>
  );
}
