var pathConfig = require('./path.config.js');
// console.log(pathConfig);

var pages={
	index:pathConfig.SRC_PATH+'/clean_mine/clean_mine.js',
	modules:[pathConfig.MODULE_PATH+'/cleanMine.class.js']
}
// console.log(pages);
module.exports = pages;