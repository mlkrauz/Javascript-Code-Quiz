var quizHeaderEl = document.querySelector("#quiz-header");
var quizContentEl = document.querySelector("#quiz-content");
var quizFooterEl = document.querySelector("#quiz-footer");
var buttonStartStop = document.querySelector("#startStopButton");

//class object for handling QuizItems
class QuizItem {

    //quizItem ctor
    constructor(question, correctA, wrongA1, wrongA2, wrongA3) {
        this.question = question;
        this.correctA = correctA;
        this.wrongA1 = wrongA1;
        this.wrongA2 = wrongA2;
        this.wrongA3 = wrongA3;
    }
}

//Build up an array of QuizItems
var questionBank = [
    new QuizItem(
        "Which of the following is NOT a primitive type?",
        "object",
        "boolean",
        "string",
        "number"
    ),
    new QuizItem(
        "Placeholder question 1",
        "correct answer",
        "wrong answer 1",
        "wrong answer 2",
        "wrong answer 3"
    ),
    new QuizItem(
        "Placeholder question 2",
        "correct answer",
        "wrong answer 1",
        "wrong answer 2",
        "wrong answer 3"
    ),
    new QuizItem(
        "Placeholder question 3",
        "correct answer",
        "wrong answer 1",
        "wrong answer 2",
        "wrong answer 3"
    ),
    new QuizItem(
        "Placeholder question 4",
        "correct answer",
        "wrong answer 1",
        "wrong answer 2",
        "wrong answer 3"
    )
];



function startQuiz() {
    buttonStartStop.setAttribute("disabled","true");

    //shuffle index - to randomize the question order
    var questionIndex = shuffleIndex(questionBank.length);
    
    for (var i = 0; i < questionBank.length; i++) {
        
        
    }
}

//#region helperFunctions

//My less-than-efficient implementation of the fisher-yates shuffle algorithm.
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

//#endregion

//#region eventListeners
buttonStartStop.addEventListener("click", function(){
    startQuiz()
})
//#endregion