const path = require("path");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js", //export to ./dist/bundle.js
  },
  devServer: {
    host: "localhost",
    hot: true,
    publicPath: "http://localhost:3000/dist/", //make sure the dev server can access our bundles
    contentBase: path.join(__dirname, "public"), //serve from the public directory by default
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i, //Send .ts and .tsx through babel with the react and typescript presets
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-typescript",
              "@babel/preset-react",
            ],
          },
        },
        exclude: ["/node_modules/"],
      },
      {
        test: /\.css$/i, //send css through css loaders and postcss
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"], //add .jsx here if your need dictate
  },
};

module.exports = () => {
  if (isProduction) {
    //Switch config mode depending on NODE_ENV == "production" or not
    config.mode = "production";
  } else {
    config.mode = "development";
    config.devtool = "cheap-module-source-map"; //only include source-maps if we are in dev mode
  }
  return config;
};
