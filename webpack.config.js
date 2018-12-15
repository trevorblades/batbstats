const EmojiFaviconPlugin = require('emoji-favicon-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const title = 'BATB Stats';
const favicon = '⚡️';
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  return {
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
        }
      ]
    },
    plugins: [
      new EmojiFaviconPlugin(favicon),
      new HtmlPlugin({
        title,
        template: 'index.html'
      }),
      new webpack.DefinePlugin({
        TITLE: JSON.stringify(title),
        FAVICON: JSON.stringify(favicon),
        API_URL: JSON.stringify(
          isProduction
            ? 'https://batbstats.herokuapp.com'
            : 'http://localhost:3000'
        ),
        COUNTRIES_API_URL: JSON.stringify(
          isProduction
            ? 'https://countries.trevorblades.com'
            : 'http://localhost:4000'
        )
      })
    ]
  };
};
