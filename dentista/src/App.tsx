import { useEffect, useRef, useState } from "react";
import { Clinic } from "./Clinic";
import { clinic, DEMO } from "./config";
import { Home, quickMessage } from "./Home";
import { StickyBar } from "./StickyBar";
import type { SendStatus } from "./AppointmentCard";
import { buildMessage, cleanName, saveRequest, whenLabel, type Draft } from "./booking";

const useHashPage = () => {
  // "#clinica" é um nome simples de propósito: funciona em qualquer hospedagem e dá pra mandar o link.
  const read = () => (/^#\/?clinica$/.test(window.location.hash) ? "clinica" : "site");
  const [page, setPage] = useState(read());
  useEffect(() => {
    let current = read();
    const on = () => {
      const next = read();
      setPage(next);
      // Só volta ao topo quando troca de página; um link interno (como "Horários") rola sozinho.
      if (next !== current) window.scrollTo({ top: 0 });
      current = next;
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return page;
};

type Notice = { kind: "link"; message: string } | { kind: "sent" };

export function App() {
  const page = useHashPage();
  const [draft, setDraft] = useState<Draft>({ service: "avaliacao", period: "qualquer", name: "" });
  const [status, setStatus] = useState<SendStatus>("idle");
  const [reply, setReply] = useState<string>();
  const [notice, setNotice] = useState<Notice | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const message = buildMessage(draft);

  // Mudou alguma coisa no cartão: o pedido volta a ser rascunho (e uma resposta que ainda ia chegar,
  // da mensagem anterior, é cancelada).
  useEffect(() => {
    window.clearTimeout(timer.current);
    setStatus("idle");
    setReply(undefined);
  }, [message]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Demonstração: um botão geral de WhatsApp mostra a mensagem que iria.
  const demoLink = (text: string) => setNotice({ kind: "link", message: text });

  // Demonstração: o cartão de consulta "envia", carimba e recebe uma resposta simulada.
  const demoSend = () => {
    if (!DEMO || !draft.date || !draft.time) return;
    saveRequest({ name: cleanName(draft.name) || "Visitante", service: draft.service, period: draft.period, date: draft.date, time: draft.time, message });
    setStatus("sent");
    setNotice(null);
    const first = cleanName(draft.name).split(" ")[0];
    const sorry = draft.service === "dor" ? " Sinto muito pela dor." : "";
    const answer = `Oi${first ? `, ${first}` : ""}!${sorry} Está livre ${whenLabel(draft.date, draft.time)}. Posso confirmar?`;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setReply(answer);
      setStatus("replied");
      // O aviso da demonstração vem depois, para não cobrir a resposta antes de ela ser lida.
      timer.current = window.setTimeout(() => setNotice({ kind: "sent" }), 2500);
    }, 1400);
  };

  // A visão do consultório só existe na demonstração: num cliente real os pedidos chegam no WhatsApp.
  if (DEMO && page === "clinica") return <Clinic />;
  return (
    <>
      <Home draft={draft} setDraft={setDraft} status={status} reply={reply} onDemoSend={demoSend} onDemoLink={demoLink} />
      <StickyBar message={quickMessage} onDemo={demoLink} />
      {notice && (
        <div className="notice" role="status">
          {notice.kind === "link" ? (
            <>
              <p>
                Isto é uma demonstração. No site de verdade, este botão abre o WhatsApp da {clinic.dentist} já com a
                mensagem:
              </p>
              <p className="notice-quote">{notice.message}</p>
              <a className="btn light small" href="#agendar" onClick={() => setNotice(null)}>
                Ou escolha um horário
              </a>
            </>
          ) : (
            <>
              <p>
                Isto é uma demonstração: no site de verdade, o botão abre o WhatsApp com a mensagem pronta e a
                resposta chega por lá.
              </p>
              <a className="btn light small" href="#clinica" onClick={() => setNotice(null)}>
                Ver como o consultório recebe
              </a>
            </>
          )}
          <button type="button" className="notice-close" aria-label="Fechar aviso" onClick={() => setNotice(null)}>
            ×
          </button>
        </div>
      )}
    </>
  );
}
