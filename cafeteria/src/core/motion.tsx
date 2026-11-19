import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Entradas ao rolar: qualquer elemento com `data-reveal` ganha a classe `is-in`
 * quando entra na tela. Sem JavaScript ou com "reduzir movimento", tudo aparece
 * normalmente (as regras só valem com `html.motion-ok`).
 */
export function useRevealObserver(dep: unknown) {
  useEffect(() => {
    const root = document.documentElement;
    if (reduced() || !('IntersectionObserver' in window)) {
      root.classList.remove('motion-ok');
      return;
    }
    root.classList.add('motion-ok');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    const scan = () => document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [dep]);
}

/** Inclinação 3D + brilho que segue o cursor (só em mouse/caneta). */
export function useTilt<T extends HTMLElement>(max = 5) {
  const ref = useRef<T>(null);
  const raf = useRef(0);
  const onPointerMove = (e: RPointerEvent<T>) => {
    if (e.pointerType === 'touch' || reduced()) return;
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--rx', `${((0.5 - y) * max).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${((x - 0.5) * max).toFixed(2)}deg`);
      el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    });
  };
  const onPointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };
  return { ref, onPointerMove, onPointerLeave };
}

/** Deslocamento suave conforme o elemento atravessa a tela (−1 a 1 em --p). */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        el.style.setProperty('--p', Math.max(-1, Math.min(1, p)).toFixed(3));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return ref;
}

export interface SteamPoint {
  /** Centro da boca da xícara, em fração da imagem (0 a 1). */
  x: number;
  y: number;
  /** Largura da xícara, em fração da largura da imagem. */
  w: number;
}

/**
 * Vapor saindo de uma xícara da foto. Calcula onde o ponto da imagem cai depois do
 * `object-fit: cover` (proporção e `object-position` informados) e acompanha o redimensionamento.
 */
export function Steam({
  point,
  aspect,
  position = [0.5, 0.5],
  rise = 1.5,
  className,
}: {
  point: SteamPoint;
  aspect: number;
  position?: [number, number];
  /** Altura da coluna de vapor em relação à largura da xícara. */
  rise?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ opacity: 0 });
  useLayoutEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const calc = () => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      if (!cw || !ch) return;
      const rw = Math.max(cw, ch * aspect);
      const rh = rw / aspect;
      const ox = (cw - rw) * position[0];
      const oy = (ch - rh) * position[1];
      const w = point.w * rw;
      setStyle({ left: ox + point.x * rw, top: oy + point.y * rh, width: w, height: w * rise, ['--w' as string]: `${w}px` });
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [point.x, point.y, point.w, aspect, position[0], position[1], rise]);
  if (reduced()) return null;
  return (
    <div ref={ref} className={`steam ${className ?? ''}`} style={style} aria-hidden="true">
      <span style={{ '--d': '0s', '--dx': '-18%', '--sk': '-8deg' } as CSSProperties} />
      <span style={{ '--d': '1.6s', '--dx': '14%', '--sk': '10deg' } as CSSProperties} />
      <span style={{ '--d': '3.2s', '--dx': '-6%', '--sk': '-4deg' } as CSSProperties} />
    </div>
  );
}
