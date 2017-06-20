var pathConfig = require('./path.config.js');
var HtmlWebpackPlugin = require('html-webpack-plugin'); //html编译

var htmlWebpackPluginArray = [];
htmlWebpackPluginArray.push(new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
    favicon: '', //favicon路径
    filename: pathConfig.DIST_PATH + '/clean_mine.html', //生成的html存放路径，相对于 path
    template: pathConfig.SRC_PATH + '/clean_mine/clean_mine.html', //html模板路径
    chunks: ['modules', 'clean_mine'],
    inject: 'body', //允许插件修改哪些内容，包括head与body
    hash: true, //为静态资源生成hash值
    minify: { //压缩HTML文件o c
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: true //删除空白符与换行符
    }
}));

htmlWebpackPluginArray.push(new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
    favicon: '', //favicon路径
    filename: pathConfig.DIST_PATH + '/five_chess.html', //生成的html存放路径，相对于 path
    template: pathConfig.SRC_PATH + '/five_chess/five_chess.html', //html模板路径
    chunks: ['modules', 'five_chess'],
    inject: 'body', //允许插件修改哪些内容，包括head与body
    hash: true, //为静态资源生成hash值
    minify: { //压缩HTML文件o c
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: true //删除空白符与换行符
    }
}));

htmlWebpackPluginArray.push(new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
    favicon: '', //favicon路径
    filename: pathConfig.DIST_PATH + '/black&white.html', //生成的html存放路径，相对于 path
    template: pathConfig.SRC_PATH + '/black&white/black&white.html', //html模板路径
    chunks: ['modules', 'black&white'],
    inject: 'body', //允许插件修改哪些内容，包括head与body
    hash: true, //为静态资源生成hash值
    minify: { //压缩HTML文件o c
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: true //删除空白符与换行符
    }
}));
module.exports = htmlWebpackPluginArray;