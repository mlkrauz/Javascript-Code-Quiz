//#region querySelectors

var quizHeaderEl = document.querySelector("#quiz-header");
var quizContentEl = document.querySelector("#quiz-content");
var quizFooterEl = document.querySelector("#quiz-footer");
var buttonStartStop = document.querySelector("#startStopButton");

//#endregion querySelectors

//class object for handling QuizItems
class QuizItem {

    //quizItem ctor
    constructor(question, correctA, wrongA1, wrongA2, wrongA3) {
        this.question = question;
        this.correctA = correctA;
        this.answers = [correctA, wrongA1, wrongA2, wrongA3];
    }

    //Creates question & answer elements, randomizes answer order, and appends answers to a div element.
    //Returns unappended div element, and appended question/answer children.
    createElements() {
        //Create div container
        var divEl = document.createElement("div");

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

            divEl.append(buttonEl);
        }

        return divEl;
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

    quizContentEl.append(questionBank[0].createElements())
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

//#endregion

//#region eventListeners
buttonStartStop.addEventListener("click", function(){
    startQuiz()
})
//#endregion