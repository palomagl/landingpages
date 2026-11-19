import { useEffect, useRef, useState } from "react";
import { Clinic } from "./Clinic";
import { DEMO } from "./config";
import { Home, type Draft } from "./Home";
import type { PhoneState } from "./Phone";
import { buildMessage, cleanName, longDay, saveRequest } from "./booking";

const useHashPage = () => {
  // "#clinica" é um nome simples de propósito: funciona em qualquer hospedagem e dá pra mandar o link.
  const read = () => (/^#\/?clinica$/.test(window.location.hash) ? "clinica" : "site");
  const [page, setPage] = useState(read());
  useEffect(() => {
    const on = () => {
      setPage(read());
      window.scrollTo({ top: 0 });
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

  // Mudou a escolha: o celular volta a mostrar a mensagem sendo montada.
  useEffect(() => {
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
    const chosen = draft.date && draft.time ? `${longDay(draft.date)} às ${draft.time.replace(":", "h")}` : "";
    const answer = chosen
      ? `${oi} ${draft.service === "dor" ? "Sinto muito pela dor. " : ""}Tenho ${chosen} livre, posso confirmar?`
      : draft.service === "dor"
        ? `${oi} Sinto muito pela dor. Consigo te encaixar hoje no fim da tarde, pode ser?`
        : `${oi} Tenho dois horários: quarta às 15h30 ou quinta às 9h30. Qual fica melhor?`;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setReply(answer);
      setPhone("replied");
      setNotice(true);
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
          <a className="btn light small" href="#clinica">Ver como o consultório recebe</a>
          <button className="notice-close" aria-label="Fechar aviso" onClick={() => setNotice(false)}>×</button>
        </div>
      )}
    </>
  );
}
