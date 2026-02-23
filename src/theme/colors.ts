export const colors = {
  primary: {
    DEFAULT: '#E8435A',
    dark: '#C4364A',
    light: '#FF6B81',
  },
  secondary: '#FF7854',
  accent: {
    gold: '#F5C563',
    violet: '#8B5CF6',
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0C',
  },
} as const;

export const gradientColors = {
  brand: ['#E8435A', '#FF7854'] as const,
  brandReverse: ['#FF7854', '#E8435A'] as const,
};
