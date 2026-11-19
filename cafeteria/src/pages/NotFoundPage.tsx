import { routes } from '../core/router';
import { Icon } from '../components/Icon';

export function NotFoundPage({ title = 'Página não encontrada' }: { title?: string }) {
  return (
    <div className="wrap grid min-h-[70svh] content-center gap-6 pb-16 pt-32">
      <h1 className="t-section max-w-[16ch]">{title}</h1>
      <p className="max-w-[44ch] text-lg text-muted">O endereço pode ter mudado ou o item saiu do catálogo. Continue pela coleção completa.</p>
      <div className="flex flex-wrap gap-3">
        <a href={routes.collection()} className="btn btn-dark">
          Ver a coleção <Icon name="arrowR" size={18} className="btn-arrow" />
        </a>
        <a href={routes.home()} className="btn btn-outline">
          Ir para o início
        </a>
      </div>
    </div>
  );
}
