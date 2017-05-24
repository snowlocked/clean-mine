import React from 'react';

import './style.less';

import FiveChess from '../../assets/modules/fiveChess.class.js';

class FiveChessReact extends React.Component{
    constructor(props){
        super(props);
        // console.log(props);
        this.state = {
            type:this.props.params.type,
        }
    }
	componentDidMount() {
		this.init();
	}
	init() {
        let fiveChess = new FiveChess('#canvas');
        let colorType = "";
        let {type} = this.state;
        if(type=="first"){
            colorType = "black";
            fiveChess.drawChess(9,9);
        } 
        if(type=="last") colorType = "white";
        fiveChess.clickEvent((e)=> {
            let point = {
                x: parseInt(e.offsetX / fiveChess.preWidth),
                y: parseInt(e.offsetY / fiveChess.preHeight)
            };
            fiveChess.drawChess(point.x, point.y);
            let {type} = this.state;        
            if(type=="first" || type=="last") fiveChess.autoDraw(colorType);
            let autoPlay;
            if (type=="eve") {
                autoPlay = setInterval(function() {
                    if (fiveChess.isEnd) {
                        clearInterval(autoPlay);
                    } else {
                        fiveChess.autoDraw(colorType);
                        if (colorType == "black") {
                            colorType = "white";
                        } else if (colorType == "white") {
                            colorType = "black";
                        }
                    }
                }, 100)
            }
        });
        this.setState({
            fiveChess:fiveChess
        })
    }
    changeType(type){
        const {router} = this.props;
        let fiveChess = this.state.fiveChess;
        // console.log(fiveChess);
        return ()=>{           
            // console.log(fiveChess);
            fiveChess.reset();
            type == "first" && fiveChess.drawChess(9,9);
            this.setState({
                type:type,
                fiveChess:fiveChess
            });
            router.push('/fiveChess/'+type);
        }
        // console.log(type);
        // router.push('/fiveChess/'+type);
    }
    reset(){
        console.log(this);
        let fiveChess = this.state.fiveChess;
        fiveChess.reset();
        this.state.type == "first" && fiveChess.drawChess(9,9);
        this.setState({
            fiveChess:fiveChess
        })
    }
    render(){
        let {type} = this.state;
        return(
            <div className="fiveChess">
                <div id="canvas"></div>
                <div className="setting-box">
                    <div id="computer-first" className={type=="first"?"is-choose":""} onClick={this.changeType('first')}>计算机先</div>
                    <div id="computer-last" className={type=="last"?"is-choose":""} onClick={this.changeType('last')}>玩家先</div>
                    <div id="pvp" className={type=="pvp"?"is-choose":""} onClick={this.changeType('pvp')}>人人对战</div>
                    <div id="eve" className={type=="eve"?"is-choose":""} onClick={this.changeType('eve')}>机机对战</div>
                </div>
                <div id="reset" onClick={()=>this.reset()}>reset</div>
            </div>
        );
    }
}

export default FiveChessReact;
