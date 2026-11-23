// Tudo o que muda de um consultório para outro fica aqui. Para usar este site com um cliente de
// verdade, troque estes dados e ponha DEMO = false: o botão passa a abrir o WhatsApp do consultório.

export const DEMO = true;

export const clinic = {
  dentist: "Dra. Lívia Hartmann",
  firstName: "Lívia",
  // Exigências do Código de Ética Odontológica para anúncios: nome, número no CRO e, em clínica,
  // o responsável técnico. Aqui os dados são fictícios.
  cro: "CRO-RS 00000",
  specialty: "Clínica geral e endodontia (tratamento de canal)",
  whatsapp: "5551900000000",
  whatsappDisplay: "(51) 90000-0000",
  phone: "(51) 3500-0000",
  instagram: "@dra.liviahartmann",
  address: "Rua dos Ipês, 214, sala 3",
  district: "Centro, Novo Hamburgo/RS",
  mapsQuery: "Centro, Novo Hamburgo, RS",
  // Cliente de verdade: cole aqui o link de incorporação do Google Maps (Compartilhar > Incorporar um
  // mapa > só o endereço do src). Vazio = mostra o mapa ilustrado, que é o que a demonstração usa.
  mapEmbedUrl: "",
  // Fuso do consultório: a agenda usa o horário daqui mesmo para quem abre o site de outro lugar.
  timeZone: "America/Sao_Paulo",
  howToGetThere: "A 6 minutos a pé da Estação Centro do trem. Estacionamento conveniado em frente.",
  hours: [
    { days: "Segunda a sexta", time: "8h30 às 18h30" },
    { days: "Sábado", time: "8h às 12h" },
  ],
};

export const services = [
  {
    id: "avaliacao",
    short: "Avaliação",
    name: "Avaliação e plano de tratamento",
    text: "A gente conversa, examina com calma e você sai sabendo o que precisa ser feito, em que ordem e por quê. Nada começa sem você entender o plano.",
    message: "marcar uma avaliação",
    minutes: 40,
  },
  {
    id: "limpeza",
    short: "Limpeza",
    name: "Limpeza e prevenção",
    text: "Remoção de tártaro, polimento e orientação de escovação para o seu caso. É a consulta que evita as outras.",
    message: "marcar uma limpeza",
    minutes: 40,
  },
  {
    id: "dor",
    short: "Estou com dor",
    name: "Dor e urgência",
    text: "Dente doendo, quebrado ou inchaço. Todo dia ficam horários reservados para encaixe de quem chega com dor.",
    message: "um encaixe, porque estou com dor",
    minutes: 30,
  },
  {
    id: "restauracao",
    short: "Restauração",
    name: "Restaurações",
    text: "Tratamento de cárie e troca de restaurações antigas, com material da cor do dente.",
    message: "ver uma restauração",
    minutes: 60,
  },
  {
    id: "canal",
    short: "Canal",
    name: "Tratamento de canal",
    text: "Feito pela própria Dra. Lívia, que é especialista em endodontia. Anestesia sem pressa e pausas sempre que você precisar.",
    message: "conversar sobre um tratamento de canal",
    minutes: 60,
  },
  {
    id: "clareamento",
    short: "Clareamento",
    name: "Clareamento",
    text: "Só depois da avaliação: nem todo dente pode ser clareado, e a gente explica o porquê antes de qualquer coisa.",
    message: "saber sobre clareamento",
    minutes: 40,
  },
] as const;

export type ServiceId = (typeof services)[number]["id"];

export const periods = [
  { id: "manha", label: "De manhã", message: "de preferência de manhã" },
  { id: "tarde", label: "À tarde", message: "de preferência à tarde" },
  { id: "sabado", label: "No sábado", message: "de preferência no sábado" },
  { id: "qualquer", label: "Tanto faz", message: "no primeiro horário que tiver" },
] as const;

export type PeriodId = (typeof periods)[number]["id"];

// Fotos: ficam em public/fotos, em dois tamanhos (800 e 1600 px de largura), geradas pelo
// tools/preparar-fotos.py. w e h são a proporção da foto original, para a página não "pular" ao carregar.
export const photos = {
  retrato: { alt: "Dra. Lívia Hartmann ajustando a luz da cadeira no consultório", w: 4, h: 5 },
  consultorio: { alt: "O consultório: a Dra. Lívia e a auxiliar atendendo uma paciente", w: 3, h: 2 },
  conversa: { alt: "A Dra. Lívia mostrando no tablet o que vai ser feito", w: 4, h: 5 },
  exame: { alt: "A Dra. Lívia e a auxiliar explicando o plano de tratamento para a paciente", w: 4, h: 3 },
  prevencao: { alt: "A Dra. Lívia atendendo uma paciente, com a auxiliar ao lado", w: 4, h: 3 },
  atendimento: { alt: "A Dra. Lívia na mesa do consultório", w: 1, h: 1 },
} as const;

export type PhotoId = keyof typeof photos;
