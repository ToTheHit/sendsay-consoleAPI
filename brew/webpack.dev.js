const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.config');

module.exports = merge(common, {
  mode: 'development',
  output: {
    publicPath: '/',
  },
  devServer: {
    contentBase: './dist',
    allowedHosts: [
      '.ngrok.io',
      '.vk.com',
    ],
    host: '0.0.0.0',
    port: 10880,
    publicPath: '/',
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'styleTag',
            },
          },
          {
            loader: 'css-loader',
            options: { },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'styleTag',
            },
          },
          {
            loader: 'css-loader',
            options: {},
          },
          {
            loader: 'less-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        PUBLIC_URL: JSON.stringify(''),
      },
    }),
  ],
});
