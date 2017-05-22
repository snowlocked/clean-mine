const PI = Math.PI;

class FiveChess {
	constructor(selector) {
		selector = document.querySelector(selector);
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		selector.appendChild(this.canvas);
		this.canvas.width = selector.offsetWidth;
		this.canvas.height = selector.offsetHeight;
		this.preWidth = this.canvas.width / 19;
		this.preHeight = this.canvas.height / 19;
		// this.drawChessBoard();
		let winMethods = this.winMethods();
		this.winMethodArr = winMethods.winMethods;
		this.winCount = winMethods.count;
		this.winMethodPonints = winMethods.winMethodPonints;
		this.reset();
		console.log(this);
	}
	drawChessBoard() {
		let startPoint = {
				x: this.preWidth / 2,
				y: this.preHeight / 2
			},
			endPoint = {
				x: this.canvas.width - this.preWidth / 2,
				y: this.canvas.height - this.preHeight / 2
			}
		this.context.strokeStyle = "#000";
		for (let i = 0; i < 19; i++) {
			this.context.beginPath();
			this.context.moveTo(startPoint.x + i * this.preWidth, startPoint.y);
			this.context.lineTo(startPoint.x + i * this.preWidth, endPoint.y);
			this.context.stroke();
		}
		for (let i = 0; i < 19; i++) {
			this.context.beginPath();
			this.context.moveTo(startPoint.x, startPoint.y + this.preHeight * i);
			this.context.lineTo(endPoint.x, startPoint.y + this.preHeight * i);
			this.context.stroke();
		}
		let blackPoint = [3, 9, 15],
			r = Math.min(this.preWidth, this.preHeight) / 4 * 0.8;
		this.context.fillStyle = "#000";
		for (let [i, x] of blackPoint.entries()) {
			for (let [j, y] of blackPoint.entries()) {
				this.context.beginPath();
				this.context.arc(startPoint.x + x * this.preWidth, startPoint.y + y * this.preHeight, r, 0, 2 * PI)
				this.context.fill();
			}
		}
	}
	drawChess(x, y) {
		if (this.isEnd || this.isDrew(x, y, this.isDrewPoint)) {
			return false;
		}
		this.isDrewPoint.push({
			x: x,
			y: y
		});
		this.clickTimes++;
		let type = this.clickTimes % 2 == 1 ? "black" : "white";
		if (type == "black") {
			this.context.fillStyle = "#000";
		} else if (type == "white") {
			this.context.fillStyle = "#fff";
		}
		this[type + "Player"].push({
			x: x,
			y: y
		});
		let point = {
				x: x * this.preWidth + this.preWidth / 2,
				y: y * this.preHeight + this.preHeight / 2
			},
			r = Math.min(this.preWidth, this.preHeight) / 2 * 0.8;
		this.context.beginPath();
		this.context.arc(point.x, point.y, r, 0, 2 * PI)
		this.context.fill();
		this.judge(type, x, y);
	}
	clickEvent(call) {
		this.canvas.addEventListener('click', function(e) {
			call(e);
		}, false)
	}
	winMethods() {
		let winMethodArr = [];
		let winMethodPonints = [];
		for (let i = 0; i < 19; i++) {
			winMethodArr[i] = []
			for (let j = 0; j < 19; j++) {
				winMethodArr[i][j] = [];
			}
		}
		let k = 0;

		function kAdd() {
			k++;
		}

		function initWinMethodPoints(k) {
			winMethodPonints[k] = [];
		}
		this.__init3Array__(19, 19 - 5 + 1, 5, function() {
			initWinMethodPoints(k)
		}, function(i, j, l) {
			winMethodArr[i][j + l].push(k);
			winMethodPonints[k].push({
				x: i,
				y: j + l
			})
		}, kAdd);
		this.__init3Array__(19 - 5 + 1, 19, 5, function() {
			initWinMethodPoints(k)
		}, function(i, j, l) {
			winMethodArr[i + l][j].push(k);
			winMethodPonints[k].push({
				x: i + l,
				y: j
			})
		}, kAdd);
		this.__init3Array__(19 - 5 + 1, 19 - 5 + 1, 5, function() {
			initWinMethodPoints(k)
		}, function(i, j, l) {
			winMethodArr[i + l][j + l].push(k);
			winMethodPonints[k].push({
				x: i + l,
				y: j + l
			})
		}, kAdd);
		this.__init3Array__(19 - 5 + 1, 19 - 5 + 1, 5, function() {
			initWinMethodPoints(k)
		}, function(i, j, l) {
			winMethodArr[i + l][j + 5 - 1 - l].push(k);
			winMethodPonints[k].push({
				x: i + l,
				y: j + 5 - 1 - l
			})
		}, kAdd);
		// console.log(winMethodPonints);
		return {
			winMethods: winMethodArr,
			count: k,
			winMethodPonints: winMethodPonints
		}
	}
	judge(type, x, y) {
		let winKs = this.winMethodArr[x][y];
		for (let [j, winType] of winKs.entries()) {
			// console.log(winType);
			this[`${type}Wins`][winType]++;
			// console.log(this[`${type}Wins`][winType]);
			if (this[`${type}Wins`][winType] == 5) {
				alert(`${type} player win this game!`);
				this.isEnd = true;
				return false;
			}
		}
		if (this.isDrewPoint.length >= 19 * 19) {
			alert('打平了');
			this.isEnd = true;
		}
	}
	reset() {
		this.blackPlayer = [];
		this.whitePlayer = [];
		this.canvas.width = this.canvas.width;
		this.canvas.height = this.canvas.height;
		this.isDrewPoint = [];
		this.blackWins = new Array(this.winCount).fill(0);
		this.whiteWins = new Array(this.winCount).fill(0);
		this.valuesOfBlack = [];
		this.valuesOfWhite = [];
		this.isEnd = false;
		this.clickTimes = 0;
		this.drawChessBoard();
	}
	isDrew(x, y, points) {
		for (let [i, value] of points.entries()) {
			if (value.x == x && value.y == y) return true;
		}
		return false;
	}
	autoDraw(type) {
		let computerWins = [],
			humanWins = []
		if (type == "black") {
			computerWins = this.blackWins;
			humanWins = this.whiteWins;
		} else if (type == "white") {
			computerWins = this.whiteWins;
			humanWins = this.blackWins;
		}
		let humanValues = this.getValues(humanWins, computerWins),
			computerValues = this.getValues(computerWins, humanWins);
		let autoDrawPoints = this.getMaxValue(humanValues, computerValues);
		// console.log(humanValues);
		// console.log(computerValues);
		// console.log(autoDrawPoints);
		this.drawRandomPoint(autoDrawPoints);
	}
	getValues(wins, otherWins) {
		let values = this.__init2Array__(0);
		for (let [i, count] of wins.entries()) {
			if (count <= 0) continue;
			for (let [j, point] of this.winMethodPonints[i].entries()) {
				if (this.isDrew(point.x, point.y, this.isDrewPoint)) {
					values[point.x][point.y] = -100000;
				} else {
					values[point.x][point.y] += this.getValue(wins[i] - otherWins[i]);
					// values[point.x][point.y] -= this.getValue(otherWins[i] / 10);
				}
			}
		}
		return values;
	}
	getValue(value) {
		switch (value) {
			case 0:
				return 0;
			case 1:
				return 10;
			case 2:
				return 100;
			case 3:
				return 2000;
			case 4:
				return 10000000;
			default:
				return 0;
		}
	}
	getMaxValue(values1, values2) {
		let max = 0,
			maxPoints = [];
		for (let [i, arr1] of values1.entries()) {
			for (let [j, value] of arr1.entries()) {
				if (value > max) {
					max = value;
					maxPoints = [{
						x: i,
						y: j
					}];
				} else if (value == max) {
					maxPoints.push({
						x: i,
						y: j
					})
				}
			}
		}
		for (let [i, arr1] of values2.entries()) {
			for (let [j, value] of arr1.entries()) {
				if (value > max) {
					max = value;
					maxPoints = [{
						x: i,
						y: j
					}];
				} else if (value == max) {
					maxPoints.push({
						x: i,
						y: j
					})
				}
			}
		}
		return maxPoints;
	}
	drawRandomPoint(points) {
		let len = points.length,
			i = parseInt(Math.random() * len),
			point = points[i];
		console.log(point);
		this.drawChess(point.x, point.y);
	}
	__init2Array__(num) {
		let arr = [];
		for (let i = 0; i < 19; i++) {
			arr[i] = [];
			for (let j = 0; j < 19; j++) {
				arr[i][j] = num
			}
		}
		return arr;
	}
	__init3Array__(i, j, l, callback, callback3, callback2) {
		for (let x = 0; x < i; x++) {
			for (let y = 0; y < j; y++) {
				callback();
				for (let z = 0; z < l; z++) {
					callback3(x, y, z)
				}
				callback2();
			}
		}
	}
}

export default FiveChess;