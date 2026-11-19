import { useCatalog } from '../core/catalog';
import { routes } from '../core/router';
import { whatsappUrl } from '../core/whatsapp';
import { Logo } from './Header';
import { Icon } from './Icon';

/** Rodapé com o contato (destino do item "Contato" do menu). */
export function Footer() {
  const { config, categories } = useCatalog();
  const { contact, copy, brand } = config;
  return (
    <footer id="contato" className="mt-[clamp(3.5rem,6vw,5rem)] scroll-mt-20 border-t hairline">
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr] lg:py-14">
        <div>
          <Logo className="text-ink" />
          <p className="mt-5 max-w-[22rem] text-[0.9375rem] leading-relaxed text-muted">{copy.footer.statement}</p>
        </div>
        <nav aria-label="Categorias">
          <h2 className="text-[0.9375rem] font-semibold">Coleção</h2>
          <ul className="mt-3 space-y-2 text-[0.9375rem] text-muted">
            {categories.map((c) => (
              <li key={c.id}>
                <a href={routes.collection(c.id)} className="transition-colors hover:text-ink">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-[0.9375rem] font-semibold">Contato</h2>
          <div className="mt-3 space-y-1.5 text-[0.9375rem] text-muted">
            {contact.address && <p>{contact.address}</p>}
            {contact.hours && <p>{contact.hours}</p>}
            {contact.email && <p>{contact.email}</p>}
            {contact.phone && <p>{contact.phone}</p>}
          </div>
          <a href={whatsappUrl(contact.whatsapp, contact.whatsappGreeting)} target="_blank" rel="noopener noreferrer" className="btn btn-dark mt-5 !min-h-12 gap-2.5">
            <Icon name="whatsapp" size={18} /> {contact.whatsappDisplay ?? 'Falar no WhatsApp'}
          </a>
        </div>
      </div>
      <div className="wrap flex flex-wrap justify-between gap-3 border-t hairline py-5 text-[0.8125rem] text-muted">
        <p>
          © {new Date().getFullYear()} {brand.name}. {copy.footer.legal}
        </p>
        {copy.footer.credit && <p>{copy.footer.credit}</p>}
      </div>
    </footer>
  );
}
