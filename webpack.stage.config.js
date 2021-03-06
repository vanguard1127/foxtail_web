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
  resolve: {
    extensions: [".mjs", ".ts", ".tsx", ".js", ".jsx", ".scss"],
    alias: {
      components: path.resolve(__dirname, "src/components"),
      containers: path.resolve(__dirname, "src/containers"),
      utils: path.resolve(__dirname, "src/utils"),
      queries: path.resolve(__dirname, "src/queries"),
      assets: path.resolve(__dirname, "src/assets"),
      types: path.resolve(__dirname, "src/types")
    }
  },
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
        test: /\.ts(x?)$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        loader: "babel-loader",
        test: /\.js$/,
        exclude: ["/node_modules/", "/src/DevTools.js"]
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
      description:
        "Foxtail is a Free Sex-Positive Dating Web App - FREE | Private | 18+ Fun",
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
      { from: "src/assets/icon-512.png", to: "icon-512.png" },
      { from: "src/robots.txt", to: "robots.txt" }
    ]),
    new CleanWebpackPlugin(),
    new Dotenv({ path: "./.env.stage", defaults: true }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new OfflinePlugin({
      ServiceWorker: {
        events: true,
        minify: true
      }
    })
  ]
};
