var path = require('path');

var ROOT_PATH = path.resolve(__dirname);

var pathConfig = {
    SRC_PATH: path.resolve(ROOT_PATH, '../src'),
    MODULE_PATH: path.resolve(ROOT_PATH, '../modules'),
    CONFIG_PATH: path.resolve(ROOT_PATH, '../config'),
    DIST_PATH: path.resolve(ROOT_PATH, '../dist'),
    IMG_PATH: path.resolve(ROOT_PATH, '../img')
}

module.exports = pathConfig;
