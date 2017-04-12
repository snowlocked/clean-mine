var path = require('path');
var webpack = require('webpack');
// var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var webpackDevServer = require('webpack-dev-server');
// 提取样式到单独的css文件
var ExtractTextPlugin = require('extract-text-webpack-plugin');


var CONFIG_PATH = path.resolve(__dirname, 'config');
var pathConfig = require(CONFIG_PATH + '/path.config.js');
// var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

var extractCSS = new ExtractTextPlugin('css/[name].css');
var extractModules = new webpack.optimize.CommonsChunkPlugin({
    name: 'modules',
    filename: 'js/modules.js'
});
// console.log(pathConfig.CONFIG_PATH);
var htmlWebpackPlugin = require(pathConfig.CONFIG_PATH + '/webpack.html.js');
var webpackEntry = require(pathConfig.CONFIG_PATH + '/webpack.entry.js');

var pluginsArray = [extractCSS, extractModules].concat(htmlWebpackPlugin);

module.exports = {
    entry: webpackEntry,
    output: {
        // 输出目录
        path: pathConfig.DIST_PATH,
        filename: 'js/[name].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            // loaders: ['style', 'css']
            // 配置css的抽取器、加载器。'-loader'可以省去
            loader: ExtractTextPlugin.extract({
            	fallback:'style-loader',
            	use: 'css-loader'
            })
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'url-loader',
            query: {
                // limit的单位是byte
                limit: 10,
                name: 'imgs/[name].[ext]?[hash]'
            }
        }, {
            test: /\.scss$/,
            // loaders: ['style', 'css', 'sass']
            //配置sass的抽取器、加载器
            // 根据从右到左的顺序依次调用sass、css加载器，前一个的输出是后一个的输入
            loader: ExtractTextPlugin.extract({
            	fallback:'style-loader', 
            	use:'css-loader!sass-loader'
            })
        }]
    },
    plugins: pluginsArray,
    devServer: {
        historyApiFallback: true,
        inline: true,
        port: 8080, //端口你可以自定义
    }
}
