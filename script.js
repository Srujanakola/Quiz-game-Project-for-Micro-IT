const loginScreen = document.getElementById("login-screen");
const startScreen = document.getElementById("start-screen");
const quizContainer = document.getElementById("quiz-container");
const resultScreen = document.getElementById("result-screen");
const usernameInput = document.getElementById("username");
const userDisplay = document.getElementById("user-display");
const userResult = document.getElementById("user-result");
const categoryDropdown = document.getElementById("category");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score");
const reviewList = document.getElementById("review-list");
const timeDisplay = document.getElementById("time");

let currentQuestionIndex = 0;
let questions = [];
let score = 0;
let timer;
let timeLeft = 15;
let reviewAnswers = [];

const allQuestions = {
  general: [
    {
      question: "What is the capital of France?",
      answers: [
        { text: "Paris", correct: true },
        { text: "Madrid", correct: false },
        { text: "Berlin", correct: false },
        { text: "Rome", correct: false }
      ]
    },
    {
      question: "Who wrote 'Hamlet'?",
      answers: [
        { text: "Shakespeare", correct: true },
        { text: "Tolstoy", correct: false },
        { text: "Hemingway", correct: false },
        { text: "Dickens", correct: false }
      ]
    }
  ],
  math: [
    {
      question: "What is 5 x 3?",
      answers: [
        { text: "15", correct: true },
        { text: "10", correct: false },
        { text: "8", correct: false },
        { text: "20", correct: false }
      ]
    },
    {
      question: "What is the square root of 64?",
      answers: [
        { text: "8", correct: true },
        { text: "6", correct: false },
        { text: "7", correct: false },
        { text: "9", correct: false }
      ]
    }
  ],
  science: [
    {
      question: "Which planet is known as the Red Planet?",
      answers: [
        { text: "Earth", correct: false },
        { text: "Mars", correct: true },
        { text: "Venus", correct: false },
        { text: "Jupiter", correct: false }
      ]
    },
    {
      question: "What gas do plants absorb?",
      answers: [
        { text: "Oxygen", correct: false },
        { text: "Carbon Dioxide", correct: true },
        { text: "Nitrogen", correct: false },
        { text: "Hydrogen", correct: false }
      ]
    }
  ]
};

function loginUser() {
  const username = usernameInput.value.trim();
  if (username) {
    localStorage.setItem("quizUser", username);
    userDisplay.textContent = username;
    loginScreen.classList.add("hide");
    startScreen.classList.remove("hide");
  }
}

function startQuiz() {
  const category = categoryDropdown.value;
  questions = [...allQuestions[category]];
  currentQuestionIndex = 0;
  score = 0;
  reviewAnswers = [];

  userResult.textContent = localStorage.getItem("quizUser");

  startScreen.classList.add("hide");
  quizContainer.classList.remove("hide");

  showQuestion();
}

function showQuestion() {
  resetState();
  startTimer();

  const question = questions[currentQuestionIndex];
  questionElement.textContent = question.question;

  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("btn");
    button.onclick = () => selectAnswer(button, answer);
    answerButtons.appendChild(button);
  });
}

function resetState() {
  nextButton.style.display = "none";
  answerButtons.innerHTML = "";
  clearInterval(timer);
  timeLeft = 15;
  timeDisplay.textContent = timeLeft;
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      autoReveal();
    }
  }, 1000);
}

function autoReveal() {
  Array.from(answerButtons.children).forEach(btn => {
    btn.disabled = true;
    const isCorrect = questions[currentQuestionIndex].answers.find(a => a.text === btn.textContent).correct;
    if (isCorrect) btn.classList.add("correct");
  });
  reviewAnswers.push({
    q: questions[currentQuestionIndex].question,
    a: "No Answer",
    correct: questions[currentQuestionIndex].answers.find(a => a.correct).text
  });
  nextButton.style.display = "block";
}

function selectAnswer(button, answer) {
  clearInterval(timer);
  const correct = answer.correct;

  Array.from(answerButtons.children).forEach(btn => {
    btn.disabled = true;
    const isCorrect = questions[currentQuestionIndex].answers.find(a => a.text === btn.textContent).correct;
    if (isCorrect) btn.classList.add("correct");
    else if (btn === button && !correct) btn.classList.add("wrong");
  });

  if (correct) score++;

  reviewAnswers.push({
    q: questions[currentQuestionIndex].question,
    a: answer.text,
    correct: questions[currentQuestionIndex].answers.find(a => a.correct).text
  });

  nextButton.style.display = "block";
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  quizContainer.classList.add("hide");
  resultScreen.classList.remove("hide");
  scoreText.textContent = `${score} / ${questions.length}`;
  reviewList.innerHTML = "";

  reviewAnswers.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>Q${i + 1}:</strong> ${item.q}<br>
      <span>Your Answer:</span> ${item.a}<br>
      <span>Correct Answer:</span> ${item.correct}
    `;
    reviewList.appendChild(li);
  });
}

function restart() {
  resultScreen.classList.add("hide");
  startScreen.classList.remove("hide");
}


