const HtmlPlugin = require('html-webpack-plugin');
const WepappPlugin = require('webapp-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const title = 'BATB Stats';
const branchName = process.env.CIRCLE_BRANCH;
const publicPath =
  branchName && branchName !== 'master' ? `/${branchName}/` : '/';

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: ['babel-polyfill', './index.js'],
  output: {
    publicPath,
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[hash].js'
  },
  devtool: 'source-map',
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
    new HtmlPlugin({
      title,
      template: 'index.html'
    }),
    new WepappPlugin({
      logo: './assets/favicon.png',
      favicons: {
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          firefox: false,
          windows: false,
          yandex: false
        }
      }
    }),
    new webpack.DefinePlugin({
      PUBLIC_PATH: JSON.stringify(publicPath),
      TITLE: JSON.stringify(title)
    })
  ]
};
