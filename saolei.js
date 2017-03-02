var saoleiBoard = document.getElementById('saolei-board');

// 定义宽高格子个数
var boardWidth = 24,
    boardHeight = 20;
// 定义格子边长
var squareWidth = 30;
// 定义雷的个数
var leiNum = 99;
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
    "flag": './img/flag.jpg',
    "lei": './img/lei.jpg'
}

// 定义地图数组（二维）坐标值为0为安全区域，坐标值为1为雷
var map = [];
// 定义显示地图
var showMapArray = [];
// 当前开采地图,-1为未开采
var exploreMap = initArray(-1);
//计算两个板块的共同部分，注意：这里编号代表相邻程度。从0到23，分别从左到右，从上到下。
// common为5维数组[boardWidth][boardHeight][5][5][4]
var common = function() {
    var x, y, x1, y1, k;
    var p, q;
    var common = [];
    for (i = 0; i < boardWidth; i++) {
        common[i] = [];
        for (j = 0; j < boardHeight; j++) {
            common[i][j] = [];
            for (i1 = 0; i1 < 5; i1++) {
                common[i][j][i1] = [];
                for (j1 = 0; j1 < 5; j1++) {
                    common[i][j][i1][j1] = [];
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
//周围的地雷不知道的个数
var unknownMinesArray = initArray(8);
// 怀疑有雷数组
var suspectMinesArray = initArray(0);

var context = saoleiBoard.getContext('2d');

// 画格子
function drawChessBoard(x, y) {
    saoleiBoard.width = squareWidth * (x + 1);
    saoleiBoard.height = squareWidth * (y + 1);
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

// 画数字,旗子标记,雷
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
    } else {
        drawPic(status, x, y);
    }
}
// 画图片
function drawPic(status, x, y) {
    var img = new Image();
    img.src = numCorlor[status];
    img.onload = function() {
        context.drawImage(img, (x + 0.5) * squareWidth, (y + 0.5) * squareWidth, squareWidth, squareWidth);
    };
}
// 生成随机数坐标
function random() {
    var rx = parseInt(Math.random() * boardWidth),
        ry = parseInt(Math.random() * boardHeight);
    return {
        x: rx,
        y: ry
    }
}

// 初始化二维数组值
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
// 创建地图数组
function createMapArray(x, y) {
    var arr = [];
    for (var i = 0; i < boardWidth; i++) {
        arr[i] = [];
        for (var j = 0; j < boardHeight; j++) {
            arr[i][j] = 0
        }
    }
    for (var i = 0; i < leiNum;) {
        var location = random();
        if (((x < location.x - 1 || x > location.x + 1) || (y < location.y - 1 || y > location.y + 1)) && arr[location.x][location.y] == 0) {
            arr[location.x][location.y] = 1;
            i++
        }
    }
    return arr;
}

// 根据地图计算坐标值是什么
// 如(x,y)=5代表该坐标附近有5个雷，(x,y)='lei'代表该位置为雷
function getMapValue() {
    var arr = []
    for (var i = 0; i < boardWidth; i++) {
        arr[i] = [];
        for (var j = 0; j < boardHeight; j++) {
            if (map[i][j] == 0) {
                arr[i][j] = getLeiNum(i, j);
            } else {
                arr[i][j] = 'lei'
            }
        }
    }
    return arr;
}
// 获取坐标点有几个雷
function getLeiNum(x, y) {
    var num = 0;
    var aroundPoints = getAroundPointLocations(x, y);
    for (var i = 0; i < aroundPoints.length; i++) {
        if (map[aroundPoints[i].x][aroundPoints[i].y] == 1) {
            num++
        }
    }
    return num;
}

//鉴定这个是不是落在边界内部，出界返回0
function boundary(x, y) {
    if (x > -1 && x < boardWidth && y > -1 && y < boardHeight) return 1;
    else return 0;
}
// 获取周围坐标数组
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
//判断两个格点是否相邻，对角返回2，相邻返回1，否则为0
function isNeighbour(x, y, x1, y1) {
    var distance;
    distance = (x1 - x) * (x1 - x) + (y1 - y) * (y1 - y);
    if (distance == 2) return 2;
    if (distance == 1) return 1;
    else return 0;
}
// 画出地图效果
function drawShowMapArray(arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            drawFlag(arr[i][j], i, j)
        }
    }
}
// 开采地图
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
saoleiBoard.addEventListener('click', function(e) {
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

drawChessBoard(boardWidth, boardHeight);

//当这一块被开采或被标记后，其周围的图块自减1
function modUnknown(x, y) {
    var locations = getAroundPointLocations(x, y);
    for(var i=0;i<locations.length;i++){
        unknownMinesArray[locations[i].x][locations[i].y]--;
    }
}
