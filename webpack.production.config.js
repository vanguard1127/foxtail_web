const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
var ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");

module.exports = {
  entry: { main: "./src/index.js" },
  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "./build"),
    publicPath: "/"
  },
  mode: "production",
  node: {
    fs: "empty"
  },
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: /\.js$/,
        exclude: [
          "/node_modules/",
          "/src/DevTools.js",
          "/src/components/Landing/Signup_dev.js"
        ]
      },
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: ["/src/assets/favicon.ico", "/src/assets/static"],
        use: ["file-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        exclude: /node_modules/,
        use: ["file-loader"]
      },
      {
        test: /\.(wav|mp3)$/,
        exclude: /node_modules/,
        use: ["file-loader"]
      },
      {
        test: /\.hbs$/,
        use: ["handlebars-loader"]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 10000,
      automaticNameDelimiter: "_"
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Foxtail",
      template: "src/page-template.hbs",
      description: "FREE | Private | 18+ Fun",
      filename: "index.html",
      favicon: "./src/assets/favicon.ico",
      manifest: "./src/assets/manifest.json"
    }),
    new MiniCssExtractPlugin({
      filename: "styles.[contenthash].css"
    }),
    new CopyPlugin([
      { from: "src/assets/locales", to: "locales", toType: "dir" },
      { from: "src/assets/manifest.json", to: "manifest.json" }
    ]),
    new CleanWebpackPlugin(),
    new Dotenv({ path: "./.env.prod", defaults: true })
  ]
};
