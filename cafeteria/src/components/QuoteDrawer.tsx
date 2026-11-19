import { useMemo, useRef, useState } from 'react';
import { useCatalog } from '../core/catalog';
import { cx } from '../core/cx';
import { formatPrice, pluralize } from '../core/format';
import { useDialog, useLockBody, usePresence } from '../core/hooks';
import { useQuote } from '../core/quote';
import { routes, useRouter } from '../core/router';
import { priceFor, selectedValues } from '../core/selection';
import { buildQuoteMessage, whatsappUrl } from '../core/whatsapp';
import { Img } from '../media/Img';
import { Icon } from './Icon';
import { QuantityStepper } from './ProductBits';

/** Gaveta do orçamento: itens, variações, quantidades, observações e envio ao WhatsApp. */
export function QuoteDrawer() {
  const { config } = useCatalog();
  const quote = useQuote();
  const { navigate } = useRouter();
  const { mounted, visible } = usePresence(quote.isOpen, 520);
  const ref = useDialog<HTMLDivElement>(quote.isOpen, quote.close);
  useLockBody(quote.isOpen);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [preview, setPreview] = useState(false);
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null);
  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({});
  const fieldRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const message = useMemo(
    () => buildQuoteMessage(config, quote.lines, quote.customer, quote.notes),
    [config, quote.lines, quote.customer, quote.notes],
  );

  if (!mounted) return null;
  const { copy } = config;

  const validate = () => {
    const missing = Object.fromEntries(config.quoteFields.filter((f) => f.required && !quote.customer[f.id]?.trim()).map((f) => [f.id, true]));
    setErrors(missing);
    const first = Object.keys(missing)[0];
    if (first) fieldRefs.current[first]?.focus();
    return !first;
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied('ok');
    } catch {
      setCopied('fail');
      setPreview(true);
    }
    window.setTimeout(() => setCopied(null), 2400);
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="quote-title">
      <div className={cx('scrim absolute inset-0', visible ? 'opacity-100' : 'opacity-0')} onClick={quote.close} />
      <div
        ref={ref}
        tabIndex={-1}
        className={cx(
          'absolute flex flex-col bg-bg outline-none shadow-2xl',
          'inset-x-0 bottom-0 top-[6svh] rounded-t-[1.25rem] panel-b sm:inset-y-0 sm:left-auto sm:right-0 sm:top-0 sm:w-[min(32rem,100%)] sm:rounded-l-[1.25rem] sm:rounded-tr-none sm:panel-r',
          visible ? 'translate-x-0 translate-y-0' : 'translate-y-full sm:translate-x-full sm:translate-y-0',
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b hairline px-5 py-5 sm:px-8 sm:py-7">
          <div>
            <h2 id="quote-title" className="t-subsection">
              {copy.quote.title}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {quote.count ? pluralize(quote.count, 'item', 'itens') : 'Nenhum item'}
              {quote.total != null && quote.count > 0 && (
                <>
                  , referência de <span className="t-num text-ink">{formatPrice(quote.total, config.brand)}</span>
                </>
              )}
            </p>
          </div>
          <button type="button" onClick={quote.close} className="-mr-2 grid h-11 w-11 place-items-center" aria-label="Fechar orçamento" data-autofocus>
            <Icon name="close" />
          </button>
        </header>

        {quote.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-6 px-5 sm:px-8">
            <p className="max-w-[30ch] text-xl font-semibold leading-snug tracking-[-0.02em]">{copy.quote.empty}</p>
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => {
                quote.close();
                navigate(routes.collection());
              }}
            >
              {copy.quote.emptyCta} <Icon name="arrowR" size={18} className="btn-arrow" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <p className="px-5 pt-5 text-[0.9375rem] text-muted sm:px-8">{copy.quote.intro}</p>
              <ul className="px-5 sm:px-8">
                {quote.lines.map((l) => {
                  const unit = priceFor(l.product, l.selection);
                  const vals = selectedValues(l.product, l.selection);
                  const showNote = openNotes[l.key] || !!l.note;
                  return (
                    <li key={l.key} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b hairline py-5 anim-fade">
                      <a href={routes.product(l.product.slug)} onClick={quote.close} className="block aspect-square overflow-hidden rounded-[0.75rem]">
                        {l.product.images[0] && <Img image={l.product.images[0]} sizes="88px" />}
                      </a>
                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-[1.0625rem] font-bold leading-tight tracking-[-0.02em]">{l.product.name}</h3>
                            {vals.length > 0 && (
                              <p className="mt-1.5 text-sm text-muted">{vals.map((v) => v.value.label).join(', ')}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => quote.remove(l.key)}
                            className="-mr-2 -mt-1 grid h-9 w-9 shrink-0 place-items-center text-muted hover:text-ink"
                            aria-label={`Remover ${l.product.name}`}
                          >
                            <Icon name="trash" size={18} />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <QuantityStepper size="sm" value={l.quantity} onChange={(n) => quote.setQuantity(l.key, n)} label={`Quantidade de ${l.product.name}`} />
                          {config.features.prices && (
                            <span className="text-sm tabular-nums">
                              {unit != null ? formatPrice(unit * l.quantity, config.brand) : <span className="text-muted">{copy.priceOnRequest}</span>}
                            </span>
                          )}
                        </div>
                        {showNote ? (
                          <label className="mt-3 block">
                            <span className="sr-only">Observação para {l.product.name}</span>
                            <input
                              className="field text-sm"
                              value={l.note}
                              onChange={(e) => quote.setNote(l.key, e.target.value)}
                              placeholder="Ex.: instalação em bancada de 60 cm"
                              autoFocus={openNotes[l.key] && !l.note}
                            />
                          </label>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setOpenNotes((o) => ({ ...o, [l.key]: true }))}
                            className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
                          >
                            <Icon name="plus" size={14} /> Adicionar observação
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="space-y-6 px-5 py-7 sm:px-8">
                <h3 className="text-[0.9375rem] font-semibold">Seus dados</h3>
                {config.quoteFields.map((f) => (
                  <label key={f.id} className="block">
                    <span className="mb-1.5 block text-sm font-medium">
                      {f.label}
                      {f.required && <span className="text-muted"> (obrigatório)</span>}
                    </span>
                    <input
                      ref={(el: HTMLInputElement | null) => {
                        fieldRefs.current[f.id] = el;
                      }}
                      className="field"
                      value={quote.customer[f.id] ?? ''}
                      onChange={(e) => {
                        quote.setCustomer(f.id, e.target.value);
                        if (errors[f.id]) setErrors((x) => ({ ...x, [f.id]: false }));
                      }}
                      autoComplete={f.autoComplete}
                      placeholder={f.placeholder}
                      aria-invalid={errors[f.id] || undefined}
                      aria-describedby={errors[f.id] ? `err-${f.id}` : undefined}
                    />
                    {errors[f.id] && (
                      <span id={`err-${f.id}`} className="mt-1.5 block text-sm text-[#b3412e]">
                        Preencha {f.label.toLowerCase()} para enviarmos o orçamento.
                      </span>
                    )}
                  </label>
                ))}
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">{copy.quote.notesLabel}</span>
                  <textarea
                    className="field min-h-20 resize-y"
                    value={quote.notes}
                    onChange={(e) => quote.setNotes(e.target.value)}
                    placeholder="Prazo desejado, tipo de instalação, forma de pagamento…"
                    rows={2}
                  />
                </label>
                <div>
                  <button type="button" onClick={() => setPreview((p) => !p)} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink" aria-expanded={preview}>
                    <Icon name="chevronD" size={16} className={cx('transition-transform', preview && 'rotate-180')} />
                    {preview ? 'Ocultar mensagem' : 'Ver mensagem que será enviada'}
                  </button>
                  {preview && (
                    <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-[0.75rem] bg-bg-alt p-4 font-sans text-[0.8125rem] leading-relaxed anim-fade">
                      {message}
                    </pre>
                  )}
                </div>
                <button type="button" onClick={quote.clear} className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
                  Esvaziar orçamento
                </button>
              </div>
            </div>

            <footer className="border-t hairline bg-bg px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-8 sm:pb-7 sm:pt-5">
              <a
                href={whatsappUrl(config.contact.whatsapp, message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!validate()) e.preventDefault();
                }}
                className="btn btn-dark w-full"
              >
                <Icon name="whatsapp" size={20} /> {copy.quote.sendLabel}
              </a>
              <button type="button" onClick={copyMessage} className="btn mt-2 w-full text-muted hover:text-ink">
                <Icon name={copied === 'ok' ? 'check' : 'copy'} size={18} />
                {copied === 'ok' ? 'Mensagem copiada' : copied === 'fail' ? 'Copie a mensagem acima' : 'Copiar mensagem'}
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
