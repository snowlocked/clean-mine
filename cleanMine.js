var cleanMineBoard = document.getElementById('cleanMine-board');

// 定义宽高格子个数
var boardWidth = 24,
    boardHeight = 20;
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
    "10": './img/flag.jpg',
    "9": './img/mine.jpg'
}

// 定义地图数组（二维）坐标值为0为安全区域，坐标值为1为雷
var map = [];
// 定义显示地图
var showMapArray = [];
// 当前开采地图,9为未开采,玩家能看到的画面,10为以标记地雷
var exploreMap = initArray(9);
// 总共的未开采地图坐标点数数量
var totalUnknowPointsNum = boardWidth * boardHeight;
// 触雷判定
var isTouchMine;
// 未知地雷
var unknownMinesNum = mineNum;
//计算两个板块的共同部分，注意：这里编号代表相邻程度。从0到23，分别从左到右，从上到下。
// common为5维数组[boardWidth][boardHeight][5][5][4]
var common = function() {
    var k;
    var p, q;
    var common = [];
    for (var i = 0; i < boardWidth; i++) {
        common[i] = [];
        for (var j = 0; j < boardHeight; j++) {
            common[i][j] = [];
            for (var i1 = 0; i1 < 5; i1++) {
                common[i][j][i1] = [];
                for (var j1 = 0; j1 < 5; j1++) {
                    common[i][j][i1][j1] = [];
                    for (var a = 0; a < 4; a++) {
                        common[i][j][i1][j1][a] = 0
                    }
                }
            }
        }
    }
    for (var i = 0; i < boardWidth; i++) {
        for (var j = 0; j < boardHeight; j++) {
            for (var i1 = 0; i1 < 5; i1++) {
                for (var j1 = 0; j1 < 5; j1++) {
                    if (boundary(i + i1 - 2, j + j1 - 2) == 0) continue; //如果要比较的格点出界，直接跳过
                    k = 0;
                    for (p = i - 1; p <= i + 1; p++) {
                        for (q = j - 1; q <= j + 1; q++) {
                            if (boundary(p, q) == 0) continue; //如果周边的格点有出界的，直接跳过
                            if (p == i && q == j) continue; //中心的格点自然跳过
                            if (isNeighbour(p, q, i + i1 - 2, j + j1 - 2) != 0) {
                                common[i][j][i1][j1][k] = p * boardHeight + q + 1;
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
// 怀疑有雷数组
var suspectMinesArray = initArray(0);

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
        context.fillText(status, x * squareWidth + 25, y * squareWidth + 38);
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
 * 如(x,y)=5代表该坐标附近有5个雷，(x,y)=9代表该位置为雷]
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
 * [drawShowMapArray 根据数组画出显示效果]
 * @param  {[type]} arr [二维数组]
 * @return {[type]}     [description]
 */
function drawShowMapArray(arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            drawFlag(arr[i][j], i, j)
        }
    }
}
/**
 * [setExploreMap 展开地图,开采]
 * @param {[type]} x [横坐标]
 * @param {[type]} y [纵坐标]
 */
function setExploreMap(x, y) {
    if (showMapArray[x][y] > 0) {
        exploreMap[x][y] = showMapArray[x][y];
    } else if (showMapArray[x][y] == 0) {
        exploreMap[x][y] = showMapArray[x][y];
        var thisAroundPoints = getAroundPointLocations(x, y);
        for (var i = 0; i < thisAroundPoints.length; i++) {
            if (exploreMap[thisAroundPoints[i].x][thisAroundPoints[i].y] == -1) {
                setExploreMap(thisAroundPoints[i].x, thisAroundPoints[i].y);
            }
        }
    }
}
var isClick = false
var isFirstClick = true;
cleanMineBoard.addEventListener('click', function(e) {
    // if (isClick) return;
    // isClick = true;
    var x = Math.floor(e.offsetX / squareWidth - 0.5),
        y = Math.floor(e.offsetY / squareWidth - 0.5);
    if (isFirstClick) {
        map = createMapArray(x, y);
        showMapArray = getMapValue();
        isFirstClick = false;
    }
    setExploreMap(x, y);
    drawShowMapArray(exploreMap);
})

drawBoard(boardWidth, boardHeight);

/**
 * [modUnknown 当该点被开采或被标记后，其周围的图块自减1]
 * @param  {[type]} x [横坐标]
 * @param  {[type]} y [纵坐标]
 * @return {[type]}   [description]
 */
function modUnknown(x, y) {
    var locations = getAroundPointLocations(x, y);
    for (var i = 0; i < locations.length; i++) {
        unknownMinesArray[locations[i].x][locations[i].y]--;
    }
}

//逻辑操作，本作品中的精华部分
function logic(x, y, x1, y1) {
    var commonUnknown, leftUnknown, rightUnknown;
    var commonMine, leftMine, rightMine;
    var commonGuess; //共同区域猜测的地雷数目
    var k, l, p, q, num;
    // click++;
    // logictimes++;
    commonUnknown = 0;
    commonMine = 0;
    k = 0;
    l = 0;
    num = (x - x1) * 5 + (y - y1);
    for (k = 0; k < 4; k++) {
        l = common[x][y][x1 - x + 2][y1 - y + 2][k];
        if (l == 0) continue;
        p = (l - 1) / boardHeight;
        q = (l - 1) % boardHeight;
        if (exploreMap[p][q] == 10) commoMine++;
        if (exploreMap[p][q] == 9) commonUnknown++;
    }
    //我们定义，x,y为左边，x1,y1为右边U
    leftUnknown = unknownMinesArray[x][y] - commonUnknown;
    rightUnknown = unknownMinesArray[x1][y1] - commonUnknown;
    leftMine = suspectMinesArray[x][y] - commonMine;
    rightMine = suspectMinesArray[x1][y1] - commonMine;
    if (leftUnknown + rightUnknown == 0) return;
    //左边或右边所有的地方都不是雷
    if (exploreMap[x1][y1] - rightMine == exploreMap[x][y] - leftMine) {
        if (leftUnknown == 0) handle(x1, y1, x, y, 1);
        if (rightUnknown == 0) handle(x, y, x1, y1, 1);
    }
    //左边或右边所有的地方都是雷
    if (exploreMap[x1][y1] - rightMine - rightUnknown == exploreMap[x][y] - leftMine - leftUnknown) {
        if (leftUnknown == 0) handle(x1, y1, x, y, 2);
        if (rightUnknown == 0) handle(x, y, x1, y1, 2);
    }
    // 判断左边全是雷，右边都不是
    if (exploreMap[x][y] - exploreMap[x1][y1] == leftMine + leftUnknown) {
        handle(x1, y1, x, y, 1);
        handle(x, y, x1, y1, 2);
    }
    //右边全是雷，左边都不是     
    if (exploreMap[x1][y1] - exploreMap[x][y] == rightMine + rightUnknown) {
        handle(x1, y1, x, y, 2);
        handle(x, y, x1, y1, 1);
    }
}

//对特定区域进行处理，前两个数字为要处理的单区域，1代表全部打开，2代表全部标记
function handle(x, y, x1, y1, flag) {
    //  printf("下面执行%d处理\n",flag);
    var p, q, k = 0;
    for (p = x - 1; p < x + 2; p++) {
        for (q = y - 1; q < y + 2; q++) {
            if (p == x && q == y) continue;
            if (isNeighbour(p, q, i1, y1) != 0 || boundary(p, q) == 0) continue;
            if (flag == 1) setExploreMap(p, q, 1);
            if (flag == 2 && exploreMap[p][q] == 9) markMins(p, q);

        }
    }

}
//把第i行第j列标记成地雷
function markMines(x, y) {
    exploreMap[x][y] = 10;
    modSuspect(x, y);
    modUnknown(x, y);
    unknownMinesNum--;
    totalUnknowPointsNum--;
}

function modSuspect(x, y) {
    // printf("modsuspect%d %d\n",i,j);
    var points = getAroundPointLocations(x, y);
    for(var i=0;i<points.length;i++){
        var px = points[i].x,py = points[i].y;
        suspectMinesArray[px][py] = getMineNum(px, py);
        if(suspectMinesArray[px][py]==exploreMap[px][py]){
            setExploreMap(px, py);
        }
    }
}
