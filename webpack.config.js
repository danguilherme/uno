'use strict';

const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');

const baseConfig = {
  devtool: 'source-map',
  mode: 'production',

  entry: './src/uno-engine.ts',
  optimization: {
    usedExports: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].bundle.js',
  },
};

const nodeTarget = {
  target: 'node',
  output: {
    filename: 'uno-engine.node.js',
    libraryTarget: 'commonjs2',
  },
  externals: [nodeExternals()],
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PLATFORM': JSON.stringify('node'),
    }),
  ],
};
const webTarget = {
  node: false,
  output: {
    filename: 'uno-engine.browser.js',
    libraryTarget: 'umd',
    library: 'Uno',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PLATFORM': JSON.stringify('browser'),
    }),
  ],
};

module.exports = [
  webpackMerge(baseConfig, webTarget),
  webpackMerge(baseConfig, nodeTarget),
];
