const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
  entry: { main: "./src/index.js" },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./build")
  },
  mode: "development",
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
  devServer: {
    port: 1234,
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
      description: "New site for alternative relationships",
      filename: "index.html"
    }),
    new CopyPlugin([
      { from: "src/assets/locales", to: "locales", toType: "dir" }
    ]),
    new CleanWebpackPlugin()
  ]
};
