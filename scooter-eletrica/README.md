# Scooter Elétrica — vitrine comercial demonstrativa

Landing page responsiva para lojas de scooters, bicicletas elétricas, triciclos e patinetes, criada para mostrar produtos e iniciar conversas de venda.

**Natureza do projeto:** demonstração não oficial da ÚNICA — Estúdio Digital. As imagens, os modelos e as informações servem para mostrar a experiência, não para representar uma loja real.

## O que o visitante encontra

- Hero com vídeo cinematográfico original em tela cheia, capa adaptada ao celular e dois caminhos: explorar o catálogo ou receber indicação por tipo de uso.
- **Catálogo aberto** logo após o hero: os 8 modelos estão na página sem filtros, "Ver todos" ou interação prévia. Atalhos opcionais por categoria apenas rolam até o produto correspondente. A escolha por rotina continua opcional, depois da vitrine, mostrando recomendações logo abaixo das escolhas.
- Seção editorial com foto da V8 em ambiente urbano, destaque V8, conteúdo sobre mobilidade, processo de compra, FAQ e contato.
- Assistente comercial com duas escolhas (modelo e tipo de dúvida) que monta uma mensagem pronta e segue para a prévia demonstrativa ou WhatsApp real configurado.
- Versão mobile com duas colunas compactas para os produtos, seleção guiada mais baixa, resultados horizontais com arraste, menu, toque confortável e CTA persistente.
- Modo de demonstração do atendimento: ao tocar em um botão de WhatsApp, uma janela mostra a mensagem que o comprador enviaria; nenhum número fictício recebe contato.

## Arquivos

- `index.html` — conteúdo e estrutura semântica.
- `style.css` — estilos e componentes da versão inicial, mantidos para compatibilidade.
- `retail.css` — direção visual base, ajustes desktop/tablet/mobile, layout e preview de contato.
- `conversion.css` — linguagem visual mais forte: letreiro animado, catálogo completo, detalhes dos cards, storytelling urbano e assistente comercial.
- `main.js` — filtros, dados dos produtos, diálogo de detalhes e galerias.
- `contact.js` — comunicação WhatsApp configurável e prévia segura para demonstração.
- `motion.js` — revelação progressiva de cards e seções no scroll, respeitando a preferência por movimento reduzido.
- `sales.js` — constrói a mensagem de atendimento conforme o modelo e o motivo escolhido; não envia dados a servidores.
- `img/`, `fonts/`, `media/` — imagens responsivas, fontes e acervo.
- `vercel.json` — cabeçalhos de segurança/cache quando a pasta é o projeto raiz na Vercel.

Não há build, framework, CDN, rastreamento ou dependências externas.

## Personalizar para uma loja real

1. **Contato:** em `contact.js`, altere `WHATSAPP_DA_LOJA = ''` para o WhatsApp verdadeiro, somente dígitos (DDI 55 + DDD + número). O clique passará a abrir o número configurado com texto correspondente ao produto.
2. **Identidade:** atualize nome, logomarca, cores, localização, descrição, horários e favicon de acordo com a loja. Não apresente informações de demonstração como dados de uma empresa real.
3. **Estoque e valores:** ajuste preços, parcelamento, imagens, descrição e especificações em `main.js` e nos cards de `index.html`. Produtos sem valores publicados mostram “Valor sob consulta”.
4. **Imagens sociais:** gere uma nova arte `og-image.jpg` para o cliente antes de publicar; a imagem atual é herança do conceito anterior e não segue a nova direção visual.
5. **Homologação:** valide a versão final com a loja, especialmente disponibilidade, entrega, meios de pagamento, garantia e direitos sobre imagens.
6. **Regras de circulação:** a exigência de habilitação/emplacamento **não deve ser deduzida de “ser elétrica”, ter pedal, potência isolada ou nome comercial**. Verifique a classificação técnica de cada veículo perante a Resolução CONTRAN 996/2023 e normas vigentes, além das regras locais. Não use “sem CNH e sem placa” como promessa geral sem documentação que a sustente.

## Verificar antes de publicar

- No desktop: testar hero, cards, grid, menu, CTA e diálogo lateral.
- No celular, especialmente 320–390 px: conferir quebra de texto, filtros horizontais, toque, menu, modal inferior e CTA fixo.
- Vitrine: os 8 modelos aparecem sempre no scroll, sem filtros nem botões de expansão; os atalhos por tipo apenas navegam até cards visíveis.
- Seleção por rotina: os resultados aparecem apenas no bloco de ajuda, sem ocultar ou alterar os 8 cards do catálogo principal.
- Detalhes de cada modelo: imagens, texto, galeria e ações de contato.
- WhatsApp: na demonstração, abrir preview e copiar texto; em loja real, validar número final com mensagem certa.
- Performance: medir em aparelho real e Lighthouse. O vídeo original foi restaurado: desktop (~1,35 MB) e mobile (~712 KB), com posters WebP, início após carregamento, pausa fora da tela e fallback para conexão lenta, economia de dados ou movimento reduzido. Evitar alegações de desempenho sem medição da versão publicada.

## Executar

Abra `index.html` no navegador ou execute um servidor estático local (ex.: Live Server). Para publicar na Vercel, a raiz do projeto deve apontar para `scooter-eletrica/`.

A proposta é ser uma vitrine reutilizável para apresentar a lojas com uma experiência de compra concreta, sem inventar depoimentos, avaliações, preços ou dados de contato.
