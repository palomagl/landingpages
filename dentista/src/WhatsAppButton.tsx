import type { ReactNode } from "react";
import { DEMO } from "./config";
import { whatsappLink } from "./booking";

// Botão que leva pro WhatsApp. No site de verdade é um link comum (abre o WhatsApp numa aba nova, sem
// pop-up e sem dar acesso a esta página). Na demonstração não existe WhatsApp de verdade do outro lado,
// então o botão chama onDemo, que mostra o que aconteceria.
export function WhatsAppButton({
  label,
  message,
  className = "btn zap",
  ready = true,
  onDemo,
  children,
}: {
  label: string;
  message: string;
  className?: string;
  ready?: boolean;
  onDemo: (message: string) => void;
  children?: ReactNode;
}) {
  if (DEMO || !ready) {
    return (
      <button type="button" className={className} disabled={!ready} aria-label={children ? label : undefined} onClick={ready ? () => onDemo(message) : undefined}>
        {children ?? label}
      </button>
    );
  }
  return (
    <a className={className} href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" aria-label={children ? label : undefined}>
      {children ?? label}
    </a>
  );
}

// Balão de conversa (desenho próprio, não é a marca do WhatsApp).
export function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path
        d="M12 3.2c-4.9 0-8.8 3.5-8.8 7.9 0 2.3 1.1 4.4 2.9 5.9l-.7 3.4 3.7-1.9c.9.3 1.9.4 2.9.4 4.9 0 8.8-3.5 8.8-7.8S16.9 3.2 12 3.2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8.3 11.2h.01M12 11.2h.01M15.7 11.2h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
