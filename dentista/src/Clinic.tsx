import { useEffect, useState } from "react";
import { clinic, services } from "./config";
import { clearRequests, dayLabel, formatTime, loadRequests, updateRequest, upcomingDays, whenLabel, type Request } from "./booking";

// Visão do consultório (só na demonstração): como os pedidos feitos no site chegam e viram agenda.

const INITIALS = ["M.S.", "R.K.", "A.P.", "J.B.", "C.M.", "L.F.", "T.W.", "E.R.", "G.H.", "P.D."];
const initialsFor = (key: string) => {
  let h = 0;
  for (const c of key) h = (h * 17 + c.charCodeAt(0)) >>> 0;
  return INITIALS[h % INITIALS.length];
};

const ago = (iso: string) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `há ${m} min`;
  const h = Math.round(m / 60);
  return h < 24 ? `há ${h} h` : `há ${Math.round(h / 24)} dias`;
};

export function Clinic() {
  const [requests, setRequests] = useState<Request[]>(loadRequests());
  const days = upcomingDays(6);

  useEffect(() => {
    const title = document.title;
    document.title = `Visão do consultório | ${clinic.dentist}`;
    return () => {
      document.title = title;
    };
  }, []);

  useEffect(() => {
    const on = () => setRequests(loadRequests());
    window.addEventListener("storage", on);
    return () => window.removeEventListener("storage", on);
  }, []);

  const confirm = (r: Request) => {
    updateRequest(r.id, { status: "confirmado" });
    setRequests(loadRequests());
  };

  const confirmation = (r: Request) =>
    `Confirmado, ${r.name.split(" ")[0]}! Te espero ${r.date && r.time ? whenLabel(r.date, r.time) : "no horário que combinamos"}, na ${clinic.address}. Se precisar remarcar, é só responder aqui.`;

  return (
    <div className="clinic">
      <header className="top">
        <a className="mark" href="#" aria-label="Voltar ao site">
          <span className="mark-name">{clinic.dentist}</span>
          <span className="mark-sub">visão do consultório</span>
        </a>
        <a className="btn quiet small" href="#">Voltar ao site</a>
      </header>
      <main className="clinic-main">
        <h1>Como os pedidos chegam</h1>
        <p className="lead">
          Cada pedido feito no site chega como mensagem no WhatsApp do consultório e aparece aqui, já organizado.
          Nesta demonstração, os pedidos ficam só no seu navegador.
        </p>

        <div className="clinic-grid">
          <section aria-labelledby="req-title">
            <div className="row">
              <h2 id="req-title">Pedidos pelo site</h2>
              {requests.length > 0 && (
                <button type="button" className="btn quiet small" onClick={() => { clearRequests(); setRequests([]); }}>Limpar testes</button>
              )}
            </div>
            {requests.length === 0 ? (
              <p className="empty">Nenhum pedido ainda. <a href="#">Volte ao site</a> e peça um horário: ele aparece aqui.</p>
            ) : (
              <ul className="requests">
                {requests.map((r) => {
                  const s = services.find((x) => x.id === r.service);
                  return (
                    <li key={r.id} className={r.status}>
                      <div className="row">
                        <strong>{r.name}</strong>
                        <span className="small muted">{ago(r.createdAt)}</span>
                      </div>
                      <p className="small">
                        {s?.name}. {r.date && r.time ? `Pediu ${whenLabel(r.date, r.time)}.` : "Sem horário escolhido."}
                      </p>
                      <p className="bubble out">{r.message}</p>
                      {r.status === "novo" ? (
                        <button type="button" className="btn zap small" onClick={() => confirm(r)}>Confirmar pelo WhatsApp</button>
                      ) : (
                        <p className="bubble in">{confirmation(r)}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section aria-labelledby="week-title">
            <h2 id="week-title">Próximos dias</h2>
            <div className="week">
              {days.map((d) => {
                const l = dayLabel(d.date);
                return (
                  <div key={d.date} className="week-day">
                    <h3>{l.weekday.slice(0, 3)} {l.day}</h3>
                    {d.slots.map((s) => {
                      const req = requests.find((r) => r.date === s.date && r.time === s.time);
                      return (
                        <div key={s.time} className={`cell ${req ? `site ${req.status}` : s.free ? "free" : "busy"}`}>
                          <span>{formatTime(s.time)}</span>
                          <span>{req ? `${req.name.split(" ")[0]}, pelo site` : s.free ? "livre" : initialsFor(s.date + s.time)}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <p className="small muted">Pacientes aparecem só com as iniciais: menos dado pessoal exposto na tela da recepção.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
