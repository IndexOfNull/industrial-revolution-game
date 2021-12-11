module.exports = {
  purge: {
    content: [
      //tell tailwind to remove unused CSs when bundling (reduces bundle size drastically)
      "./src/**/*.js",
      "./src/**/*.jsx",
      "./src/**/*.ts",
      "./src/**/*.tsx",
      "./public/index.html",
    ],
    options: {
      safelist: ['body', 'html', 'div']
    }
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
