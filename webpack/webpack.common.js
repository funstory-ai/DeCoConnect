const webpack = require("webpack");
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const srcDir = '../src/';

module.exports = {
  entry: {
    popup: path.join(__dirname, srcDir + 'popup.ts'),
    options: path.join(__dirname, srcDir + 'options.ts'),
    background: path.join(__dirname, srcDir + 'background.ts'),
    content_script: path.join(__dirname, srcDir + 'content_script.ts'),
  },
  output: {
    path: path.join(__dirname, '../dist/js'),
    filename: '[name].js'
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: "initial"
    }
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    },
    {
      test: /\.less$/,
      use: [{
        loader: 'style-loader',
      },
      {
        loader: 'css-loader',
      },
      {
        loader: 'less-loader',
        options: {
          lessOptions: {
            strictMath: true,
          },
        },
      },
      ],
    },
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: { "buffer": require.resolve("buffer/") },
  },
  plugins: [
    // exclude locale files in moment
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: '.',
          to: '../',
          context: 'src',
          globOptions: {
            ignore: ['*.ts', '*.less', 'config.json', 'config.sample.json'],
          }
        }
      ],
    }),
  ]
};