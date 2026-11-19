/**
 * EXEMPLO — o mesmo catálogo configurado para uma loja de móveis.
 *
 * Nenhum componente precisa mudar: basta trocar o import em src/main.tsx
 *   import { catalogConfig } from '../examples/moveis.config';
 * e colocar as fotos em /public/images/moveis/.
 *
 * Os atributos (material, assentos, dimensões…) viram ficha técnica e filtros
 * automaticamente; as variações (tecido, acabamento) entram na mensagem do WhatsApp.
 */
import type { CatalogConfig, ImageAsset } from '../src/config/schema';
import { catalogConfig as base } from '../src/config/catalog.config';

const foto = (nome: string, alt: string): ImageAsset => ({
  src: `images/moveis/${nome}-800.webp`,
  srcSet: `images/moveis/${nome}-800.webp 800w, images/moveis/${nome}-1600.webp 1600w`,
  alt,
});

export const catalogConfig: CatalogConfig = {
  ...base,
  brand: { ...base.brand, name: 'Casa Lume', wordmark: 'LUME', wordmarkSub: 'Móveis autorais', tagline: 'Móveis autorais em madeira maciça' },
  contact: { ...base.contact, whatsappGreeting: 'Olá! Vim pelo catálogo da Casa Lume e gostaria de falar com um consultor.' },
  navigation: [
    { label: 'Início', to: 'inicio' },
    { label: 'Coleção', to: 'colecao' },
    { label: 'Salas', to: 'colecao-salas' },
    { label: 'Jantar', to: 'colecao-jantar' },
    { label: 'Contato', to: 'contato' },
  ],
  home: {
    ...base.home,
    slides: [
      {
        eyebrow: 'Feito à mão',
        title: 'Móveis que\natravessam\ngerações',
        description: 'Madeira maciça certificada, marcenaria artesanal e tecidos naturais.',
        image: foto('hero-sofa', 'Sofá de linho em sala com luz natural'),
        primary: { label: 'Explorar a coleção', to: 'colecao' },
        secondary: { label: 'Falar no WhatsApp' },
      },
    ],
    featured: { ...base.home.featured, products: ['sofa-aurora', 'mesa-raiz'] },
    categoriesTitle: 'Explore por ambiente',
  },
  attributes: [
    { key: 'material', label: 'Material', type: 'text', group: 'Construção' },
    {
      key: 'ambiente',
      label: 'Ambiente',
      type: 'enum',
      filter: 'options',
      options: [
        { value: 'sala', label: 'Sala' },
        { value: 'jantar', label: 'Jantar' },
        { value: 'quarto', label: 'Quarto' },
      ],
    },
    { key: 'assentos', label: 'Lugares', type: 'number', filter: 'options', group: 'Medidas' },
    { key: 'dimensoes', label: 'Dimensões (L × A × P)', type: 'dimensions', unit: 'cm', group: 'Medidas' },
    { key: 'sobMedida', label: 'Sob medida', type: 'boolean', filter: 'toggle', filterLabel: 'Recursos', toggleLabel: 'Aceita sob medida' },
  ],
  categories: [
    { id: 'salas', name: 'Salas de estar', description: 'Sofás, poltronas e mesas de centro.', image: foto('cat-salas', 'Sala de estar'), keySpecs: ['assentos', 'material'] },
    { id: 'jantar', name: 'Jantar', description: 'Mesas, cadeiras e aparadores.', image: foto('cat-jantar', 'Sala de jantar'), keySpecs: ['assentos', 'dimensoes'] },
  ],
  groups: [],
  products: [
    {
      id: 'sofa-aurora',
      slug: 'sofa-aurora',
      name: 'Sofá Aurora',
      category: 'salas',
      summary: 'Linho lavado e base em carvalho.',
      description: 'Sofá de três lugares com almofadas de pluma e base em carvalho maciço.',
      price: 12900,
      pricePrefix: 'A partir de',
      attributes: { material: 'Carvalho e linho', ambiente: 'sala', assentos: 3, dimensoes: { w: 220, h: 78, d: 95 }, sobMedida: true },
      options: [
        {
          id: 'tecido',
          label: 'Tecido',
          display: 'swatch',
          values: [
            { id: 'areia', label: 'Linho areia', swatch: '#d8c7ad' },
            { id: 'grafite', label: 'Linho grafite', swatch: '#4a4642', priceDelta: 400 },
          ],
        },
      ],
      images: [foto('sofa-aurora', 'Sofá Aurora em linho areia')],
    },
    {
      id: 'mesa-raiz',
      slug: 'mesa-raiz',
      name: 'Mesa Raiz',
      category: 'jantar',
      summary: 'Tampo inteiriço em freijó.',
      description: 'Mesa de jantar com tampo inteiriço e pés em ângulo, para seis ou oito lugares.',
      price: 9800,
      attributes: { material: 'Freijó maciço', ambiente: 'jantar', assentos: 6, dimensoes: { w: 200, h: 76, d: 100 }, sobMedida: true },
      options: [
        {
          id: 'tamanho',
          label: 'Tamanho',
          display: 'choice',
          values: [
            { id: '6', label: '6 lugares' },
            { id: '8', label: '8 lugares', priceDelta: 2200 },
          ],
        },
      ],
      images: [foto('mesa-raiz', 'Mesa Raiz em freijó')],
    },
  ],
};
