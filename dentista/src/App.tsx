import { useEffect, useRef, useState } from "react";
import { Clinic } from "./Clinic";
import { DEMO } from "./config";
import { Home, type Draft } from "./Home";
import type { PhoneState } from "./Phone";
import { buildMessage, cleanName, saveRequest, suggestSlots, whenLabel } from "./booking";

const useHashPage = () => {
  // "#clinica" é um nome simples de propósito: funciona em qualquer hospedagem e dá pra mandar o link.
  const read = () => (/^#\/?clinica$/.test(window.location.hash) ? "clinica" : "site");
  const [page, setPage] = useState(read());
  useEffect(() => {
    let current = read();
    const on = () => {
      const next = read();
      setPage(next);
      // Só volta ao topo quando troca de página; um link interno (como "Ir para o conteúdo") rola sozinho.
      if (next !== current) window.scrollTo({ top: 0 });
      current = next;
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return page;
};

export function App() {
  const page = useHashPage();
  const [draft, setDraft] = useState<Draft>({ service: "avaliacao", period: "tarde", name: "" });
  const [phone, setPhone] = useState<PhoneState>("draft");
  const [reply, setReply] = useState<string>();
  const [notice, setNotice] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const message = buildMessage(draft);

  // Mudou a escolha: o celular volta a mostrar a mensagem sendo montada (e uma resposta que ainda ia
  // chegar, da mensagem anterior, é cancelada).
  useEffect(() => {
    window.clearTimeout(timer.current);
    setPhone("draft");
    setReply(undefined);
  }, [message]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const send = (where: "hero" | "agenda") => {
    if (!DEMO) return; // no site de verdade o botão já é um link direto pro WhatsApp
    saveRequest({ name: cleanName(draft.name) || "Visitante", service: draft.service, period: draft.period, date: draft.date, time: draft.time, message });
    setPhone("sent");
    const first = cleanName(draft.name).split(" ")[0];
    const oi = `Oi${first ? `, ${first}` : ""}!`;
    const sorry = draft.service === "dor" ? "Sinto muito pela dor. " : "";
    // A resposta simulada usa horários livres de verdade da agenda, no período que a pessoa escolheu.
    const [first1, first2] = suggestSlots(draft.service === "dor" ? "qualquer" : draft.period);
    const answer =
      draft.date && draft.time
        ? `${oi} ${sorry}Está livre ${whenLabel(draft.date, draft.time)}. Posso confirmar?`
        : draft.service === "dor" && first1
          ? `${oi} ${sorry}Consigo te encaixar ${whenLabel(first1.date, first1.time)}. Pode ser?`
          : first1 && first2
            ? `${oi} Tenho dois horários: ${whenLabel(first1.date, first1.time)} ou ${whenLabel(first2.date, first2.time)}. Qual fica melhor?`
            : `${oi} Recebi! Já te mando os horários livres.`;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setReply(answer);
      setPhone("replied");
      // O aviso da demonstração vem um pouco depois, para não cobrir a resposta antes de ela ser lida.
      timer.current = window.setTimeout(() => setNotice(true), 2500);
    }, 1500);
    // Em tela estreita o celular fica abaixo do formulário: rola até ele para mostrar a resposta.
    if (window.innerWidth <= 980) {
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.querySelector(where === "hero" ? ".hero-phone" : ".booking-phone")?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "center" });
    }
  };

  // A visão do consultório só existe na demonstração: num cliente real os pedidos chegam no WhatsApp.
  if (DEMO && page === "clinica") return <Clinic />;
  return (
    <>
      <Home draft={draft} setDraft={setDraft} phone={phone} reply={reply} onSend={send} />
      {notice && (
        <div className="notice" role="status">
          <p>
            Isto é uma demonstração: no site de um consultório de verdade, o botão abre o WhatsApp com a mensagem pronta.
          </p>
          <a className="btn light small" href="#clinica" onClick={() => setNotice(false)}>Ver como o consultório recebe</a>
          <button type="button" className="notice-close" aria-label="Fechar aviso" onClick={() => setNotice(false)}>×</button>
        </div>
      )}
    </>
  );
}
