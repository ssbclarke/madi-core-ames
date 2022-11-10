module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],
  safelist: [
    {
      pattern: /bg-(primary|secondary|accent|info|warning|error)/,
      variants: ['hover', 'focus'],
    },
  ],
};
