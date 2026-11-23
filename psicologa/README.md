# Andréia Brizola da Silva — landing page demonstrativa

Prévia não oficial de uma página para a psicóloga Andréia Brizola da Silva (CRP 07/42730), com atendimento presencial em Sapiranga/RS para adolescentes e adultos, abordagem psicanalítica. O texto e os dados profissionais devem ser conferidos e aprovados pela profissional antes de uso oficial.

## Versão atual

O arquivo **index.html** é autocontido: inclui HTML, CSS, JavaScript e quatro fontes de imagem WebP embutidas. A foto do hero no notebook é uma composição gráfica derivada da referência editorial aprovada; no celular, a arte é específica para a proporção vertical. A seção “Sobre” usa uma composição editorial em preto e branco com bordas integradas ao fundo.

**Atenção:** as imagens editoriais apresentadas foram geradas ou trabalhadas a partir de referências visuais. Não garantir identidade facial perfeita ou apresentar essas composições como fotografias originais não editadas. Para o site oficial, obter a aprovação da Andréia e, de preferência, fotografias originais licenciadas.

## Responsividade e testes

Última revisão: 19/11/2026. Testadas larguras de 320, 360, 390, 430, 600, 768, 870, 928, 1024, 1280 e 1440 px em Chromium.

- Sem rolagem horizontal, com imagens e âncoras carregando após navegação;
- Sem erros de JavaScript nos testes;
- Cabeçalho e links de navegação no notebook; botão de menu somente até 870 px;
- Menu mobile com X, fechamento por clique no X, Escape ou seleção de link; estado ARIA atualizado;
- Carregamento progressivo das imagens, animações com preferência por movimento reduzido;
- Botões direcionam ao WhatsApp informado para atendimento presencial.

## Publicação

Para Vercel, selecione o repositório `palomagl/landingpages` com **Root Directory: `psicologa`** e preset Other. A sincronização do domínio e o deploy da Vercel dependem das configurações externas; atualizar o GitHub não certifica o estado da URL publicada.

Os arquivos legados `styles.css`, `script.js` e `config.js` na pasta, se presentes, não são usados pela página atual, que é autocontida. Links externos e dados devem ser revisados antes da publicação final.

## Revisão editorial de 19/11/2026

Seção “Cuidado”: ilustração de sofá bege com bordas transparentes para integrar a imagem ao fundo, sem retângulo aparente; texto adicional de acolhimento e nota visível de que a composição é ilustrativa (não é fotografia comprovada do consultório). Seção “Sobre”: retrato editorial já aprovado com acabamento transparente nas bordas, sem recriar o rosto nesta revisão. Imagens em WebP otimizadas e incorporadas ao `index.html` (arquivo autocontido de aproximadamente 664 KB), além de revelação escalonada de elementos durante a rolagem, respeitando `prefers-reduced-motion`.

Testes de responsividade e funcionalidade: 320, 360, 390, 430, 600, 768, 870, 928, 1024, 1280 e 1440 px; menus móveis, links, carregamento de imagens e ausência de rolagem horizontal. A efetiva atualização no domínio da Vercel depende do deploy do repositório.

## Experiência em celular — revisão de 19/11/2026

A primeira dobra foi redesenhada para 320–600 px, com enquadramento específico da arte do hero (recorte da composição existente, sem regenerar rosto), foto mais baixa e título, texto e CTA alcançáveis logo na abertura. O menu móvel mantém o X e fecha por Esc, toque e seleção. A lista de cinco temas tem rolagem horizontal com cartões e indicação de deslize, com suporte a toque e teclado; há uma barra discreta de WhatsApp que só aparece após a abertura e desaparece na seção final e enquanto o menu está aberto. A barra respeita a área segura inferior do aparelho. Recursos visuais leves, sem biblioteca extra.

QA: 13 tamanhos de viewport em Chromium (320, 360, 375, 390, 414, 430, 600, 601, 768, 870, 871, 1024 e 1440 px); links âncora, carregamento das fotos, ausência de erros de JavaScript e rolagem horizontal, comportamento de navegação, barra de contato e posição do CTA aprovados. Isso não substitui um teste de Safari/iOS físico.


## Revisão de interação e atendimento — 23/11/2026

- Todos os botões de contato (menu desktop, menu móvel, abertura, encerramento e WhatsApp flutuante) apontam diretamente para o WhatsApp da profissional, sem etapa intermediária.
- Ícone vetorial reconhecível do WhatsApp em todos os CTAs e microinterações discretas para mouse, foco visível e toque; redução de movimentos respeitada.
- Os cinco temas aparecem simultaneamente na faixa verde, inclusive em telas de 320 px, sem rolagem horizontal.
- Nova seção editorial de localização: **Clínica Therapie, Rua Getúlio Vargas, 999, Centro, Sapiranga/RS, CEP 93800-048**, com link para Maps; dados da clínica verificados, porém **a vinculação da profissional ao local deve ser confirmada antes de publicar como site oficial**.
- Validação visual e de largura em Chromium com fontes externas indisponíveis no ambiente de teste: 320, 360, 390, 430, 768 e 1440 px; sem rolagem horizontal. Não equivale a teste físico no Safari/iOS.
