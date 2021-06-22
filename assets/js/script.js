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
        theQuizGame.removeElementTree();

        console.log(sender.textContent);
        //if (sender.)

        if (theQuizGame.secondsLeft > 0 && theQuizGame.currentQuestionIndex < theQuizGame.questionBank.length - 1) {
            //next question
            theQuizGame.currentQuestionIndex++;
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
        this.timer = setInterval(function(){timerFunction(self)}, 1000);
    }

    updateScore(decrementNum) {
        this.secondsLeft += decrementNum;
        quizHeaderEl.childNodes[1].textContent = ("Question " + (this.currentQuestionIndex + 1) + " | Score: " + this.secondsLeft);
    }

    endQuiz() {
        buttonStartStop.setAttribute("disabled","false");
        this.gameStarted = false;
        this.currentQuestionIndex = 0;
        clearInterval(this.timer);
        this.secondsLeft = 60; 
    }
    
    startQuiz() {
        buttonStartStop.setAttribute("disabled","true");
        this.gameStarted = true;
        this.currentQuestionIndex = 0;
        this.secondsLeft = 60;
    
        //shuffle index - to randomize the question order
        this.shuffledIndex = shuffleIndex(this.questionBank.length);
        
        this.appendElementTree();
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
    var q2 = new QuizItem("Placeholder question 1", "correct answer");
    q2.addWrongAnswers(["wrong answer 1", "wrong answer 2", "wrong answer 3"]);
    var q3 = new QuizItem("Placeholder question 2", "correct answer");
    q3.addWrongAnswers(["wrong answer 1", "wrong answer 2", "wrong answer 3"]);
    var q4 = new QuizItem("Placeholder question 3", "correct answer");
    q4.addWrongAnswers(["wrong answer 1", "wrong answer 2", "wrong answer 3"]);
    var q5 = new QuizItem("Placeholder question 4", "correct answer");
    q5.addWrongAnswers(["wrong answer 1", "wrong answer 2", "wrong answer 3"]);

    //add questions to the game's question bank
    theQuizGame.addQuizItem([q1, q2, q3, q4, q5]);

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