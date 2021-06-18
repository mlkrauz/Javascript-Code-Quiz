var quizHeaderEl = document.querySelector("#quiz-header");
var quizContentEl = document.querySelector("#quiz-content");
var quizFooterEl = document.querySelector("#quiz-footer");
var buttonStartStop = document.querySelector("#startStopButton");

//Function for creating a new question object.
function QuizItem(question, correctA, wrongA1, wrongA2, wrongA3) {
    this.question = question;
    this.correctA = correctA;
    this.wrongA1 = wrongA1;
    this.wrongA2 = wrongA2;
    this.wrongA3 = wrongA3;
}

var questionBank = [
    new QuizItem(
        "Which of the following are NOT primitive types?",
        "object",
        "boolean",
        "string",
        "number"
    )
];