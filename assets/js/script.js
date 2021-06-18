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

