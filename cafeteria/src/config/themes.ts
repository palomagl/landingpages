import type { ThemeDefinition } from './schema';

/**
 * Identidades visuais disponíveis. A AROMA usa as cores medidas no mockup
 * aprovado. Para outro cliente, adicione um tema e aponte `theme.default`.
 */
export const themes: ThemeDefinition[] = [
  {
    id: 'aroma',
    name: 'AROMA',
    description: 'Marrom, bege, areia, creme e grafite.',
    scheme: 'light',
    colors: {
      bg: '#F4E5D6',
      bgAlt: '#EEDDCB',
      card: '#F8EEE4',
      ink: '#1D130C',
      muted: '#6B5A4D',
      line: '#E3CFBB',
      dark: '#231811',
      onDark: '#F7EBDD',
      accent: '#A68362',
      onAccent: '#FFF8F0',
      light: '#F7E8D6',
      heroFrom: '#46301D',
      heroVia: '#76563A',
      heroTo: '#BE936B',
      banner: '#6B4E36',
      bannerTo: '#4C3421',
    },
  },
  {
    // Variação de demonstração (desligada por padrão em features.themeSwitcher)
    id: 'grafite',
    name: 'Grafite',
    description: 'Mesma estrutura com base grafite e areia.',
    scheme: 'light',
    colors: {
      bg: '#F1EDE7',
      bgAlt: '#E7E1D9',
      card: '#F8F5F1',
      ink: '#17171A',
      muted: '#5E5A55',
      line: '#DCD5CC',
      dark: '#1C1C1F',
      onDark: '#F3EFE9',
      accent: '#7C7368',
      onAccent: '#FFFFFF',
      light: '#F3EEE7',
      heroFrom: '#1E1E21',
      heroVia: '#3E3A36',
      heroTo: '#8A7F72',
      banner: '#34312D',
      bannerTo: '#1F1E1C',
    },
  },
];
