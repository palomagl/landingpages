import { DEMO } from "./config";
import { whatsappLink } from "./booking";

// Botão que leva pro WhatsApp. No site de verdade é um link comum (abre o WhatsApp numa aba nova sem
// depender de pop-up e sem dar acesso a esta página); na demonstração, simula o envio aqui mesmo.
export function SendButton({ label, message, ready = true, onDemoSend }: { label: string; message: string; ready?: boolean; onDemoSend: () => void }) {
  if (DEMO || !ready) {
    return (
      <button type="button" className="btn zap" disabled={!ready} onClick={ready ? onDemoSend : undefined}>
        {label}
      </button>
    );
  }
  return (
    <a className="btn zap" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}
