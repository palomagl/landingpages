# Cafeteria — AROMA, catálogo de máquinas de café

Catálogo digital **conceitual** para uma marca fictícia de máquinas de café de alto padrão (AROMA). É um site-catálogo, não um e-commerce: o cliente escolhe produtos, variações e quantidades, e o pedido de orçamento vai organizado para o WhatsApp da loja. Não há checkout nem pagamento.

O layout reproduz o mockup aprovado em `design/00_REFERENCIA_COMPLETA.png`, usando as nove fotos do kit em `design/kit/`.

Diferente dos outros exemplos deste repositório, este é um app **React + TypeScript + Vite + Tailwind CSS**: precisa de `npm install` para rodar.

## Executar
```bash
npm install
npm run dev        # abre em http://localhost:5173
npm run build      # gera a versão final em dist/
npm run check      # checagem de tipos + build
```
Na Vercel, aponte o **Root Directory** para `cafeteria/`. O `vercel.json` já informa o build (`npm run build`, saída `dist/`) e aplica os cabeçalhos de segurança e cache.

## Estrutura
- `src/config/catalog.config.ts` — **arquivo central**: marca, WhatsApp, recursos opcionais, menu, textos, slides do topo, diferenciais, banner, atributos, categorias e produtos.
- `src/config/themes.ts` — paleta (marrom, bege, areia, creme e grafite, medidos no mockup).
- `src/config/schema.ts` — tipos do catálogo, independentes de segmento.
- `src/sections/Home.tsx` — página inicial: topo com slides, diferenciais, "Nossos modelos", "Explore por categoria" e banner.
- `src/pages/` — coleção (categorias, busca, filtros, ordenação), página do produto, política de privacidade e página não encontrada.
- `src/components/` — cabeçalho, rodapé, cards, filtros, gaveta de orçamento, busca e avisos.
- `src/core/` — rotas por `#hash`, filtros, busca sem acento, orçamento salvo no navegador, mensagem do WhatsApp e animações (`motion.tsx`).
- `src/assets/fonts/` — Inter e Montserrat hospedadas no próprio site (só os caracteres do português), com as licenças OFL.
- `public/images/` — fotos tratadas em vários tamanhos (o navegador escolhe o tamanho certo).
- `public/og-image.jpg`, ícones e `site.webmanifest` — prévia ao compartilhar o link e ícones da tela inicial do celular.
- `tools/build_images.py` — gera todas as imagens a partir do kit (veja "Imagens").
- `examples/moveis.config.ts` — o mesmo catálogo configurado como loja de móveis.
- `design/review/` — capturas de tela em 1440, 390 e 360 px.

## O que o site faz
- **Topo:** três slides com troca automática (pausa quando o mouse está em cima ou a aba fica oculta), arrastar no celular, foto com aproximação lenta, luz que atravessa a parede e vapor saindo do espresso.
- **Coleção:** categorias e grupos (ex.: "Máquinas" reúne automáticas e semiautomáticas), busca sem acento, filtros por uso, recursos, tensão e faixa de preço, e ordenação.
- **Produto:** galeria, variações (cor, tensão, embalagem…) que mudam o preço, quantidade, ficha técnica, destaques e relacionados.
- **Orçamento:** itens, variações, quantidades, observações por item e gerais, dados do cliente e envio pelo WhatsApp com a mensagem pronta (ou cópia do texto).
- **Privacidade (LGPD):** aviso junto aos campos do orçamento e página `#privacidade` (link no rodapé) explicando quais dados são pedidos, onde ficam e como pedir exclusão, com botão para o visitante apagar o que ficou salvo no aparelho. O texto está em `copy.privacy`.
- **Acessibilidade:** navegação completa pelo teclado (o foco entra nos painéis, fica preso neles e volta ao botão de origem), link "Pular para o conteúdo", textos alternativos nas fotos e título da aba atualizado em cada página.
- **Movimento:** entradas suaves ao rolar, cards que inclinam com o cursor, títulos que sobem linha a linha, cabeçalho que se esconde ao descer e volta ao subir. Tudo é desligado quando o visitante pede "reduzir movimento" no sistema.

