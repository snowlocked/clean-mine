var pathConfig = require('./path.config.js');
// console.log(pathConfig);

var pages = {
		clean_mine: pathConfig.SRC_PATH + '/clean_mine/clean_mine.js',
		five_chess: pathConfig.SRC_PATH + '/five_chess/five_chess.js',
		modules: [
			pathConfig.MODULE_PATH + '/cleanMine.class.js',
			pathConfig.MODULE_PATH + '/fiveChess.class.js'
		]
	}
	// console.log(pages);
module.exports = pages;