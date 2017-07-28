const PI = Math.PI;

class Go {
    constructor(selector) {
        selector = document.querySelector(selector);
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        selector.appendChild(this.canvas);
        this.canvas.width = selector.offsetWidth;
        this.canvas.height = selector.offsetHeight;
        this.preWidth = this.canvas.width / 19;
        this.preHeight = this.canvas.height / 19;
        this.reset();
    }
    // 重置棋盘
    reset() {
        this.resetPramas();
        this.drewPonits = [];
        this.drawChessBoard();
    }
    // 撤销上一次操作
    redo() {
        this.resetPramas();
        let lastPoint = this.drewPonits.pop();
        this.drawChessBoard();
        for (let [i, point] of lastPoint.lastMap.entries()) {
            this.drawChess(point);
        }
    }
    // 重置数据
    resetPramas() {
        this.canvas.width = this.canvas.width;
        this.canvas.height = this.canvas.height;
        this.pointsMap = this.__init2Array__(0);
        console.log(this);
    }
    /**
     * [setChess 设置棋子]
     * @param  {[type]}  x        [description]
     * @param  {[type]}  y        [description]
     * @param  {string}  type     "white","black"
     * @param  {num}     num       显示下子位置,false代表没有数字
     * @return {boolean}           返回设置成功或失败
     */
    setChess(x, y, type,num=false) {
        if (this.isDrew(x, y, this.pointsMap)) {
            return false;
        }
        type = type === undefined ? this.type : type;
        // 记录上一步棋局
        let lastMap = this.getLastMap();
        // 初始化坐标点属性
        let point = {
            x: x,
            y: y,
            type: type,
            lastMap: lastMap,
            eat:false,//吃子标记
            eatPoints:[],//吃子数组
            num:num
        } //绘制点坐标及颜色
        // 绘制坐标顺序
        this.drewPonits.push(point);
        // console.log(this.drewPonits)

        // 绘制棋子
        this.drawChess(point);
        // 计算吃棋
        this.calDieChess(point);
        // 重绘吃棋后棋局
        this.setDieChess(point);
        return true;
    }
    // 绘画棋子
    drawChess(point) {
        // 更新棋盘布局	
        this.updatePointsMap(point);
        let { x, y, type,num } = point;
        let textColor;
        if (type == "black") {
            this.context.fillStyle = "#000";
            textColor = "#fff";
        } else if (type == "white") {
            this.context.fillStyle = "#fff";
            textColor = "#000";
        }
        let circlePoint = {
                x: x * this.preWidth + this.preWidth / 2,
                y: y * this.preHeight + this.preHeight / 2
            },
            r = Math.min(this.preWidth, this.preHeight) / 2 * 0.8;
        this.context.beginPath();
        this.context.arc(circlePoint.x, circlePoint.y, r, 0, 2 * PI)
        this.context.fill();
        if(num!==false){
        	this.context.font = `${this.preWidth/3}px STHeiti Light`;
        	this.context.fillStyle=textColor;
        	this.context.textAlign='center';
        	this.context.textBaseline='middle';
        	this.context.fillText(num, circlePoint.x, circlePoint.y);
        }
    }
    // 更新棋盘坐标状态
    updatePointsMap(drawPoint) {
        let { x, y, type,num } = drawPoint;
        this.pointsMap[x][y] = {type,num};
    }
    // 点击事件
    clickEvent(call) {
        this.canvas.addEventListener('click', function(e) {
            call(e);
        }, false)
    }
    // 是否已绘制棋子
    isDrew(x, y, pointsMap) {
        return pointsMap[x][y] !== 0;
    }
    // 画棋盘
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
    // 初始化二维数组
    __init2Array__(num) {
        let arr = []
        for (let i = 0; i < 19; i++) {
            arr[i] = []
            for (let j = 0; j < 19; j++) {
                arr[i][j] = num;
            }
        }
        return arr
    }
    // 设置吃子后的棋局
    setDieChess(point) {
        let length = this.drewPonits.length;
        let lastDrewPoint = this.drewPonits[length - 1];

        // console.log(map);
        if (lastDrewPoint.eat) {
            this.resetPramas();
            this.drawChessBoard();
            this.drawAfterSetDieChess(lastDrewPoint);
        }
    }
    drawAfterSetDieChess(point) {
    	// console.log(point);
    	let {x,y,eatPoints} = point;
        for(let [i,historyPoint] of point.lastMap.entries()){
        	let {x,y,type}=historyPoint;
        	if(!this.isInArea(x,y,eatPoints)){
        		this.drawChess(historyPoint)
        	}
        }
        if(!this.isInArea(x,y,eatPoints)){
        	this.drawChess(point);
        };
    }
    // 计算是否吃子
    calDieChess(point) {
        let { x, y, type } = point,
        otherType = this.getOtherType(type);
        // 判断及寻找对方相邻的子
        //up,1
        this.judge(x, y - 1, otherType, 1);
        //right,2
        this.judge(x + 1, y, otherType, 2);
        //down,3
        this.judge(x, y + 1, otherType, 3);
        // left,4
        this.judge(x - 1, y, otherType, 4);
        // 自杀可能性
        if(!point.eat){
        	this.judge(x,y,type,0)
        };
    }
    // 判断及寻找
    judge(x, y, type, direction) {
        if (!this.isInChessBoard(x, y)) {
            return false;
        }
        let map = this.pointsMap;
        this.__area = [];
        if (map[x][y].type == type) {
            // console.log(area,this.hasThisType(x,y,type,area));
            // 找出和x,y相邻的己方棋子区域,存在__aera里
            this.hasThisType(x, y, type);
            // 根据__aera获取“气”的坐标数组
            let breathPoints = this.getBreathPoints(this.__area);
            // 吃子操作
            this.eat(breathPoints, type);
        }
    }
    // 找出和x,y相邻的己方棋子区域,存在__aera里
    hasThisType(x, y, type) {
        if (!this.isInChessBoard(x, y)) {
            return false;
        }
        this.__area.push({ x: x, y: y });
        // 找相邻的己方
        this.nextPoint(x, y - 1, type);
        this.nextPoint(x + 1, y, type);
        this.nextPoint(x, y + 1, type);
        this.nextPoint(x - 1, y, type);
        // console.log(arr,this.nextPoint(x,y-1,type));
    }
    // 找相邻的己方
    nextPoint(x, y, type) {
        if (this.isInArea(x, y, this.__area) || !this.isInChessBoard(x, y)) {
            return false;
        }
        let map = this.pointsMap;
        if (map[x][y].type == type) {
            this.hasThisType(x, y, type);
        }
        // console.log(arr);
    }
    // 获取“气”的坐标数组
    getBreathPoints(points) {
        let arr = [];
        let map = this.pointsMap;
        for (let [i, point] of points.entries()) {
            let { x, y } = point;
            arr = arr.concat(this.pushBreathPoint(x, y - 1, arr));
            arr = arr.concat(this.pushBreathPoint(x + 1, y, arr));
            arr = arr.concat(this.pushBreathPoint(x, y + 1, arr));
            arr = arr.concat(this.pushBreathPoint(x - 1, y, arr));
        }
        return arr;
    }
    // 找各个“气”点
    pushBreathPoint(x, y, area) {
        if (!this.isInChessBoard(x, y) || this.isInArea(x, y, area) || this.isInArea(x, y, this.__area)) {
            return [];
        } else {
            return [{ x, y }];
        }
    }
    // 吃子
    eat(points, type) {
        // console.log(points);
        let map = this.pointsMap;
        let otherType = this.getOtherType(type);
        // console.log(type,otherType);
        for (let [i, point] of points.entries()) {
            let { x, y } = point;
            // 当气点存在非对方（无子）状态，存活，不能吃
            if (map[x][y].type !== otherType) {
                // console.log("you can't eat these cheses!");
                return false;
            }
        }
        // console.log("you can eat it!");
        // console.log(this.drewPonits);
        // 设置最后下点有子吃
        this.setCanEatPointsAtLastDrewPoint();
    }
    // 设置最后下点有子吃及吃子坐标
    setCanEatPointsAtLastDrewPoint() {
        let length = this.drewPonits.length;
        this.drewPonits[length - 1].eat = true;
        // console.log(this.drewPonits);
        let eatPoints = this.drewPonits[length - 1].eatPoints
        if (eatPoints == undefined) {
            eatPoints = [];
        }
        this.drewPonits[length - 1].eatPoints = eatPoints.concat(this.__area);
        // console.log(this.drewPonits);
    }
    // 坐标位于棋盘内
    isInChessBoard(x, y) {
        return x >= 0 && y >= 0 && x < 19 && y < 19;
    }
    // 坐标位于某个area（数组）内
    isInArea(x, y, area) {
        for (let [i, point] of area.entries()) {
            if (x == point.x && y == point.y) {
                return true;
            }
        }
        return false;
    }
    // 根据当前type获取另一个敌方
    getOtherType(type) {
        if (type == "black") {
            return "white";
        } else if (type == "white") {
            return "black";
        }
    }
    // 获取下子前的棋盘状态，用于撤销操作
    getLastMap() {
        let lastMap = [];
        let map = this.pointsMap;
        for (let [i, lines] of map.entries()) {
            for (let [j, value] of lines.entries()) {
                if (this.isDrew(i, j, this.pointsMap)) {
                    lastMap.push({
                        x: i,
                        y: j,
                        type: value.type,
                        num:value.num
                    })
                }
            }
        }
        return lastMap;
    }
}

export default Go;