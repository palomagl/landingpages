# Andréia Brizola da Silva — landing page demonstrativa

**Prévia visual não oficial** desenvolvida para apresentar a proposta de um site de psicologia. Não representa um site aprovado ou publicado oficialmente pela profissional.

## Informações de referência
- Andréia Brizola da Silva · Psicóloga · CRP 07/42730
- Atendimento individual presencial para adolescentes e adultos
- Sapiranga/RS
- Abordagem psicanalítica
- Instagram: https://www.instagram.com/andreiasilva.psi/

Confirme os dados e obtenha autorização antes da publicação comercial.

## Como visualizar o projeto atual

A implementação **atual** está no arquivo **`index.html`**, que é autônomo: contém HTML, CSS, JavaScript e os dois retratos enviados para a prévia. Para visualizar localmente, abra `index.html` ou use um servidor estático. Os arquivos `styles.css`, `script.js` e `config.js` são de uma versão anterior **e não são carregados por este index.html**.

Para publicar via Vercel, crie um projeto ligado ao repositório `palomagl/landingpages` com **Root Directory = `psicologa`**, Framework Preset = Other e Output Directory em branco. Um commit no GitHub, sozinho, não garante que o endereço atual esteja implantando esta pasta; confira as configurações da Vercel.

## Fotografias
- O hero contém o retrato real enviado para a prévia, com resolução útil próxima de **470×319 px**.
- A seção “Sobre” utiliza a foto real em preto e branco enviada, de **136×135 px**.
- Não existe upscaling capaz de recuperar detalhes reais de origem; a edição atual prioriza não ampliar excessivamente, não transformar o rosto, não aplicar blur artístico nem reconstruir a aparência.
- Para alcançar nitidez profissional em telas de alta densidade, **substituir essas duas imagens por fotografias originais de alta resolução autorizadas pela Andréia**.

## Interações e qualidade
A página atual usa IntersectionObserver e CSS para revelar textos e desenhar linhas, com fallback para `prefers-reduced-motion`. Um problema de inicialização foi corrigido: o script passou do `head` para o final do `body`, garantindo que os elementos existam antes de registrar eventos.

A revisão refinou retratos, removendo zoom infinito, e trocou ornamentos botânicos genéricos por formas editoriais.

**Validação pendente:** captura visual real e teste funcional no domínio de produção após o deploy da pasta correta. Não considerar testes anteriores do tema fictício Clara Avelar como validação desta versão.

## Avisos
A prévia permanece com `noindex,nofollow` e identificação de projeto não oficial. Revisar dados, direitos de imagem, orientações CFP/CRP e contato antes de ativar como site público oficial.
