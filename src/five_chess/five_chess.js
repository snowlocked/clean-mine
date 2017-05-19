import FiveChess from "../../modules/fiveChess.class.js";

let fiveChess = new FiveChess('#canvas');

fiveChess.clickEvent(function(e) {
	let point = {
		x: parseInt(e.offsetX / fiveChess.preWidth),
		y: parseInt(e.offsetY / fiveChess.preHeight)
	}
	fiveChess.drawChess(point.x, point.y);
})

document.querySelector("#reset").addEventListener('click', function() {
	fiveChess.reset();
	type = null;
}, false)