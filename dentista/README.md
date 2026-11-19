# Site para dentista: do site direto pro WhatsApp

Modelo de site para consultório odontológico. A pessoa escolhe o que precisa (avaliação, limpeza, dor…)
e o melhor período, ou um dia e horário livres, e o botão abre o WhatsApp do consultório com a mensagem
pronta. Feito para ser reaproveitado: quase tudo que muda de um cliente pro outro está em `src/config.ts`.

A versão deste repositório é a **demonstração** (Dra. Lívia Hartmann, dados fictícios, fotos de banco de imagem). Nela o
botão não abre o WhatsApp: mostra a resposta simulada no celular da tela e guarda o pedido no próprio
navegador, para a página `#clinica` mostrar como o consultório recebe os pedidos.

## Rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (confere os tipos antes)
```

Precisa de Node 20.19 ou mais novo. Depois do primeiro `npm install`, faça commit do `package-lock.json`
para as versões ficarem travadas.

Publicação na Vercel: importe o repositório e aponte o **Root Directory** para esta pasta. O `vercel.json`
já diz que é Vite, qual o comando de build e traz os cabeçalhos de segurança. Em outra hospedagem, publique
a pasta `dist/` gerada pelo build.

## Adaptar para um cliente

1. **`src/config.ts`**: nome, CRO, especialidade, WhatsApp (só números, com 55 e DDD), telefone,
   endereço, horários, serviços e as frases que vão na mensagem. Troque `DEMO` para `false`.
2. **Mapa**: no Google Maps, *Compartilhar > Incorporar um mapa*, copie só o endereço do `src` e cole em
   `mapEmbedUrl`. Vazio, o site mostra o mapa ilustrado.
3. **Fotos**: ponha as fotos originais do cliente numa pasta com os nomes `retrato`, `consultorio`,
   `conversa`, `exame`, `prevencao` e `atendimento` (qualquer extensão) e rode
   `python3 tools/preparar-fotos.py pasta-das-fotos`. O script recorta na proporção certa e gera WebP em
   800 e 1600 px em `public/fotos/`. Ajuste os textos alternativos em `photos` no `config.ts`.
4. **Textos**: os blocos "Medo de dentista", "Sobre" e as perguntas frequentes estão em `src/Home.tsx`.
5. **`index.html`**: título, descrição e `og:` com o nome e a cidade do cliente.

## Regras de publicidade do CFO (checklist)

Baseado no Código de Ética Odontológica (Resolução CFO-118/2012) e nas resoluções posteriores. Confira
com o cliente, que é quem responde perante o CRO.

- Nome do profissional e número de inscrição no CRO em toda peça; em clínica, também o responsável técnico.
- Sem preços, "grátis", formas de pagamento, parcelamento ou promoções no site. Convênio e pagamento:
  "pergunte no WhatsApp" (o FAQ já faz isso).
- Sem fotos de antes e depois e sem promessa ou garantia de resultado.
- Fotos de pacientes só com autorização por escrito. As fotos desta demonstração são do Pexels (licença
  livre, com modelos); num cliente de verdade, use fotos do próprio consultório e da equipe.
- Título de especialista só se a especialidade estiver registrada no CRO.

## Segurança

- **Política de segurança de conteúdo (CSP)**: o site só carrega scripts, estilos, fontes e fotos dele
  mesmo. Vai no cabeçalho pelo `vercel.json` e também numa meta tag que o build coloca no `index.html`
  (fica de fora no `npm run dev`, porque o Vite usa estilos inline enquanto você desenvolve). A única
  exceção é o Google Maps incorporado, quando `mapEmbedUrl` estiver preenchido.
- **Cabeçalhos**: HSTS, `nosniff`, bloqueio de iframe de terceiros (`frame-ancestors` e `X-Frame-Options`),
  `Referrer-Policy`, `Permissions-Policy` sem câmera, microfone e localização, e `Cross-Origin-Opener-Policy`.
- **WhatsApp**: o botão é um link comum com `rel="noopener noreferrer"`; a aba do WhatsApp não tem acesso
  a esta página. O número passa por um filtro que deixa só dígitos e a mensagem vai codificada na URL.
- **Nome digitado**: limitado a 40 caracteres, sem caracteres de controle. Nada é enviado para servidor.
- **Demonstração**: os pedidos de teste ficam no `localStorage` e são validados ao ler, então dado
  adulterado é descartado em vez de quebrar a página. A visão do consultório (`#clinica`) só existe com
  `DEMO = true`.
- **Mapa do Google**, quando usado, roda num iframe com `sandbox`.

## Responsividade

Testado de 320 px a 1920 px de largura, sem rolagem lateral: menu some abaixo de 980 px, celular da
conversa vai pra baixo das escolhas, áreas de toque com pelo menos 44 px, mapa com largura mínima e
arrastável no celular (abre centralizado no consultório), e a rolagem suave respeita quem pediu menos
movimento no sistema.

## Estrutura

```
src/config.ts      dados do consultório, serviços, períodos e fotos
src/booking.ts     horários, mensagem do WhatsApp e pedidos da demonstração
src/Home.tsx       o site
src/Clinic.tsx     visão do consultório (#clinica), só faz sentido na demonstração
src/Phone.tsx      o celular que monta a mensagem ao vivo
src/MapCard.tsx    mapa (Google Maps incorporado ou ilustrado)
src/SendButton.tsx botão do WhatsApp (link de verdade fora da demonstração)
src/styles.css     visual inteiro, sem framework
tools/preparar-fotos.py
```

Fotos da demonstração: Pexels, licença Pexels, uso livre. Qual é qual: retrato = 3952135,
consultorio = 3952130, conversa = 3952127, exame = 3952125, prevencao = 3952128, atendimento = 3952131
(endereço: pexels.com/photo/NÚMERO).
As que estão em `public/fotos` vieram da versão de 800 px; para um portfólio mais nítido, baixe os
originais pelo botão "Baixar" e rode o `preparar-fotos.py` de novo.

Nada do que a pessoa digita vai para servidor: o nome só entra na mensagem do WhatsApp. Fontes Lora e
Inter (licença OFL, em `public/fonts`).
