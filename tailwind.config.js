/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export const content = [
  './src/frontend/**/*.{js,ts,jsx,tsx,mdx}',
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
];
export const theme = {
  extend: {
    screens: {
      '2xs': '370px',
      xs: '475px',
      ...defaultTheme.screens,
    },
    colors: {
      card: '#10161E',
      'card-section': '#1D2838',
      'subtext-color': '#8F8F8F',
    },
    backgroundImage: {
      'hero-gradient':
        'linear-gradient(180deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.00) 43.75%)',
      'widget-gradient': 'linear-gradient(131deg, #2E3843 0%, #1B2027 100%)',
    },
    boxShadow: {
      widget: '0px 2px 5px 2px rgba(0, 0, 0, 0.25);',
    },
    aspectRatio: {
      '10/13': '10 / 13',
    },
  },
};
export const plugins = [];
