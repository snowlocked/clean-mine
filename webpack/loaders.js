const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const constants = require('./constants');

const isDevelopment = (process.env.NODE_ENV || "development") === "development";

const jsx = {
  test: /\.(js|jsx)$/,
  exclude: /(node_modules)/,
  use: [{
    loader: 'babel-loader',
    options: {
      plugins: [
        [
          'react-css-modules', {
            context: constants.SRC_DIR,
            filetypes: {
              '.less': 'postcss-less'
            },
            generateScopedName: '[path]_[name]_[local]_[hash:base64:5]',
          }
        ],
        // import js and css modularly (less source files)
        [
          'import', {
            libraryName: 'antd-mobile',
            style: 'css'
          }
        ]
      ],
    },
  }],
};

const antdStyle = {
  test: /\.(css|less)$/,
  include: [
    /node_modules\/.*antd-mobile\/.*/,
    /node_modules\\.*antd-mobile\\.*/,
    /node_modules\/.*normalize\.css\/.*/,
    /node_modules\\.*normalize\.css\\.*/,
      /node_modules\/.*silk-scroller\/.*/,
      /node_modules\\.*silk-scroller\\.*/,
  ],
  use: isDevelopment ?
    [
      'style-loader',
      'css-loader',
      'postcss-loader',
      'less-loader',
    ] :
    ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        'css-loader',
        'postcss-loader',
        'less-loader',
      ],
    }),
};

const less = {
  test: /\.less$/,
  include: [
    path.resolve(__dirname, '../src')
  ],
  use: isDevelopment ?
    [
      'style-loader',
      'css-loader?modules&importLoaders=1&localIdentName=[path]_[name]_[local]_[hash:base64:5]',
      'postcss-loader',
      'less-loader',
    ] :
    ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        'css-loader?modules&importLoaders=1&localIdentName=[path]_[name]_[local]_[hash:base64:5]',
        'postcss-loader',
        'less-loader',
      ],
    })
}

const css = {
  test: /\.css$/,
  include: [
    constants.SRC_DIR,
  ],
  use: isDevelopment ?
    [
      'style-loader',
      'css-loader?modules&importLoaders=1&localIdentName=[path]_[name]_[local]_[hash:base64:5]',
      'postcss-loader',
    ] :
    ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        'css-loader?modules&importLoaders=1&localIdentName=[path]_[name]_[local]_[hash:base64:5]',
        'postcss-loader',
      ],
    })
};

const assets = {
  test: /\.(jpe?g|png|gif)$/i,
  include: [
    constants.SRC_DIR,
    /node_modules\/.*antd-mobile\/.*/,
    /node_modules\\.*antd-mobile\\.*/,
  ],
  use: ['url-loader?limit=10000!img-loader?progressive=true'],
};

const assets2 = {
    test: /\.(ttf|eot|svg|woff(2)?)$/i,
    include: [
        constants.SRC_DIR,
        /node_modules\/.*silk-scroller\/.*/,
        /node_modules\\.*silk-scroller\\.*/,
    ],
    use: ['url-loader?limit=10000!img-loader?progressive=true'],
};

const svgSprite = {
  test: /\.(svg)$/i,
  include: [
    require.resolve('antd-mobile').replace(/warn\.js$/, ''),
    path.join(constants.ASSETS_DIR, 'svg'),
  ],
  use: 'svg-sprite-loader',
};

module.exports = {
  jsx: jsx,
  antdStyle: antdStyle,
  less: less,
  css: css,
  assets: assets,
  assets2:assets2,
  svgSprite: svgSprite,
};
