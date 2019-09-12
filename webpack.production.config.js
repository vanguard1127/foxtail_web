const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: { main: "./src/index.js" },
  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "./build")
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
        exclude: /node_modules/
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
      description: "New site for alternative relationships",
      filename: "index.html",
      favicon: "./src/assets/favicon.ico"
    }),
    new MiniCssExtractPlugin({
      filename: "styles.[contenthash].css"
    }),
    new CopyPlugin([
      { from: "src/assets/locales", to: "locales", toType: "dir" }
    ]),
    new CleanWebpackPlugin(),
    new Dotenv({ path: "./.env" })
  ]
};
