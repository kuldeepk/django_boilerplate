const path = require("path");
const webpack = require("webpack");

module.exports = {
  context: __dirname,
  entry: "./frontend/index",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.ya?ml$/,
        use: ["json-loader", "yaml-loader"]
      },
      {
        test: /\.json$/,
        use: ["json-loader"]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            }
          }
        ]
      },
    ]
  }
};
