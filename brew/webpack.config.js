const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: `${path.resolve(__dirname, 'dist')}/bundle/`,
    publicPath: './bundle/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[hash].[ext]',
              outputPath: 'assets/images/',
            },
          },
        ],
      },
      {
        test: /\.(ttf|otf|eot|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: '../assets/fonts/',
              outputPath: 'assets/fonts/',
            },
          },
        ],
      },
      {
        test: /\.(svg)(\?[a-z0-9=&.]+)?$/,
        use: [{
          loader: '@svgr/webpack',
        },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
