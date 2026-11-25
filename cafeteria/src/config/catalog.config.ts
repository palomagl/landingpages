/**
 * ============================================================================
 *  CONFIGURAÇÃO CENTRAL DO CATÁLOGO — AROMA Coffee Machines
 * ============================================================================
 *  Para adaptar a outro cliente ou segmento, edite apenas este arquivo
 *  (e troque as imagens em /public/images):
 *
 *   brand       → nome, logotipo, fontes, moeda
 *   contact     → WhatsApp (número e mensagem padrão) e canais de contato
 *   features    → recursos opcionais (preços, busca, filtros, orçamento…)
 *   theme       → paleta (src/config/themes.ts)
 *   navigation  → menu principal
 *   home        → slides do hero, diferenciais, destaques, banner
 *   copy        → textos da coleção, do orçamento e do rodapé
 *   attributes  → o que se mede/compara (vira ficha técnica e filtros)
 *   categories  → categorias (com imagem) e grupos (ex.: "Máquinas")
 *   products    → produtos, variações e imagens
 *
 *  Veja `examples/moveis.config.ts` para o mesmo catálogo como loja de móveis.
 * ============================================================================
 */
import type { CatalogConfig, ImageAsset, ProductOption } from './schema';
import { themes } from './themes';

/** Foto quadrada do kit, tratada e exportada em 600, 1000 e 1400 px (tools/build_images.py). */
const img = (name: string, alt: string, position?: string): ImageAsset => ({
  src: `images/${name}-600.webp`,
  srcSet: `images/${name}-600.webp 600w, images/${name}-1000.webp 1000w, images/${name}-1400.webp 1400w`,
  alt,
  width: 1400,
  height: 1400,
  position,
});

/** Imagem panorâmica gerada em várias larguras (ex.: card-aroma-one-480/800/1000.webp). */
const wide = (name: string, widths: number[], alt: string, position?: string): ImageAsset => ({
  src: `images/${name}-${widths[0]}.webp`,
  srcSet: widths.map((w) => `images/${name}-${w}.webp ${w}w`).join(', '),
  alt,
  position,
});

/** Hero com direção de arte: panorâmica (desktop), 4:3 (tablet) e retrato (celular). */
const heroArt = (name: string, alt: string): ImageAsset => ({
  ...wide(name, [1280, 1920, 2560], alt),
  sources: [
    {
      media: '(max-width: 639px)',
      srcSet: `images/${name}-mobile-600.webp 600w, images/${name}-mobile-900.webp 900w, images/${name}-mobile-1200.webp 1200w`,
      sizes: '100vw',
    },
    { media: '(max-width: 1023px)', srcSet: `images/${name}-tablet-1024.webp 1024w, images/${name}-tablet-1536.webp 1536w`, sizes: '100vw' },
  ],
});

/** Bloco de categoria: panorâmico no desktop, quadrado no celular. */
const tile = (wideName: string, squareName: string, alt: string): ImageAsset => ({
  ...wide(wideName, [400, 700, 1000], alt),
  sources: [{ media: '(max-width: 767px)', srcSet: `images/${squareName}-600.webp 600w, images/${squareName}-1000.webp 1000w`, sizes: '50vw' }],
});

const IMG = {
  hero: img('hero-maquina-pedra', 'Máquina de café preta sobre bancada de pedra clara, com planta e xícara de espresso', '50% 60%'),
  one: img('produto-aroma-one', 'Aroma One, máquina automática preta, ao lado de um pote de grãos', '62% 58%'),
  pro: img('produto-aroma-pro', 'Aroma Pro, máquina semiautomática em inox com porta-filtro', '58% 52%'),
  office: img('produto-aroma-office', 'Aroma Office, máquina automática alta com reservatório de grãos', '60% 55%'),
  extracao: img('categoria-automaticas', 'Extração de espresso em xícara de vidro dupla', '50% 50%'),
  portaFiltro: img('categoria-semiautomaticas', 'Porta-filtro com café moído sobre a bancada', '50% 45%'),
  latte: img('categoria-acessorios', 'Latte em caneca de vidro de parede dupla', '50% 55%'),
  graos: img('categoria-insumos', 'Grãos de café torrados saindo de um saco de papel', '55% 50%'),
  espresso: img('banner-cafe-espresso', 'Xícara de vidro com espresso sobre pedra', '50% 50%'),
};

