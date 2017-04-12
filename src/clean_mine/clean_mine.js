import './clean_mine.scss'
(function() {
    var cleanMineBoard = document.getElementById('cleanMine-board'),
        levelInput = document.getElementsByName('level'),
        widthInput = document.getElementById('width'),
        heightInput = document.getElementById('height'),
        numInput = document.getElementById('num'),
        isOneStep = document.getElementsByName('is-step'),
        operateTimesInput = document.getElementById('times');
    var clean = new CleanMine(30, 16, 99, cleanMineBoard);
    var levelSetting = [{
        M: 9,
        N: 9,
        num: 10
    }, {
        M: 16,
        N: 16,
        num: 40
    }, {
        M: 30,
        N: 16,
        num: 99
    }];
    // clean.init();
    var isFirstClick = true;
    levelInput.forEach(function(input, index) {
        input.addEventListener('change', function() {
            var val = input.value;
            isFirstClick = true;
            if (val < 3) {
                widthInput.disabled = true;
                height.disabled = true;
                numInput.disabled = true;
                widthInput.value = levelSetting[val].M;
                height.value = levelSetting[val].N;
                numInput.value = levelSetting[val].num;
                clean.reset(levelSetting[val].M, levelSetting[val].N, levelSetting[val].num, true);
                // clean.init();
            } else if (val == 3) {
                widthInput.disabled = false;
                height.disabled = false;
                numInput.disabled = false;
            }
        })
    });
    isOneStep.forEach(function(input, index) {
        input.addEventListener('change', function() {
            var val = input.value;
            isFirstClick = true;
            if (val == 0) {
                operateTimesInput.disabled = false;
            } else {
                operateTimesInput.disabled = true;
                operateTimesInput.value = 1;
            }
        });
    });
    widthInput.addEventListener('blur', setCleanMap);
    heightInput.addEventListener('blur', setCleanMap);
    numInput.addEventListener('blur', setCleanMap);

    function setCleanMap() {
        var M = Number(widthInput.value),
            N = Number(heightInput.value),
            num = Number(numInput.value);
        if (M < 9 || M > 30) {
            alert('please set a leagle num');
            setTimeout(function() {
                widthInput.focus();
            }, 1000)
            return;
        }
        if (N < 9 || N > 24) {
            alert('please set a leagle num');
            setTimeout(function() {
                heightInput.focus();
            }, 1000)
            return;
        }
        if (num < 10 || num > M * N * 0.9) {
            alert('please set a leagle num');
            setTimeout(function() {
                heightInput.focus();
            }, 1000)
            return;
        }
        clean.reset(M, N, num, true);
        // clean.init();
    }
    // cleanMineBoard.addEventListener('click', function(e) {
    //     // isClick = true;
    //     var x = Math.floor(e.offsetX / clean.squareWidth - 0.5),
    //         y = Math.floor(e.offsetY / clean.squareWidth - 0.5);
    //     var isStepByStep;
    //     var operateTimes = operateTimesInput.value;
    //     var dataArr = [],
    //         data = {
    //             touchMineTimes: 0,
    //             averageProgress: 0,
    //             alreadySuccessTimes: 0,
    //             successTimes: 0,
    //             totalCondictions: [0, 0, 0, 0],
    //             totalTouchCondictions: [0, 0, 0, 0]
    //         };
    //     var i, j;
    //     for (i = 0; i < isOneStep.length; i++) {
    //         if (isOneStep[i].checked) {
    //             isStepByStep = isOneStep[i].value;
    //         }
    //     }
    //     if (isStepByStep == 1) {
    //         if (isFirstClick) {
    //             clean.createMap(x, y);
    //             isFirstClick = false;
    //             clean.expandMap(x, y);
    //         } else {
    //             clean.autoNextOneStep();
    //         }
    //         if (clean.isEnd) {
    //             var thisData = {
    //                 isTouchMine: clean.isTouchMine,
    //                 progress: clean.progress,
    //                 alreadySuccess: clean.alreadySuccess,
    //                 success: clean.success,
    //                 condiction: clean.condiction,
    //             }
    //             console.log(thisData);
    //             isFirstClick = true;
    //             clean.reset(Number(widthInput.value), Number(heightInput.value), Number(numInput.value), true);
    //         }
    //     } else {
    //         var startTime = new Date();
    //         for (i = 0; i < operateTimes; i++) {
    //             if (i < operateTimes - 1) {
    //                 clean.reset(Number(widthInput.value), Number(heightInput.value), Number(numInput.value), false);
    //             } else {
    //                 clean.reset(Number(widthInput.value), Number(heightInput.value), Number(numInput.value), true);
    //             }
    //             clean.createMap(x, y);
    //             clean.expandMap(x, y);
    //             while (!clean.isEnd) {
    //                 clean.autoNextOneStep();
    //             }
    //             dataArr.push({
    //                 isTouchMine: clean.isTouchMine,
    //                 progress: clean.progress,
    //                 alreadySuccess: clean.alreadySuccess,
    //                 success: clean.success,
    //                 condiction: clean.condiction,
    //                 touchMineCondiction: clean.touchMineCondiction
    //             });
    //         }
    //         var endTime = new Date()
    //         var progressSum = 0;
    //         for (i = 0; i < dataArr.length; i++) {
    //             data.touchMineTimes += dataArr[i].isTouchMine;
    //             progressSum += dataArr[i].progress;
    //             data.alreadySuccessTimes += dataArr[i].alreadySuccess;
    //             data.successTimes += dataArr[i].success;
    //             for (j = 0; j < 4; j++) {
    //                 data.totalCondictions[j] += dataArr[i].condiction[j];
    //                 if (dataArr[i].touchMineCondiction == j)
    //                     data.totalTouchCondictions[j]++;
    //             }
    //         }
    //         data.averageProgress = progressSum / dataArr.length;
    //         data.alreadySuccessRate = data.alreadySuccessTimes / dataArr.length;
    //         data.successRate = data.successTimes / dataArr.length;
    //         console.log(data);
    //         console.log(endTime - startTime);
    //     }
    //     // drawShowMapArray(exploreMap);
    // })
})()
