const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path')

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "./src/Pages/Redirect.html",
  filename: "./docs/Pages/Redirect.html"
});

module.exports =
{
  entry:"./src/Pages/Redirect.js",
  output: {
    path: path.resolve('docs/Pages'),
    filename: "Redirect.js"
  },
  module:
  {
    rules:
    [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use:
        {
          loader: "babel-loader"
        },
      },

      {
        test: /\.css$/,
        use:
        [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options:
            {
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]_[local]_[hash:base64]",
              sourceMap: true,
              minimize: true
            }
          }
        ]
      }
    ]
  },
  plugins: [htmlWebpackPlugin]
};