const CARD = {
  one: wide('card-aroma-one', [480, 800, 1200], 'Aroma One ao lado de um pote de grãos', '50% 55%'),
  pro: wide('card-aroma-pro', [480, 800, 1200], 'Aroma Pro em inox com planta ao fundo', '50% 55%'),
  office: wide('card-aroma-office', [480, 800, 1200], 'Aroma Office com reservatório de grãos', '50% 55%'),
  signature: wide('card-aroma-signature', [480, 800, 1200], 'Aroma Signature sobre bloco de pedra', '50% 55%'),
  xicara: wide('card-xicara-espresso', [480, 800, 1200], 'Xícara de vidro com espresso', '50% 50%'),
  portaFiltro: wide('cat-semiautomaticas', [400, 700, 1000], 'Porta-filtro com café moído', '62% 50%'),
  latte: wide('cat-acessorios', [400, 700, 1000], 'Caneca de vidro com latte', '58% 50%'),
  graos: wide('cat-insumos', [400, 700, 1000], 'Grãos de café saindo do saco', '62% 50%'),
};

const tensao = (values: ('127' | '220')[] = ['127', '220']): ProductOption => ({
  id: 'tensao',
  label: 'Tensão',
  display: 'choice',
  values: values.map((v) => ({ id: v, label: `${v} V` })),
});

const cor = (values: [string, string, string?][]): ProductOption => ({
  id: 'cor',
  label: 'Cor',
  display: 'swatch',
  values: values.map(([label, swatch, description]) => ({
    id: label.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-'),
    label,
    swatch,
    description,
  })),
});

const PRETO = 'linear-gradient(135deg,#4a4642 0%,#1d1b19 60%,#0e0d0c 100%)';
const INOX = 'linear-gradient(135deg,#f3f3f1 0%,#c3c6c6 45%,#8a8e90 100%)';
const BRONZE = 'linear-gradient(135deg,#c9a27c 0%,#8c6646 55%,#5a3f2b 100%)';

