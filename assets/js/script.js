//#region querySelectors
var quizHeaderEl = document.querySelector("#quiz-header");
var quizContentEl = document.querySelector("#quiz-content");
var quizFooterEl = document.querySelector("#quiz-footer");
var buttonStartStop = document.querySelector("#startStopButton");
//#endregion querySelectors

//class to handle the quiz game itself.
class QuizGame {
    constructor() {
        this.gameStarted = false;
        this.questionBank = [];
        this.currentElementTree;
        this.shuffledIndex;
        this.currentQuestionIndex;
        this.secondsLeft;
    }

    //add question to questionBank
    addQuizItem(quizItemInput) {
        if (quizItemInput instanceof QuizItem) {
            this.questionBank.push(quizItemInput);
        } else if (Array.isArray(quizItemInput)) {
            //if it's an array, it's probably an array of quizItems - iterate through and recall
            for (var i = 0; i < quizItemInput.length; i++) {
                this.addQuizItem(quizItemInput[i]);
            }
        } else {
            console.log("addQuizItem called, but passed variable is not a quizItem or an array of quizItems!");
        }
    }

    appendElementTree() {
        //remember; questions are shuffled too, so we retrieve the ordering from the shuffled index using the real index counter.
        this.currentElementTree = this.questionBank[this.shuffledIndex[this.currentQuestionIndex]].createElements();
        
        //this may be bad practice? I don't like hard coding for the second (and last) element ouf of the nodeList. It betrays all of this abstraction I've done.
        var buttons = this.currentElementTree.childNodes[1].children;
        //just wrap buttons in an array for ease of use
        buttons = Array.from(buttons);
        //create listeners
        buttons.forEach(function(element) {
            element.addEventListener("click", this.answerSelected)
        }, this);

        //append to DOM under the quizContentElement
        quizContentEl.append(this.currentElementTree);
    }

    removeElementTree() {
        var buttons = this.currentElementTree.childNodes[1].children;
        buttons = Array.from(buttons);
        //remove listeners
        buttons.forEach(function(element) {
            element.removeEventListener("click", this.answerSelected);
        }, this);

        this.currentElementTree.remove();
    }

    //it's by this point that I understand that setting this up as a class was a bad BAD idea. 'this' gets determined at runtime? I don't have time to redo everything and learn how to use .bind()
    answerSelected(event) {
        var sender = event.target;

        //console.log(sender.textContent);
        if (sender.textContent == 
            theQuizGame.questionBank[theQuizGame.shuffledIndex[theQuizGame.currentQuestionIndex]].correctA) {
                //correct answer
            } else {
                theQuizGame.updateScore(-100);
            }

        if (theQuizGame.secondsLeft > 0 && theQuizGame.currentQuestionIndex < theQuizGame.questionBank.length - 1) {
            //next question
            theQuizGame.currentQuestionIndex++;
            theQuizGame.removeElementTree();
            theQuizGame.appendElementTree();
        } else {
            theQuizGame.endQuiz();
        }
    }

    startTimer() {
        function timerFunction(thisContext) {
            thisContext.updateScore(-1);

            if (thisContext.secondsLeft === 0) {
                thisContext.endQuiz();
            }
        }

        var self = this;
        
        //this hurts my head.
        this.timer = setInterval(function(){timerFunction(self)}, 100);
    }

    updateScore(decrementNum) {
        this.secondsLeft += decrementNum;
        quizHeaderEl.childNodes[1].textContent = ("Question " + (this.currentQuestionIndex + 1) + " | Score: " + this.secondsLeft);
        if (this.secondsLeft === 0) {
            this.endQuiz();
        }
    }

    setLeaderboard(newScore, newInitials) {
        var leaderboardCheck = localStorage.getItem("leaderboard");
        //did we already define this.leaderboard?
        if (!leaderboardCheck) {
            this.leaderboard = {
                topScore: newScore,
                topInitials: newInitials,
                latestScore: newScore,
                latestInitials: newInitials
            };
        } else {
            //check for new highscore
            if (newScore > this.leaderboard.topScore) {
                this.leaderboard.topScore = newScore;
                this.leaderboard.topInitials = newInitials;
            }
            //save latest score
            this.leaderboard.latestScore = newScore;
            this.leaderboard.latestInitials = newInitials;
        }

        //save in local storage
        localStorage.setItem("leaderboard", JSON.stringify(this.leaderboard));
        //update quiz footer header element
        this.updateLeaderBoard();
    }

