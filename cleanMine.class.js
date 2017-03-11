function CleanMine(M, N, num, node) {
    this.M = M; //宽度
    this.N = N; //高度
    this.num = num; //雷数
    this.totalNum = M * N; //总格数
    this.unknownMinesNum = num; //未排雷数
    this.unknownPointsNum = M * N; //未填格数
    this.map = []; //地图，0：安全;1：雷
    this.realMap = []; //真实地图，99：雷
    this.currentMap = []; //当前进度
    this.common = []; //2点公共区域
    this.isTouchMine = 0; //触雷判定
    this.node = node; //节点
    this.context = node.getContext('2d'); //canvas.context
    this.squareWidth = 30; //格子宽度
    this.hasExpandMap = []; //坐标点周围已解决的点数
    this.hasSetFlagMap = []; //坐标点周围已放置旗子的点数
    this.isDraw = true;
    var mineImg = new Image(),
        flagImg = new Image();
    mineImg.src = './img/flag.jpg';
    flagImg.src = './img/mine.jpg';
    this.flagColor = { //绘画颜色，图片
        "1": '#0805dc',
        "2": '#16710a',
        "3": '#de1b2c',
        "4": '#01067e',
        "5": '#770004',
        "6": '#0b7271',
        "7": '#000',
        "8": '#999',
        "100": mineImg,
        "99": flagImg
    };
    this.progress = 0;
    this.alreadySuccess = 0;
    this.success = 0;
    this.isEnd = false;
    this.condiction = [0, 0, 0, 0];
    this.init();
}

