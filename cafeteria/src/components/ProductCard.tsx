import type { CSSProperties } from 'react';
import type { Product } from '../config/schema';
import { useCatalog } from '../core/catalog';
import { useTilt } from '../core/motion';
import { cx } from '../core/cx';
import { routes } from '../core/router';
import { Img } from '../media/Img';
import { Icon } from './Icon';
import { Price } from './ProductBits';

/**
 * Card de produto do mockup: foto em cima, painel claro sobreposto com nome,
 * descrição curta, preço "A partir de" e botão quadrado de seta.
 */
export function ProductCard({
  product,
  className,
  style,
  sizes = '(min-width: 1024px) 400px, (min-width: 640px) 46vw, 86vw',
  priority,
  transition = true,
}: {
  product: Product;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  priority?: boolean;
  transition?: boolean;
}) {
  const { config } = useCatalog();
  const cover = product.cover ?? product.images[0];
  const tilt = useTilt<HTMLElement>(4);
  return (
    <article
      ref={tilt.ref}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className={cx('tilt group relative flex min-w-0 flex-col overflow-hidden rounded-[1rem] bg-card card-shadow', className)}
      style={style}
    >
      <div
        className="relative aspect-[1000/570] overflow-hidden"
        style={transition ? ({ viewTransitionName: `produto-${product.id}` } as CSSProperties) : undefined}
      >
        {cover && (
          <div className="reveal-zoom h-full w-full">
            <Img
              image={cover}
              sizes={sizes}
              priority={priority}
              className="transition-transform duration-[1.4s] ease-expo group-hover:scale-[1.06]"
            />
          </div>
        )}
        {/* luz quente que acende no hover */}
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_70%_30%,rgb(255_205_150/0.32),transparent_70%)] opacity-0 mix-blend-soft-light transition-opacity duration-700 group-hover:opacity-100" />
        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-dark/80 px-3 py-1 text-xs font-semibold text-on-dark backdrop-blur">
            {product.badge}
          </span>
        )}
        {/* a foto inteira também abre o produto (o link acessível é o do nome, abaixo) */}
        <a href={routes.product(product.slug)} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-[1]" />
      </div>
      <div className="relative -mt-3 flex flex-1 flex-col rounded-[0.875rem] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--c-card)_70%,white)_0%,var(--c-card)_60%)] px-6 pb-6 pt-[1.15rem] shadow-[0_-10px_22px_-18px_rgb(60_35_15/0.45)] md:px-5 lg:pb-[1.6rem] lg:pl-[2.4rem] lg:pr-6 lg:pt-[1.35rem]">
        <h3 className="pr-16 text-[1.25rem] font-bold leading-tight tracking-[-0.025em] lg:text-[1.4375rem]">
          <a href={routes.product(product.slug)} className="outline-none after:absolute after:inset-0 after:z-10 after:rounded-[1rem] focus-visible:after:ring-2 focus-visible:after:ring-accent">
            {product.name}
          </a>
        </h3>
        <p className="mt-1.5 max-w-[16.5rem] pr-14 text-[0.9375rem] leading-[1.45] text-muted lg:text-[1rem]">{product.summary}</p>
        {config.features.prices && (
          <p className="mt-auto pt-3.5 text-[0.96875rem] tracking-[-0.01em] lg:pt-4 lg:text-[1.0625rem]">
            <Price product={product} strong />
          </p>
        )}
        <span className="arrow-sq absolute right-6 top-1/2 -translate-y-1/2" aria-hidden="true">
          <Icon name="arrowR" size={20} strokeWidth={1.8} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