## Como apresentar para uma empresa
1. **Coloque o seu WhatsApp** em `contact.whatsapp` (DDI + DDD + número, só dígitos, ex.: `5511912345678`). Assim, na reunião, você monta um orçamento na frente do cliente e a mensagem chega no seu celular, mostrando o fluxo completo. Vazio, o WhatsApp abre e pede para escolher o contato.
2. **Mostre no celular primeiro:** a maioria dos clientes da empresa vai abrir o catálogo pelo link do WhatsApp ou do Instagram.
3. **Roteiro de 3 minutos:** página inicial → "Explorar a coleção" → filtro "Bebidas com leite" → produto → trocar cor e tensão (o preço muda) → "Adicionar ao orçamento" → abrir o orçamento → "Enviar pelo WhatsApp".
4. **Deixe claro o que é demonstração:** a marca AROMA, as fotos, os preços e as especificações são fictícios (o rodapé avisa). No projeto do cliente, tudo isso é trocado pelos dados dele.

### O que pedir à empresa para a versão dela
- Logo e cores da marca (ou o manual de marca).
- Fotos dos produtos em boa resolução (de preferência fundo neutro e ambientadas).
- Lista de produtos com nome, categoria, descrição curta, preço (ou "sob consulta"), variações e ficha técnica. Uma planilha basta.
- Número de WhatsApp do atendimento, endereço/horário e redes sociais.
- Domínio (ex.: `catalogo.empresa.com.br`) ou acesso para publicar.
- Aprovação do texto de privacidade (`copy.privacy`) pelo jurídico da empresa.

### Antes de publicar como site real
- **Marca e rodapé:** troque `brand`, `copy.footer.legal` (hoje avisa que a marca é fictícia) e os textos do topo e do banner.
- **Preços e especificações:** confirme cada um com o cliente. Para esconder todos os preços, use `features.prices: false`.
- **Privacidade:** o texto é um modelo. Ele diz que o site não usa cookies de rastreamento nem análise de visitas; se a empresa pedir Google Analytics, Meta Pixel ou similar, atualize a política e o `vercel.json`.
- **Prévia no WhatsApp:** a tag `og:image` em `index.html` aponta para `og-image.jpg` no branch `main` deste repositório. Em domínio próprio, troque pela URL do domínio.

## Imagens
As nove fotos do kit (`design/kit/`) têm 414 × 414 px e foram geradas para acompanhar o mockup. Para chegar à composição da referência, `tools/build_images.py`:
1. limpa os artefatos de compressão;
2. amplia com nitidez só na luminância;
3. monta os formatos do layout — topo panorâmico (desktop), 4:3 (tablet) e retrato (celular), cards, blocos de categoria e banner — estendendo a cena com reflexo e desfoque de fundo;
4. aplica o tratamento de cor quente (contraste fílmico, sombras e luzes aquecidas, brilho suave, vinheta) e grão fino.

```bash
pip install numpy opencv-python pillow
python3 tools/build_images.py
```
Para lançamento, troque os arquivos de `design/kit/` por fotos originais em alta resolução e rode o script de novo. Se a posição da xícara mudar, ajuste os pontos `steam` em `catalog.config.ts` (frações da imagem).

## Reutilizar em outros segmentos
Os componentes não conhecem "máquina de café". Para móveis, decoração, eletrodomésticos ou equipamentos, troque `catalog.config.ts` e as imagens. Os atributos viram ficha técnica e filtros automaticamente. O exemplo `examples/moveis.config.ts` mostra a troca; para usá-lo, mude o import em `src/main.tsx`.

## Desempenho e segurança
- Nenhum recurso de terceiros: scripts, estilos, fontes e fotos saem do próprio site.
- Fotos em WebP com `srcset`: o celular baixa a versão de 600–1200 px, o desktop a de 1280–2560 px; as que estão fora da tela carregam só quando o visitante chega nelas.
- Animações só com `transform` e `opacity`; efeitos de cursor apenas em mouse.
- `vercel.json`: política de segurança de conteúdo (só scripts, estilos e fontes do próprio site), HTTPS obrigatório (HSTS), proteção contra a página ser embutida em outro site, `nosniff`, política de referência e bloqueio de câmera, microfone e localização.
- Links externos com `noopener noreferrer`. Sem formulários enviados, cookies ou rastreadores; o orçamento fica salvo só no navegador do visitante.

## Painel administrativo (futuro)
Todo o conteúdo é JSON puro e chega aos componentes por `CatalogProvider` (`src/core/catalog.tsx`). Para um CMS ou API, carregue um `CatalogConfig` e passe ao provider; nenhum componente importa a configuração diretamente.

Este é um projeto de apresentação/portfólio; antes de divulgar como página oficial, confirme textos, preços, uso de marcas e direitos sobre as imagens.
