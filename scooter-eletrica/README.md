# Scooter Elétrica — Loja de elétricos

Landing page conceitual **não oficial** para uma loja de scooters, bikes, triciclo e patinetes elétricos. Todo o caminho de compra leva o cliente ao WhatsApp do vendedor, com a mensagem já escrita.

## Estrutura
- `index.html` — topo com vídeo, atalhos, "Para que você vai usar?", catálogo com filtros, destaque da V8, como comprar, dúvidas e chamada final.
- `style.css` — identidade de sinalização de trânsito (preto asfalto, amarelo de placa, Barlow Condensed), responsiva de 320 px a desktop, com reforços para navegadores antigos.
- `main.js` — filtros, painel do produto (sobe de baixo no celular), galerias com arrastar, vídeo que só carrega em conexão boa e pausa fora da tela. Os dados dos produtos ficam no início do arquivo.
- `img/` — fotos dos produtos em fundo branco, em 400, 640 e 1200 px (o navegador escolhe o tamanho certo).
- `media/` — vídeo do topo (paisagem e retrato) e imagens de capa leves.
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest` — ícones da aba e da tela inicial do celular.
- `og-image.jpg` — prévia de 1200×630 que aparece ao enviar o link no WhatsApp e nas redes.
- `fonts/` — Barlow e Barlow Condensed hospedadas no próprio site (só os caracteres do português), com as licenças OFL.
- `vercel.json` — cabeçalhos de segurança e cache (vale quando a pasta é a raiz do projeto na Vercel).

## Antes de apresentar como site real
- **WhatsApp e contatos:** o número `5500900000000`, o telefone, o endereço e o horário são provisórios. Troque em `index.html` e em `main.js` (busque por `5500900000000`).
- **Preços:** cada produto aceita preço e parcelamento; enquanto não houver, aparece "Preço no WhatsApp".
- **Sem CNH e sem placa:** confirmado apenas para a V8. Os demais modelos dependem da Resolução CONTRAN nº 996/2023; o texto do site pede que o vendedor confirme.
- **Especificações:** só aparecem dados informados pela loja ou visíveis nas fotos. O restante fica para a ficha técnica pelo WhatsApp.

## Imagens e vídeo
- Fotos dos produtos: fornecidas para a demonstração e versões maiores dos mesmos anúncios (Mercado Livre e Amazon). Para lançamento, use as fotos originais da loja ou do fabricante.
- Vídeo do topo: "Men and Woman Standing Beside Parked Motorcycles", de Anastasia Shuraeva, Pexels (licença gratuita).

## Desempenho e segurança
- Nenhum recurso de terceiros: script, estilos, fontes, fotos e vídeo saem do próprio site. O visitante não tem o IP enviado ao Google e a página abre mesmo se outro serviço cair.
- Em 3G lento (simulação, celular com CPU 4× mais lenta): primeira tela em cerca de 2,5 s; o vídeo não é carregado nessa conexão.
- Rolagem a 60 quadros por segundo no mesmo celular simulado, sem deslocamento de layout.
- Política de segurança de conteúdo (CSP) no `index.html` e no `vercel.json`: só roda o script do próprio site, sem estilos ou scripts embutidos.
- Cabeçalhos na Vercel: HTTPS obrigatório (HSTS), proteção contra a página ser embutida em outro site, `nosniff`, política de referência e bloqueio de câmera, microfone e localização.
- Links externos com `noopener noreferrer`. Não há formulários, cookies, rastreadores nem bibliotecas de terceiros.

## Prévia no WhatsApp
A tag `og:image` aponta para `og-image.jpg` no branch `main` deste repositório (`raw.githubusercontent.com`). A prévia aparece depois que esta pasta estiver no `main`. Se o site for publicado em domínio próprio, troque a URL pela do domínio.

## Executar
Abra `index.html` no navegador ou utilize Live Server. Não precisa instalar dependências.

Este é um projeto de apresentação/portfólio; antes de divulgar como página oficial, confirme textos, preços, uso de marcas de produtos e direitos sobre as imagens.
