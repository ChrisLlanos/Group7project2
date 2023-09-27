// Spanish and Japanese quiz questions

document.addEventListener("DOMContentLoaded", function () {
  const spanishButton = document.getElementById("spanish-button");
  const japaneseButton = document.getElementById("japanese-button");
  const quizContainer = document.getElementById("quiz-container");

  function fetchAndGenerateQuiz(language) {
    fetch("/json")
      .then((response) => response.json())
      .then((quizData) => {
        generateQuiz(quizData, language);
      })
      .catch((error) => {
        console.error("Error fetching quiz data:", error);
      });
  }
  spanishButton.addEventListener("click", function () {
    generateQuiz(quizData, "Spanish");
  });

  japaneseButton.addEventListener("click", function () {
    generateQuiz(quizData, "Japanese");
  });

  function generateQuiz(quizData, language) {
    quizContainer.innerHTML = "";

    const filteredQuizData = quizData.filter(
      (question) => question.language === language
    );

    filteredQuizData.forEach(function (questionData, index) {
      const questionDiv = document.createElement("div");
      questionDiv.className = "question";
      questionDiv.innerHTML = `<p>${index + 1}. ${questionData.question}</p>`;

      const choicesDiv = document.createElement("div");
      choicesDiv.className = "choices";

      questionData.choices.forEach(function (choice, choiceIndex) {
        const choiceInput = document.createElement("input");
        choiceInput.type = "radio";
        choiceInput.name = `q${index}`;
        choiceInput.value = choiceIndex;
        choicesDiv.appendChild(choiceInput);

        const choiceLabel = document.createElement("label");
        choiceLabel.textContent = choice;
        choicesDiv.appendChild(choiceLabel);

        choicesDiv.appendChild(document.createElement("br"));
      });

      quizContainer.appendChild(questionDiv);
      quizContainer.appendChild(choicesDiv);
    });
    let userScore = 0;
    //submit
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.addEventListener("click", function () {
      evaluateAnswers(filteredQuizData);
    });
    quizContainer.appendChild(submitButton);
  }

  function evaluateAnswers(filteredQuizData) {
    let correctAnswers = 0;

    filteredQuizData.forEach(function (questionData, index) {
      const selectedAnswerIndex = getSelectedAnswerIndex(`q${index}`);
      const correctAnswerIndex = questionData.correctAnswer;

      if (selectedAnswerIndex === correctAnswerIndex) {
        correctAnswers++;
      }
    });

    userScore = correctAnswers;

    const quizSummary = document.querySelector(".quiz-summary");
    quizSummary.innerHTML = `<p>Your score: ${correctAnswers} out of ${filteredQuizData.length}</p>`;
    quizSummary.style.display = "block";
  }

  function getSelectedAnswerIndex(name) {
    const selectedAnswer = document.querySelector(
      `input[name="${name}"]:checked`
    );
    if (selectedAnswer) {
      return parseInt(selectedAnswer.value);
    }
    return -1;
  }
});
