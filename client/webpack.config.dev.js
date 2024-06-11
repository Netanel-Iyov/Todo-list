const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const cryptoBrowserify = require.resolve('crypto-browserify');

const Dotenv = require("dotenv-webpack") // Loads environment variables from a .env file into process.env

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  // define build output dir
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    // define loaders to handle loading of different file types
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(css)$/,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: ['file-loader?name=[name].[ext]']
      },
    ],
  },
  // define resolves 
  resolve: {
    modules: ['node_modules', 'src'],
    fallback: {
      buffer: false,
      crypto: false,
      util: false,
      stream: false,
      'crypto-browserify': cryptoBrowserify,
      "path": require.resolve("path-browserify"),
      "os": false
    },
  },
  // define web server config
  devServer: {
    port: 3000,
    hot: true,
  },
  plugins: [
    new Dotenv( {
      path: './.env.dev',
      systemvars: true
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    // fix "process is not defined" error:
      new webpack.ProvidePlugin({
        process: 'process/browser',
        favicon: "./src/assets/favicon.ico"
      }),
  ]
};