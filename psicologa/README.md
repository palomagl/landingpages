# Clara Avelar · Psicologia — demonstração ÚNICA

Identidade conceitual fictícia. Não representa uma profissional nem oferece atendimento. Não há CRP, credenciais, endereço, agenda ou número de contato inventados. Toda a implementação está nesta pasta; os demais projetos foram preservados.

## Executar

Sem build, sem dependências em produção. Na raiz do repositório:

```sh
python3 -m http.server 4173
```

Abra `http://localhost:4173/psicologa/`. Também funciona em hospedagem estática com caminhos relativos.

## Arquivos

- `index.html`: conteúdo semântico, descrição, Open Graph, navegação, FAQ e diálogo.
- `styles.css`: estilos mobile-first, fontes locais, estados de foco, movimento reduzido.
- `script.js`: configuração, contato, diálogo e revelações com IntersectionObserver.
- `config.js`: dados editáveis e bloqueio de contato demonstrativo.
- `assets/`: arte original em três tamanhos WebP, favicon e fontes com licenças OFL.
- `DIRECAO.md`: conceitos explorados, escolha e referências.
- `review/`: capturas reais e relatório das verificações.

## Personalizar

Edite `config.js`: `nomeCompleto`, `tituloProfissional`, `crp`, `cidade`, `modalidades`, `abordagem`, `contatoWhatsapp`, `endereco`, `fotografia`. Dados vazios não são apresentados como credenciais. A fotografia opcional deve estar em `assets/` e ser autorizada. Sem retrato, permanece a composição abstrata original. Modalidades em configuração alteram os dois títulos; adapte as descrições e os temas diretamente no HTML à atuação real.

O contato só vira link de WhatsApp quando **ambos** forem definidos: `demonstracao: false` e `contatoWhatsapp` com 10–15 dígitos (DDI, DDD e número autorizado). O texto inicial é configurável em `mensagemWhatsapp`. Enquanto isso, todos os CTAs mostram um diálogo e não enviam mensagens. Não há formulário, analytics, cookies ou armazenamento de dados.

`demonstracao: false` libera apenas o contato: **não remove os avisos fictícios**. Para uma profissional real, substituir integralmente identidade, textos demonstrativos, FAQ, avisos, título e metadados. Revisar identificação profissional e publicidade segundo as regras vigentes do CFP/CRP. Não acrescentar credenciais não verificadas.

## Publicar

Hospedar esta pasta em qualquer serviço estático, preservando `assets/` e os caminhos relativos. Se o GitHub Pages já estiver configurado para a raiz, a rota será `/landingpages/psicologa/`. Não alteramos configuração de hospedagem fora desta pasta. Um push no repositório não garante que Pages esteja habilitado.

A demonstração usa `noindex, nofollow` intencionalmente. Para lançamento real autorizado, trocar essa diretiva, adicionar canonical e `og:url` com o domínio real, `og:image` com URL absoluta e revisar título/descrição. Não incluímos schema de profissional porque não há profissional real. Não publicar esta demo como site oficial.

## Validação executada

Chromium headless via Playwright em 16/11/2026. Viewports: **320, 360, 375, 390, 414, 430, 768 e 1440 px**. Sem overflow horizontal, elementos com largura fora da tela, imagens quebradas ou erros JS nas oito larguras. FAQ e abertura/fechamento de diálogo com Escape passaram em todas. Verificados também skip link, foco inicial no diálogo, retorno de foco ao CTA, `prefers-reduced-motion` e geração local do link configurável, sem enviar mensagens.

Capturas de página inteira: [320 px](review/320.webp), [390 px](review/390.webp), [1440 px](review/1440.webp). Inspeção visual feita em 390 e 1440 px. Resultados de layout: [JSON](review/results.json).

Não foram executados Lighthouse, auditoria automatizada WCAG, Safari/iOS ou testes em hardware modesto real. Não há métricas de LCP/CLS alegadas. A revisão técnica independente prevista no briefing continua pendente, assim como aprovação visual do estúdio e eventual validação em aparelho físico.

## Recursos e licenças

Arte e símbolo criados originalmente para este projeto, sem fotografias de terceiros. Instrument Serif e DM Sans distribuídas sob SIL Open Font License; cópias em `assets/*-OFL.txt`. Fontes hospedadas localmente, com fallback e `font-display: swap`. Nenhuma chamada externa é necessária para renderizar a página.
