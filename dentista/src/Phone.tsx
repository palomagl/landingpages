import { clinic } from "./config";

// Celular com a conversa que vai chegar no WhatsApp do consultório. A mensagem se monta ao vivo
// conforme a pessoa escolhe; é o elemento que mostra, na hora, que o site termina numa conversa.

export type PhoneState = "draft" | "sent" | "replied";

export function Phone({ message, state, reply }: { message: string; state: PhoneState; reply?: string }) {
  return (
    <figure className="phone" aria-label="Prévia da mensagem que vai para o WhatsApp do consultório">
      <div className="phone-top">
        <span className="avatar" aria-hidden>LH</span>
        <span>
          <strong>{clinic.dentist}</strong>
          <small>{state === "draft" ? "WhatsApp do consultório" : "online"}</small>
        </span>
      </div>
      <div className="chat">
        <p className="chat-day">hoje</p>
        <p className="bubble out" aria-live="polite">
          {message}
          <span className="meta">
            {state === "draft" ? <em className="caret" aria-hidden /> : <span className="ticks" aria-label="entregue">✓✓</span>}
          </span>
        </p>
        {state === "replied" && reply && <p className="bubble in">{reply}</p>}
      </div>
      <div className="composer" aria-hidden>
        <span>{state === "draft" ? "Mensagem pronta para enviar" : "Mensagem"}</span>
      </div>
    </figure>
  );
}
