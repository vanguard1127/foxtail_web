const path = require("path");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const OfflinePlugin = require("offline-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const PreloadWebpackPlugin = require("preload-webpack-plugin");
const webpack = require("webpack");
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
        exclude: ["/node_modules/", "/src/DevTools.js"]
      },
      {
        test: /\.s?css$/,
        use: ["cache-loader", MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: ["/src/assets/favicon.ico", "/src/assets/static"],
        use: ["cache-loader", "file-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        exclude: /node_modules/,
        use: ["cache-loader", "file-loader"]
      },
      {
        test: /\.(wav|mp3)$/,
        exclude: /node_modules/,
        use: ["cache-loader", "file-loader"]
      },
      {
        test: /\.hbs$/,
        use: ["handlebars-loader"]
      },
      {
        // Exposes jQuery for use outside Webpack build
        test: require.resolve("jquery"),
        use: [
          "cache-loader",
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
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCssAssetsPlugin({})],
    splitChunks: {
      chunks: "all",
      minSize: 10000,
      automaticNameDelimiter: "_",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        },
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Foxtail",
      template: "src/page-template.hbs",
      description: "FREE | Private | 18+ Fun",
      filename: "index.html",
      httpsurl: "https://foxtailapp.com",
      favicon: "./src/assets/favicon.ico",
      appleicon: "./src/assets/img/logo/foxtail-apple-touch-icon.png",
      manifest: "/manifest.json"
    }),
    new PreloadWebpackPlugin({
      rel: "preload",
      as(entry) {
        if (/\.css$/.test(entry)) return "style";
        if (/\.woff$/.test(entry)) return "font";
        if (/\.png$/.test(entry)) return "image";
        if (/\.jpg$/.test(entry)) return "image";
        return "script";
      },
      media: "(min-width: 600px)"
    }),
    new MiniCssExtractPlugin({
      filename: "styles.[contenthash].css"
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
