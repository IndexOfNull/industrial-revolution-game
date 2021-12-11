# Industrial Revolution Game

This game was made for a US History final. The premise is that you're a worker in the United States during the Industrial Revolution. It is inspired by older text-adventure games and borrows some ideas from Papers, Please. It was built with the following technologies:

- React (with react-dom)
- TypeScript
- TailwindCSS
- styled-components
- twin.macro (configured for use with TypeScript and styled-components)
- Prettier
- Webpack (preconfigured with dev server and HMR)
  - Babel and babel-loader for transpilation and macros.
  - PostCSS, css-loader, and postcss-loader for compiling basic CSS.

# Building

```
yarn install -d
yarn run build
```

Distributable files should be placed in the `./dist` directory.
