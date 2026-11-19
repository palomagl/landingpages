# Rio Vale — Refúgio a Dois

Landing page conceitual **não oficial** baseada na Cabana Rio Vale, Nova Roma do Sul/RS.

## Estrutura
- `index.html` — composição editorial curta: abertura, cabana, experiência e reserva.
- `style.css` — direção visual com Instrument Serif e Manrope, responsividade, fotografia em destaque.
- `main.js` — efeitos de revelação e scroll, CTA móvel, proteção contra imagens indisponíveis.
- `favicon.svg` — símbolo vetorial da marca conceitual.
- `fonts/` — DM Sans e Instrument Serif hospedadas no próprio site (só os caracteres do português), com as licenças OFL.
- `vercel.json` — cabeçalhos de segurança e cache (vale quando a pasta é a raiz do projeto na Vercel).

## Fotografias
Cinco URLs de fotos diferentes extraídas do mesmo anúncio oficial da Cabana Rio Vale no Airbnb; nenhuma imagem de banco de imagens ou cabana fictícia.

**Atenção:** links de imagens externos do Airbnb podem não funcionar em todos os sites, mesmo quando as URLs existem. O código apresenta um link ao anúncio caso o carregamento falhe. Para lançamento real, obtenha as fotografias originais com autorização da proprietária, hospede os arquivos otimizados no projeto e substitua as URLs remotas.

Anúncio oficial: https://www.airbnb.com.br/rooms/1525661029363941402

## Reservas
Todos os botões abrem diretamente o anúncio oficial no Airbnb. Não há pagamentos, preços inventados ou disponibilidade falsa na landing page.

## Segurança e privacidade
- Política de segurança de conteúdo (CSP) no `index.html` e no `vercel.json`: só roda o script do próprio site, e imagens externas só do CDN do Airbnb (`a0.muscache.com`).
- Fontes servidas pelo próprio site: o visitante não tem o IP enviado ao Google e a página não depende de outro servidor para abrir.
- Fotos do Airbnb carregadas sem enviar o endereço da página (`referrerpolicy="no-referrer"`), o que também reduz bloqueios de hotlink.
- Cabeçalhos na Vercel: HTTPS obrigatório (HSTS), proteção contra a página ser embutida em outro site, `nosniff`, política de referência e bloqueio de câmera, microfone e localização.
- Links externos com `noopener noreferrer`. Não há formulários, cookies, rastreadores nem bibliotecas de terceiros.

## Executar
Abra `index.html` no navegador ou utilize Live Server. Não precisa instalar dependências.

## Publicação
O GitHub armazena o código: para visualizar as alterações em um site público, será preciso que um serviço de hospedagem faça o deploy da versão mais recente. Se houver cache, atualize a página depois do deploy.

Este é um projeto de apresentação/portfólio; antes de divulgar como página oficial, confirme textos, uso da marca e direitos sobre as imagens.
