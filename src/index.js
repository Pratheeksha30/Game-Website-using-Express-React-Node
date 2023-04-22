import React from 'react';
import ReactDOM from 'react-dom';
import './App.css'
import Game from './Game1'
import Maze from './Game2'
import Rocket from './Game3'

class Main extends React.Component{
    constructor(props){
        super(props);
        this.state={
            totalscore:0,
            level1:0,
            level2:0,
            level3:0,
            completedl1:false,
            completedl2:false,
            completedl3:false,
        }
    }
    scoreUpdate = (value) => {
        this.setState({
            totalscore : this.state.totalscore + value
        })
    }
    level3Update = (value) => {
        console.log("after l1 : " + this.state.totalscore);
        this.setState({
            completedl3 : value
        })
    }
    quizGame=(e)=>{
        this.setState({
            level1 : 1,
            level2 : 0,
            level3 : 0
        })
    }
    mazeGame=(e)=>{
        console.log("after l1 : " + this.state.totalscore);
        this.setState({
            completedl1 : true,
            level1 : 0,
            level2 : 1,
            level3 : 0
        })
    }
    shootGame=(e)=>{
        console.log("after l1 : " + this.state.totalscore);
        this.setState({
            completedl1 : true,
            completedl2 : true,
            level1 : 0,
            level2 : 0,
            level3 : 1
        })
    }
    render(){
        let div;
        if(!this.state.completedl1){
            div = <div style = {{margin : "150px"}}>
                        {!this.state.level1?               
                            <button id = "l1" onMouseOver  onClick = {this.quizGame}>Level 1</button>
                        : <div><Game onScoreUpdate = {this.scoreUpdate}/><br/><br/></div>}
                        <br/><br/>
                        
                        {!this.state.level2?  
                            <button id = "l2" onClick = {this.mazeGame}>Level 2</button>
                            :<Maze onScoreUpdate = {this.scoreUpdate}/>} 
                        <br/><br/>
        
                        {!this.state.level3?   
                            <button id = "l3" onClick = {this.shootGame}>Level 3</button>
                            :<Rocket onScoreUpdate = {this.scoreUpdate} onLevel = {this.level3Update}/>}
                    </div>
        }
        else if(!this.state.completedl2){
            div = <div style = {{margin : "200px"}}>                        
                        {!this.state.level2?  
                            <button id = "l2" onClick = {this.mazeGame}>Level 2</button>
                            :<Maze onScoreUpdate = {this.scoreUpdate}/>} 
                        <br/><br/>

                        {!this.state.level3?   
                            <button id = "l3" onClick = {this.shootGame}>Level 3</button>
                            :<Rocket onScoreUpdate = {this.scoreUpdate} onLevel = {this.level3Update}/>}
                    </div>
        }
        else if(this.state.completedl3){
            div = <div><br/><br/><br/><h1 className = "heading">Game Completed !!<br/><br/>Total Score: {this.state.totalscore}</h1></div>
        }
        else {
            div = <div style = {{margin : "200px"}}>
                        {!this.state.level3?   
                            <button id = "l3" onClick = {this.shootGame}>Level 3</button>
                            :<Rocket onScoreUpdate = {this.scoreUpdate} onLevel = {this.level3Update}/>}
                    </div>
        }
        return(
            <div>
                {div}
            </div>
        )
    }
}
ReactDOM.render(
    <div>
        <Main/>
    </div>,
	document.getElementById("root")
);
