import { useState } from "react";
import { Choices } from "./Choices";
import { clinic, DEMO, periods, services, type PeriodId, type ServiceId } from "./config";
import { MapCard } from "./MapCard";
import { Phone, type PhoneState } from "./Phone";
import { Photo } from "./Photo";
import { SendButton } from "./SendButton";
import { buildMessage, cleanName, dayLabel, formatTime, longDay, upcomingDays } from "./booking";

export interface Draft {
  service: ServiceId;
  period: PeriodId;
  name: string;
  date?: string;
  time?: string;
}

type Props = {
  draft: Draft;
  setDraft: (d: Draft) => void;
  phone: PhoneState;
  reply?: string;
  onSend: (where: "hero" | "agenda") => void;
};

const calm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: calm() ? "auto" : "smooth", block: "start" });

export function Home({ draft, setDraft, phone, reply, onSend }: Props) {
  const message = buildMessage(draft);
  return (
    <>
      <a className="skip" href="#conteudo">Ir para o conteúdo</a>
      <header className="top">
        <a className="mark" href="#" aria-label={`${clinic.dentist}, início`}>
          <span className="mark-name">{clinic.dentist}</span>
          <span className="mark-sub">odontologia</span>
        </a>
        <nav aria-label="Seções">
          <button type="button" onClick={() => scrollTo("medo")}>Pra quem tem medo</button>
          <button type="button" onClick={() => scrollTo("tratamentos")}>Tratamentos</button>
          <button type="button" onClick={() => scrollTo("onde")}>Onde fica</button>
        </nav>
        <button type="button" className="btn zap small" onClick={() => scrollTo("agendar")}>Marcar horário</button>
      </header>

      <main id="conteudo" tabIndex={-1}>
        <section className="hero">
          <div className="hero-copy">
            <h1>Dentista sem pressa, pra quem anda adiando.</h1>
            <p className="lead">
              Consultório pequeno no centro de Novo Hamburgo, com hora marcada e tempo pra explicar cada passo. Diz o
              que você precisa: a mensagem já sai pronta pro WhatsApp.
            </p>
            <Choices
              name="hero-service"
              legend="O que você precisa?"
              options={services.map((s) => ({ id: s.id, label: s.short }))}
              value={draft.service}
              onChange={(service) => setDraft({ ...draft, service, date: undefined, time: undefined })}
            />
            <Choices
              name="hero-period"
              legend="Quando fica melhor?"
              options={periods}
              value={draft.period}
              onChange={(period) => setDraft({ ...draft, period, date: undefined, time: undefined })}
            />
            <div className="actions">
              <SendButton label="Mandar no WhatsApp" message={message} onDemoSend={() => onSend("hero")} />
              <button type="button" className="btn quiet" onClick={() => scrollTo("agendar")}>Prefiro escolher dia e hora</button>
            </div>
          </div>
          <div className="hero-visual">
            <Photo id="retrato" className="hero-photo" sizes="(max-width: 980px) 92vw, 460px" priority />
            <div className="hero-phone">
              <Phone message={message} state={phone} reply={reply} live />
            </div>
          </div>
        </section>

        <section className="facts" aria-label="Como funciona o consultório">
          <p><strong>Hora marcada de verdade.</strong> Uma pessoa por vez, sem sala de espera cheia.</p>
          <p><strong>Plano antes de começar.</strong> Você sabe o que vai ser feito e por quê antes do primeiro procedimento.</p>
          <p><strong>Encaixe pra quem tem dor.</strong> Todo dia tem horário reservado pra urgência.</p>
        </section>

        <section className="room" aria-label="O consultório">
          <figure>
            <Photo id="consultorio" className="room-photo" sizes="(max-width: 980px) 92vw, 720px" />
            <figcaption>
              <strong>Sala 3, {clinic.address.split(",")[0]}.</strong>
              <span>Uma cadeira só, uma paciente por vez e nenhuma pressa. A auxiliar fica junto o tempo todo.</span>
            </figcaption>
          </figure>
        </section>

        <section className="fear" id="medo" aria-labelledby="fear-title">
          <div className="fear-text">
            <h2 id="fear-title">Medo de dentista é comum. A gente trabalha contando com ele.</h2>
            <ul className="fear-list">
              <li><strong>Nada de surpresa.</strong> Antes de cada etapa, a Dra. Lívia explica o que você vai sentir e quanto tempo leva.</li>
              <li><strong>Um sinal pra parar.</strong> Combinado no começo: levantou a mão, ela para na hora.</li>
              <li><strong>Anestesia sem pressa.</strong> Esperar o tempo certo faz toda a diferença, e aqui ninguém tem pressa.</li>
              <li><strong>Consulta curta, se preferir.</strong> Dá pra dividir o tratamento em sessões menores.</li>
            </ul>
          </div>
          <Photo id="conversa" className="fear-photo" sizes="(max-width: 980px) 92vw, 560px" />
        </section>

        <section className="first" aria-labelledby="first-title">
          <h2 id="first-title">Como é a primeira consulta</h2>
          <div className="first-grid">
            <Photo id="exame" className="first-photo" sizes="(max-width: 980px) 92vw, 520px" />
            <ol className="steps">
              <li><span className="n" aria-hidden>1</span><h3>Conversa</h3><p>O que está incomodando, o que você já fez e o que te deixa nervoso.</p></li>
              <li><span className="n" aria-hidden>2</span><h3>Exame</h3><p>Exame clínico e, se precisar, radiografia na hora.</p></li>
              <li><span className="n" aria-hidden>3</span><h3>Plano</h3><p>Você recebe por escrito o que precisa ser feito, por prioridade.</p></li>
              <li><span className="n" aria-hidden>4</span><h3>Você decide</h3><p>Leva o plano pra casa e marca quando quiser. Sem pressão.</p></li>
            </ol>
          </div>
        </section>

        <section className="treatments" id="tratamentos" aria-labelledby="t-title">
          <div className="t-grid">
            <div className="t-aside">
              <h2 id="t-title">Tratamentos</h2>
              <p className="muted">{clinic.specialty}.</p>
              <Photo id="prevencao" className="t-photo" sizes="(max-width: 980px) 92vw, 440px" />
            </div>
            <dl className="t-list">
              {services.map((s) => (
                <div key={s.id}>
                  <dt>{s.name}</dt>
                  <dd>{s.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <Booking draft={draft} setDraft={setDraft} phone={phone} reply={reply} onSend={() => onSend("agenda")} message={message} />

        <section className="about" aria-labelledby="about-title">
          <Photo id="atendimento" className="about-photo" sizes="(max-width: 980px) 92vw, 560px" />
          <div>
            <h2 id="about-title">Sobre a {clinic.dentist}</h2>
            <p>
              Formada há 8 anos, com especialização em endodontia, a parte da odontologia que cuida do canal.
              Atende só com uma auxiliar, justamente pra conseguir conhecer cada paciente pelo nome.
            </p>
            <p>
              Usa radiografia digital e mostra tudo no tablet: você vê o mesmo que ela antes de decidir qualquer
              coisa.
            </p>
            <p className="small muted">{clinic.cro}. Responsável técnica pelo consultório.</p>
          </div>
        </section>

        <section className="where" id="onde" aria-labelledby="where-title">
          <MapCard />
          <div className="where-info">
            <h2 id="where-title">Onde fica</h2>
            <p className="addr">{clinic.address}<br />{clinic.district}</p>
            <p className="muted">{clinic.howToGetThere} Acesso por elevador.</p>
            <table className="hours">
              <caption className="sr-only">Horário de atendimento</caption>
              <tbody>
                {clinic.hours.map((h) => (
                  <tr key={h.days}><th scope="row">{h.days}</th><td>{h.time}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="small muted">Telefone fixo {clinic.phone}. WhatsApp {clinic.whatsappDisplay}.</p>
          </div>
        </section>

        <section className="faq-section" aria-labelledby="faq-title">
          <Faq />
        </section>
      </main>

      <footer className="foot">
        <div>
          <strong>{clinic.dentist}</strong>
          <p>{clinic.cro}. {clinic.specialty}.</p>
          <p>{clinic.address}, {clinic.district}. {clinic.phone}.</p>
        </div>
        <div className="small">
          <p>
            O que você escolhe e digita aqui serve só para montar a mensagem do WhatsApp: nada é enviado para outro
            lugar.{DEMO && " Na demonstração, os pedidos de teste ficam guardados só neste navegador."}
          </p>
          {DEMO && (
            <p>
              Site de demonstração: profissional, CRO, endereço e telefones são fictícios. Fotos de banco de imagem
              (Pexels), com modelos.{" "}
              <a href="#clinica">Ver como o consultório recebe os pedidos</a>.
            </p>
          )}
        </div>
      </footer>
    </>
  );
}

function Booking({ draft, setDraft, phone, reply, onSend, message }: Omit<Props, "onSend"> & { onSend: () => void; message: string }) {
  // Recalculado a cada vez: se a aba ficar aberta por horas, horários que já passaram somem sozinhos.
  const days = upcomingDays(10);
  const [picked, setDay] = useState(draft.date ?? days.find((d) => d.slots.some((s) => s.free))?.date ?? days[0].date);
  const current = days.find((d) => d.date === picked) ?? days[0];
  const day = current.date;
  // O horário escolhido ainda precisa existir (com a aba aberta muito tempo, ele pode ter passado).
  const stillOpen = days.some((d) => d.slots.some((s) => s.free && s.date === draft.date && s.time === draft.time));
  const ready = cleanName(draft.name).length >= 2 && stillOpen;

  return (
    <section className="booking" id="agendar" aria-labelledby="b-title">
      <div className="booking-form">
        <h2 id="b-title">Escolha dia e horário</h2>
        <p className="lead small-lead">O horário fica reservado pra você quando o consultório confirmar pelo WhatsApp.</p>

        <Choices
          name="b-service"
          legend="Pra quê?"
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
                <label key={d.date} className={`day ${day === d.date ? "on" : ""} ${free === 0 ? "full" : ""}`}>
                  <input
                    type="radio"
                    name="b-day"
                    value={d.date}
                    checked={day === d.date}
                    disabled={free === 0}
                    onChange={() => {
                      setDay(d.date);
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
            {current.slots.map((s) => (
              <label key={s.time} className={`slot ${draft.time === s.time && draft.date === s.date ? "on" : ""} ${s.free ? "" : "taken"}`}>
                <input
                  type="radio"
                  name="b-time"
                  value={s.time}
                  disabled={!s.free}
                  checked={draft.time === s.time && draft.date === s.date}
                  onChange={() => setDraft({ ...draft, date: s.date, time: s.time })}
                />
                {formatTime(s.time)}
                <span className="sr-only">{s.free ? "livre" : "ocupado"}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="b-name">Seu nome</label>
          <input id="b-name" className="input" type="text" maxLength={40} autoComplete="given-name" enterKeyHint="done" placeholder="Ana" value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value.slice(0, 40) })} />
        </div>

        <div className="actions">
          <SendButton label="Pedir esse horário no WhatsApp" message={message} ready={ready} onDemoSend={onSend} />
          {!ready && <span className="small muted">{stillOpen ? "Falta só o seu nome." : "Escolha um horário."}</span>}
        </div>
      </div>
      <div className="booking-phone">
        <Phone message={message} state={phone} reply={reply} />
      </div>
    </section>
  );
}

const FAQ = [
  {
    q: "Estou com dor agora. O que faço?",
    a: "Manda uma mensagem escrito \"dor\" no WhatsApp. Todo dia ficam horários reservados para encaixe, e a gente te responde com o primeiro disponível.",
  },
  {
    q: "Atende convênio? Quais as formas de pagamento?",
    a: "Isso depende do tratamento e muda com frequência, então a gente responde certinho pelo WhatsApp, já olhando o seu caso.",
  },
  {
    q: "Atende criança?",
    a: "Sim, a partir dos 6 anos, com um responsável junto na consulta.",
  },
  {
    q: "Quanto tempo dura a primeira consulta?",
    a: "Uns 40 minutos. Se precisar de radiografia, ela é feita na hora.",
  },
];

function Faq() {
  return (
    <div className="faq">
      <h2 id="faq-title">Perguntas que sempre chegam</h2>
      {FAQ.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
