import { fontFamily } from 'tailwindcss/defaultTheme';

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: { fontFamily: { sans: ['var(--font-sans)', ...fontFamily.sans] } },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