CleanMine.prototype = {
    /**
     * [init 初始化]
     * @return {[type]} [description]
     */
    init: function() {
        this._drawBoard();
        this.currentMap = this._initSecondArray(99);
        this.hasExpandMap = this._initSecondArray(0);
        this.hasSetFlagMap = this._initSecondArray(0);
        this.common = this._getCommon();
    },
    /**
     * [_drawBoard 画格子]
     * @param  {[type]} x [宽度格子数]
     * @param  {[type]} y [高度格子数]
     * @return {[type]}   [description]
     */
    _drawBoard: function() {
        if (this.isDraw) {
            var context = this.context,
                M = this.M,
                N = this.N,
                squareWidth = this.squareWidth;
            this.node.width = (M + 1) * squareWidth;
            this.node.height = (N + 1) * squareWidth;
            context.strokeStyle = "#000";
            for (var i = 0; i < M + 1; i++) {
                context.moveTo(squareWidth * (i + 0.5), squareWidth / 2);
                context.lineTo(squareWidth * (i + 0.5), squareWidth * (N + 0.5));
                context.stroke();
            }
            // 画竖线
            for (i = 0; i < N + 1; i++) {
                context.moveTo(squareWidth / 2, squareWidth * (i + 0.5));
                context.lineTo(squareWidth * (M + 0.5), squareWidth * (i + 0.5));
                context.stroke();
            }
        }
    },
    /**
     * [drawFlag 画数字、旗子、雷]
     * @param  {[type]} status [数字、旗子、雷的值]
     * @param  {[type]} x      [横坐标]
     * @param  {[type]} y      [纵坐标]
     * @return {[type]}        [description]
     */
    drawFlag: function(status, x, y) {
        if (this.isDraw) {
            var context = this.context,
                squareWidth = this.squareWidth;
            if (status > 0 && status < 9) {
                context.font = squareWidth * 0.8 + 'px bold sans-serif';
                context.fillStyle = this.flagColor[status]
                context.fillText(status, (x + 5 / 6) * squareWidth, (y + 4 / 3) * squareWidth);
            } else if (status == 0) {
                context.fillStyle = "#666";
                context.fillRect((x + 0.5) * squareWidth, (y + 0.5) * squareWidth, squareWidth, squareWidth);
                context.fillStyle = "#999";
                context.strokeRect((x + 0.5) * squareWidth, (y + 0.5) * squareWidth, squareWidth, squareWidth);
            } else if (status >= 9) {
                this._drawPic(status, x, y);
            }
        }
    },
    /**
     * [drawPic 画图片]
     * @param  {[type]} status [图片名称]
     * @param  {[type]} x      [横坐标]
     * @param  {[type]} y      [纵坐标]
     * @return {[type]}        [description]
     */
    _drawPic: function(status, x, y) {
        var context = this.context,
            squareWidth = this.squareWidth;
        var img = this.flagColor[status];
        context.drawImage(img, (x + 0.5) * squareWidth, (y + 0.5) * squareWidth, squareWidth, squareWidth);
    },
    /**
     * [randomPoint 生成随机数坐标]
     * @return {[object]} [{x:横坐标,y:纵坐标}]
     */
    randomPoint: function() {
        var rx = parseInt(Math.random() * this.M),
            ry = parseInt(Math.random() * this.N);
        return {
            x: rx,
            y: ry
        }
    },
    /**
     * [createMap 创建地图数组]
     * @param  {[type]} x [初始横坐标]
     * @param  {[type]} y [初始纵坐标]
     * @return {[array]}   [坐标有雷值为1，无雷值为0，初始坐标和周围点无雷]
     */
    createMap: function(x, y) {
        var arr = [];
        for (var i = 0; i < this.M; i++) {
            arr[i] = [];
            for (var j = 0; j < this.N; j++) {
                arr[i][j] = 0
            }
        }
        for (var i = 0; i < this.num;) {
            var location = this.randomPoint();
            if (((x < location.x - 1 || x > location.x + 1) || (y < location.y - 1 || y > location.y + 1)) && arr[location.x][location.y] == 0) {
                arr[location.x][location.y] = 1;
                i++
            }
        }
        this.map = arr;
        this.realMap = this.getMapValue();
    },
    /**
     * [getMapValue 根据地图计算坐标值是什么，
     * 如(x,y)=5代表该坐标附近有5个雷，(x,y)=99代表该位置为雷]
     * @return {[array]} [地图显示数组]
     */
    getMapValue: function() {
        var arr = []
        for (var i = 0; i < this.M; i++) {
            arr[i] = [];
            for (var j = 0; j < this.N; j++) {
                if (this.map[i][j] == 0) {
                    arr[i][j] = this.getMineNum(i, j);
                } else {
                    arr[i][j] = 99
                }
            }
        }
        return arr;
    },
    /**
     * [getMineNum 获取坐标点有几个雷]
     * @param  {[type]} x [横坐标]
     * @param  {[type]} y [纵坐标]
     * @return {[int]}   [值为0-8]
     */
    getMineNum: function(x, y) {
        var num = 0;
        var aroundPoints = this.getAroundPointLocations(x, y);
        for (var i = 0; i < aroundPoints.length; i++) {
            if (this.map[aroundPoints[i].x][aroundPoints[i].y] == 1) {
                num++
            }
        }
        return num;
    },
    /**
     * [_isInBoundary 鉴定这个点是不是在board内部]
     * @param  {[type]} x [横坐标]
     * @param  {[type]} y [纵坐标]
     * @return {[num]}   [0：不在内部；1：在内部]
     */
    _isInBoundary: function(x, y) {
        if (x > -1 && x < this.M && y > -1 && y < this.N) return 1;
        else return 0;
    },
    /**
     * [getAroundPointLocations 获取周围坐标数组]
     * @param  {[type]} x [横坐标]
     * @param  {[type]} y [纵坐标]
     * @return {[array]}   [周围点的坐标数组]
     */
    getAroundPointLocations: function(x, y) {
        var arr = []
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if ((i != 0 || j != 0) && this._isInBoundary(x + i, y + j) == 1) {
                    arr.push({
                        x: x + i,
                        y: y + j
                    })
                }
            }
        }
        return arr;
    },
    /**
     * [isNeighbour 判断两个格点是否相邻]
     * @param  {[type]}  x  [p1横坐标]
     * @param  {[type]}  y  [p1纵坐标]
     * @param  {[type]}  x1 [p2横坐标]
     * @param  {[type]}  y1 [p2纵坐标]
     * @return {int}    [对角返回2，相邻返回1，否则为0]
     */
    isNeighbour: function(x, y, x1, y1) {
        var distance;
        distance = (x1 - x) * (x1 - x) + (y1 - y) * (y1 - y);
        if (distance == 2) return 2;
        if (distance == 1) return 1;
        else return 0;
    },
    /**
     * [expandMap 展开地图,开采]
     * @param {[type]} x [横坐标]
     * @param {[type]} y [纵坐标]
     */
    expandMap: function(x, y) {
        if (this.map[x][y] == 1) { //触雷
            this.isTouchMine = 1;
            this.drawFlag(99, x, y);
            this.endOperate();
            return;
        }
        this.unknownPointsNum--;
        this.currentMap[x][y] = this.realMap[x][y];
        this.drawFlag(this.currentMap[x][y], x, y);
        this.addExpandNum(x, y);
        // if (this.realMap[x][y] > 0 && this.realMap[x][y] < 9) {

        // } else 
        if (this.realMap[x][y] == 0) {
            // this.currentMap[x][y] = this.realMap[x][y];
            // this.drawFlag(this.currentMap[x][y], x, y);
            var thisAroundPoints = this.getAroundPointLocations(x, y);
            for (var i = 0; i < thisAroundPoints.length; i++) {
                var px = thisAroundPoints[i].x,
                    py = thisAroundPoints[i].y;
                if (this.currentMap[px][py] == 99) {
                    this.expandMap(px, py);
                    // this.drawFlag(this.currentMap[px][py], px, py)
                }
            }
        }
    },
    /**
     * [addExpandNum 坐标周围已知点数量+1]
     * @param {[type]} x [description]
     * @param {[type]} y [description]
     */
    addExpandNum: function(x, y) {
        var arr = this.getAroundPointLocations(x, y);
        for (var i = 0; i < arr.length; i++) {
            var px = arr[i].x,
                py = arr[i].y;
            this.hasExpandMap[px][py]++;
        }
    },
    /**
     * [addSetFlagNum 坐标周围已知雷数+1]
     * @param {[type]} x [description]
     * @param {[type]} y [description]
     */
    addSetFlagNum: function(x, y) {
        var arr = this.getAroundPointLocations(x, y);
        for (var i = 0; i < arr.length; i++) {
            var px = arr[i].x,
                py = arr[i].y;
            this.hasSetFlagMap[px][py]++;
        }
    },
    /**
     * [getArroundUnknowPointsNum 获取坐标周围未知数量]
     * @param  {[type]} x [description]
     * @param  {[type]} y [description]
     * @return {[type]}   [description]
     */
    getArroundUnknowPointsNum: function(x, y) {
        var arr = this.getAroundPointLocations(x, y);
        var num = 0;
        for (var i = 0; i < arr.length; i++) {
            var px = arr[i].x,
                py = arr[i].y
            if (this.currentMap[px][py] == 99) {
                num++;
            }
        }
        return num;
    },
    /**
     * [mark 标旗]
     * @param  {[type]} x [description]
     * @param  {[type]} y [description]
     * @return {[type]}   [description]
     */
    mark: function(x, y) {
        this.currentMap[x][y] = 100;
        this.unknownMinesNum--;
        this.unknownPointsNum--;
        this.drawFlag(100, x, y);
        this.addExpandNum(x, y);
        this.addSetFlagNum(x, y);
    },
    /**
     * [logic 2点的逻辑判断]
     * @param  {[type]} x  [description]
     * @param  {[type]} y  [description]
     * @param  {[type]} x1 [description]
     * @param  {[type]} y1 [description]
     * @return {[type]}    [description]
     */
    logic: function(x, y, x1, y1) {
        var commonMine = 0,
            commonUnknown = 0,
            pUnknown = 0,
            qUnknown = 0,
            pMine = 0,
            qMine = 0,
            pRestMine = 0,
            qRestMine = 0,
            commonLocations = this.common[x][y][x1 - x + 2][y1 - y + 2],
            count = 0;
        for (var i = 0; i < commonLocations.length; i++) {
            var px = commonLocations[i].x,
                py = commonLocations[i].y;
            if (this.currentMap[px][py] == 100) {
                commonMine++;
            }
            if (this.currentMap[px][py] == 99) {
                commonUnknown++
            }
        }
        pUnknown = this.getArroundUnknowPointsNum(x, y) - commonUnknown;
        qUnknown = this.getArroundUnknowPointsNum(x1, y1) - commonUnknown;
        pMine = this.hasSetFlagMap[x][y] - commonMine;
        qMine = this.hasSetFlagMap[x1][y1] - commonMine;
        pRestMine = this.currentMap[x][y] - this.hasSetFlagMap[x][y];
        qRestMine = this.currentMap[x1][y1] - this.hasSetFlagMap[x1][y1];
        if (pUnknown + qUnknown == 0) return;
        if (this.currentMap[x][y] - pMine == this.currentMap[x1][y1] - qMine) {
            if (pUnknown == 0) {
                this._handle(x1, y1, x, y, 1);
                count++;
            }
            if (qUnknown == 0) {
                this._handle(x, y, x1, y1, 1);
                count++;
            }
        }
        if (this.currentMap[x][y] - pUnknown - pMine == this.currentMap[x1][y1] - qUnknown - qMine) {
            if (pUnknown == 0) {
                this._handle(x1, y1, x, y, 2);
                count++;
            }
            if (qUnknown == 0) {
                this._handle(x, y, x1, y1, 2);
                count++;
            }
        }
        if (pRestMine - qRestMine == pUnknown) {
            this._handle(x1, y1, x, y, 1);
            this._handle(x, y, x1, y1, 2);
            count++;
        }
        if (qRestMine - pRestMine == qUnknown) {
            this._handle(x1, y1, x, y, 2);
            this._handle(x, y, x1, y1, 1);
            count++;
        }
        return count;
    },
    /**
     * [_handle 判断2点结果后的操作]
     * @param  {[type]} x    [description]
     * @param  {[type]} y    [description]
     * @param  {[type]} x1   [description]
     * @param  {[type]} y1   [description]
     * @param  {[type]} flag [description]
     * @return {[type]}      [description]
     */
    _handle: function(x, y, x1, y1, flag) {
        var arr = this.getAroundPointLocations(x, y);
        for (var i = 0; i < arr.length; i++) {
            var px = arr[i].x,
                py = arr[i].y;
            if (this.isNeighbour(px, py, x1, y1) == 0 && this.currentMap[px][py] == 99) {
                if (flag == 1) {
                    this.expandMap(px, py)
                }
                if (flag == 2) {
                    this.mark(px, py);
                }
            }
        }
    },
    /**
     * [getUnknownPoints 获取全地图未知点]
     * @return {[type]} [description]
     */
    getUnknownPoints: function() {
        var arr = [];
        for (var i = 0; i < this.M; i++) {
            for (var j = 0; j < this.N; j++) {
                if (this.currentMap[i][j] == 99) {
                    arr.push({
                        x: i,
                        y: j
                    });
                }
            }
        }
        return arr;
    },
    /**
     * [setGuessPoint 猜测函数]
     */
    setGuessPoint: function() {
        var unknownMinesNum = this.unknownMinesNum,
            totalUnknowPointsNum = this.unknownPointsNum;
        var restPoints = this.getUnknownPoints(); //获取未知点坐标
        if (unknownMinesNum == 0) { //已标记所有雷
            for (var i = 0; i < restPoints.length; i++) {
                this.expandMap(restPoints[i].x, restPoints[i].y);
            }
            this.condiction[0]++;
        } else if (unknownMinesNum == totalUnknowPointsNum) { //全是雷
            for (var i = 0; i < restPoints.length; i++) {
                this.mark(restPoints[i].x, restPoints[i].y);
            }
            this.condiction[0]++;
        } else {
            // 以下操作均有可能触雷
            var density = unknownMinesNum / totalUnknowPointsNum; //当前雷的密度
            var guessMine = this._getGuessMine(restPoints); //猜测数组
            var totalHasDensity = 0; //计算未知点概率和
            for (var i = 0; i < restPoints.length; i++) {
                var px = restPoints[i].x,
                    py = restPoints[i].y;
                totalHasDensity += guessMine[px][py];
            }
            var data = this._classifyRestMine(restPoints, guessMine, totalHasDensity)
            if (data.isOperate) {
                // console.log('c3,c4');
                this.condiction[1]++;
                return;
            }
            var hasGuessMine = data.hasGuessMine, //已猜坐标及概率
                notHasGuessMine = data.notHasGuessMine; //未猜坐标
            var hasGuess = hasGuessMine.length;
            if (notHasGuessMine.length == 0) {
                this._allPointHasGuessOperate(hasGuessMine, totalHasDensity);
                // console.log('c5,c6,c7');
                this.condiction[2]++;
                return;
            }
            // console.log('c8,c9');
            this.condiction[3]++;
            var count = 0
            var notHasGuessMineAvage = (unknownMinesNum - totalHasDensity) / notHasGuessMine.length;
            if (notHasGuessMineAvage > 0 && notHasGuessMineAvage < density) {
                // 未猜测点平均概率<总平均概率
                var _r = parseInt(Math.random() * notHasGuessMine.length);
                // console.log(notHasGuessMine[_r]);
                this.expandMap(notHasGuessMine[_r].x, notHasGuessMine[_r].y);
                count++;
                // return;
            } else {
                var min = density;
                var min_x = -1,
                    min_y = -1;
                for (var i = 0; i < hasGuessMine.length; i++) {
                    if (hasGuessMine[i].guessPossible <= min) { //猜测概率<平均概率
                        min = hasGuessMine[i].guessPossible;
                        min_x = hasGuessMine[i].x;
                        min_y = hasGuessMine[i].y;
                        break;
                    }
                }
                if (min_x > -1 && min_y > -1) {
                    this.expandMap(min_x, min_y);
                    count++;
                }
            }
            if (count == 0) {
                var _r = parseInt(Math.random() * restPoints.length);
                this.expandMap(restPoints[_r].x, restPoints[_r].y);
            }
        }
    },
    /**
     * [_initSecondArray 初始化二维数组值]
     * @param  {[type]} num [初始值]
     * @return {[array]}     [二维数组]
     */
    _initSecondArray: function(num) {
        var arr = [];
        for (var i = 0; i < this.M; i++) {
            arr[i] = [];
            for (var j = 0; j < this.N; j++) {
                arr[i][j] = num;
            }
        }
        return arr;
    },
    _getCommon: function() {
        var k;
        var p, q;
        var common = [];
        for (var i = 0; i < this.M; i++) {
            common[i] = []
            for (var j = 0; j < this.N; j++) {
                common[i][j] = []
                for (var i1 = 0; i1 < 5; i1++) {
                    common[i][j][i1] = []
                    for (var j1 = 0; j1 < 5; j1++) {
                        common[i][j][i1][j1] = []
                        if (this._isInBoundary(i + i1 - 2, j + j1 - 2) == 0) continue; //如果要比较的格点出界，直接跳过
                        k = 0;
                        for (p = i - 1; p <= i + 1; p++) {
                            for (q = j - 1; q <= j + 1; q++) {
                                if (this._isInBoundary(p, q) == 0) continue; //如果周边的格点有出界的，直接跳过
                                if (p == i && q == j) continue; //中心的格点自然跳过
                                if (this.isNeighbour(p, q, i + i1 - 2, j + j1 - 2) != 0) {
                                    common[i][j][i1][j1][k] = { x: p, y: q };
                                    k++;
                                }
                            }
                        }
                    }
                }
            }
        }
        return common;
    },
    /**
     * [_getGuessMine 获取可猜测概率值]
     * @param  {[type]} arr [description]
     * @return {[type]}     [description]
     */
    _getGuessMine: function(arr) {
        var guessMine = this._initSecondArray(0);
        for (var i = 0; i < arr.length; i++) {
            var px = arr[i].x,
                py = arr[i].y;
            var pArround = this.getAroundPointLocations(px, py); //获取未知点周围坐标
            for (var j = 0; j < pArround.length; j++) {
                if (this.currentMap[pArround[j].x][pArround[j].y] < 9) {
                    var pArroundUnknown = this.getArroundUnknowPointsNum(pArround[j].x, pArround[j].y); //获取未知坐标总数
                    var pRestMine = this.currentMap[pArround[j].x][pArround[j].y] - this.hasSetFlagMap[pArround[j].x][pArround[j].y]; //未知雷总数
                    var thisPointDensity = pRestMine / pArroundUnknown; //有雷概率
                    if (thisPointDensity > guessMine[px][py]) {
                        guessMine[px][py] = thisPointDensity;
                    }
                }

            }
        }
        return guessMine;
    },
    /**
     * [_classifyRestMine 未知点的分类]
     * @param  {[type]} arr             [description]
     * @param  {[type]} guessMine       [description]
     * @param  {[type]} totalHasDensity [description]
     * @return {[type]}                 [description]
     */
    _classifyRestMine: function(arr, guessMine, totalHasDensity) {
        var unknownMinesNum = this.unknownMinesNum,
            totalUnknowPointsNum = this.unknownPointsNum;
        var data = {
            hasGuessMine: [],
            notHasGuessMine: []
        };
        for (var i = 0; i < arr.length; i++) {
            var px = arr[i].x,
                py = arr[i].y;
            if (this.currentMap[px][py] == 99) {
                if (guessMine[px][py] > 0) {
                    data.hasGuessMine.push({ x: px, y: py, guessPossible: guessMine[px][py] });
                } else {
                    data.notHasGuessMine.push({ x: px, y: py });
                }
            }
        }
        if (totalHasDensity >= unknownMinesNum && guessMine[px][py] == 0) {
            // 总概率大于总雷数可判定未开发点概率未计算的点为安全点
            for (var i = 0; i < data.notHasGuessMine.length; i++) {
                var px = data.notHasGuessMine[i].x,
                    py = data.notHasGuessMine[i].y;
                if (this.currentMap[px][py] == 99) {
                    this.expandMap(px, py);
                    data.isOperate = true;
                }
            }
        }
        if (unknownMinesNum - totalHasDensity >= data.notHasGuessMine.length) {
            // 总雷数-总概率大于剩余未猜测点数可判定未开发点概率未计算的点为有雷点
            for (var i = 0; i < data.notHasGuessMine.length; i++) {
                var px = data.notHasGuessMine[i].x,
                    py = data.notHasGuessMine[i].y;
                if (this.currentMap[px][py] == 99) {
                    this.mark(px, py);
                    data.isOperate = true;
                }
            }
        }
        return data;
    },
    /**
     * [_getGuessMineSum 该点可能性总和]
     * @param  {[type]} arr [description]
     * @return {[type]}     [description]
     */
    _getGuessMineSum: function(arr) {
        var guessMine = this._initSecondArray(0);
        for (var i = 0; i < arr.length; i++) {
            var px = arr[i].x,
                py = arr[i].y;
            var pArround = this.getAroundPointLocations(px, py); //获取未知点周围坐标
            for (var j = 0; j < pArround.length; j++) {
                if (this.currentMap[pArround[j].x][pArround[j].y] < 9) {
                    var pArroundUnknown = this.getArroundUnknowPointsNum(pArround[j].x, pArround[j].y); //获取未知坐标总数
                    var pRestMine = this.currentMap[pArround[j].x][pArround[j].y] - this.hasSetFlagMap[pArround[j].x][pArround[j].y]; //未知雷总数
                    var thisPointDensity = pRestMine / pArroundUnknown; //有雷概率
                    guessMine[px][py] += thisPointDensity;
                }
            }
        }
        return guessMine;
    },
    /**
     * [_allPointHasGuessOperate 所有点都计算了概率的操作]
     * @param  {Boolean} hasGuessMine    [description]
     * @param  {[type]}  totalHasDensity [description]
     * @return {[type]}                  [description]
     */
    _allPointHasGuessOperate: function(hasGuessMine, totalHasDensity) {
        var unknownMinesNum = this.unknownMinesNum,
            totalUnknowPointsNum = this.unknownPointsNum;
        var guessSum = this._getGuessMineSum(hasGuessMine);
        if (totalHasDensity > unknownMinesNum) {
            var max = 0;
            var max_x = -1,
                max_y = -1;
            for (var i = 0; i < hasGuessMine.length; i++) {
                if (guessSum[hasGuessMine[i].x][hasGuessMine[i].y] > max) {
                    max = guessSum[hasGuessMine[i].x][hasGuessMine[i].y];
                    max_x = hasGuessMine[i].x;
                    max_y = hasGuessMine[i].y
                }
            }
            this.mark(max_x, max_y);
        } else if (totalHasDensity < unknownMinesNum) {
            var min = 1000;
            var max_x = -1,
                max_y = -1;
            for (var i = 0; i < hasGuessMine.length; i++) {
                if (guessSum[hasGuessMine[i].x][hasGuessMine[i].y] < min) {
                    min = guessSum[hasGuessMine[i].x][hasGuessMine[i].y];
                    min_x = hasGuessMine[i].x;
                    min_y = hasGuessMine[i].y
                }
            }
            this.expandMap(min_x, min_y);
        } else {
            var _r = parseInt(Math.random() * hasGuessMine.length);
            this.expandMap(hasGuessMine[_r].x, hasGuessMine[_r].y);
        }
    },
    /**
     * [autoNext 自动操作]
     * @return {[type]} [description]
     */
    autoNextOneStep: function() {
        if (this.isEnd) {
            return;
        }
        var count = 0;
        for (var i = 0; i < this.M; i++) {
            for (var j = 0; j < this.N; j++) {
                if (this.currentMap[i][j] == 0) continue;
                var arr = this.getAroundPointLocations(i, j);
                var len = arr.length;
                var px, py;
                if (this.hasExpandMap[i][j] >= len) continue;
                if (this.currentMap[i][j] + this.hasExpandMap[i][j] - this.hasSetFlagMap[i][j] == len) {
                    for (var i1 = 0; i1 < len; i1++) {
                        px = arr[i1].x, py = arr[i1].y;
                        if (this.currentMap[px][py] == 99) {
                            this.mark(px, py);
                            count++;
                        }
                    }
                }
                if (this.hasSetFlagMap[i][j] == this.currentMap[i][j]) {
                    for (var i1 = 0; i1 < len; i1++) {
                        px = arr[i1].x, py = arr[i1].y;
                        if (this.currentMap[px][py] == 99) {
                            this.expandMap(px, py);
                            count++;
                        }
                    }
                }
                for (var i1 = i; i1 < i + 3; i1++) {
                    for (var j1 = j - 2; j1 < j + 3; j1++) {
                        if (this._isInBoundary(i1, j1) != 0) {
                            if (this.currentMap[i1][j1] > 7 || this.currentMap[i1][j1] == 0) continue;
                            var getLogic = this.logic(i, j, i1, j1) || 0;
                            count += getLogic;
                        }
                    }
                }
            }
        }
        // console.log(count);
        if (count == 0) {
            this.setGuessPoint();
        }
        if (this.unknownPointsNum == 0) {
            this.endOperate();
        }
        // console.log("未知雷："+);
    },
    endOperate: function() {
        this.progress = (this.totalNum - this.unknownPointsNum) / this.totalNum;
        if (this.progress >= 0.8) {
            this.alreadySuccess = 1;
        }
        if (this.progress == 1) {
            this.success = 1;
        }
        this.isEnd = true;
        // console.log('完成率：' + this.progress * 100 + '%');
    },
    reset: function(M, N, num, isDraw) {
        this.M = M; //宽度
        this.N = N; //高度
        this.num = num; //雷数
        this.totalNum = M * N; //总格数
        this.unknownMinesNum = num; //未排雷数
        this.unknownPointsNum = M * N; //未填格数
        this.map = []; //地图，0：安全;1：雷
        this.realMap = []; //真实地图，99：雷
        this.currentMap = []; //当前进度
        this.common = []; //2点公共区域
        this.isTouchMine = 0; //触雷判定
        this.squareWidth = 30; //格子宽度
        this.hasExpandMap = []; //坐标点周围已解决的点数
        this.hasSetFlagMap = []; //坐标点周围已放置旗子的点数
        this.progress = 0;
        this.alreadySuccess = 0;
        this.success = 0;
        this.isEnd = false;
        this.condiction = [0, 0, 0, 0];
        this.isDraw = isDraw;
        this.init();
    }
}
