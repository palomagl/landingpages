# Briefing — Psicologia | ÚNICA

## Contexto comercial
Este site integra um catálogo de landing pages por nicho para apresentar a potenciais clientes da ÚNICA pelo WhatsApp. Tem que ser memorável no primeiro contato, não parecer um template e funcionar em celulares modestos.

## Público
Pessoas buscando conhecer uma psicóloga e entender modalidades de atendimento (online e presencial, quando aplicável). Comunicação sensível e respeitosa, sem pressão comercial, promessas clínicas ou gatilhos de medo.

## Resultado esperado
Landing page demonstrativa de 1 página, com experiência editorial original, CTA WhatsApp (configurável), seção sobre a profissional, atuação/modalidades, como funciona o primeiro contato, dúvidas frequentes e rodapé profissional. Não incluir fluxo de agendamento com banco de dados nesta versão.

## Direção visual para criação
Conceito-base: **escuta contemporânea / editorial intimista**. Sofisticado sem ser frio; humano sem visual infantil ou 'padrão psicóloga'. Explorar 3 conceitos de hero bem diferentes, com proposta de tipografia, foto/arte, paleta, interação e composição mobile. Escolher um e executar com identidade coerente do começo ao fim.

**Evitar:** fotos irreais de consultórios, rostos fictícios apresentados como profissionais verdadeiros, desenhos de cérebro, emojis, excesso de verde-sálvia/bege por padrão, gradientes genéricos, cards repetitivos, efeitos pesados e ícones decorativos em excesso.

## Conteúdo e integridade
- Por ser demo, sinalizar **Projeto demonstrativo — profissional e dados fictícios**.
- Usar campos editáveis para `nomeCompleto`, `tituloProfissional`, `crp`, `cidade`, `modalidades`, `abordagem`, `contatoWhatsapp`, `endereco`, `fotografia`.
- Nunca inventar número CRP, titulação, formação, especialização, endereços, depoimentos, quantidade de pacientes, resultados, disponibilidade ou preço.
- Não usar número de WhatsApp de outra pessoa. Enquanto não houver contato real, CTA de demonstração pode exibir modal/feedback 'Canal de contato demonstrativo — configure um número autorizado' em vez de abrir um número.
- Evitar coletar informações sobre saúde/sofrimento emocional em formulários e armazenar mensagens sensíveis.
- Em uso real, conferir o Código de Ética Profissional do Psicólogo (art. 20), normas e orientações do CFP/CRP: dados de identificação, títulos efetivos, publicidade sóbria, sem promessas de resultados ou preços como propaganda.

## Especificações de entrega
- Todos os arquivos em `/psicologa/`, com README, código, assets e configuração.
- Mobile-first: 320, 360, 375, 390, 414 e 430 px; tablets e desktop.
- HTML semântico, foco visível, navegação por teclado, contraste, textos legíveis, hierarquia de headings, `prefers-reduced-motion`.
- Usar imagens autorizadas e otimizadas com largura responsiva; fonte com fallback; lazy loading abaixo da dobra.
- Interações originais com CSS/JS leve, sem bibliotecas pesadas desnecessárias.
- Metas de referência: LCP até 2,5 s e CLS até 0,1 em condições de teste especificadas; verificar por Lighthouse, sem alegar medições que não foram feitas.
- Entregar capturas desktop/mobile para revisão, e só depois preparar a publicação.

## Política de edição
Codex cria o visual e implementa o design primeiro. Claude revisa arquitetura, performance, SEO, segurança e testes depois da aprovação visual, com commits separados. Não editar a landing da Cabana Rio Vale.
