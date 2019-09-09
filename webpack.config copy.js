const path = require("path");

module.exports = env => {
  const isProduction = env === "production";

  return {
    entry: "./src/index.js",
    output: {
      path: path.join(__dirname, "public"),
      filename: "bundle.js"
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
          use: ["style-loader", "css-loader", "sass-loader"]
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
          test: /\.json$/,
          loader: "json-loader"
        }
      ]
    },
    devtool: isProduction ? "source-map" : "cheap-module-eval-source-map",
    devServer: {
      contentBase: path.join(__dirname, "public"),
      historyApiFallback: true
    }
  };
};
