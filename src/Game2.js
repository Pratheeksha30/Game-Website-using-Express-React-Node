import React from 'react';
import "./App.css"

class Maze extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            gameStart : true,
            gameOver : false,
            gameWon : false,
            timeLeft :30,
            moves: 0,
            playing : true,
            board : [],
            playerScore : 0
        }
    }
    startGame = () => {
        if(this.state.gameStart == true){
            var Board = new Array(21);
            var vis = new Array(21);
            var EL = [];
            this.init(Board,vis);
            this.add_edges(EL);
            this.gen_maze(EL,Board);
            this.draw_canvas(Board);
            this.setState({
                board : Board,
            })
        }     
    };
    componentDidMount = () =>{
        if(this.state.gameStart && !this.gameOver){
            this.startGame();   
            window.addEventListener('keydown',this.doKeyDown,true);
            this.ID = setInterval(this.updateTimer,1000);
        }
    };
    componentWillUnmount=()=>{
        this.setState({
            gameStart : false,
            gameOver : true
        });
        window.removeEventListener('keydown',this.doKeyDown,true);
        clearInterval(this.ID);
    }
    modelfunwin = () => {
        var modal = document.getElementById('myModal');
        modal.style.display = "block";
        var x = document.getElementById("gamehead");
        x.textContent = "Congrats! You Win..."
        window.onclick = function(event) {
            if (event.target != modal) {
                modal.style.display = "none";
            }
        }
        this.setState({
            playerScore : 150 - this.state.moves + this.state.timeLeft
        })
        this.props.onScoreUpdate(this.state.playerScore);
    };
    doKeyDown = (event) => {
        if(!this.state.gameOver && !this.state.gameWon){
            var handled = false;
            if (this.state.playing) {
                switch (event.keyCode) {
                    case 38:  					// Up arrow
                        this.moveup(this.state.board);
                        handled = true
                        break;
                    case 87:  					// up arrow
                        this.moveup(this.state.board);
                        handled = true
                        break;
                    case 40 :  					//down arrow
                        this.movedown(this.state.board);
                        handled = true
                        break;
                    case 83 :  					//down arrow
                        this.movedown(this.state.board);
                        handled = true
                        break;
                    case 37:  					//left arrow
                        this.moveleft(this.state.board);
                        handled = true
                        break;
                    case 65:  					// left arrow
                        this.moveleft(this.state.board);
                        handled = true
                        break;
                    case 39: 					//right arrow
                        this.moveright(this.state.board);
                        handled = true
                        break;
                    case 68:  					//right arrow
                        this.moveright(this.state.board);
                        handled = true
                        break;
                }
                if (this.checker(this.state.board))
                    this.setState({
                        playing : false
                    })
            }
            if (handled)
                event.preventDefault();// prevents default job of scrolling
        }
    };
    random(min, max){ return (min + (Math.random() * (max - min))); };
    randomChoice(choices) { return choices[Math.round(this.random(0, choices.length-1))]; };
    find = (x,P) => {
        if (x == P[x])
            return x;
        P[x] = this.find(P[x],P);
        return P[x];
    };
    union = (x, y,P,R) => {
        var u = this.find(x,P);
        var v = this.find(y,P);
        if (R[u] > R[v]) {
            R[u] = R[v] + 1;
            P[u] = v;
        }
        else {
            R[v] = R[u] + 1;
            P[v] = u;
        }
    };
    init = (Board, vis) => {
        for (var i = 0; i < 21; i++) {
            Board[i] = new Array(21);
            vis[i] = new Array(21);
        }
        for (var i = 0; i < 21; i++) {
            for (var j = 0; j < 21; j++) {
                if (!(i % 2) && !(j % 2)) 
                    Board[i][j] = '+';
                else if (!(i % 2)) 
                    Board[i][j] = '-';
                else if (!(j % 2)) 
                    Board[i][j] = '|';
                else 
                    Board[i][j] = ' ';
                vis[i][j] = 0;
            }
        }
    };
    h = (e) => {
        return e[1] * 10 + e[0];
    }
    add_edges = (EL) => {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                if (i != 10 - 1) {
                    EL.push([[i, j], [i + 1, j], 1]);
                }
                if (j != 10 - 1) {
                    EL.push([[i, j], [i, j + 1], 1]);
                }
            }
        }
    };
    randomize =(EL) => {
        for (var i = 0; i < EL.length; i++) {
            var si = Math.floor(Math.random() * 387) % EL.length;
            var tmp = EL[si];
            EL[si] = EL[i];
            EL[i] = tmp;
        }
        return EL;
    };
    breakwall = function (e,Board) {
        var x = e[0][0] + e[1][0] + 1;
        var y = e[0][1] + e[1][1] + 1;
        Board[x][y] = ' ';
    }
    gen_maze = (EL,Board) => {
        EL = this.randomize(EL);
        var P = new Array(100);
        var R = new Array(100);
        for (var i = 0; i < 100; i++) {
            P[i] = i;
            R[i] = 0;
        }
        var s = this.h([0, 0]);
        var e = this.h([9, 9]);
        Board[1][0] = ' ';
        Board[19][20] = ' ';
        for (var i = 0; i < EL.length; i++) {
            var x = this.h(EL[i][0]);
            var y = this.h(EL[i][1]);
            if (this.find(s,P) == this.find(e,P)) {
                if (!(this.find(x,P) == this.find(s,P) && this.find(y,P) == this.find(s,P))) {
                    if (this.find(x,P) != this.find(y,P)) {
                        this.union(x, y,P,R);
                        this.breakwall(EL[i],Board);
                        EL[i][2] = 0;
                    }
                }
            }
            else if (this.find(x,P) != this.find(y,P)) {
                this.union(x, y,P,R);
                this.breakwall(EL[i],Board);
                EL[i][2] = 0;
            }
            else 
                continue;
        }
    };
    draw_canvas = (Board) => {
        var canvas = document.getElementById("canvas");
        var temp = [];
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            Board[1][0] = '$'
            for (var i = 0; i < 21; i++) {
                for (var j = 0; j < 21; j++) {
                    if (Board[i][j] != ' '){//} && this.Board[i][j] != '&') {
                        ctx.fillStyle = "#081b46"; //barrier color
                        ctx.fillRect(25 * i, 25 * j, 25, 25);
                    }
                    else if(i<5 && j<5)
                        temp.push([i,j])
                }
            }
            var x = this.randomChoice(temp);
            Board[x[0]][x[1]] = '&'
            ctx.fillStyle = "#92bfd1"; //color of pointer
            ctx.fillRect(25* x[0], 25 * x[1], 25, 25);
        }
    };
    checkPos = (Board) => {
        for (var i = 0; i < 21; i++) 
            for (var j = 0; j < 21; j++) 
                if (Board[i][j] == '&') 
                    return [i,j];
    };
    moveclear = (a,b,Board) => {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = "#36aae0"; //color of pointer path
        ctx.fillRect(25 * a, 25 * b, 25, 25);
        Board[a][b] = ' '
    };
    move =  (a,b,Board) => {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = "#92bfd1"; //color of the pointer
        ctx.fillRect(25 * a, 25 * b, 25, 25);
        Board[a][b] = '&'
    };
    moveup = (Board) => {
        var cord = this.checkPos(Board);
        var i = cord[0];
        var j = cord[1] - 1;
        if (j < 0)
            return
        else if (j > 20)
            return
        else if (Board[i][j] == ' ') {
            this.moveclear(i,j+1,Board);
            this.move(i,j,Board);
            this.setState({
                moves: this.state.moves + 1
            });            
        }
        else
            return
    };
    movedown = (Board) => {
        var cord = this.checkPos(Board);
        var i = cord[0];
        var j = cord[1] + 1;
        if(j<0)
            return
        else if(j>20)
            return
        else if(Board[i][j] ==' ') {
            this.moveclear(i,j-1,Board);
            this.move(i,j,Board);
            this.setState({
                moves: this.state.moves + 1
            });
        }
        else
            return
    };
    moveleft = (Board) => {
        var cord = this.checkPos(Board);
        var i = cord[0] - 1;
        var j = cord[1];
        if(i<0)
            return
        else if(i>20)
            return
        else if(Board[i][j] ==' ') {
            this.moveclear(i+1,j,Board);
            this.move(i,j,Board);
            this.setState({
                moves: this.state.moves + 1
            });
        }
        else
            return
    };
    moveright = (Board) => {
        var cord = this.checkPos(Board);
        var i = cord[0] + 1;
        var j = cord[1];
        if(i<0)
            return
        else if(i>20)
            return
        else if(Board[i][j] ==' ') {
            this.moveclear(i-1,j,Board);
            this.move(i,j,Board);
            this.setState({
                moves: this.state.moves + 1
            });
        }
        else
            return
    };
    checker = (Board) => {
        var cord = this.checkPos(Board);
        var i = cord[0];
        var j = cord[1];
        if ((i == 19 && j == 20) || (i == 1 && j == 0)) {
            this.setState({
                gameWon: true
            });
            this.modelfunwin();
            return 1;
        }
        return 0;
    };
    updateTimer = () => {
        if(!this.state.gameWon && this.state.timeLeft>0)
            this.setState({
                timeLeft : this.state.timeLeft - 1
            });
        this.GameOver();
    };
    GameOver = () => {
        if(!this.state.timeLeft && !this.state.gameWon){
            this.setState({
                gameStart : false,
                gameOver : true
            });
        }
    };

    render(){
        return(
            <section>
                {!this.state.gameOver ? 
                    <div id="wrapper" style={{marginLeft:"auto", marginRight:"auto"}}>
                        <h1 id="heading1" style={{backgroundColor: "paleblue", textDecorationStyle: "solid", color: "white", width: "40%", marginTop: "0px", marginBottom: "10px"}}>Oh no ! A comet is on it's way to Glendale you must destroy the comet by escaping the maze .  Hurry! you've got 30 seconds.</h1>
                        <div id="maze">
                            <div id="c" style={{marginLeft:"auto", marginRight:"auto",marginBottom: "10px",textAlign: "center",width: "10%",fontSize: "large"}}></div>
                            <canvas id="canvas" width="520" height="520" style={{marginLeft:'auto', marginRight:'auto'}}>
                            Your browser does not support HTML5 Canvas.
                            </canvas>
                            <h1 id="timerel">Time left : {this.state.timeLeft}</h1>
                            <h1 id="timerel">Moves : {this.state.moves}</h1>
                        </div>

                        <div id="myModal" className="modal">
                            <div className="modal-content">
                        <       div className="modal-header">
                                    <span className="close">&times;</span>
                                    <h2 id="gamehead"></h2>
                                </div>
                                <div className="modal-footer">
                                    <h2 id="demo" style={{cursor:"pointer"}}>COMET APOPHIS BLASTED SUCCESFULLY!<br/>Score : {this.state.playerScore}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                :<h1 className = "heading" >GAME OVER !<br/><br/>You failed to escape the maze!</h1>}
            </section>
        )
    }
}

export default Maze;