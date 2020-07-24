const merge = require('webpack-merge');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.config.js');

// Paste here part of Github Pages URL after github.io/
const page = 'sendsay-consoleAPI';

module.exports = merge(common, {
  mode: 'production',
  output: {
    publicPath: './bundle/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '/styles/[name].css',
      chunkFilename: '/styles/[id].css',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        PUBLIC_URL: JSON.stringify(`${page}`),
      },
    }),
  ],
});
