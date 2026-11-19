import type { CSSProperties } from 'react';
import type { ImageAsset, Product } from '../config/schema';
import { cx } from '../core/cx';
import type { Selection } from '../core/selection';

/**
 * Imagem responsiva: srcset/sizes, carregamento preguiçoso e enquadramento
 * configurável (object-position), para preservar o produto em qualquer recorte.
 */
export function Img({
  image,
  sizes = '100vw',
  priority,
  className,
  style,
  alt,
}: {
  image: ImageAsset;
  sizes?: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  alt?: string;
}) {
  const el = (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      alt={alt ?? image.alt}
      width={image.width}
      height={image.height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={cx('h-full w-full object-cover', className)}
      style={{ objectPosition: image.position, ...style }}
    />
  );
  if (!image.sources?.length) return el;
  return (
    <picture className="contents">
      {image.sources.map((s) => (
        <source key={s.media} media={s.media} srcSet={s.srcSet} sizes={s.sizes ?? sizes} />
      ))}
      {el}
    </picture>
  );
}

/** Galeria do produto: fotos da variação escolhida (se houver) ou as do produto. */
export function galleryFor(product: Product, selection: Selection): ImageAsset[] {
  const override = product.options
    ?.flatMap((o) => o.values.filter((v) => selection[o.id] === v.id))
    .find((v) => v.images?.length)?.images;
  return override ?? product.images;
}
