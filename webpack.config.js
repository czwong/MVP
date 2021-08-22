const path = require("path");

const DIST_Path = path.join(__dirname, "client/dist");
const SRC_Path = path.join(__dirname, "client/src");

module.exports = {
  entry: `${SRC_Path}/index.jsxs`,
  output: {
    filename: "bundle.js",
    path: DIST_Path,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  regenerator: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
