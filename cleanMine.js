var cleanMineBoard = document.getElementById('cleanMine-board');

// 定义宽高格子个数
var boardWidth = 30,
    boardHeight = 16;
// 定义格子边长
var squareWidth = 30;
// 定义雷的个数
var mineNum = 99;
// 定义数字颜色
var numCorlor = {
    "1": '#0805dc',
    "2": '#16710a',
    "3": '#de1b2c',
    "4": '#01067e',
    "5": '#770004',
    "6": '#0b7271',
    "7": '#000',
    "8": '#999',
    "100": './img/flag.jpg',
    "99": './img/mine.jpg'
}

// 定义地图数组（二维）坐标值为0为安全区域，坐标值为1为雷
var map = [];
// 定义显示地图,(x,y)周围雷数
var showMapArray = [];
// 当前开采地图,99为未开采,玩家能看到的画面,100为以标记地雷
var exploreMap = initArray(99);
// 坐标(x,y)已开采个数
var hasExploreNum = initArray(0);
// 坐标周围已设旗子个数
var hasSetFlagNum = initArray(0);

// 总共的未开采地图坐标点数数量
var totalUnknowPointsNum = boardWidth * boardHeight;
// 触雷判定
var isTouchMine = 0;
// 未知地雷
var unknownMinesNum = mineNum;
//计算两个板块的共同部分，注意：这里编号代表相邻程度。从0到23，分别从左到右，从上到下。
// common为5维数组[boardWidth][boardHeight][5][5][4]
var common = function() {
    var k;
    var p, q;
    var common = [];
    for (var i = 0; i < boardWidth; i++) {
        common[i] = []
        for (var j = 0; j < boardHeight; j++) {
            common[i][j] = []
            for (var i1 = 0; i1 < 5; i1++) {
                common[i][j][i1] = []
                for (var j1 = 0; j1 < 5; j1++) {
                    common[i][j][i1][j1] = []
                    if (boundary(i + i1 - 2, j + j1 - 2) == 0) continue; //如果要比较的格点出界，直接跳过
                    k = 0;
                    for (p = i - 1; p <= i + 1; p++) {
                        for (q = j - 1; q <= j + 1; q++) {
                            if (boundary(p, q) == 0) continue; //如果周边的格点有出界的，直接跳过
                            if (p == i && q == j) continue; //中心的格点自然跳过
                            if (isNeighbour(p, q, i + i1 - 2, j + j1 - 2) != 0) {
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
}();
//周围的地雷不知道的个数,未知地图
var unknownMinesArray = initArray(8);
//密度操作
var densityArray = initArray(0);

var context = cleanMineBoard.getContext('2d');

/**
 * [drawBoard 画格子]
 * @param  {[type]} x [宽度格子数]
 * @param  {[type]} y [高度格子数]
 * @return {[type]}   [description]
 */
function drawBoard(x, y) {
    cleanMineBoard.width = squareWidth * (x + 1);
    cleanMineBoard.height = squareWidth * (y + 1);
    context.strokeStyle = "#000";
    // 画横线
    for (var i = 0; i < x + 1; i++) {
        context.moveTo(squareWidth * (i + 0.5), squareWidth / 2);
        context.lineTo(squareWidth * (i + 0.5), squareWidth * (y + 0.5));
        context.stroke();
    }
    // 画竖线
    for (i = 0; i < y + 1; i++) {
        context.moveTo(squareWidth / 2, squareWidth * (i + 0.5));
        context.lineTo(squareWidth * (x + 0.5), squareWidth * (i + 0.5));
        context.stroke();
    }
}

/**
 * [drawFlag 画数字、旗子、雷]
 * @param  {[type]} status [数字、旗子、雷的值]
 * @param  {[type]} x      [横坐标]
 * @param  {[type]} y      [纵坐标]
 * @return {[type]}        [description]
 */
function drawFlag(status, x, y) {
    if (status > 0 && status < 9) {
        context.font = squareWidth * 0.8 + 'px bold sans-serif';
        context.fillStyle = numCorlor[status]
        context.fillText(status, x * squareWidth + 25, y * squareWidth + 40);
    } else if (status == 0) {
        context.fillStyle = "#666";
        context.fillRect((x + 0.5) * squareWidth, (y + 0.5) * squareWidth, squareWidth, squareWidth);
        context.fillStyle = "#999";
        context.strokeRect((x + 0.5) * squareWidth, (y + 0.5) * squareWidth, squareWidth, squareWidth);
    } else if (status >= 9) {
        drawPic(status, x, y);
    }
}
/**
 * [drawPic 画图片]
 * @param  {[type]} status [图片名称]
 * @param  {[type]} x      [横坐标]
 * @param  {[type]} y      [纵坐标]
 * @return {[type]}        [description]
 */
function drawPic(status, x, y) {
    var img = new Image();
    img.src = numCorlor[status];
    img.onload = function() {
        context.drawImage(img, (x + 0.5) * squareWidth, (y + 0.5) * squareWidth, squareWidth, squareWidth);
    };
}
/**
 * [random 生成随机数坐标]
 * @return {[object]} [{x:横坐标,y:纵坐标}]
 */
function random() {
    var rx = parseInt(Math.random() * boardWidth),
        ry = parseInt(Math.random() * boardHeight);
    return {
        x: rx,
        y: ry
    }
}

/**
 * [initArray 初始化二维数组值]
 * @param  {[type]} num [初始值]
 * @return {[array]}     [二维数组]
 */
function initArray(num) {
    var arr = [];
    for (var i = 0; i < boardWidth; i++) {
        arr[i] = [];
        for (var j = 0; j < boardHeight; j++) {
            arr[i][j] = num
        }
    }
    return arr;
}
/**
 * [createMapArray 创建地图数组]
 * @param  {[type]} x [初始横坐标]
 * @param  {[type]} y [初始纵坐标]
 * @return {[array]}   [坐标有雷值为1，无雷值为0，初始坐标和周围点无雷]
 */
function createMapArray(x, y) {
    var arr = [];
    for (var i = 0; i < boardWidth; i++) {
        arr[i] = [];
        for (var j = 0; j < boardHeight; j++) {
            arr[i][j] = 0
        }
    }
    for (var i = 0; i < mineNum;) {
        var location = random();
        if (((x < location.x - 1 || x > location.x + 1) || (y < location.y - 1 || y > location.y + 1)) && arr[location.x][location.y] == 0) {
            arr[location.x][location.y] = 1;
            i++
        }
    }
    return arr;
}

/**
 * [getMapValue 根据地图计算坐标值是什么，
 * 如(x,y)=5代表该坐标附近有5个雷，(x,y)=99代表该位置为雷]
 * @return {[array]} [地图显示数组]
 */
function getMapValue() {
    var arr = []
    for (var i = 0; i < boardWidth; i++) {
        arr[i] = [];
        for (var j = 0; j < boardHeight; j++) {
            if (map[i][j] == 0) {
                arr[i][j] = getMineNum(i, j);
            } else {
                arr[i][j] = 9
            }
        }
    }
    return arr;
}
/**
 * [getMineNum 获取坐标点有几个雷]
 * @param  {[type]} x [横坐标]
 * @param  {[type]} y [纵坐标]
 * @return {[int]}   [值为0-8]
 */
function getMineNum(x, y) {
    var num = 0;
    var aroundPoints = getAroundPointLocations(x, y);
    for (var i = 0; i < aroundPoints.length; i++) {
        if (map[aroundPoints[i].x][aroundPoints[i].y] == 1) {
            num++
        }
    }
    return num;
}

/**
 * [boundary 鉴定这个点是不是在board内部]
 * @param  {[type]} x [横坐标]
 * @param  {[type]} y [纵坐标]
 * @return {[num]}   [0：不在内部；1：在内部]
 */
function boundary(x, y) {
    if (x > -1 && x < boardWidth && y > -1 && y < boardHeight) return 1;
    else return 0;
}
/**
 * [getAroundPointLocations 获取周围坐标数组]
 * @param  {[type]} x [横坐标]
 * @param  {[type]} y [纵坐标]
 * @return {[array]}   [周围点的坐标数组]
 */
function getAroundPointLocations(x, y) {
    var arr = []
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            if ((i != 0 || j != 0) && boundary(x + i, y + j) == 1) {
                arr.push({
                    x: x + i,
                    y: y + j
                })
            }
        }
    }
    return arr;
}
/**
 * [isNeighbour 判断两个格点是否相邻]
 * @param  {[type]}  x  [p1横坐标]
 * @param  {[type]}  y  [p1纵坐标]
 * @param  {[type]}  x1 [p2横坐标]
 * @param  {[type]}  y1 [p2纵坐标]
 * @return {int}    [对角返回2，相邻返回1，否则为0]
 */
function isNeighbour(x, y, x1, y1) {
    var distance;
    distance = (x1 - x) * (x1 - x) + (y1 - y) * (y1 - y);
    if (distance == 2) return 2;
    if (distance == 1) return 1;
    else return 0;
}

/**
 * [setExploreMap 展开地图,开采]
 * @param {[type]} x [横坐标]
 * @param {[type]} y [纵坐标]
 */
function setExploreMap(x, y) {
    if (map[x][y] == 1) { //触雷
        isTouchMine = 1;
        console.log(x, y);
        return;
    }
    totalUnknowPointsNum--;
    if (showMapArray[x][y] > 0 && showMapArray[x][y] < 9) {
        exploreMap[x][y] = showMapArray[x][y];
        drawFlag(exploreMap[x][y], x, y);
        setHasExploreNum(x, y);
    } else if (showMapArray[x][y] == 0) {
        exploreMap[x][y] = showMapArray[x][y];
        drawFlag(exploreMap[x][y], x, y);
        setHasExploreNum(x, y);
        var thisAroundPoints = getAroundPointLocations(x, y);
        for (var i = 0; i < thisAroundPoints.length; i++) {
            var px = thisAroundPoints[i].x,
                py = thisAroundPoints[i].y;
            if (exploreMap[px][py] == 99) {
                setExploreMap(px, py);
                drawFlag(exploreMap[px][py], px, py)
            }
        }
    }
}
/**
 * [setHasExploreNum 坐标周围已知值+1]
 * @param {[type]} x [description]
 * @param {[type]} y [description]
 */
function setHasExploreNum(x, y) {
    var arr = getAroundPointLocations(x, y);
    for (var i = 0; i < arr.length; i++) {
        var px = arr[i].x,
            py = arr[i].y;
        if (hasExploreNum[px][py] < arr.length);
        hasExploreNum[px][py]++;
    }
}
/**
 * [setHasFlagNum 坐标周围已标记+1]
 * @param {[type]} x [description]
 * @param {[type]} y [description]
 */
function setHasFlagNum(x, y) {
    var arr = getAroundPointLocations(x, y);
    for (var i = 0; i < arr.length; i++) {
        var px = arr[i].x,
            py = arr[i].y;
        if (hasSetFlagNum[px][py] < arr.length);
        hasSetFlagNum[px][py]++;
    }
}
/**
 * [mark 标旗]
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @return {[type]}   [description]
 */
function mark(x, y) {
    exploreMap[x][y] = 100;
    unknownMinesNum--;
    totalUnknowPointsNum--;
    drawFlag(100, x, y);
    setHasExploreNum(x, y);
    setHasFlagNum(x, y);
}
var isFirstClick = true;
cleanMineBoard.addEventListener('click', function(e) {
    // isClick = true;
    var x = Math.floor(e.offsetX / squareWidth - 0.5),
        y = Math.floor(e.offsetY / squareWidth - 0.5);
    if (isFirstClick) {
        map = createMapArray(x, y);
        showMapArray = getMapValue();
        isFirstClick = false;
        setExploreMap(x, y);
    } else if (unknownMinesNum == 0 && totalUnknowPointsNum == 0) {
        console.log('clean mine success!');
    } else if (isTouchMine == 0) {
        autoNext();
    }

    // drawShowMapArray(exploreMap);
})

drawBoard(boardWidth, boardHeight);

/**
 * [autoNext 自动操作]
 * @return {[type]} [description]
 */
function autoNext() {
    var count = 0;
    for (var i = 0; i < boardWidth; i++) {
        for (var j = 0; j < boardHeight; j++) {
            if (exploreMap[i][j] == 0) continue;
            var arr = getAroundPointLocations(i, j);
            var len = arr.length;
            var px, py;
            if (hasExploreNum[i][j] >= len) continue;
            if (exploreMap[i][j] + hasExploreNum[i][j] - hasSetFlagNum[i][j] == len) {
                for (var i1 = 0; i1 < len; i1++) {
                    px = arr[i1].x, py = arr[i1].y;
                    if (exploreMap[px][py] == 99) {
                        mark(px, py);
                        count++;
                    }
                }
            }
            if (hasSetFlagNum[i][j] == exploreMap[i][j]) {
                for (var i1 = 0; i1 < len; i1++) {
                    px = arr[i1].x, py = arr[i1].y;
                    if (exploreMap[px][py] == 99) {
                        setExploreMap(px, py);
                        count++;
                    }
                }
            }
            for (var i1 = i; i1 < i + 3; i1++) {
                for (var j1 = j - 2; j1 < j + 3; j1++) {
                    if (boundary(i1, j1) != 0) {
                        if (exploreMap[i1][j1] > 7 || exploreMap[i1][j1] == 0) continue;
                        var getLogic = logic(i, j, i1, j1) || 0;
                        count += getLogic;
                    }
                }
            }
        }
    }
    // console.log(count);
    if (count == 0) {
        setGuessPoint();
    }
    // console.log("未知雷："+);
}
/**
 * [getArroundUnknow 获取坐标周围未知数量]
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @return {[type]}   [description]
 */
function getArroundUnknow(x, y) {
    var arr = getAroundPointLocations(x, y);
    var num = 0;
    for (var i = 0; i < arr.length; i++) {
        var px = arr[i].x,
            py = arr[i].y
        if (exploreMap[px][py] == 99) {
            num++;
        }
    }
    return num;
}

function logic(x, y, x1, y1) {
    var commonMine = 0,
        commonUnknown = 0,
        pUnknown = 0,
        qUnknown = 0,
        pMine = 0,
        qMine = 0,
        pRestMine = 0,
        qRestMine = 0,
        commonLocations = common[x][y][x1 - x + 2][y1 - y + 2],
        count = 0;
    for (var i = 0; i < commonLocations.length; i++) {
        var px = commonLocations[i].x,
            py = commonLocations[i].y;
        if (exploreMap[px][py] == 100) {
            commonMine++;
        }
        if (exploreMap[px][py] == 99) {
            commonUnknown++
        }
    }
    pUnknown = getArroundUnknow(x, y) - commonUnknown;
    qUnknown = getArroundUnknow(x1, y1) - commonUnknown;
    pMine = hasSetFlagNum[x][y] - commonMine;
    qMine = hasSetFlagNum[x1][y1] - commonMine;
    pRestMine = exploreMap[x][y] - hasSetFlagNum[x][y];
    qRestMine = exploreMap[x1][y1] - hasSetFlagNum[x1][y1];
    if (pUnknown + qUnknown == 0) return;
    if (exploreMap[x][y] - pMine == exploreMap[x1][y1] - qMine) {
        if (pUnknown == 0) {
            handle(x1, y1, x, y, 1);
            count++;
        }
        if (qUnknown == 0) {
            handle(x, y, x1, y1, 1);
            count++;
        }
    }
    if (exploreMap[x][y] - pUnknown - pMine == exploreMap[x1][y1] - qUnknown - qMine) {
        if (pUnknown == 0) {
            handle(x1, y1, x, y, 2);
            count++;
        }
        if (qUnknown == 0) {
            handle(x, y, x1, y1, 2);
            count++;
        }
    }
    if (pRestMine - qRestMine == pUnknown) {
        handle(x1, y1, x, y, 1);
        handle(x, y, x1, y1, 2);
        count++;
    }
    if (qRestMine - pRestMine == qUnknown) {
        handle(x1, y1, x, y, 2);
        handle(x, y, x1, y1, 1);
        count++;
    }
    return count;
}

function handle(x, y, x1, y1, flag) {
    var arr = getAroundPointLocations(x, y);
    for (var i = 0; i < arr.length; i++) {
        var px = arr[i].x,
            py = arr[i].y;
        if (isNeighbour(px, py, x1, y1) == 0 && exploreMap[px][py] == 99) {
            if (flag == 1) {
                setExploreMap(px, py)
            }
            if (flag == 2) {
                mark(px, py);
            }
        }
    }
}

function getUnknownPoints() {
    var arr = [];
    for (var i = 0; i < boardWidth; i++) {
        for (var j = 0; j < boardHeight; j++) {
            if (exploreMap[i][j] == 99) {
                arr.push({
                    x: i,
                    y: j
                });
            }
        }
    }
    return arr;
}

function setGuessPoint() {
    var restPoints = getUnknownPoints(); //获取未知点坐标
    if (unknownMinesNum == 0) { //已标记所有雷
        for (var i = 0; i < restPoints.length; i++) {
            setExploreMap(restPoints[i].x, restPoints[i].y);
        }
    } else if (unknownMinesNum == totalUnknowPointsNum) { //全是雷
        for (var i = 0; i < restPoints.length; i++) {
            mark(restPoints[i].x, restPoints[i].y);
        }
    } else {
        var density = unknownMinesNum / totalUnknowPointsNum; //当前雷的密度
        var guessMine = initArray(0); //猜测数组
        console.log("未知雷：" + unknownMinesNum);
        console.log("未知区域：" + totalUnknowPointsNum);
        console.log('平均可能性：' + density);
        for (var i = 0; i < restPoints.length; i++) {
            var px = restPoints[i].x,
                py = restPoints[i].y;
            var pArround = getAroundPointLocations(px, py); //获取未知点周围坐标
            for (var j = 0; j < pArround.length; j++) {
                if (exploreMap[pArround[j].x][pArround[j].y] < 9) {
                    var pArroundUnknown = getArroundUnknow(pArround[j].x, pArround[j].y); //获取未知坐标总数
                    var pRestMine = exploreMap[pArround[j].x][pArround[j].y] - hasSetFlagNum[pArround[j].x][pArround[j].y]; //未知雷总数
                    var thisPointDensity = pRestMine / pArroundUnknown; //有雷概率
                    if (thisPointDensity > guessMine[px][py]) {
                        guessMine[px][py] = thisPointDensity;
                    }
                }

            }
        }
        var totalHasDensity = 0; //计算未知点概率和
        for (var i = 0; i < restPoints.length; i++) {
            var px = restPoints[i].x,
                py = restPoints[i].y;
            totalHasDensity += guessMine[px][py];
        }
        console.log('有雷点可能性总和：' + totalHasDensity);
        var hasGuess = 0;
        var hasGuessMine = [],
            notHasGuessMine = [];
        for (var i = 0; i < restPoints.length; i++) {
            var px = restPoints[i].x,
                py = restPoints[i].y;
            if (exploreMap[px][py] == 99 && totalHasDensity >= unknownMinesNum && guessMine[px][py] == 0) {
                // 总概率大于总雷数可判定未开发点概率未计算的点 为安全点
                setExploreMap(px, py);
                return;
            }
            if (guessMine[px][py] > 0) {
                hasGuess++;
                hasGuessMine.push({ x: px, y: py, guessPossible: guessMine[px][py] });
            } else {
                notHasGuessMine.push({ x: px, y: py });
            }
            if (exploreMap[px][py] == 99 && unknownMinesNum - totalHasDensity >= totalUnknowPointsNum - hasGuess && guessMine[px][py] == 0) {
                // 总雷数-总概率大于剩余未猜测点数可判定未开发点概率未计算的点为有雷点
                mark(px, py);
            }
        }
        console.log('猜测有雷可能个数：' + hasGuess);
        console.log(hasGuessMine);
        console.log(notHasGuessMine);
        var notHasGuessMineAvage = (unknownMinesNum - totalHasDensity) / (totalUnknowPointsNum - hasGuess);
        if (notHasGuessMineAvage > 0 && notHasGuessMineAvage < density) {
            // 未猜测点平均概率<总平均概率
            var _r = parseInt(Math.random() * notHasGuessMine.length);
            console.log(notHasGuessMine[_r]);
            setExploreMap(notHasGuessMine[_r].x, notHasGuessMine[_r].y);
            // return;
        } else {
            var min = density;
            var min_x=-1,min_y=-1;
            for (var i = 0; i < hasGuessMine.length; i++) {
                if (hasGuessMine[i].guessPossible < min) { //猜测概率<平均概率
                    min = hasGuessMine[i].guessPossible;
                    min_x = hasGuessMine[i].x;
                    min_y = hasGuessMine[i].y;                    
                    break;
                }
            }
            if(min_x>-1&&min_y>-1){
                setExploreMap(min_x, min_y);
            }
        }
    }
}
