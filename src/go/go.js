import Go from "../../modules/go.class.js";
import './go.scss';

let go = new Go('#canvas');

let type = "exchange",
    canClick = true,
    clickTimes = 0;

go.clickEvent(function(e) {
    let point = {
        x: parseInt(e.offsetX / go.preWidth),
        y: parseInt(e.offsetY / go.preHeight)
    }
    let color = "",
        num = false;
    if (type == "exchange") {
        clickTimes++;
        color = clickTimes % 2 == 1 ? "black" : "white";
        num = clickTimes;
    } else {
        color = type;
        clickTimes = 0;
        num = false;
    }
    let setAChess = go.setChess(point.x, point.y, color, num);
    if (!setAChess) {
        clickTimes--;
    }
});

document.querySelector('.setting-box').addEventListener('click', function(e) {   
    let target = e.target;
    let id = target.id;
    if (id == "redo") {
        go.redo();
    } else {
        if (!canClick) return false;
        for (let [i, ele] of this.querySelectorAll('div').entries()) {
            ele.classList.remove("is-choose");
        }
        target.classList.add("is-choose");
    }
    setType(id);
}, false);


document.querySelector("#reset").addEventListener('click', function() {
    go.reset();
    clickTimes = 0;
    canClick = true;
    isStep=false;
    // type = null;
}, false);

function setType(playType) {
    if (playType == "redo") {
        type == "exchange" ? clickTimes-- : 0;
    } else {
        type = playType;
    }
}
import arr from './json/1.js';
// console.log(arr);
document.querySelector('#auto1').addEventListener('click', function(e) {
    // if (id) {
    go.reset();
    type = "exchange";
    clickTimes = 0;
    canClick = false;
    isStep=false;
    autoSetChess(arr);
    // }
},false);
let isStep=false;
document.querySelector("#stepbystep1").addEventListener('click',function(e){
    type="exchange";
    canClick=false;
    if(!isStep){
        go.reset();
        clickTimes=0;
        isStep=true;
    }
    if(clickTimes<arr.length) setAChessByStep(arr,clickTimes);
    clickTimes++;
})

function autoSetChess(arr) {
    let color;
    let point = arr.shift();
    let { x, y } = point;
    clickTimes++;
    color = clickTimes % 2 == 1 ? "black" : "white";
    setTimeout(() => {
        go.setChess(x, y, color, clickTimes);
        if (arr.length > 0) autoSetChess(arr);
    }, 300)
}

function setAChessByStep(arr,index){
    let color;
    let point = arr[index];
    let { x, y } = point;
    color = (index+1) % 2 == 1 ? "black" : "white";
    go.setChess(x,y,color,index+1);
}