export const catalogConfig: CatalogConfig = {
  brand: {
    name: 'AROMA',
    wordmark: 'AROMA',
    wordmarkSub: 'Coffee Machines',
    tagline: 'Máquinas de café de alto padrão',
    description: 'Máquinas premium que combinam design, performance e o verdadeiro sabor do café. Peça seu orçamento pelo WhatsApp.',
    locale: 'pt-BR',
    currency: 'BRL',
    fonts: {
      // arquivos em public/fonts, declarados em src/index.css (sem serviços de terceiros)
      text: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      display: '"Inter Display", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      logo: '"Montserrat", "Inter", system-ui, sans-serif',
    },
  },

  contact: {
    whatsapp: '', // ex.: '5511912345678' — vazio abre o WhatsApp para escolher o contato
    whatsappDisplay: 'Falar no WhatsApp',
    whatsappGreeting: 'Olá! Vim pelo catálogo da AROMA e gostaria de falar com um especialista.',
    address: 'Showroom em São Paulo, com atendimento agendado',
    hours: 'Segunda a sexta, das 9h às 18h',
  },

  features: {
    prices: true,
    search: true,
    filters: true,
    quote: true,
    themeSwitcher: false,
    relatedProducts: true,
    pricesInMessage: true,
    heroAutoplay: 7000,
  },

  theme: {
    default: 'aroma',
    available: themes,
  },

  navigation: [
    { label: 'Início', to: 'inicio' },
    { label: 'Coleção', to: 'colecao' },
    { label: 'Máquinas', to: 'colecao-maquinas' },
    { label: 'Acessórios', to: 'colecao-acessorios' },
    { label: 'Contato', to: 'contato' },
  ],

  home: {
    slides: [
      {
        eyebrow: 'Café de alto padrão',
        title: 'Tecnologia\npara cafés\nextraordinários',
        description: 'Máquinas premium que combinam design, performance e o verdadeiro sabor do café.',
        image: heroArt('hero-01', 'Máquina de café preta sobre bloco de pedra, com planta e xícara de espresso'),
        primary: { label: 'Explorar a coleção', to: 'colecao' },
        secondary: { label: 'Falar no WhatsApp' },
        // posição da xícara de espresso em cada versão da foto (tools/build_images.py)
        steam: {
          wide: { x: 0.769, y: 0.815, w: 0.07 },
          tablet: { x: 0.796, y: 0.846, w: 0.112 },
          mobile: { x: 0.657, y: 0.91, w: 0.13 },
        },
      },
      {
        eyebrow: 'Extração profissional',
        title: 'O ritual da\ncafeteria na\nsua bancada',
        description: 'Controle total de temperatura, pressão e moagem com a Aroma Pro semiautomática.',
        image: heroArt('hero-pro', 'Aroma Pro em inox sobre bancada de pedra'),
        primary: { label: 'Conhecer a Aroma Pro', to: 'produto-aroma-pro' },
        secondary: { label: 'Falar no WhatsApp', whatsapp: 'Olá! Gostaria de saber mais sobre a Aroma Pro.' },
      },
      {
        eyebrow: 'Para empresas',
        title: 'Café de\nqualidade para\nquem não para',
        description: 'A Aroma Office atende escritórios e negócios com receitas prontas em um toque.',
        image: heroArt('hero-office', 'Aroma Office sobre bancada de pedra com ripado de madeira'),
        primary: { label: 'Conhecer a Aroma Office', to: 'produto-aroma-office' },
        secondary: { label: 'Falar no WhatsApp', whatsapp: 'Olá! Gostaria de um orçamento da Aroma Office para minha empresa.' },
      },
    ],
    benefits: [
      { icon: 'cup', title: 'Qualidade profissional', text: 'Resultado de cafeteria em casa.', short: 'Qualidade' },
      { icon: 'gear', title: 'Tecnologia inteligente', text: 'Extração perfeita e consistente.', short: 'Tecnologia' },
      { icon: 'layers', title: 'Design sofisticado', text: 'Peças que valorizam o ambiente.', short: 'Design' },
      { icon: 'leaf', title: 'Mais sustentabilidade', text: 'Consumo eficiente e consciente.', short: 'Eficiência' },
    ],
    featured: {
      eyebrow: 'Coleção em destaque',
      title: 'Nossos modelos',
      linkLabel: 'Ver toda a coleção',
      products: ['aroma-one', 'aroma-pro', 'aroma-office'],
    },
    categoriesTitle: 'Explore por categoria',
    banner: {
      title: 'Mais que máquinas,\numa experiência completa.',
      text: 'Soluções para quem valoriza o ritual do café,\nseja em casa, no escritório ou no seu negócio.',
      cta: 'Falar com um especialista',
      image: {
        ...wide('banner', [1280, 1920, 2560], 'Xícara de vidro com espresso sobre bancada de pedra', '100% 50%'),
        sources: [
          { media: '(max-width: 767px)', srcSet: 'images/banner-cafe-espresso-600.webp 600w, images/banner-cafe-espresso-1000.webp 1000w', sizes: '100vw' },
        ],
      },
      message: 'Olá! Vim pelo catálogo da AROMA e gostaria de falar com um especialista sobre a melhor máquina para mim.',
      steam: { wide: { x: 0.796, y: 0.355, w: 0.13 }, mobile: { x: 0.483, y: 0.27, w: 0.4 } },
    },
  },

  copy: {
    collectionEyebrow: 'Catálogo AROMA',
    collectionTitle: 'Coleção',
    collectionIntro: 'Filtre por categoria, uso ou recursos e monte seu pedido de orçamento.',
    priceOnRequest: 'Sob consulta',
    quote: {
      title: 'Seu orçamento',
      intro: 'Revise os itens e envie o pedido pelo WhatsApp. Respondemos com valores, prazos e condições.',
      empty: 'Seu orçamento ainda está vazio. Escolha os produtos na coleção para montar o pedido.',
      emptyCta: 'Explorar a coleção',
      greeting: 'Olá! Vim pelo catálogo da {brand} e gostaria de um orçamento para:',
      closing: 'Aguardo o retorno. Obrigado!',
      notesLabel: 'Observações gerais',
      sendLabel: 'Enviar pelo WhatsApp',
    },
    footer: {
      statement: 'Máquinas de café de alto padrão para casa, escritório e negócios.',
      legal: 'AROMA é uma marca fictícia, criada para demonstrar este catálogo.',
      credit: 'Catálogo digital por ÚNICA',
    },
    // Modelo de texto: revise com o cliente (e com o jurídico dele) antes de publicar.
    privacy: {
      title: 'Política de privacidade',
      intro:
        'Este catálogo foi pensado para pedir o mínimo de informação. Aqui explicamos quais dados você informa ao pedir um orçamento, onde eles ficam e como a {brand} usa cada um.',
      sections: [
        {
          title: 'Quais dados você informa',
          text: 'No pedido de orçamento você pode informar nome, empresa e cidade, além dos produtos escolhidos e das observações. Nenhum campo pede documentos, endereço completo ou dados de pagamento.',
        },
        {
          title: 'Onde eles ficam',
          text: 'Os dados ficam salvos apenas neste navegador, para você não perder o orçamento ao fechar a página. O catálogo não tem cadastro, não envia formulários para servidores e não usa cookies de rastreamento nem ferramentas de análise de visitas.',
        },
        {
          title: 'Quando são enviados',
          text: 'Somente quando você toca em “Enviar pelo WhatsApp”. A mensagem abre no seu WhatsApp para você revisar antes de enviar. A partir daí, a conversa também segue os termos de uso e a política de privacidade do WhatsApp.',
        },
        {
          title: 'Para que a {brand} usa',
          text: 'Para responder ao seu pedido com valores, prazos de entrega e condições de pagamento. Os dados não são usados para outras finalidades nem vendidos ou repassados a terceiros.',
        },
        {
          title: 'Seus direitos',
          text: 'Pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode pedir acesso, correção ou exclusão dos dados enviados à {brand}, pelo mesmo WhatsApp do atendimento. Os dados salvos neste aparelho você mesmo apaga no botão abaixo.',
        },
      ],
      formNote: 'Ficam salvos só neste aparelho e são enviados apenas quando você tocar em enviar.',
    },
  },

  quoteFields: [
    { id: 'nome', label: 'Seu nome', messageLabel: 'Nome', required: true, autoComplete: 'name' },
    { id: 'empresa', label: 'Empresa', messageLabel: 'Empresa', autoComplete: 'organization', placeholder: 'Opcional' },
    { id: 'cidade', label: 'Cidade', autoComplete: 'address-level2', placeholder: 'Para calcular o frete' },
  ],

  /* Atributos ------------------------------------------------------------- */
  attributes: [
    {
      key: 'uso',
      label: 'Indicada para',
      type: 'enum',
      group: 'Geral',
      filter: 'options',
      filterLabel: 'Uso',
      options: [
        { value: 'casa', label: 'Casa' },
        { value: 'escritorio', label: 'Escritório' },
        { value: 'negocio', label: 'Negócio' },
      ],
    },
    { key: 'pressao', label: 'Pressão da bomba', type: 'number', unit: 'bar', group: 'Desempenho' },
    { key: 'receitas', label: 'Receitas programadas', type: 'number', group: 'Desempenho' },
    { key: 'xicaras', label: 'Capacidade diária', type: 'text', group: 'Desempenho' },
    {
      key: 'moedor',
      label: 'Moedor integrado',
      type: 'boolean',
      group: 'Desempenho',
      filter: 'toggle',
      filterLabel: 'Recursos',
      toggleLabel: 'Moedor integrado',
    },
    {
      key: 'leite',
      label: 'Sistema de leite',
      type: 'boolean',
      group: 'Desempenho',
      filter: 'toggle',
      filterLabel: 'Recursos',
      toggleLabel: 'Bebidas com leite',
    },
    { key: 'reservatorio', label: 'Reservatório de água', type: 'number', unit: 'L', decimals: 1, group: 'Desempenho' },
    { key: 'capacidade', label: 'Capacidade', type: 'number', unit: 'ml', group: 'Geral' },
    { key: 'diametro', label: 'Diâmetro', type: 'number', unit: 'mm', group: 'Geral' },
    { key: 'origem', label: 'Origem', type: 'text', group: 'Café' },
    { key: 'torra', label: 'Torra', type: 'text', group: 'Café' },
    { key: 'notas', label: 'Notas sensoriais', type: 'text', group: 'Café' },
    { key: 'potencia', label: 'Potência', type: 'number', unit: 'W', group: 'Elétrica' },
    {
      key: 'tensao',
      label: 'Tensão',
      type: 'enum',
      group: 'Elétrica',
      filter: 'options',
      options: [
        { value: '127', label: '127 V' },
        { value: '220', label: '220 V' },
      ],
    },
    { key: 'dimensoes', label: 'Dimensões (L × A × P)', type: 'dimensions', unit: 'cm', group: 'Dimensões' },
    { key: 'peso', label: 'Peso', type: 'number', unit: 'kg', decimals: 1, group: 'Dimensões' },
    { key: 'material', label: 'Material', type: 'text', group: 'Construção e garantia' },
    { key: 'garantia', label: 'Garantia', type: 'text', group: 'Construção e garantia' },
  ],

  /* Categorias ------------------------------------------------------------ */
  categories: [
    {
      id: 'automaticas',
      name: 'Máquinas Automáticas',
      description: 'Do grão à xícara em um toque, com moagem na hora.',
      image: tile('cat-automaticas', 'categoria-automaticas', 'Extração de espresso em xícara de vidro'),
      keySpecs: ['receitas', 'reservatorio', 'pressao'],
    },
    {
      id: 'semiautomaticas',
      name: 'Semiautomáticas',
      description: 'Porta-filtro e controle total para quem gosta de preparar.',
      image: tile('cat-semiautomaticas', 'categoria-semiautomaticas', 'Porta-filtro com café moído'),
      keySpecs: ['pressao', 'reservatorio', 'potencia'],
    },
    {
      id: 'acessorios',
      name: 'Acessórios',
      description: 'Xícaras, canecas e ferramentas de barista.',
      image: tile('cat-acessorios', 'categoria-acessorios', 'Caneca de vidro com latte'),
      keySpecs: ['capacidade', 'material', 'diametro'],
    },
    {
      id: 'insumos',
      name: 'Insumos',
      description: 'Cafés especiais selecionados para cada máquina.',
      image: tile('cat-insumos', 'categoria-insumos', 'Grãos de café saindo do saco'),
      keySpecs: ['origem', 'torra', 'notas'],
    },
  ],

  groups: [
    {
      id: 'maquinas',
      name: 'Máquinas',
      description: 'Automáticas e semiautomáticas para casa, escritório e negócios.',
      categories: ['automaticas', 'semiautomaticas'],
    },
  ],

  /* Produtos -------------------------------------------------------------- */
  products: [
    {
      id: 'aroma-one',
      slug: 'aroma-one',
      name: 'Aroma One',
      category: 'automaticas',
      summary: 'Compacta, potente e ideal para o dia a dia.',
      description:
        'A Aroma One leva o espresso de cafeteria para a cozinha de casa em um corpo compacto. O moedor cônico mói os grãos na hora, e o painel de um toque prepara espresso, lungo e café coado com a mesma consistência todos os dias.',
      price: 4990,
      pricePrefix: 'A partir de',
      featured: true,
      attributes: {
        uso: 'casa',
        pressao: 15,
        receitas: 6,
        xicaras: 'Até 20 cafés por dia',
        moedor: true,
        leite: false,
        reservatorio: 1.5,
        potencia: 1350,
        tensao: ['127', '220'],
        dimensoes: { w: 22, h: 34, d: 38 },
        peso: 7.5,
        material: 'Plástico ABS fosco e aço inox',
        garantia: '1 ano',
      },
      highlights: [
        { title: 'Moagem na hora', text: 'Moedor cônico com cinco níveis de ajuste.' },
        { title: 'Um toque', text: 'Seis receitas prontas no painel frontal.' },
        { title: 'Compacta', text: 'Apenas 22 cm de largura para qualquer bancada.' },
      ],
      options: [cor([['Preto fosco', PRETO, 'Acabamento fosco antimarcas.']]), tensao()],
      cover: CARD.one,
      images: [IMG.one, IMG.extracao],
      related: ['aroma-office', 'cafe-graos', 'xicara-espresso'],
      keywords: ['compacta', 'casa', 'automática', 'espresso'],
    },
    {
      id: 'aroma-pro',
      slug: 'aroma-pro',
      name: 'Aroma Pro',
      category: 'semiautomaticas',
      summary: 'Extração profissional com controle total.',
      description:
        'A Aroma Pro é a semiautomática para quem gosta de conduzir cada etapa. Moedor integrado com dose ajustável, porta-filtro de 58 mm, controle de temperatura PID e lança de vapor para microespuma de cafeteria.',
      price: 7490,
      pricePrefix: 'A partir de',
      featured: true,
      attributes: {
        uso: 'casa',
        pressao: 15,
        xicaras: 'Até 40 cafés por dia',
        moedor: true,
        leite: true,
        reservatorio: 2,
        potencia: 1600,
        tensao: ['127', '220'],
        dimensoes: { w: 33, h: 41, d: 40 },
        peso: 11.8,
        material: 'Aço inox escovado',
        garantia: '2 anos',
      },
      highlights: [
        { title: 'Porta-filtro 58 mm', text: 'Padrão profissional, compatível com acessórios de barista.' },
        { title: 'Temperatura PID', text: 'Estabilidade de 1 °C para extrações consistentes.' },
        { title: 'Vapor potente', text: 'Lança articulada para latte art.' },
      ],
      options: [cor([['Inox escovado', INOX, 'Aço inox com escovação horizontal.'], ['Preto fosco', PRETO, 'Pintura fosca com detalhes em inox.']]), tensao()],
      cover: CARD.pro,
      images: [IMG.pro, IMG.portaFiltro, IMG.latte],
      related: ['porta-filtro', 'caneca-latte', 'cafe-graos'],
      keywords: ['porta-filtro', 'barista', 'manual', 'vapor', 'leite'],
    },
    {
      id: 'aroma-office',
      slug: 'aroma-office',
      name: 'Aroma Office',
      category: 'automaticas',
      summary: 'Alta performance para escritórios e negócios.',
      description:
        'A Aroma Office foi feita para servir a equipe inteira. Tela sensível ao toque com doze bebidas, reservatório de grãos de 500 g, sistema de leite automático e ligação opcional à rede de água para uso contínuo.',
      price: 9990,
      pricePrefix: 'A partir de',
      featured: true,
      attributes: {
        uso: ['escritorio', 'negocio'],
        pressao: 19,
        receitas: 12,
        xicaras: 'Até 120 cafés por dia',
        moedor: true,
        leite: true,
        reservatorio: 4,
        potencia: 1900,
        tensao: ['220'],
        dimensoes: { w: 32, h: 55, d: 48 },
        peso: 16,
        material: 'Aço pintado e vidro temperado',
        garantia: '2 anos, com assistência técnica',
      },
      highlights: [
        { title: 'Tela touch', text: 'Doze bebidas e perfis por usuário.' },
        { title: 'Uso contínuo', text: 'Reservatório de 4 L ou ligação direta à rede.' },
        { title: 'Leite automático', text: 'Cappuccino e latte sem intervenção.' },
      ],
      options: [cor([['Preto', PRETO, 'Pintura eletrostática preta.']]), tensao(['220'])],
      cover: CARD.office,
      images: [IMG.office, IMG.extracao],
      related: ['aroma-one', 'cafe-graos', 'caneca-latte'],
      keywords: ['empresa', 'escritório', 'touch', 'leite', 'cappuccino', 'negócio'],
    },
    {
      id: 'aroma-signature',
      slug: 'aroma-signature',
      name: 'Aroma Signature',
      category: 'automaticas',
      summary: 'Linhas puras e moldura metálica para cozinhas de projeto.',
      description:
        'A Aroma Signature combina moldura metálica, painel de vidro e interface circular. Pensada para cozinhas planejadas, prepara espresso e bebidas com leite com a mesma qualidade da linha profissional.',
      price: 12990,
      pricePrefix: 'A partir de',
      badge: 'Lançamento',
      attributes: {
        uso: ['casa', 'escritorio'],
        pressao: 19,
        receitas: 16,
        xicaras: 'Até 60 cafés por dia',
        moedor: true,
        leite: true,
        reservatorio: 2.2,
        potencia: 1500,
        tensao: ['127', '220'],
        dimensoes: { w: 30, h: 42, d: 46 },
        peso: 12,
        material: 'Vidro temperado e alumínio anodizado',
        garantia: '2 anos',
      },
      highlights: [
        { title: 'Interface circular', text: 'Gire, toque e pronto.' },
        { title: 'Moldura metálica', text: 'Combina com marcenaria e pedra.' },
        { title: 'Silenciosa', text: 'Moagem com isolamento acústico.' },
      ],
      options: [cor([['Preto e bronze', BRONZE, 'Moldura em alumínio anodizado bronze.'], ['Preto', PRETO, 'Moldura preta acetinada.']]), tensao()],
      cover: CARD.signature,
      images: [IMG.hero, IMG.extracao, IMG.espresso],
      related: ['aroma-office', 'xicara-espresso', 'cafe-graos'],
      keywords: ['premium', 'design', 'cozinha', 'automática'],
    },
    {
      id: 'porta-filtro',
      slug: 'porta-filtro',
      name: 'Porta-filtro Precision 58',
      category: 'acessorios',
      summary: 'Inox maciço e cabo ergonômico para extrações precisas.',
      description:
        'Porta-filtro de 58 mm em aço inox maciço, com bico duplo e cabo ergonômico. Compatível com a Aroma Pro e com a maioria das máquinas semiautomáticas do mercado.',
      price: 289,
      attributes: { uso: ['casa', 'negocio'], diametro: 58, material: 'Aço inox 304', peso: 0.6, garantia: '1 ano' },
      options: [
        {
          id: 'bico',
          label: 'Bico',
          display: 'choice',
          values: [
            { id: 'duplo', label: 'Duplo' },
            { id: 'sem-fundo', label: 'Sem fundo', priceDelta: 60 },
          ],
        },
      ],
      cover: CARD.portaFiltro,
      images: [IMG.portaFiltro],
      related: ['aroma-pro', 'cafe-graos'],
      keywords: ['porta filtro', 'barista', '58 mm'],
    },
    {
      id: 'caneca-latte',
      slug: 'caneca-latte',
      name: 'Caneca Latte Dupla',
      category: 'acessorios',
      summary: 'Vidro de parede dupla que mantém a temperatura.',
      description:
        'Caneca de vidro borossilicato com parede dupla: o latte fica quente por mais tempo e a caneca continua fria ao toque. Ideal para mostrar as camadas do café com leite.',
      price: 149,
      attributes: { uso: ['casa', 'escritorio'], capacidade: 350, material: 'Vidro borossilicato', garantia: '90 dias' },
      options: [
        {
          id: 'kit',
          label: 'Quantidade',
          display: 'choice',
          values: [
            { id: 'par', label: 'Par' },
            { id: 'kit-4', label: 'Kit com 4', priceDelta: 130 },
          ],
        },
      ],
      cover: CARD.latte,
      images: [IMG.latte],
      related: ['xicara-espresso', 'aroma-pro'],
      keywords: ['caneca', 'vidro', 'latte', 'cappuccino'],
    },
    {
      id: 'xicara-espresso',
      slug: 'xicara-espresso',
      name: 'Xícara Espresso Vidro',
      category: 'acessorios',
      summary: 'Parede dupla e alça delicada para o espresso perfeito.',
      description:
        'Xícara de 90 ml em vidro de parede dupla, que valoriza a crema e mantém a temperatura do espresso. Vai à lava-louças.',
      price: 119,
      attributes: { uso: ['casa', 'escritorio', 'negocio'], capacidade: 90, material: 'Vidro borossilicato', garantia: '90 dias' },
      options: [
        {
          id: 'kit',
          label: 'Quantidade',
          display: 'choice',
          values: [
            { id: 'par', label: 'Par' },
            { id: 'kit-6', label: 'Kit com 6', priceDelta: 190 },
          ],
        },
      ],
      cover: CARD.xicara,
      images: [IMG.espresso],
      related: ['caneca-latte', 'aroma-one'],
      keywords: ['xícara', 'vidro', 'espresso'],
    },
    {
      id: 'cafe-graos',
      slug: 'cafe-graos',
      name: 'Café Especial em Grãos',
      category: 'insumos',
      summary: 'Torra média, notas de chocolate e caramelo.',
      description:
        'Café especial do Sul de Minas, torrado em pequenos lotes para máquinas automáticas e semiautomáticas. Torra média, corpo aveludado e doçura persistente.',
      price: 89,
      attributes: { uso: ['casa', 'escritorio', 'negocio'], origem: 'Sul de Minas, MG', torra: 'Média', notas: 'Chocolate, caramelo e castanhas' },
      options: [
        {
          id: 'peso',
          label: 'Embalagem',
          display: 'choice',
          values: [
            { id: '1kg', label: '1 kg' },
            { id: '500g', label: '500 g', priceDelta: -40 },
          ],
        },
        {
          id: 'moagem',
          label: 'Moagem',
          display: 'choice',
          values: [
            { id: 'graos', label: 'Em grãos' },
            { id: 'espresso', label: 'Moído para espresso' },
          ],
        },
      ],
      cover: CARD.graos,
      images: [IMG.graos],
      related: ['aroma-one', 'aroma-pro', 'xicara-espresso'],
      keywords: ['café', 'grãos', 'especial', 'insumo'],
    },
  ],
};
