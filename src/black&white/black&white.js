import BlackAndWhite from "../../modules/blackAndWhite.class.js";
import './black&White.scss';

let blackAndWhite = new BlackAndWhite('#canvas', 9),
blackScoreBox = document.querySelector("#black"),
whiteScoreBox = document.querySelector("#white");

blackScoreBox.innerHTML = blackAndWhite.blackNum;
whiteScoreBox.innerHTML = blackAndWhite.whiteNum;

blackAndWhite.clickEvent(function(e) {
    const { offsetX, offsetY } = e;
    let point = {
        x: parseInt(offsetX / blackAndWhite.preWidth-0.5),
        y: parseInt(offsetY / blackAndWhite.preHeight-0.5)
    }
    if(point.x>=0&&point.x<blackAndWhite.M&&point.y>=0&&point.y<=blackAndWhite.M){
    	blackAndWhite.moveOneStep(point.x, point.y);
    }
    blackScoreBox.innerHTML = blackAndWhite.blackNum;
	whiteScoreBox.innerHTML = blackAndWhite.whiteNum;
    
})
