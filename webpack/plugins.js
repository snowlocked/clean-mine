const path = require('path');
const webpack = require('webpack');
const pxtorem = require('postcss-pxtorem');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const constants = require('./constants');
const isDevelopment = (process.env.NODE_ENV || "development") === "development";

exports.commonPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'IS_DEV': isDevelopment,
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || "development")
    },
  }),
  new HtmlWebpackPlugin({
    title: isDevelopment ? 'dev-wechat' : '商户登录',
    template: path.join(constants.SRC_DIR, 'index.html')
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: !isDevelopment,
    debug: isDevelopment,
  }),
  new OpenBrowserPlugin({
      url: ['http://', constants.HOST, ':', constants.PORT, '/'].join('')
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      context: path.resolve(__dirname, '../src'),
      postcss: [
        pxtorem({
          rootValue: 100,
          propWhiteList: [],
        }),
      ],
    }
  }),
];

exports.devPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
];

exports.prodPlugins = [
  new CleanWebpackPlugin(['dist'], {
    root: constants.ABSOLUTE_BASE,
    verbose: true,
  }),
  new ExtractTextPlugin('[name]_[contenthash].css'),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true
  }),
];
