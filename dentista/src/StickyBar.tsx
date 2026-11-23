import { useEffect, useState } from "react";
import { WhatsAppButton } from "./WhatsAppButton";

// Barra fixa no pé da tela do celular, com o botão do WhatsApp sempre à mão. Some enquanto o topo, o
// cartão de consulta ou o rodapé estão na tela, onde já existe um botão igual.
export function StickyBar({ message, onDemo }: { message: string; onDemo: (message: string) => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const targets = ["topo", "agendar", "rodape"].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!targets.length || !("IntersectionObserver" in window)) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setShow(visible.size === 0);
    }, { rootMargin: "-90px 0px -40px 0px" }); // ignora o pedaço escondido atrás do topo fixo
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div className={`sticky-bar ${show ? "on" : ""}`} inert={!show}>
      <WhatsAppButton label="Marcar pelo WhatsApp" message={message} onDemo={onDemo} className="btn zap" />
      <a className="btn ghost" href="#agendar">
        Horários
      </a>
    </div>
  );
}
