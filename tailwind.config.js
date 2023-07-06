/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/frontend/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
  },
  plugins: [],
};
