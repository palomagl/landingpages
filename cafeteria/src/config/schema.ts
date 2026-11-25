/**
 * Esquema do catálogo — independente de segmento.
 *
 * Nada aqui sabe o que é "máquina de café", "sofá" ou "luminária".
 * Um segmento é descrito por atributos (o que se mede/compara), categorias,
 * variações (cores, tensões, tamanhos…) e imagens. Todos os tipos são dados
 * puros (serializáveis em JSON), prontos para virem de uma API ou CMS no futuro
 * — veja `src/core/catalog.tsx`.
 */

/* ------------------------------------------------------------------ Imagens */

export interface ImageAsset {
  /** Caminho relativo a /public (ex.: "images/produto-414.webp"). */
  src: string;
  /** Ex.: "images/produto-414.webp 414w, images/produto-828.webp 828w" */
  srcSet?: string;
  alt: string;
  width?: number;
  height?: number;
  /** Enquadramento (CSS object-position), ex.: "60% 50%". */
  position?: string;
  /**
   * Direção de arte: outras versões da imagem por tamanho de tela
   * (ex.: retrato no celular). A primeira cuja `media` combinar é usada.
   */
  sources?: { media: string; srcSet: string; sizes?: string }[];
}

/* ------------------------------------------------------------------ Atributos */

export type AttributeType = 'text' | 'number' | 'enum' | 'boolean' | 'dimensions';

export interface AttributeOption {
  value: string;
  label: string;
}

export interface AttributeDefinition {
  /** Chave usada em `product.attributes`. */
  key: string;
  label: string;
  type: AttributeType;
  /** Unidade exibida após números e dimensões (ex.: "W", "kg", "cm"). */
  unit?: string;
  decimals?: number;
  /** Opções para `enum` (o valor no produto pode ser uma string ou lista). */
  options?: AttributeOption[];
  /** Grupo na ficha técnica (ex.: "Desempenho", "Dimensões"). */
  group?: string;
  /**
   * Como o atributo vira filtro na coleção.
   * - `options`: lista de valores existentes
   * - `toggle`: liga/desliga (boolean)
   * - `range`: faixa numérica mín./máx.
   */
  filter?: 'options' | 'toggle' | 'range';
  filterLabel?: string;
  toggleLabel?: string;
  hideInSpecs?: boolean;
}

export type DimensionsValue = { w: number; h: number; d?: number };
export type AttributeValue = string | number | boolean | string[] | DimensionsValue;

/* ------------------------------------------------------------------ Categorias */

export interface Category {
  /** Letras minúsculas, números e hífens (vai para a URL: #colecao-{id}). */
  id: string;
  name: string;
  description: string;
  /** Imagem do bloco de categoria (panorâmica; use `sources` para a versão do celular). */
  image?: ImageAsset;
  /** Atributos de destaque nos cards e na página do produto. */
  keySpecs?: string[];
}

/** Agrupamento de categorias com endereço próprio (ex.: "Máquinas"). */
export interface CollectionGroup {
  id: string;
  name: string;
  description: string;
  categories: string[];
}

/* ------------------------------------------------------------------ Variações */

export interface OptionValue {
  id: string;
  label: string;
  description?: string;
  /** Cor (ou gradiente CSS) da amostra no seletor. */
  swatch?: string;
  /** Diferença de preço em relação ao preço base. */
  priceDelta?: number;
  /** Fotos específicas desta variação (substituem a galeria). */
  images?: ImageAsset[];
}

export interface ProductOption {
  id: string;
  label: string;
  /** `swatch` mostra amostras de cor; `choice` mostra botões de texto. */
  display: 'swatch' | 'choice';
  values: OptionValue[];
}

/* ------------------------------------------------------------------ Produto */

export interface ProductHighlight {
  title: string;
  text: string;
}

export interface Product {
  id: string;
  /** Usado na URL: #produto-{slug} */
  slug: string;
  name: string;
  category: string;
  /** Frase curta dos cards. */
  summary: string;
  description: string;
  /** Preço base. Omitir ou `null` para "sob consulta". */
  price?: number | null;
  /** Ex.: "A partir de" */
  pricePrefix?: string;
  badge?: string;
  featured?: boolean;
  attributes: Record<string, AttributeValue>;
  highlights?: ProductHighlight[];
  options?: ProductOption[];
  /** Galeria da página do produto. */
  images: ImageAsset[];
  /** Imagem dos cards (panorâmica). Padrão: a primeira da galeria. */
  cover?: ImageAsset;
  /** IDs de produtos relacionados. Se vazio, usa a mesma categoria. */
  related?: string[];
  keywords?: string[];
  keySpecs?: string[];
}

/* ------------------------------------------------------------------ Tema */

