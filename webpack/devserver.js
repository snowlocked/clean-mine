const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config.js');
const constants = require('./constants');


new WebpackDevServer(webpack(config), {
    contentBase: constants.ABSOLUTE_BASE,
    hot: true,
    historyApiFallback: true,
    //proxy: {
    //    '/api': {
    //        // 开发环境接口服务，需要配置host 10.1.21.126 ftapp.95039.com
    //        target: 'http://ftapp.95039.com',
    //        changeOrigin: true,
    //    }
    //},
    proxy: {
        '/api/*': {
            target: 'http://10.1.21.86:8081/',
            pathRewrite: {
                '^/api': ``
            },
            secure: false,
            changeOrigin: true,
        }
    },
    stats: {colors: true}
}).listen(constants.PORT, constants.HOST, function (err, result) {
    if (err) {
        return console.log(err);
    }

    console.log(`Listening at ${constants.HOST}:${constants.PORT}/`);
});
