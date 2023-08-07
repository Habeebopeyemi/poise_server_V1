const path = require("path");
const webpackNodeExternals = require("webpack-node-externals");

module.exports = {
  target: "node",
  mode: "production",
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  externals: [webpackNodeExternals()],
};
