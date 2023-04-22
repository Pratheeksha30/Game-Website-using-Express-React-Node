import React from 'react';
import "./App.css"

class Rocket extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            gameStart : true,
            gameOver : false,
            playerScore : 0,
            livesUsed : 0,
        }
    }
    componentDidMount = () =>{
        if(this.state.gameStart && !this.state.gameOver){
            window.addEventListener("keydown",this.func,true);
            this.interval1 = setInterval(this.generaterocks, 1000);
            this.interval2 = setInterval(this.moverocks, 450);  
        } 
    };
    componentWillUnmount = () => {
        this.setState({
            gameStart : false,
            gameOver : true
        })
        window.removeEventListener("keydown",this.func,true);   
        clearInterval(this.interval1);
        clearInterval(this.interval2);
    }
    func = (e)=>{
        if(this.state.gameStart){
        var board = document.getElementById('board');
        var rocks = document.getElementsByClassName("rocks");
        var jet = document.getElementById('jet');
        var left = parseInt(window.getComputedStyle(jet).getPropertyValue("left"));
        if (e.key === "ArrowLeft" && left>0){
            jet.style.left = left - 10 + "px"; 
        }

        else if (e.key === "ArrowRight" && left<=490){
            jet.style.left = left + 10 + "px";
        }

        if (e.key === "ArrowUp" || e.keyCode===32){
            var bullet = document.createElement("div");
            bullet.classList.add("bullets");
            board.appendChild(bullet);
            e.preventDefault();

            var movebullet = () => {
                for (var i=0; i<rocks.length ; i++){
                    var rock=rocks[i];
                    var rockbound = rock.getBoundingClientRect();
                    var bulletbound = bullet.getBoundingClientRect();

                    if(
                        bulletbound.left >= rockbound.left &&
                        bulletbound.right <= (rockbound.right + 47) &&
                        bulletbound.top <= rockbound.top &&
                        bulletbound.bottom <= rockbound.bottom
                    ){
                        rock.parentElement.removeChild(rock);
                        bullet.parentElement.removeChild(bullet);
                        this.setState({
                            playerScore : this.state.playerScore + 1
                        })  
                    }
                }
                var bulletbottom = parseInt(window.getComputedStyle(bullet).getPropertyValue("bottom"));
                bullet.style.left = left+ 47 + "px";
                bullet.style.bottom = bulletbottom + 3 + "px";
            }
            this.interval3 = setInterval(movebullet,0);
        }
    }
    };
    generaterocks=() =>{ 
        if(this.state.gameStart && !this.state.gameOver){
            var board = document.getElementById('board');
            var rock = document.createElement("div");
            rock.classList.add("rocks");
            rock.style.left = Math.floor(Math.random()*420) + "px";
            board.appendChild(rock);
        }    
    };
    moverocks = () => { 
        if(this.state.gameStart){
            var rocks = document.getElementsByClassName("rocks");
            var jet = document.getElementById('jet');
            if (rocks !== undefined){
                for (var i=0 ; i<rocks.length ; i++){
                    var rock = rocks[i];
                    var rocktop = parseInt(window.getComputedStyle(rock).getPropertyValue("top"));
                    var jettop = parseInt(window.getComputedStyle(jet).getPropertyValue("top"));
                    if(this.state.livesUsed == 1 || this.state.playerscore == 40){
                        this.gameOver();
                        break;
                    }
                    if(rocktop >= jettop + 50){
                        this.setState({
                            livesUsed : this.state.livesUsed + 1
                        })
                    }
                    rock.style.top = rocktop + 20 + "px";
                }
            }
        }
    };    
    gameOver = () => {
        this.setState({
            gameOver : true,
            gameStart : false
        })
        this.props.onScoreUpdate(this.state.playerScore);
        if(this.state.gameOver) clearInterval(this.interval3);  
        this.props.onLevel(true);
    }
    render(){
        return(
            <div>
                <div id="board">
                    <div className="rocks"/>
                    <div id="jet"/>
                    <h1 className = "score" >Score : {this.state.playerScore}<br/><br/>Clear all spaceships to save Glendale from the invasion.</h1>
                </div>
            </div>
        )
    }
}
export default Rocket;