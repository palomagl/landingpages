import { useState } from "react";
import { Choices } from "./Choices";
import { clinic, services } from "./config";
import { cleanName, dayLabel, formatTime, longDay, shortDate, upcomingDays, type Draft } from "./booking";
import { WhatsAppButton } from "./WhatsAppButton";

export type SendStatus = "idle" | "sent" | "replied";

// O cartão de consulta: igual ao que a recepção entrega, só que a pessoa preenche e ele vira a mensagem
// do WhatsApp. O que é escrito (nome e horário) aparece em letra de mão.
export function AppointmentCard({
  draft,
  setDraft,
  status,
  reply,
  message,
  onDemoSend,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
  status: SendStatus;
  reply?: string;
  message: string;
  onDemoSend: () => void;
}) {
  // Recalculado a cada vez: se a aba ficar aberta por horas, horários que já passaram somem sozinhos.
  const days = upcomingDays(10);
  // Dia aberto na tela: o do horário escolhido (que pode ter vindo do cartãozinho do topo), senão o
  // último dia que a pessoa tocou, senão o primeiro com horário livre.
  const [picked, setPicked] = useState<string>();
  const firstFree = days.find((d) => d.slots.some((s) => s.free))?.date;
  const current = days.find((d) => d.date === (draft.date ?? picked ?? firstFree)) ?? days[0];
  const stillOpen = days.some((d) => d.slots.some((s) => s.free && s.date === draft.date && s.time === draft.time));
  const name = cleanName(draft.name);
  const ready = name.length >= 2 && stillOpen;
  const chosen = stillOpen && draft.date && draft.time ? `${dayLabel(draft.date).weekday}, ${shortDate(draft.date)}, ${formatTime(draft.time)}` : "";

  return (
    <section className="booking" id="agendar" aria-labelledby="b-title">
      <div className="booking-intro">
        <h2 id="b-title">Escolha um horário</h2>
        <p>Preencha o cartão. O pedido chega no meu WhatsApp e eu confirmo por lá, normalmente no mesmo dia.</p>
      </div>

      <div className="booking-grid">
        <div className="appt-col">
          <div className={`appt ${status === "idle" ? "" : "is-sent"}`}>
            <div className="appt-head">
              <span className="appt-brand">{clinic.dentist}</span>
              <span className="appt-kind">Cartão de consulta</span>
            </div>

            <div className="appt-body">
              <div className="appt-name">
                <label htmlFor="b-name">Nome</label>
                <input
                  id="b-name"
                  className="hand-input"
                  type="text"
                  maxLength={40}
                  autoComplete="given-name"
                  enterKeyHint="done"
                  placeholder="seu nome"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value.slice(0, 40) })}
                />
              </div>

              <Choices
                name="b-service"
                legend="Tratamento"
                options={services.map((s) => ({ id: s.id, label: s.short }))}
                value={draft.service}
                onChange={(service) => setDraft({ ...draft, service })}
              />

              <fieldset className="choices">
                <legend>Dia</legend>
                <div className="days">
                  {days.map((d) => {
                    const l = dayLabel(d.date);
                    const free = d.slots.filter((s) => s.free).length;
                    return (
                      <label key={d.date} className={`day ${current.date === d.date ? "on" : ""} ${free === 0 ? "full" : ""}`}>
                        <input
                          type="radio"
                          name="b-day"
                          value={d.date}
                          checked={current.date === d.date}
                          disabled={free === 0}
                          onChange={() => {
                            setPicked(d.date);
                            setDraft({ ...draft, date: undefined, time: undefined });
                          }}
                        />
                        <span className="wd">{l.weekday.slice(0, 3)}</span>
                        <span className="dn">{l.day}</span>
                        <span className="mo">{free === 0 ? "lotado" : l.month}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="choices">
                <legend>Horários de {longDay(current.date)}</legend>
                <div className="slots">
                  {current.slots.map((s) => {
                    const on = draft.time === s.time && draft.date === s.date;
                    return (
                      <label key={s.time} className={`slot ${on ? "on" : ""} ${s.free ? "" : "taken"}`}>
                        <input
                          type="radio"
                          name="b-time"
                          value={s.time}
                          disabled={!s.free}
                          checked={on}
                          onChange={() => setDraft({ ...draft, date: s.date, time: s.time })}
                        />
                        {formatTime(s.time)}
                        <span className="sr-only">{s.free ? "livre" : "ocupado"}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            <div className="appt-stub">
              <span className="stub-label">Seu horário</span>
              <span className={`hand ${chosen ? "" : "empty"}`} aria-live="polite">
                {chosen || "escolha o dia e a hora"}
              </span>
              {status !== "idle" && (
                <span className="stamp" aria-hidden="true">
                  Pedido enviado
                </span>
              )}
            </div>
          </div>

          <WhatsAppButton label="Pedir esse horário no WhatsApp" message={message} ready={ready} onDemo={onDemoSend} className="btn zap wide" />
          {!ready && (
            <p className="hint">
              {!stillOpen && name.length < 2 ? "Falta escolher o horário e escrever seu nome." : !stillOpen ? "Falta escolher o horário." : "Falta só o seu nome."}
            </p>
          )}
        </div>

        <aside className="preview" aria-label="Como a mensagem chega no WhatsApp">
          <p className="preview-label">Vai chegar assim no WhatsApp:</p>
          <p className="bubble out">{message}</p>
          <div className="preview-live" aria-live="polite">
            {status === "replied" && reply && (
              <p className="bubble in">
                <span className="bubble-from">{clinic.dentist}</span>
                {reply}
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
