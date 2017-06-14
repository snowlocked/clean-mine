import React from 'react';

import { Button } from 'antd-mobile';
import './style.less';

// import FiveChess from '../../assets/modules/fiveChess.class.js';

class Index extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            buttonType:"primary",
            disabled:false,
            buttonContent:"start click!"
        }       
    }
	componentDidMount() {
		// this.init();
	}
	setButtonType(){
        let time = 60;
        let obj = {
            buttonContent:`${time}秒后重试`,
            disabled:true,
        }
        this.setState(obj);
        let interval = setInterval(()=>{
            time--;
            if(time<0){
                clearInterval(interval);
                obj = {
                    disabled:false,
                    buttonContent:"start click!"
                }
            }else{
                obj = {
                    buttonContent:`${time}秒后重试`,
                    disabled:true,
                }
            }
            this.setState(obj);                       
        },1000)
    }
    render(){
        const {buttonType,disabled,buttonContent} = this.state;
        return(
            <div className="index">
                <Button size="small" disabled={this.state.disabled} type={buttonType} onClick={()=>this.setButtonType()}>{buttonContent}</Button>
            </div>
        );
    }
}

export default Index;
