import React from 'react';
import "./App.css"
import GameQuestions from "./json/spaceGame.json"

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            gameStart : false,
            gameOver : false,
            playerScore : 0,
            questionNum : 0,
            totalQuestions : GameQuestions.length,
            question : "",
            right : "",
            a1 : "",
            a2 : "",
            a3 : "",
            a4 : ""
         };
    }

    startGame = () =>{
        this.quizGameStart();
        this.setState({
            gameStart : true,
            gameOver : false,
            playerScore : 0
        });
    };
    quizGameStart =()=>{
        this.setState({
            startQuiz :true,
            questionNum: this.state.questionNum + 1
        });
        this.loadNewQuestion();
    };
    loadNewQuestion = ()=>{
        this.setState({
            question: GameQuestions[this.state.questionNum].question,
            a1: GameQuestions[this.state.questionNum].a1,
            a2: GameQuestions[this.state.questionNum].a2,
            a3: GameQuestions[this.state.questionNum].a3,
            a4: GameQuestions[this.state.questionNum].a4,
            right: GameQuestions[this.state.questionNum].right,
        });
    };
    checkAnswer = e =>{
        this.setState({
            questionNum : this.state.questionNum + 1
        });
        this.otherCheck(e);
    };
    otherCheck =e =>{
        let id = e.target.getAttribute("data_id");
        if(id === this.state.right){
            this.setState({
                playerScore: this.state.playerScore + 1
            });
            this.props.onScoreUpdate(this.state.playerScore);
        } 
        if(this.state.questionNum < this.state.totalQuestions){
            this.loadNewQuestion();
        }else {
            this.GameOver();
        }
    };
    GameOver = () =>{
        this.setState({
            gameStart: false,
            gameOver: true,
            startQuiz : false,
            questionNum : 0,
            totalQuestions:3,
            question: "",
            right : "",
            a1: "",
            a2 : "",
            a3 : "",
            a4 : ""
        })
    }

	render(){
		return(
            <div id="quizbody">
                <h1 className='heading'>Welcome to space Quiz</h1>
                {!this.state.gameStart && !this.state.gameOver?
                   <button className = "menu" onClick = {this.startGame}>Start Quiz</button> 
                :null}
               {this.state.gameStart ? 
               <div id = 'Quiz'>
                    <h1 className = "score" >Score : {this.state.playerScore}</h1>
                    <h3 className = "heading">Q.{this.state.questionNum}</h3>
                    <h2 className = "heading">{this.state.question}</h2>
                    <button className = "choice" onClick = {this.checkAnswer} data_id  ="1">
                        {this.state.a1}
                    </button>
                    <button className = "choice" onClick = {this.checkAnswer} data_id  ="2">
                        {this.state.a2}
                    </button>
                    <button className = "choice" onClick = {this.checkAnswer} data_id  ="3">
                        {this.state.a3}
                    </button>
                    <button className = "choice" onClick = {this.checkAnswer} data_id  ="4">
                        {this.state.a4}
                    </button>
                </div>    
                : null}
                {this.state.gameOver ?
                     <h1 className = "heading" >Score : {this.state.playerScore}</h1>
                :null}
            </div>
		);
    }    
}
export default Game;




