// eslint-disable-next-line no-undef
module.exports = {
  mode: 'jit',
  content: ['index.html', './public/**/*.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: '#848484',
      },
    },
  },
  variants: {
    width: ['hover', 'focus'],
    extend: {},
  },
};
