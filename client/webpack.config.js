const EmojiFaviconPlugin = require('emoji-favicon-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const title = 'BATB Stats';
module.exports = {
  context: path.join(__dirname, 'src'),
  entry: ['@babel/polyfill', './index.js'],
  output: {
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.png$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new EmojiFaviconPlugin('⚡️'),
    new HtmlPlugin({
      title,
      template: 'index.html'
    }),
    new webpack.DefinePlugin({
      TITLE: JSON.stringify(title)
    })
  ]
};
