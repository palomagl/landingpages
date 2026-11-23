import { AppointmentCard, type SendStatus } from "./AppointmentCard";
import { clinic, DEMO, gallery, promises, services, type ServiceId } from "./config";
import { doodles } from "./Doodles";
import { MapCard } from "./MapCard";
import { Photo } from "./Photo";
import { ChatIcon, WhatsAppButton } from "./WhatsAppButton";
import { buildMessage, dayLabel, formatTime, shortDate, suggestSlots, type Draft } from "./booking";

type Props = {
  draft: Draft;
  setDraft: (d: Draft) => void;
  status: SendStatus;
  reply?: string;
  onDemoSend: () => void;
  onDemoLink: (message: string) => void;
};

const calm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: calm() ? "auto" : "smooth", block: "start" });

// Mensagem dos botões gerais de WhatsApp (topo, barra do celular): pede uma avaliação, sem horário.
export const quickMessage = buildMessage({ service: "avaliacao", period: "qualquer", name: "" });

export function Home({ draft, setDraft, status, reply, onDemoSend, onDemoLink }: Props) {
  const message = buildMessage(draft);
  const pick = (service: ServiceId) => {
    setDraft({ ...draft, service });
    goTo("agendar");
  };
  // O próximo horário livre de verdade, para o cartãozinho do topo.
  const next = suggestSlots("qualquer", 1)[0];
  const reserveNext = () => {
    if (!next) return;
    setDraft({ ...draft, date: next.date, time: next.time });
    goTo("agendar");
  };

  return (
    <>
      <a className="skip" href="#conteudo">Ir para o conteúdo</a>
      <header className="top">
        <a className="mark" href="#" aria-label={`${clinic.dentist}, início`}>
          <span className="mark-badge" aria-hidden="true">LH</span>
          <span className="mark-text">
            <span className="mark-name">{clinic.dentist}</span>
            <span className="mark-sub">dentista em Novo Hamburgo</span>
          </span>
        </a>
        <nav className="top-nav" aria-label="Seções">
          <a href="#tratamentos">Tratamentos</a>
          <a href="#agendar">Horários</a>
          <a href="#onde">Onde fica</a>
        </nav>
        <WhatsAppButton label="Chamar no WhatsApp" message={quickMessage} onDemo={onDemoLink} className="top-chat">
          <ChatIcon />
          <span className="top-chat-text">WhatsApp</span>
        </WhatsAppButton>
      </header>

      <main id="conteudo" tabIndex={-1}>
        <section className="hero" id="topo" aria-labelledby="hero-title">
          <div className="hero-photo-wrap">
            <Photo id="retrato" className="hero-photo" sizes="(max-width: 860px) 100vw, 50vw" priority />
          </div>
          <div className="hero-panel">
            <h1 id="hero-title">Pode chegar com medo.</h1>
            <p className="hero-lead">
              Sou a Lívia, dentista no centro de Novo Hamburgo. Atendo uma pessoa por vez, com hora marcada, e explico
              cada passo antes de fazer.
            </p>
            <div className="hero-actions">
              <WhatsAppButton label="Marcar pelo WhatsApp" message={quickMessage} onDemo={onDemoLink} className="btn zap" />
              <a className="hero-link" href="#agendar">Ver horários livres</a>
            </div>
            <p className="hero-cro">
              {clinic.dentist}, {clinic.cro}
            </p>
          </div>
          {next && (
            <button type="button" className="next-card" onClick={reserveNext} aria-label={`Próximo horário livre: ${dayLabel(next.date).weekday}, ${shortDate(next.date)}, ${formatTime(next.time)}. Reservar.`}>
              <span className="next-card-brand">{clinic.dentist}</span>
              <span className="next-card-label">Próximo horário livre</span>
              <span className="hand">
                <span className="write-on">
                  {dayLabel(next.date).weekday}, {shortDate(next.date)}, {formatTime(next.time)}
                </span>
              </span>
              <span className="next-card-cta">Toque para reservar</span>
            </button>
          )}
        </section>

        <section className="promises" id="medo" aria-labelledby="promises-title">
          <div className="section-head">
            <h2 id="promises-title">O que eu combino com quem tem medo</h2>
            <p>Medo de dentista é mais comum do que parece. Esses combinados valem desde a primeira consulta.</p>
          </div>
          <ul className="promise-list swipe">
            {promises.map((p, i) => {
              const Doodle = doodles[i % doodles.length];
              return (
                <li key={p.title}>
                  <Doodle />
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </li>
              );
            })}
          </ul>
          <p className="swipe-hint">Arraste para o lado para ver todos.</p>
        </section>

        <section className="room" id="consultorio" aria-labelledby="room-title">
          <div className="section-head">
            <h2 id="room-title">O consultório</h2>
            <p>
              {clinic.address}, no {clinic.district.split(",")[0]}. Sala pequena, de propósito: é só você, eu e a
              auxiliar.
            </p>
          </div>
          <ul className="gallery swipe">
            {gallery.map((g) => (
              <li key={g.id}>
                <figure>
                  <Photo id={g.id} className="gallery-photo" sizes="(max-width: 860px) 82vw, 560px" />
                  <figcaption>{g.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>

        <section className="treatments" id="tratamentos" aria-labelledby="t-title">
          <div className="t-head">
            <h2 id="t-title">Tratamentos</h2>
            <p>{clinic.specialty}. Valores e convênios eu passo pelo WhatsApp, olhando o seu caso.</p>
          </div>
          <ul className="t-list">
            {services.map((s) => (
              <li key={s.id}>
                <details>
                  <summary>
                    <h3>{s.name}</h3>
                    <span className="t-time">consulta de cerca de {s.minutes} min</span>
                  </summary>
                  <div className="t-body">
                    <p>{s.text}</p>
                    <button type="button" className="t-pick" onClick={() => pick(s.id)}>
                      Marcar {s.short.toLowerCase() === "estou com dor" ? "um encaixe" : s.short.toLowerCase()}
                    </button>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </section>

        <AppointmentCard draft={draft} setDraft={setDraft} status={status} reply={reply} message={message} onDemoSend={onDemoSend} />

        <section className="about" id="sobre" aria-labelledby="about-title">
          <div className="about-photo-wrap">
            <Photo id="atendimento" className="about-photo" sizes="(max-width: 860px) 92vw, 440px" />
            <span className="about-photo-note hand">minha mesa, sala 3</span>
          </div>
          <div className="about-text">
            <h2 id="about-title">Prazer, Lívia.</h2>
            <p>
              Me formei há 8 anos e fiz especialização em endodontia, que é o tratamento de canal. Escolhi atender só
              com uma auxiliar pra conseguir conhecer cada paciente pelo nome.
            </p>
            <p>
              Uso radiografia digital e mostro tudo no tablet: você vê o mesmo que eu antes de decidir qualquer coisa.
              Nada começa sem você entender o plano.
            </p>
            <p className="signature hand" aria-hidden="true">
              Lívia
            </p>
            <p className="about-cro">
              {clinic.dentist}, {clinic.cro}. Responsável técnica pelo consultório.
            </p>
          </div>
        </section>

        <section className="where" id="onde" aria-labelledby="where-title">
          <div className="where-info">
            <h2 id="where-title">Onde fica</h2>
            <p className="addr">
              {clinic.address}
              <br />
              {clinic.district}
            </p>
            <p className="muted">{clinic.howToGetThere} Prédio com elevador.</p>
            <table className="hours">
              <caption className="sr-only">Horário de atendimento</caption>
              <tbody>
                {clinic.hours.map((h) => (
                  <tr key={h.days}>
                    <th scope="row">{h.days}</th>
                    <td>{h.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="muted small">
              Telefone fixo {clinic.phone}. WhatsApp {clinic.whatsappDisplay}.
            </p>
            <div className="go-buttons">
              <a className="btn ghost small" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.mapsQuery)}`} target="_blank" rel="noopener noreferrer">
                Abrir no Google Maps
              </a>
              <a className="btn ghost small" href={`https://waze.com/ul?q=${encodeURIComponent(clinic.wazeQuery)}&navigate=yes`} target="_blank" rel="noopener noreferrer">
                Abrir no Waze
              </a>
            </div>
          </div>
          <MapCard />
        </section>

        <section className="faq-section" id="perguntas" aria-labelledby="faq-title">
          <h2 id="faq-title">Perguntas que sempre chegam</h2>
          <div className="faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="foot" id="rodape">
        <div className="foot-main">
          <p className="foot-name">{clinic.dentist}</p>
          <p>
            {clinic.cro}. {clinic.specialty}.
          </p>
          <p>
            {clinic.address}, {clinic.district}. {clinic.phone}.
          </p>
        </div>
        <div className="foot-note">
          <p>
            O que você escolhe e digita aqui serve só para montar a mensagem do WhatsApp: nada é enviado para outro
            lugar.{DEMO && " Na demonstração, os pedidos de teste ficam guardados só neste navegador."}
          </p>
          {DEMO && (
            <p>
              Site de demonstração: profissional, CRO, endereço e telefones são fictícios. Fotos de banco de imagem
              (Pexels), com modelos. <a href="#clinica">Ver como o consultório recebe os pedidos</a>.
            </p>
          )}
        </div>
      </footer>
    </>
  );
}

const FAQ = [
  {
    q: "Estou com dor agora. O que faço?",
    a: "Me manda uma mensagem escrito \"dor\" no WhatsApp. Todo dia ficam horários reservados para encaixe, e eu te respondo com o primeiro disponível.",
  },
  {
    q: "Atende convênio? Quais as formas de pagamento?",
    a: "Isso depende do tratamento e muda com frequência, então eu respondo certinho pelo WhatsApp, já olhando o seu caso.",
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
