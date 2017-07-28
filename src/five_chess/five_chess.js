import FiveChess from "../../modules/fiveChess.class.js";
import './five_chess.scss';

let fiveChess = new FiveChess('#canvas');
let isAuto = true,
	type = "white",
	isEve = false;
fiveChess.clickEvent(function(e) {
	let point = {
		x: parseInt(e.offsetX / fiveChess.preWidth),
		y: parseInt(e.offsetY / fiveChess.preHeight)
	}
	fiveChess.drawChess(point.x, point.y);
	isAuto && fiveChess.autoDraw(type);
	let autoPlay;
	if (isEve) {
		autoPlay = setInterval(function() {
			if (fiveChess.isEnd) {
				clearInterval(autoPlay);
			} else {
				fiveChess.autoDraw(type);
				if (type == "black") {
					type = "white";
				} else if (type == "white") {
					type = "black";
				}
			}
		}, 100)
	}
})

document.querySelector("#reset").addEventListener('click', function() {
	fiveChess.reset();
	// type = null;
}, false);

document.querySelector('.setting-box').addEventListener('click', function(e) {
	let target = e.target;
	for (let [i, ele] of this.querySelectorAll('div').entries()) {
		ele.classList.remove("is-choose");
	}
	target.classList.add("is-choose");
	let id = e.target.id;
	setType(id);
}, false)

function setType(id) {
	fiveChess.reset();
	isEve = false;
	switch (id) {
		case "computer-first":
			fiveChess.drawChess(9, 9);
			type = "black";
			isAuto = true;
			break;
		case "computer-last":
			isAuto = true;
			type = "white";
			break;
		case "pvp":
			isAuto = false;
			break;
		case "eve":
			isEve = true;
			break;
	}
}