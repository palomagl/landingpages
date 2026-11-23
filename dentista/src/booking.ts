import { clinic, periods, services, type PeriodId, type ServiceId } from "./config";

// Horários e pedidos de agendamento. Nesta demonstração os dados ficam só no navegador de quem
// testa; num cliente real, a mensagem vai para o WhatsApp e (se quiser) para uma agenda online.

// O que a pessoa já escolheu no cartão de consulta.
export interface Draft {
  service: ServiceId;
  period: PeriodId;
  name: string;
  date?: string;
  time?: string;
}

export interface Slot {
  date: string; // AAAA-MM-DD
  time: string; // HH:MM
  free: boolean;
}

export interface Request {
  id: string;
  name: string;
  service: ServiceId;
  period: PeriodId;
  date?: string;
  time?: string;
  message: string;
  createdAt: string;
  status: "novo" | "confirmado";
}

const WEEKDAY_TIMES = ["08:30", "09:30", "10:30", "11:30", "13:30", "14:30", "15:30", "16:30", "17:30"];
const SATURDAY_TIMES = ["08:00", "09:00", "10:00", "11:00"];

const pad = (n: number) => String(n).padStart(2, "0");
export const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Ocupação "realista" e estável: o mesmo dia mostra sempre os mesmos horários ocupados. */
function busy(date: string, time: string) {
  let h = 0;
  for (const c of date + time) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 100 < 46;
}

/** Agora, no relógio do consultório (não no de quem abre o site, que pode estar em outro fuso). */
export function clinicNow(from = new Date()): Date {
  try {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-US", {
        timeZone: clinic.timeZone,
        hourCycle: "h23",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
        .formatToParts(from)
        .map((p) => [p.type, p.value]),
    );
    return new Date(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
  } catch {
    return new Date(from);
  }
}

/** Próximos dias de atendimento (sem domingo), só com horários que ainda dá pra marcar. */
export function upcomingDays(count = 10, from = new Date()): { date: string; slots: Slot[] }[] {
  const out: { date: string; slots: Slot[] }[] = [];
  const now = clinicNow(from);
  const today = isoDate(now);
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const d = new Date(now);
  d.setHours(12, 0, 0, 0);
  while (out.length < count) {
    if (d.getDay() !== 0) {
      const date = isoDate(d);
      const times = (d.getDay() === 6 ? SATURDAY_TIMES : WEEKDAY_TIMES).filter((time) => {
        if (date !== today) return true;
        const [hh, mm] = time.split(":").map(Number);
        return hh * 60 + mm >= minutesNow + 60; // hoje, só com pelo menos 1 hora de antecedência
      });
      // Hoje sem nenhum horário pela frente: a agenda começa no próximo dia.
      if (times.length) out.push({ date, slots: times.map((time) => ({ date, time, free: !busy(date, time) })) });
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/** Primeiros horários livres que combinam com o período escolhido (usado na resposta da demonstração). */
export function suggestSlots(period: PeriodId, count = 2, from = new Date()): Slot[] {
  const fits = (s: Slot) => {
    const h = Number(s.time.slice(0, 2));
    const saturday = dayLabel(s.date).weekday === "sábado";
    if (period === "manha") return h < 12 && !saturday;
    if (period === "tarde") return h >= 12;
    if (period === "sabado") return saturday;
    return true;
  };
  return upcomingDays(14, from)
    .flatMap((d) => d.slots)
    .filter((s) => s.free && fits(s))
    .slice(0, count);
}

const WEEKDAYS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function dayLabel(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d, 12);
  return { weekday: WEEKDAYS[dt.getDay()], day: d, month: MONTHS[m - 1] };
}

export function longDay(date: string) {
  const l = dayLabel(date);
  return `${l.weekday}, ${l.day} de ${l.month}`;
}

/** "08:30" vira "8h30" e "11:00" vira "11h", como se escreve no Brasil. */
export function formatTime(time: string) {
  const [hh, mm] = time.split(":");
  return `${Number(hh)}h${mm === "00" ? "" : mm}`;
}

/** "24/11", como se escreve num cartão de consulta. */
export function shortDate(date: string) {
  const [, m, d] = date.split("-");
  return `${d}/${m}`;
}

/** "na quinta, 19 de nov, às 17h30" (ou "no sábado, ..."), para usar no meio de uma frase. */
export function whenLabel(date: string, time: string) {
  const l = dayLabel(date);
  const article = l.weekday === "sábado" || l.weekday === "domingo" ? "no" : "na";
  return `${article} ${longDay(date)}, às ${formatTime(time)}`;
}

/** A mensagem que chega no WhatsApp do consultório. */
export function buildMessage(opts: { name?: string; service: ServiceId; period: PeriodId; date?: string; time?: string }) {
  const s = services.find((x) => x.id === opts.service) ?? services[0];
  const p = periods.find((x) => x.id === opts.period) ?? periods[3];
  const first = cleanName(opts.name ?? "").split(" ")[0];
  const hello = `Oi, ${clinic.dentist}!${first ? ` Aqui é ${first}.` : ""}`;
  const chosen = opts.date && opts.time ? whenLabel(opts.date, opts.time) : "";
  if (s.id === "dor") {
    return chosen
      ? `${hello} Estou com dor e queria um encaixe ${chosen}. Pode ser?`
      : `${hello} Estou com dor e queria um encaixe, ${p.message}. Tem algum horário?`;
  }
  return chosen ? `${hello} Queria ${s.message} ${chosen}. Esse horário dá certo?` : `${hello} Queria ${s.message}, ${p.message}.`;
}

// Nome digitado: sem caracteres de controle, espaços repetidos ou tamanho exagerado.
export function cleanName(name: string) {
  return name.replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim().slice(0, 40);
}

export function whatsappLink(message: string) {
  return `https://wa.me/${clinic.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

// ---------------------------------------------------------------- pedidos (só neste navegador)

const KEY = "dentista-demo-pedidos";

// O que vem do localStorage pode ter sido mexido por qualquer um: só aceita pedidos no formato certo.
function isRequest(x: unknown): x is Request {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  const optional = (v: unknown, format: RegExp) => v === undefined || (typeof v === "string" && format.test(v));
  return (
    typeof r.id === "string" &&
    typeof r.name === "string" &&
    r.name.length <= 60 &&
    typeof r.message === "string" &&
    r.message.length <= 600 &&
    typeof r.createdAt === "string" &&
    !Number.isNaN(Date.parse(r.createdAt)) &&
    (r.status === "novo" || r.status === "confirmado") &&
    services.some((s) => s.id === r.service) &&
    periods.some((p) => p.id === r.period) &&
    optional(r.date, /^\d{4}-\d{2}-\d{2}$/) &&
    optional(r.time, /^\d{2}:\d{2}$/)
  );
}

export function loadRequests(): Request[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(data) ? data.filter(isRequest).slice(0, 30) : [];
  } catch {
    return [];
  }
}

export function saveRequest(r: Omit<Request, "id" | "createdAt" | "status">): Request {
  const full: Request = { ...r, id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, createdAt: new Date().toISOString(), status: "novo" };
  try {
    localStorage.setItem(KEY, JSON.stringify([full, ...loadRequests()].slice(0, 30)));
  } catch {
    /* navegador sem armazenamento: segue sem guardar */
  }
  return full;
}

export function updateRequest(id: string, patch: Partial<Request>) {
  try {
    const list = loadRequests().map((r) => (r.id === id ? { ...r, ...patch } : r));
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignora */
  }
}

export function clearRequests() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignora */
  }
}
