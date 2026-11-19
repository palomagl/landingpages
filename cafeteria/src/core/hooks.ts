import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** Trava a rolagem da página enquanto um painel está aberto. */
export function useLockBody(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [active]);
}

/**
 * Painel modal acessível: Esc fecha, foco entra no painel, Tab fica preso
 * nele e volta ao elemento de origem ao fechar.
 */
export function useDialog<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const el = ref.current;
    const t = window.setTimeout(() => {
      const first = el?.querySelector<HTMLElement>('[data-autofocus]') ?? el;
      first?.focus({ preventScroll: true });
    }, 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeRef.current();
      }
      if (e.key === 'Tab' && el) {
        const items = [...el.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])')].filter(
          (n) => n.offsetParent !== null,
        );
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      prev?.focus?.({ preventScroll: true });
    };
  }, [open]);
  return ref;
}

/** Tamanho de um elemento, atualizado com ResizeObserver. */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setSize({ width: el.clientWidth, height: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

/** Mantém um painel montado durante a animação de saída. */
export function usePresence(open: boolean, ms = 320) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(r);
    }
    setVisible(false);
    const t = window.setTimeout(() => setMounted(false), ms);
    return () => window.clearTimeout(t);
  }, [open, ms]);
  return { mounted, visible };
}

/** localStorage com tolerância a falhas (modo privado, iframes, cotas). */
export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* armazenamento indisponível: segue só em memória */
    }
  },
};
