const PI = Math.PI;
class BlackAndWhite {
    constructor(selector, M) {
        selector = document.querySelector(selector);
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        selector.appendChild(this.canvas);
        this.canvas.width = selector.offsetWidth;
        this.canvas.height = selector.offsetHeight;
        this.reset(M);
        console.log(this);
    };
    moveOneStep(x, y) {
        // if (this.isEnd || this.isDrew(x, y, this.isDrewPoint)) {
        //     return false;
        // }
        const { preWidth, preHeight, context } = this;
        this.clickTimes++;
        let type = this.clickTimes % 2 == 1 ? "black" : "white";
        if (this._canDraw(x, y, type)) {
            this.drawChess(x, y, type);
        } else {
            this.clickTimes--;
        }
        this.blackNum = this._calc("black");
        this.whiteNum = this._calc("white");
        // this.judge(type, x, y);
    }
    drawChess(x, y, type) {
        const { preHeight, preWidth, context } = this;
        this.drewPoint[x][y] = type;
        let point = {
                x: (x + 1) * preWidth,
                y: (y + 1) * preHeight
            },
            r = Math.min(preWidth, preHeight) / 2 * 0.8;
        if (type == "black") {
            context.fillStyle = "#000";
        } else if (type == "white") {
            context.fillStyle = "#fff";
        }
        context.beginPath();
        context.arc(point.x, point.y, r, 0, 2 * PI)
        context.fill();
    }
    clickEvent(call) {
        const { canvas } = this;
        canvas.addEventListener('click', function(e) {
            call(e);
        }, false)
    }
    _drawChessBord() {
        const { M, preWidth, preHeight, canvas, context } = this;
        let startPoint = {
                x: preWidth / 2,
                y: preHeight / 2
            },
            endPoint = {
                x: canvas.width - preWidth / 2,
                y: canvas.height - preHeight / 2
            }
        this.context.strokeStyle = "#000";
        for (let i = 0; i < M + 1; i++) {
            context.beginPath();
            context.moveTo(startPoint.x + i * preWidth, startPoint.y);
            context.lineTo(startPoint.x + i * preWidth, endPoint.y);
            context.stroke();
        }
        for (let i = 0; i < M + 1; i++) {
            context.beginPath();
            context.moveTo(startPoint.x, startPoint.y + preHeight * i);
            context.lineTo(endPoint.x, startPoint.y + preHeight * i);
            context.stroke();
        }
    }
    _getAllLine() {
        let lines = [];
        const { M } = this;
        let line = [];
        for (let i = 0; i < M; i++) {
            line = []
            for (let j = 0; j < M; j++) {
                line.push({
                    x: i,
                    y: j
                })
            }
            lines.push(line);
        }
        for (let i = 0; i < M; i++) {
            line = [];
            for (let j = 0; j < M; j++) {
                line.push({
                    x: j,
                    y: i
                })
            }
            lines.push(line)
        }
        for (let i = 0; i < M; i++) {
            line = [];
            for (let j = 0; i + j < M; j++) {
                line.push({
                    x: i + j,
                    y: j
                })
            }
            lines.push(line);
        }
        for (let i = 1; i < M; i++) {
            line = [];
            for (let j = 0; i + j < M; j++) {
                line.push({
                    x: j,
                    y: i + j
                })
            }
            lines.push(line);
        }
        for (let i = 0; i < M; i++) {
            line = [];
            for (let j = 0; i + j < M; j++) {
                line.push({
                    x: M - i - j - 1,
                    y: j
                })
            }
            lines.push(line);
        }
        for (let i = 1; i < M; i++) {
            line = [];
            for (let j = 0; j + i < M; j++) {
                line.push({
                    x: M - j - 1,
                    y: i + j
                })
            }
            line.length > 2 && lines.push(line);
        }
        return lines;
    }
    initStatus() {
        const { M } = this;
        let arr = []
        for (let i = 0; i < M; i++) {
            arr[i] = [];
            for (let j = 0; j < M; j++) {
                arr[i][j] = false;
            }
        }
        return arr;
    }
    reset(M) {
        this.M = M % 2 == 0 ? M : M + 1;
        this.preWidth = this.canvas.width / (this.M + 1);
        this.preHeight = this.canvas.height / (this.M + 1);
        this.drewPoint = this.initStatus();
        this.isEnd = false;
        this.clickTimes = 0;
        this.lines = this._getAllLine();
        this._drawChessBord();
        this.drawChess(this.M / 2 - 1, this.M / 2 - 1, "black");
        this.drawChess(this.M / 2 - 1, this.M / 2, "white");
        this.drawChess(this.M / 2, this.M / 2, "black");
        this.drawChess(this.M / 2, this.M / 2 - 1, "white");
        this.blackNum = this._calc("black");
        this.whiteNum = this._calc("white");
    }
    _canDraw(x, y, type) {
        let otherType = type == "white" ? "black" : "white",
            { drewPoint, lines } = this,
            canDraw = false;
        if (drewPoint[x][y]) return false;
        for (let [i, line] of lines.entries()) {
            let position = this._thePointInTheLine(x, y, line),
                front = [],
                back = [],
                hasFront = -1,
                hasBack = -1,
                frontCan = false,
                backCan = false;
            if (position > -1) {
                front = line.slice(0, position).reverse();
                back = line.slice(position + 1);
                frontCan = this._isMatchMode(front, type, otherType);
                backCan = this._isMatchMode(back, type, otherType);
            }
            if (frontCan || backCan) {
                canDraw = true;
            }
        }
        return canDraw;
    }
    _thePointInTheLine(x, y, line) {
        for (let [i, point] of line.entries()) {
            if (point.x == x && point.y == y) return i;
        }
        return -1;
    }
    _isMatchMode(line, type, otherType) {
        const { drewPoint } = this, lineLength = line.length;
        if (lineLength < 2) return false;
        let x0 = line[0].x,
            y0 = line[0].y,
            typePosition = 0;
        if (drewPoint[x0][y0] != otherType) return false;
        for (let i = 1; i < lineLength; i++) {
            let { x, y } = line[i];
            console.log(x, y);
            console.log(drewPoint[x][y]);
            if (drewPoint[x][y] == type) {
                typePosition = i;
                break;
            }
        }
        if (typePosition == 0) return false;
        for (let i = 1; i < typePosition; i++) {
            let { x, y } = line[i];
            if (drewPoint[x][y] != otherType) {
                return false;
            }
        }
        for (let i = 0; i < typePosition; i++) {
            let { x, y } = line[i];
            this.drewPoint[x][y] = type;
            this.drawChess(x, y, type);
        }
        return true;
    }
    _calc(type) {
        const { drewPoint, M } = this;
        let num = 0;
        for (let i = 0; i < M; i++) {
            for (let j = 0; j < M; j++) {
                if (drewPoint[i][j] == type) num++;
            }
        }
        return num;
    }
}

export default BlackAndWhite;
