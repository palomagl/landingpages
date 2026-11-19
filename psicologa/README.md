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
