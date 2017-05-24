const path = require('path');
const webpack = require('webpack');
const constants = require('./constants');
const loaders = require('./loaders');
const plugins = require('./plugins');

const isDevelopment = (process.env.NODE_ENV || "development") === "development";

const webpackConfig = {
  devtool: isDevelopment ? 'cheap-module-eval-source-map' : 'hidden-source-map',

  context: constants.SRC_DIR,

  entry: {
    app: isDevelopment ?
      [
        'babel-polyfill',
        'url-search-params-polyfill',
        // activate HMR for React
        'react-hot-loader/patch',
        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint
        `webpack-dev-server/client?http://0.0.0.0:${constants.PORT}`,
        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates
        'webpack/hot/only-dev-server',
        // the entry point of our app

        path.join(constants.SRC_DIR, 'entry.js'),
      ] : [
        'babel-polyfill',
        'url-search-params-polyfill',
        path.join(constants.SRC_DIR, 'entry.js'),
      ],
  },

  output: {
    path: constants.DIST_DIR,
    filename: isDevelopment ? '[name]_[hash].js' : '[name]_[chunkhash].js',
    publicPath: '/',
  },

  module: {
    rules: [
      loaders.jsx,
      loaders.antdStyle,
      loaders.css,
      loaders.less,
      loaders.assets,
      loaders.assets2,
      loaders.svgSprite,
    ],
  },

  plugins: isDevelopment ?
    [].concat(plugins.commonPlugins, plugins.devPlugins) :
    [].concat(plugins.commonPlugins, plugins.prodPlugins),

  resolve: {
    modules: ['node_modules'],
    extensions: ['.web.js', '.js', '.css', '.less', '.json'],


    alias: {
      // 自定义路径别名，大写用于区别NPM模块
      ASSETS: path.join(constants.SRC_DIR, 'assets'),
      SVG: path.join(constants.SRC_DIR, 'assets/svg'),
      PAGES: path.join(constants.SRC_DIR, 'pages'),
      COM: path.join(constants.SRC_DIR, 'components'),
      UTILS: path.join(constants.SRC_DIR, 'utils'),
    }

  },

};

module.exports = webpackConfig;