    updateLeaderBoard() {
        var leaderboardCheck = localStorage.getItem("leaderboard");
        //first time running on this browser?
        if (!leaderboardCheck) {
            return;
        } else {
            //set each time, just in case it's the first loading of the script
            this.leaderboard = JSON.parse(leaderboardCheck);
            quizFooterEl.childNodes[1].textContent = ("Highscore) " + this.leaderboard.topInitials + " - " + this.leaderboard.topScore +
                " | " + this.leaderboard.latestInitials + " - " + this.leaderboard.latestScore + " (Latest score");
        }
    }

    endQuiz() {
        buttonStartStop.removeAttribute("disabled");
        this.gameStarted = false;
        this.removeElementTree();
        this.currentQuestionIndex = 0;
        clearInterval(this.timer);

        var initials = prompt("Please enter your initials.", "AAA");
        this.setLeaderboard(this.secondsLeft, initials);

        this.secondsLeft = 600; 
    }
    
    startQuiz() {
        buttonStartStop.setAttribute("disabled","true");
        this.gameStarted = true;
        this.currentQuestionIndex = 0;
        this.secondsLeft = 600;
    
        //shuffle index - to randomize the question order
        this.shuffledIndex = shuffleIndex(this.questionBank.length);
        
        this.appendElementTree();
        this.updateScore(0); //immediately display score, before the lag in time it takes to start timer.
        this.startTimer();

    }
}

//class object for handling QuizItems
class QuizItem {

    //quizItem ctor
    constructor(question, correctA) {
        this.question = question;
        this.correctA = correctA;
        this.answers = [correctA];
    }

    addWrongAnswers(wrongA) {
        if (Array.isArray(wrongA)) {
            this.answers = this.answers.concat(wrongA);
        } else {
            this.answers.push(wrongA);
        }
    }

    //Creates question & answer elements, randomizes answer order, and appends answers to a div element.
    //Returns unappended div element, and appended question/answer children.
    createElements() {
        //Create div containers
        var divEl = document.createElement("div");
        var innerDivEl = document.createElement("div");

        //Create h3 element for title, set its text to the question, append to div.
        var questionEl = document.createElement("h3");
        questionEl.textContent = this.question;
        divEl.appendChild(questionEl);

        //create a shuffled indexer for our answers
        var answerIndex = shuffleIndex(this.answers.length);

        //loop through and create answer button elements, append them to the bottom of the question element.
        for (var i = 0; i < this.answers.length; i++) {
            var buttonEl = document.createElement("button");
            buttonEl.textContent = this.answers[answerIndex[i]];

            innerDivEl.append(buttonEl);
        }

        divEl.appendChild(innerDivEl);

        return divEl;
    }
}

var theQuizGame = new QuizGame();

function init() {
    //Build up question bank
    var q1 = new QuizItem("Which of the following is NOT a primitive type?", "object");
    q1.addWrongAnswers(["boolean", "string", "number"]);
    var q2 = new QuizItem("Which symbol(s) is NOT an operator?", "//");
    q2.addWrongAnswers(["&&", "||", "==", "++", "--"]);
    var q3 = new QuizItem("Which type of brackets would be used in a function call?", "function ()");
    q3.addWrongAnswers(["function []", "function {}"]);
    var q4 = new QuizItem("What interface can be used to access HTML elements with javascript?", "DOM");
    q4.addWrongAnswers(["COM", "XML", "HTTP"]);
    var q5 = new QuizItem("Commenting your code is", "useful for your future self and others");
    q5.addWrongAnswers(["dumb and a waste of time"]);

    //add questions to the game's question bank
    theQuizGame.addQuizItem([q1, q2, q3, q4, q5]);
    theQuizGame.updateLeaderBoard();

}



//#region helperFunctions
//My less-than-efficient implementation of the fisher-yates shuffle algorithm.
//returns an array of length arrayLength containing shuffled index positions.
function shuffleIndex(arrayLength) {
    //Create a new array of the same length as the passed in value
    var newIndex = new Array(arrayLength);

    //populate the array with 0..arrayLength, because I haven't figured out a better way of doing it.
    for (var i = 0; i < arrayLength; i++) {
        newIndex[i] = i;
    }

    for (var i = arrayLength-1; i > 0; i--) {
        //random number i >= j > 0
        var j = Math.round(Math.random() * i);
        //swap newIndex[i] with newIndex[j]
        temp = newIndex[j];
        newIndex[j] = newIndex[i];
        newIndex[i] = temp;
    }

    return newIndex;
}
//#endregion helperFunctions

//#region eventListeners
buttonStartStop.addEventListener("click", function(){
    theQuizGame.startQuiz();
});
//#endregion eventListeners

init();