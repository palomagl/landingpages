import { useState } from 'react';
import { useCatalog } from '../core/catalog';
import { useQuote } from '../core/quote';
import { routes } from '../core/router';
import { whatsappUrl } from '../core/whatsapp';
import { Icon } from '../components/Icon';
import { NotFoundPage } from './NotFoundPage';

/** Política de privacidade: texto da configuração + botão para apagar os dados deste aparelho. */
export function PrivacyPage() {
  const { config } = useCatalog();
  const quote = useQuote();
  const [erased, setErased] = useState(false);
  const privacy = config.copy.privacy;
  if (!privacy) return <NotFoundPage />;
  const fill = (t: string) => t.replaceAll('{brand}', config.brand.name);
  const hasData = quote.items.length > 0 || quote.notes.trim() !== '' || Object.values(quote.customer).some((v) => v.trim());

  return (
    <article className="wrap pb-6 pt-28 lg:pt-36">
      <header className="max-w-[44rem]">
        <p className="eyebrow text-muted">{config.brand.name}</p>
        <h1 className="t-section mt-3">{privacy.title}</h1>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">{fill(privacy.intro)}</p>
      </header>

      <div className="mt-10 grid max-w-[44rem] gap-8 lg:mt-12">
        {privacy.sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-[1.1875rem] font-semibold tracking-[-0.02em]">{fill(s.title)}</h2>
            <p className="mt-2 text-[1rem] leading-relaxed text-ink/85">{fill(s.text)}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 flex max-w-[44rem] flex-wrap items-center gap-3 rounded-[1.25rem] bg-card p-6 card-shadow md:p-7">
        <p className="min-w-[14rem] flex-1 text-[0.9375rem] leading-snug" role="status">
          {erased
            ? 'Pronto: os dados deste catálogo foram apagados deste aparelho.'
            : hasData
              ? 'Há um orçamento e dados de contato salvos neste aparelho.'
              : 'Nenhum dado do orçamento está salvo neste aparelho.'}
        </p>
        {hasData && !erased && (
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => {
              quote.forget();
              setErased(true);
            }}
          >
            <Icon name="trash" size={18} /> Apagar meus dados
          </button>
        )}
        <a href={whatsappUrl(config.contact.whatsapp, `Olá! Gostaria de falar sobre os meus dados enviados pelo catálogo da ${config.brand.name}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          <Icon name="whatsapp" size={18} /> Falar sobre meus dados
        </a>
      </div>

      <p className="mt-8 text-sm text-muted">
        <a href={routes.home()} className="link-underline">
          Voltar ao início
        </a>
      </p>
    </article>
  );
}