export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  scheme: 'light' | 'dark';
  colors: {
    /** Fundo da página. */
    bg: string;
    /** Fundo alternativo (faixas, seções). */
    bgAlt: string;
    /** Corpo dos cards. */
    card: string;
    ink: string;
    muted: string;
    line: string;
    /** Botões escuros (pílulas principais). */
    dark: string;
    onDark: string;
    /** Destaque de marca (botões de seta, detalhes). */
    accent: string;
    onAccent: string;
    /** Texto claro sobre o hero e o banner. */
    light: string;
    /** Gradiente do hero (do escuro, à esquerda, ao claro). */
    heroFrom: string;
    heroVia: string;
    heroTo: string;
    /** Fundo do banner inferior. */
    banner: string;
    bannerTo: string;
  };
}

/* ------------------------------------------------------------------ Conteúdo da página inicial */

/** Ponto da foto onde há uma xícara (efeito de vapor), em frações da imagem. */
export interface SteamSpot {
  x: number;
  y: number;
  w: number;
}

export interface HeroSlide {
  eyebrow: string;
  /** Use \n para quebrar linhas exatamente como no layout. */
  title: string;
  description: string;
  image: ImageAsset;
  primary: { label: string; to: string };
  /** Abre o WhatsApp com a mensagem padrão quando omitido `to`. */
  secondary?: { label: string; whatsapp?: string };
  /** Vapor sobre a xícara da foto, por versão da imagem (opcional). */
  steam?: { wide?: SteamSpot; tablet?: SteamSpot; mobile?: SteamSpot };
}

export type BenefitIcon = 'cup' | 'gear' | 'layers' | 'leaf' | 'truck' | 'shield' | 'tool' | 'star';

export interface QuoteField {
  id: string;
  label: string;
  /** Rótulo usado na mensagem do WhatsApp (padrão: `label`). */
  messageLabel?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}

export interface NavLink {
  label: string;
  /** Rota interna sem "#" (ex.: "inicio", "colecao", "colecao-maquinas", "contato"). */
  to: string;
}

/* ------------------------------------------------------------------ Configuração */

export interface CatalogConfig {
  brand: {
    name: string;
    /** Logotipo em texto (pode ser trocado por SVG em Header.tsx). */
    wordmark: string;
    wordmarkSub?: string;
    tagline: string;
    description: string;
    locale: string;
    currency: string;
    fonts: {
      text: string;
      display: string;
      logo: string;
      /** URL do Google Fonts (ou outra folha de estilos). */
      stylesheet?: string;
    };
  };

  contact: {
    /** DDI + DDD + número, só dígitos (ex.: "5511912345678"). Vazio = o WhatsApp pede para escolher o contato. */
    whatsapp: string;
    whatsappDisplay?: string;
    /** Mensagem padrão dos botões "Falar no WhatsApp". */
    whatsappGreeting: string;
    email?: string;
    phone?: string;
    address?: string;
    hours?: string;
    instagram?: string;
  };

  features: {
    prices: boolean;
    search: boolean;
    filters: boolean;
    quote: boolean;
    /** Seletor de identidade visual (ferramenta de demonstração). */
    themeSwitcher: boolean;
    relatedProducts: boolean;
    pricesInMessage: boolean;
    /** Troca automática dos slides do hero (ms). 0 desliga. */
    heroAutoplay: number;
  };

  theme: {
    default: string;
    available: ThemeDefinition[];
  };

  navigation: NavLink[];

  home: {
    slides: HeroSlide[];
    benefits: { icon: BenefitIcon; title: string; text: string; /** Rótulo curto (celular). */ short?: string }[];
    featured: { eyebrow: string; title: string; linkLabel: string; products: string[] };
    categoriesTitle: string;
    banner: { title: string; text: string; cta: string; image: ImageAsset; message?: string; steam?: { wide?: SteamSpot; mobile?: SteamSpot } };
  };

  copy: {
    collectionEyebrow: string;
    collectionTitle: string;
    collectionIntro: string;
    priceOnRequest: string;
    quote: {
      title: string;
      intro: string;
      empty: string;
      emptyCta: string;
      greeting: string;
      closing: string;
      notesLabel: string;
      sendLabel: string;
    };
    footer: {
      statement: string;
      legal?: string;
      credit?: string;
    };
    /**
     * Política de privacidade (página #privacidade e aviso no formulário do
     * orçamento). `{brand}` vira o nome da marca. Revise o texto com o cliente.
     */
    privacy?: {
      title: string;
      intro: string;
      sections: { title: string; text: string }[];
      /** Frase curta exibida junto aos campos do orçamento. */
      formNote: string;
    };
  };

  quoteFields: QuoteField[];

  attributes: AttributeDefinition[];
  categories: Category[];
  groups: CollectionGroup[];
  products: Product[];
}
