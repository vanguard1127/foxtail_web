const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const OfflinePlugin = require("offline-plugin");
const webpack = require("webpack");
module.exports = {
  entry: { main: "./src/index.js" },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./build"),
    publicPath: "/"
  },
  mode: "development",
  node: {
    fs: "empty"
  },
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader"]
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
      },
      {
        // Exposes jQuery for use outside Webpack build
        test: require.resolve("jquery"),
        use: [
          {
            loader: "expose-loader",
            options: "jQuery"
          },
          {
            loader: "expose-loader",
            options: "$"
          }
        ]
      }
    ]
  },
  devServer: {
    port: process.env.PORT || 1234,
    contentBase: path.resolve(__dirname, "./build"),
    compress: true,
    index: "index.html",
    historyApiFallback: true,
    open: true,
    publicPath: "/"
  },
  devtool: "cheap-module-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Foxtail",
      template: "src/page-template.hbs",
      description: "FREE | Private | 18+ Fun",
      filename: "index.html",
      favicon: "./src/assets/favicon.ico",
      manifest: "./src/assets/manifest.json"
    }),
    new CopyPlugin([
      { from: "src/assets/locales", to: "locales", toType: "dir" },
      { from: "src/assets/manifest.json", to: "manifest.json" },
      { from: "src/assets/icon-192.png", to: "icon-192.png" },
      { from: "src/assets/icon-512.png", to: "icon-512.png" }
    ]),
    new CleanWebpackPlugin(),
    new Dotenv({ path: "./.env.stage", defaults: true }),
    new OfflinePlugin({
      ServiceWorker: {
        events: true,
        minify: true
      }
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ]
};
