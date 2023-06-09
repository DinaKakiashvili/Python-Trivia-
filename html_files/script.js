const NUMBER_OF_QUESTIONS = 7;
const bodyDiv = document.getElementById('body');
let answersList = [];
let questionsList = [];
let codesList = [];
let correctAnswersList = [];
let questionIdList = [];
let allTriviaQuestions = [];
let userList = JSON.parse('%s');
let currentUser = null;
let currentIndex = 0;

let number_of_question = 0;
let number_of_correct_answer = 0;

// Define user level
const levels = [
  {
    name: "Beginner",
    requirements: {
      answeredQuestions: -1,
      correctAnswersPercentage: -1,
    },
  },
  {
    name: "Intermediate",
    requirements: {
      answeredQuestions: 20,
      correctAnswersPercentage: 80,
    },
  },
  {
    name: "Advanced",
    requirements: {
      answeredQuestions: 50,
      correctAnswersPercentage: 90,
    },
  },
];

// Define the trophies
var trophies = [
  {
    name: "3 Streak",
    description: "Answered correctly 3 times in a row.",
    time: "26/05/2023",
    points: 10,
  },
  {
    name: "High Five!",
    description: "Answered correctly 5 times in a row.",
    time: "26/05/2023",
    points: 10,
  },
  {
    name: "Lucky Number",
    description: "Answered all 7 questions correctly in a single game.",
    time: "26/05/2023",
    points: 10,
  },
  {
    name: "Rapid Responder",
    description: "Answered all 7 questions within the time limit.",
    time: "26/05/2023",
    points: 10,
  },
  {
    name: "Easy Category Champion",
    description: "Answered all questions correctly in the Easy category.",
    time: "26/05/2023",
    points: 10,
  },
  {
    name: "Medium Category Champion",
    description: "Answered all questions correctly in the Medium category.",
    time: "26/05/2023",
    points: 10,
  },
  {
    name: "Hard Category Champion",
    description: "Answered all questions correctly in the Hard category.",
    time: "26/05/2023",
    points: 10,
  },
  {
    name: "Trivia Whiz",
    description: "Accumulated 100 total points across multiple games.",
    time: "26/05/2023",
    points: 10,
  },
];

const loginButton = document.getElementById("login-btn");
loginButton.addEventListener("click", handleLoginButton);
const menuButtons = [];

firebaseConfig = {
  databaseURL: "https://trivia-game-6a531-default-rtdb.firebaseio.com/",
};

firebase.initializeApp(firebaseConfig);
database = firebase.database().ref("SkyWard/Questions");

function handleLoginButton(event) {
  if (currentUser != null) {
    currentUser = null;
    loginButton.innerHTML = "LOGIN";
    handleLoginView(event);
  } else {
    currentUser = handleUserLogin();
    if (currentUser === null) {
      const errorLabel = document.getElementById("login-error-label");
      errorLabel.innerHTML = "Wrong Username or Password";
      return;
    }

    const sideBar = document.getElementById("side-bar");
    sideBar.innerHTML = `
      <img src="https://raw.githubusercontent.com/DinaKakiashvili/test/23a23c21ea5aef7dd8f4c9517884829612fd2aa3/SkyWardLogo.jpg" alt="Image">
      <button id="home-btn" class="sidebar-btn">HOME</button>
      <button id="play-btn" class="sidebar-btn">PLAY!</button>
      <button id="config-btn" class="sidebar-btn">CONFIG</button>
      <button id="login-btn" class="sidebar-btn">LOGOUT</button>
    `;
    const playButton = document.getElementById("play-btn");
    playButton.addEventListener("click", handleGameInfoView);
    const homeButton = document.getElementById("home-btn");
    homeButton.addEventListener("click", handleHomeView);
    const configButton = document.getElementById("config-btn");
    configButton.addEventListener("click", handleConfigView);
    menuButtons.push(playButton, homeButton, configButton);
    const loginButton = document.getElementById("login-btn");
    loginButton.addEventListener("click", handleLoginButton);

    // Check type of user
    if (!currentUser.is_manager) {
      configButton.className = "wrong-privilage-btn";
      configButton.removeEventListener("click", handleConfigView);
    }
    // Render home view
    handleHomeView(event);
  }
}

function handleLoginView(event) {
  handleMenuButtonClick(event);
  const sideBar = document.getElementById("side-bar");
  // Set the login div
  sideBar.innerHTML = `
    <img src="https://raw.githubusercontent.com/DinaKakiashvili/test/23a23c21ea5aef7dd8f4c9517884829612fd2aa3/SkyWardLogo.jpg" alt="Image">
    <input placeholder='Username' for='username' type='text' id='username-input' ></input>
    <input placeholder='Password' for='password' type='password' id='password-input'></input>
    <button id="login-btn" class="sidebar-btn">LOGIN</button>
    <label for='login-error' class='error-label' id='login-error-label'></label>
  `;
  const loginButton = document.getElementById("login-btn");
  loginButton.addEventListener("click", handleLoginButton);
}

function handleUserLogin() {
  const usernameInputValue = document.getElementById("username-input").value;
  const passwordInputValue = document.getElementById("password-input").value;
  var foundUser = null;
  // Iterate through the userList
  for (let i = 0; i < userList.length; i++) {
    const user = userList[i];
    // Check if the username and password match
    if (
      user.user_name === usernameInputValue &&
      user.password === passwordInputValue
    ) {
      // Match found!
      foundUser = user;
      break;
    }
  }
  return foundUser;
}

function handleMenuButtonClick(event) {
  // Clear view
  bodyDiv.innerHTML = "";
  // Enable all menu buttons
  menuButtons.forEach((button) => {
    button.disabled = false;
  });
  // Disabled active button
  event.target.disabled = true;
}

function fetchQuestionsFromDB(difficultyLevel) {
  database
    .orderByChild("difficulty")
    .equalTo(difficultyLevel)
    .once("value")
    .then(function (snapshot) {
      // Handle the retrieved data here
      snapshot.forEach(function (childSnapshot) {
        var question = childSnapshot.val();
        answersList.push(question.answers);
        questionsList.push(question.question);
        codesList.push(question.code);
        correctAnswersList.push(question.correctAnswer - 1);
        questionIdList.push(question.question_id);
      });

      // Shuffle the questions
      for (let i = questionsList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questionsList[i], questionsList[j]] = [
          questionsList[j],
          questionsList[i],
        ];
        [answersList[i], answersList[j]] = [answersList[j], answersList[i]];
        [codesList[i], codesList[j]] = [codesList[j], codesList[i]];
        [correctAnswersList[i], correctAnswersList[j]] = [
          correctAnswersList[j],
          correctAnswersList[i],
        ];
        [questionIdList[i], questionIdList[j]] = [
          questionIdList[j],
          questionIdList[i],
        ];
      }
      // Take only 7 questions
      questionsList = questionsList.slice(0, 7);
      answersList = answersList.slice(0, 7);
      codesList = codesList.slice(0, 7);
      correctAnswersList = correctAnswersList.slice(0, 7);
      questionIdList = questionIdList.slice(0, 7);
    })
    .catch(function (error) {
      console.error(error);
    });
}

function getAllQuestionsFromDB() {
  return database
    .once("value")
    .then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        const question = childSnapshot.val();
        allTriviaQuestions.push(question);
      });
    })
    .catch(function (error) {
      console.error(error);
    });
}

function handleConfigView(event) {
  getAllQuestionsFromDB();
  handleMenuButtonClick(event);
  // A form to add questions to the database
  const configDiv = document.createElement("div");
  configDiv.innerHTML = `
  <div class="form-container">
      <div class="columns">
      <div class="left-column">
        <div class="update-container">
          <label for="update-or-add">Update or Add:</label>
          <div class="radio-container">
            <input type="radio" id="update" name="update-or-add" value="update" required>
            <label for="update">Update</label>
          </div>
          <div class="radio-container">
            <input type="radio" id="add" name="update-or-add" value="add" required>
            <label for="add">Add</label>
          </div>
        </div>
        <label for="question">Question:</label>
        <input type="text" id="question" name="question" required>

        <label for="code-snippet">Code Snippet:</label>
        <textarea id="code-snippet" name="code-snippet" rows="4" required></textarea>

        <label for="answers">Choose correct answer:</label>
        <div class="radio-container">
          <input type="radio" id="correct-answer1" name="correct-answer" value="1" required>
          <label for="correct-answer1">Answer 1</label>
        </div>

        <div class="radio-container">
          <input type="radio" id="correct-answer2" name="correct-answer" value="2" required>
          <label for="correct-answer2">Answer 2</label>
        </div>

        <div class="radio-container">
          <input type="radio" id="correct-answer3" name="correct-answer" value="3" required>
          <label for="correct-answer3">Answer 3</label>
        </div>

        <div class="radio-container">
          <input type="radio" id="correct-answer4" name="correct-answer" value="4" required>
          <label for="correct-answer4">Answer 4</label>
        </div>
      </div>

      <div class="right-column">
        <label for="answer1">Answer 1:</label>
        <input type="text" id="answer1" name="answer1" required>

        <label for="answer2">Answer 2:</label>
        <input type="text" id="answer2" name="answer2" required>

        <label for="answer3">Answer 3:</label>
        <input type="text" id="answer3" name="answer3" required>

        <label for="answer4">Answer 4:</label>
        <input type="text" id="answer4" name="answer4" required>

        <label for="difficulty">Difficulty:</label>
        <select id="difficulty" name="difficulty" required>
          <option value="easy" selected>Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <div>
          <button id="submit-question" class="submit-button" type="submit" value="Submit">Submit</button>
        </div>
      </div>
    </div>
    <div>
    </div>
    <div class='submit-message-box' style='text-align: center; font-size: 1em; color:white;background-color:#FF0000;opacity:0.9;'></div>
  </div>
  `;
  bodyDiv.appendChild(configDiv);

  let questionValue = null;
  let codeValue = null;
  let firstAnswerValue = null;
  let secondAnswerValue = null;
  let thirdAnswerValue = null;
  let forthAnswerValue = null;
  let correctAnswerValue = null;
  let questionIdValue = null;
  let difficultyValue = "easy";

  const questionInput = document.getElementById("question");
  const codeInput = document.getElementById("code-snippet");
  const firstAnswerInput = document.getElementById("answer1");
  const secondAnswerInput = document.getElementById("answer2");
  const thirdAnswerInput = document.getElementById("answer3");
  const forthAnswerInput = document.getElementById("answer4");
  const difficultySelector = document.getElementById("difficulty");
  const radioButtons = document.querySelectorAll(
    'input[name="correct-answer"]'
  );
  const updateRadioButton = document.getElementById("update");
  const addRadioButton = document.getElementById("add");
  const questionSelect = document.createElement("select");

  // UPDATE OR ADD SECTION

  questionSelect.id = "question-select";
  questionSelect.name = "question";
  questionSelect.required = true;

  updateRadioButton.addEventListener("change", function (event) {
    if (updateRadioButton.checked) {
      // Clear the Select options
      resetQuestionSelect();
      // Event listener for the select element
      questionInput.replaceWith(questionSelect);
      clearInputs();

      document
        .getElementById("submit-question")
        .removeEventListener("click", handleAddQuestion);

      document
        .getElementById("submit-question")
        .addEventListener("click", handleUpdateQuestion);
    }
  });

  addRadioButton.addEventListener("change", function (event) {
    if (addRadioButton.checked) {
      questionSelect.replaceWith(questionInput);
      clearInputs();
      document
        .getElementById("submit-question")
        .removeEventListener("click", handleUpdateQuestion);

      document
        .getElementById("submit-question")
        .addEventListener("click", handleAddQuestion);
    }
  });

  // END SECTION

  difficultySelector.value = "easy";
  document
    .getElementById("submit-question")
    .setAttribute("difficulty", difficultyValue);

  questionInput.addEventListener("change", function (event) {
    questionValue = questionInput.value;
    document
      .getElementById("submit-question")
      .setAttribute("question", questionValue);
  });

  codeInput.addEventListener("change", function (event) {
    codeValue = codeInput.value;
    document.getElementById("submit-question").setAttribute("code", codeValue);
  });

  firstAnswerInput.addEventListener("change", function (event) {
    firstAnswerValue = firstAnswerInput.value;
    document
      .getElementById("submit-question")
      .setAttribute("firstAnswer", firstAnswerValue);
  });

  secondAnswerInput.addEventListener("change", function (event) {
    secondAnswerValue = secondAnswerInput.value;
    document
      .getElementById("submit-question")
      .setAttribute("secondAnswer", secondAnswerValue);
  });

  thirdAnswerInput.addEventListener("change", function (event) {
    thirdAnswerValue = thirdAnswerInput.value;
    document
      .getElementById("submit-question")
      .setAttribute("thirdAnswer", thirdAnswerValue);
  });

  forthAnswerInput.addEventListener("change", function (event) {
    forthAnswerValue = forthAnswerInput.value;
    document
      .getElementById("submit-question")
      .setAttribute("forthAnswer", forthAnswerValue);
  });

  radioButtons.forEach(function (radioButton) {
    radioButton.addEventListener("change", function (event) {
      radioButtons.forEach(function (rb) {
        if (rb.checked) {
          correctAnswerValue = rb.value;
          document
            .getElementById("submit-question")
            .setAttribute("correctAnswer", correctAnswerValue);
        }
      });
    });
  });

  difficultySelector.addEventListener("change", function () {
    difficultyValue = difficultySelector.value;
    document
      .getElementById("submit-question")
      .setAttribute("difficulty", difficultyValue);
  });

  questionSelect.addEventListener("change", function (event) {
    const selectedOption = questionSelect.options[questionSelect.selectedIndex];
    const selectedQuestionId = selectedOption.value;
    // Find the selected question from allTriviaQuestions
    const selectedQuestion = allTriviaQuestions.find(function (question) {
      return question.question_id == selectedQuestionId;
    });

    // Set the values of input fields
    codeInput.value = selectedQuestion.code;
    firstAnswerInput.value = selectedQuestion.answers[0];
    secondAnswerInput.value = selectedQuestion.answers[1];
    thirdAnswerInput.value = selectedQuestion.answers[2];
    forthAnswerInput.value = selectedQuestion.answers[3];
    difficultySelector.value = selectedQuestion.difficulty;
    correctAnswerValue = selectedQuestion.correctAnswer;
    radioButtons.forEach(function (radioButton) {
      if (radioButton.value === correctAnswerValue) {
        radioButton.checked = true;
      }
    });
    updateValues(selectedQuestion,selectedQuestionId);
  });

  document
    .getElementById("submit-question")
    .addEventListener("click", handleAddQuestion);
  addRadioButton.checked = true;

  function updateValues(selectedQuestion,selectedQuestionId) {
    document
    .getElementById("submit-question")
    .setAttribute("question_id", selectedQuestionId);
    document
      .getElementById("submit-question")
      .setAttribute("question", selectedQuestion.question);
    document
      .getElementById("submit-question")
      .setAttribute("code", selectedQuestion.code);
    document
      .getElementById("submit-question")
      .setAttribute("firstAnswer", selectedQuestion.answers[0]);
    document
      .getElementById("submit-question")
      .setAttribute("secondAnswer", selectedQuestion.answers[1]);
    document
      .getElementById("submit-question")
      .setAttribute("thirdAnswer", selectedQuestion.answers[2]);
    document
      .getElementById("submit-question")
      .setAttribute("forthAnswer", selectedQuestion.answers[3]);
    document
      .getElementById("submit-question")
      .setAttribute("correctAnswer", selectedQuestion.correctAnswer);
    document
      .getElementById("submit-question")
      .setAttribute("difficulty", selectedQuestion.difficulty);
    getAllQuestionsFromDB();
    resetQuestionSelect();
  }
  function resetQuestionSelect() {
    questionSelect.innerHTML = "";
    // Fill the Select options with question IDs
    allTriviaQuestions.forEach(function (question) {
      const option = document.createElement("option");
      option.value = question.question_id;
      option.textContent = question.question;
      questionSelect.appendChild(option);
    });
  }

}

function handleAddQuestion(event) {
  const resultMsgBox = document.querySelector(".submit-message-box");
  if (!checkInputs()) {
    resultMsgBox.textContent = " * Please fill all fields";
    return;
  }
  const questionValue = event.target.getAttribute("question");
  const codeValue = event.target.getAttribute("code");
  const firstAnswerValue = event.target.getAttribute("firstAnswer");
  const secondAnswerValue = event.target.getAttribute("secondAnswer");
  const thirdAnswerValue = event.target.getAttribute("thirdAnswer");
  const forthAnswerValue = event.target.getAttribute("forthAnswer");
  const correctAnswer = event.target.getAttribute("correctAnswer");
  const difficultyValue = event.target.getAttribute("difficulty");

  let amountOfQuestion = null;
  let errorFlag = false;

  database.once("value").then(function (snapshot) {
    var value = snapshot.val();
    amountOfQuestion = snapshot.numChildren();

    const questionData = {
      question: questionValue,
      question_id: amountOfQuestion + 1,
      code: codeValue,
      answers: [
        firstAnswerValue,
        secondAnswerValue,
        thirdAnswerValue,
        forthAnswerValue,
      ],
      correctAnswer: correctAnswer,
      difficulty: difficultyValue,
    };

    database
      .push()
      .set(questionData)
      .then(() => {
        console.log("Data inserted successfully!");
      })
      .catch((error) => {
        console.error("Error inserting data:", error);
        resultMsgBox.style.color = "red";
        resultMsgBox.textContent =
          "Error inserting question to database, check console for further information.";
        errorFlag = true;
      });
  });

  if (!errorFlag) {
    resultMsgBox.style.color = "white";
    resultMsgBox.textContent =
      "Question inserted succesfuly to database, clearing all inputs.";
  }
  setTimeout(function () {
    clearInputs();
    resultMsgBox.textContent = "";
  }, 5000);
}

function handleUpdateQuestion(event) {
  const resultMsgBox = document.querySelector(".submit-message-box");
  if (!checkInputs()) {
    resultMsgBox.textContent = " * Please fill all fields";
    return;
  }

  const questionId = event.target.getAttribute("question_id");
  const questionValue = event.target.getAttribute("question");
  const codeValue = event.target.getAttribute("code");
  const firstAnswerValue = event.target.getAttribute("firstAnswer");
  const secondAnswerValue = event.target.getAttribute("secondAnswer");
  const thirdAnswerValue = event.target.getAttribute("thirdAnswer");
  const forthAnswerValue = event.target.getAttribute("forthAnswer");
  const correctAnswer = event.target.getAttribute("correctAnswer");
  const difficultyValue = event.target.getAttribute("difficulty");

  const questionData = {
    question: questionValue,
    code: codeValue,
    answers: [
      firstAnswerValue,
      secondAnswerValue,
      thirdAnswerValue,
      forthAnswerValue,
    ],
    correctAnswer: correctAnswer,
    difficulty: difficultyValue,
  };

  let questionRef = null;
  database.once("value").then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      const childData = childSnapshot.val();
      console.log(childData);
      if (childData.question_id == questionId) {
        questionRef = childSnapshot.ref;
        return true; // Exit the loop if the question is found
      }
    });

    console.log(questionRef);

    if (questionRef) {
      questionRef
        .update(questionData)
        .then(() => {
          console.log("Question updated successfully!");
          resultMsgBox.style.color = "white";
          resultMsgBox.textContent =
            "Question updated successfully in the database.";
        })
        .catch((error) => {
          console.error("Error updating question:", error);
          resultMsgBox.style.color = "red";
          resultMsgBox.textContent =
            "Error updating question in the database, check console for further information.";
        });
    } else {
      resultMsgBox.style.color = "red";
      resultMsgBox.textContent = "Question not found in the database.";
    }
  });

  setTimeout(function () {
    clearInputs();
    resultMsgBox.textContent = "";
  }, 5000);
}

function checkInputs() {
  const questionInput =
    document.getElementById("question") == null
      ? document.getElementById("question-select").value
      : document.getElementById("question").value;
  const codeInput = document.getElementById("code-snippet").value;
  const firstAnswerInput = document.getElementById("answer1").value;
  const secondAnswerInput = document.getElementById("answer2").value;
  const thirdAnswerInput = document.getElementById("answer3").value;
  const forthAnswerInput = document.getElementById("answer4").value;
  const difficultySelector = document.getElementById("difficulty").value;

  if (
    questionInput === "" ||
    codeInput === "" ||
    firstAnswerInput === "" ||
    secondAnswerInput === "" ||
    thirdAnswerInput === "" ||
    forthAnswerInput === "" ||
    difficultySelector === "" ||
    document.querySelector('input[name="correct-answer"]:checked') === null
  ) {
    return false;
  }
  return true;
}

function clearInputs() {
  const questionInput =
    document.getElementById("question") == null
      ? (document.getElementById("question-select").value = "")
      : (document.getElementById("question").value = "");
  const codeInput = (document.getElementById("code-snippet").value = "");
  const firstAnswerInput = (document.getElementById("answer1").value = "");
  const secondAnswerInput = (document.getElementById("answer2").value = "");
  const thirdAnswerInput = (document.getElementById("answer3").value = "");
  const forthAnswerInput = (document.getElementById("answer4").value = "");
  const difficultySelector = (document.getElementById("difficulty").value = "");

  const radioButtons = document.querySelectorAll(
    'input[name="correct-answer"]'
  );
  radioButtons.forEach((radioButton) => {
    if (radioButton.checked) {
      radioButton.checked = false;
    }
  });
}

function handleGameInfoView(event) {
  // Clear questions
  answersList = [];
  questionsList = [];
  codesList = [];
  correctAnswersList = [];
  questionIdList = [];
  currentIndex = 0;
  // Handle menu button click
  handleMenuButtonClick(event);
  // Set the gameInfo div
  const gameInfoDiv = document.createElement("div");
  gameInfoDiv.innerHTML = `<div class="grid-container">
    <div class = "game-description">
        "Skyward" is a captivating trivia game designed to challenge your Python programming skills.<br><br>
        Test your knowledge of Python syntax, data types, control flow, and more in this engaging game.<br><br>
        Each question presents a code snippet, and you'll have to review it and choose the best answer from four options provided.<br><br>
        With a wide range of difficulty levels, from Easy to Hard, the game caters to Python enthusiasts of all skill levels.<br><br>
        Explore real-world coding scenarios and puzzles that will enhance your understanding of Python concepts.
    </div>

    <div class="game-config">
      <select id="choose-difficulty" name="difficulty">
        <option value="" disabled selected>Select Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <button id="start-game-btn" class = "start-btn" >Start Game</button>
    </div>
    <div class='error-msg-box'>

    </div>
  </div>`;

  bodyDiv.appendChild(gameInfoDiv);

  const difficultySelector = document.getElementById("choose-difficulty");

  // Disable options based on user's level
  const userLevel = currentUser.level;
  if (userLevel === "Beginner") {
    difficultySelector.options[1].disabled = false; // Enable Easy
    difficultySelector.options[2].disabled = true; // Disable Medium
    difficultySelector.options[3].disabled = true; // Disable Hard
  } else if (userLevel === "Intermediate") {
    difficultySelector.options[1].disabled = false; // Enable Easy
    difficultySelector.options[2].disabled = false; // Enable Medium
    difficultySelector.options[3].disabled = true; // Disable Hard
  } else {
    difficultySelector.options[1].disabled = false; // Enable Easy
    difficultySelector.options[2].disabled = false; // Enable Medium
    difficultySelector.options[3].disabled = false; // Enable Hard
  }
  difficultySelector.value = "Easy";
  difficultySelector.addEventListener("change", function () {
    difficultyValue = difficultySelector.value;
    document
      .getElementById("start-game-btn")
      .setAttribute("difficulty", difficultyValue);
    fetchQuestionsFromDB(difficultyValue);
  });
  document
    .getElementById("start-game-btn")
    .addEventListener("click", checkChooseDifficulty);
}

function checkChooseDifficulty(event) {
  const resultMsgBox = document.querySelector(".error-msg-box");
  if (document.getElementById("choose-difficulty").value === "") {
    resultMsgBox.textContent = " * Please choose the game's difficulty";
    return;
  } else handlePlayView(event);
}

function handlePlayView(event) {
  let userAnswersList = {};
  currentIndex = 0;
  // Handle menu button click
  handleMenuButtonClick(event);
  // Set the game div
  const gameDiv = document.createElement("div");
  gameDiv.innerHTML = `<div class="grid-container">
    <div id="question-box" class="grid-question-box">
      <div>
        <h1 id="question-title">QUESTION | EASY</h1>
        <span id="question-text"></span>
      </div>
      <div id="question-btn-menu">
        <button id="prev-question"><- PREVIOUS QUESTION</button>
        <button id="skip-question">SKIP QUESTION -></button>
      </div>
    </div>
    <div id="code-box" class="grid-code-box">
      <textarea readonly id="code-text"></textarea>
    </div>
    <div id="answers-box" class="grid-answers-box">
      <button id="answer-btn-0"></button>
      <button id="answer-btn-1"></button>
      <button id="answer-btn-2"></button>
      <button id="answer-btn-3"></button>
    </div>
    <div id="progress-box" class="grid-progress-box"></div>
  </div>`;
  bodyDiv.appendChild(gameDiv);

  var isChangingQuestion = false;
  const skipQuestionButton = document.getElementById("skip-question");
  skipQuestionButton.addEventListener("click", function () {
    if (!isChangingQuestion) {
      currentIndex += 1;
      if (currentIndex === NUMBER_OF_QUESTIONS) {
        handleGameOver();
      }
      setQuestion();
      handleProgNode();
    }
  });

  const prevQuestionButton = document.getElementById("prev-question");
  prevQuestionButton.addEventListener("click", function () {
    if (!isChangingQuestion) {
      if (currentIndex > 0) {
        currentIndex -= 1;
      }
      setQuestion();
      handleProgNode();
    }
  });

  const answerButtons = document.querySelectorAll("#answers-box > button");

  function displayProgressNode(index) {
    const divNode = document.createElement("div");
    divNode.classList.add(`prog-node-${index}`);
    return divNode;
  }

  const progressBox = document.getElementById("progress-box");
  for (let i = 0; i < questionsList.length; i++) {
    progressBox.appendChild(displayProgressNode(i));
  }

  function setQuestion() {
    var currentProgressNode = document.querySelector(
      `.prog-node-${currentIndex}`
    );

    // Display answers
    answerButtons.forEach(
      (element, index) => (element.innerHTML = answersList[currentIndex][index])
    );
    // Set the question
    document.getElementById("question-text").innerHTML =
      questionsList[currentIndex];
    // Set the code
    document.getElementById("code-text").value = codesList[currentIndex];

    answerButtons.forEach(function (button) {
      button.disabled = false;
      button.style.backgroundColor = "#5282b2";
    });

    if (
      getComputedStyle(currentProgressNode).backgroundColor !=
      "rgb(255, 255, 255)"
    ) {
      var buttonIndex = userAnswersList[currentIndex];
      var questionId = questionIdList[currentIndex];
      if (
        currentUser.completed_questions.filter((question) =>
          question.hasOwnProperty(questionId)
        ) != []
      ) {
        // User already answered this question
        answerButtons.forEach(function (button, index) {
          button.disabled = true;
          if (index.toString() === buttonIndex.toString()) {
            button.style.backgroundColor =
              getComputedStyle(currentProgressNode).backgroundColor;
          } else {
            button.style.backgroundColor = "#5282b2";
          }
        });
      }
    }
  }

  function handleGameOver() {
    handleUserUpdate_DB();

    answersList = [];
    questionsList = [];
    codesList = [];
    correctAnswersList = [];
    questionIdList = [];
    bodyDiv.innerHTML = "";
    const gameDiv = document.createElement("div");

    gameDiv.innerHTML = `
    <div class="end-game">
      END GAME!
      <canvas id="chartCanvas"></canvas>
    </div>
    `;

    bodyDiv.appendChild(gameDiv);

    const chartCanvas = document.getElementById("chartCanvas");
    const chartData = {
      labels: ["Correct", "Incorrect"],
      datasets: [
        {
          label: "Correct answers",
          data: [
            number_of_correct_answer,
            number_of_question - number_of_correct_answer,
          ],
          backgroundColor: ["green", "red"],
        },
      ],
    };
    const maxTicks = Math.ceil(number_of_question);
    new Chart(chartCanvas, {
      type: "bar",
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: maxTicks,
            ticks: {
              color: "white",
              stepSize: 1,
            },
          },
          x: {
            ticks: {
              color: "white",
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Question Results",
            color: "white",
            font: {
              size: 30,
            },
          },
        },
      },
    });

    number_of_question = 0;
    number_of_correct_answer = 0;
  }

  let streakCounter = 0;
  // Get already earned trophies from the user

  var earnedTrophyNames = new Set(
    currentUser.trophies.map((trophy) => trophy.name)
  );

  function handleUserUpdate(isCorrect) {
    // Add completed question to user's data
    completed_question = {
      [questionIdList[currentIndex]]: isCorrect,
    };
    currentUser.completed_questions.push(completed_question);
    // Update number of questions answered
    number_of_question = Number(number_of_question) + 1 + "";
    if (isCorrect) {
      currentUser.points += 1;
      streakCounter += 1;
      // Define the streak trophy names and corresponding streak thresholds
      var streakTrophies = [
        { name: "3 Streak", streakThreshold: 3 },
        { name: "High Five!", streakThreshold: 5 },
        { name: "Lucky Number", streakThreshold: 7 },
      ];

      // Check if any of the streak trophies are earned
      streakTrophies.forEach((streakTrophy) => {
        if (
          streakCounter === streakTrophy.streakThreshold &&
          !earnedTrophyNames.has(streakTrophy.name)
        ) {
          var earnedTrophy = trophies.find(
            (trophy) => trophy.name === streakTrophy.name
          );
          currentUser.trophies.push(earnedTrophy);
          currentUser.points += earnedTrophy.points;
          earnedTrophyNames.add(streakTrophy.name);
        }
      });
    } else {
      streakCounter = 0; // Reset the streak counter if the answer is incorrect
    }
  }

  function handleAnswerClick(event) {
    isChangingQuestion = true;
    const buttonIndex = event.target.getAttribute("data-index").toString();
    userAnswersList[currentIndex] = buttonIndex;
    // Add the user's answer to the list
    trackProgress(
      buttonIndex == Number(correctAnswersList[currentIndex]) + "",
      buttonIndex
    );
    handleUserUpdate(
      buttonIndex == Number(correctAnswersList[currentIndex]) + ""
    );
    currentIndex = currentIndex + 1;
    if (currentIndex === questionsList.length) {
      setTimeout(function () {
        handleGameOver();
      }, 2500);
    } else {
      setTimeout(function () {
        handleProgNode();
        setQuestion();
        isChangingQuestion = false;
      }, 2500);
    }
  }

  function trackProgress(isCorrect, buttonIndex) {
    var currentProgressNode = document.querySelector(
      `.prog-node-${currentIndex}`
    );
    const currentButton = document.querySelector(`#answer-btn-${buttonIndex}`);
    if (isCorrect) {
      currentProgressNode.style.backgroundColor = "green";
      currentButton.style.backgroundColor = "green";
      number_of_correct_answer = Number(number_of_correct_answer) + 1 + "";
    } else {
      currentProgressNode.style.backgroundColor = "red";
      currentButton.style.backgroundColor = "red";
    }
    setTimeout(function () {
      currentButton.style.backgroundColor = "";
      answerButtons.forEach((button) => {
        button.disabled = false;
      });
    }, 2500);
    answerButtons.forEach((button) => {
      button.disabled = true;
    });
  }

  function handleProgNode() {
    var progNodeList = document.querySelectorAll('[class^="prog-node-"]');
    progNodeList.forEach((node) => {
      if (node.classList.contains(`prog-node-${currentIndex}`)) {
        node.style.outline = "3px solid #fff";
        node.style.outlineOffset = "3px";
      } else {
        node.style.outline = "none";
      }
    });
  }

  handleProgNode();
  setQuestion();
  for (let i = 0; i < answerButtons.length; i++) {
    var answerBtn = document.getElementById(`answer-btn-${i}`);
    // Add an index attribute for each button
    answerBtn.setAttribute("data-index", i);
    // Add event listeners to the buttons to handle question answering
    answerBtn.addEventListener("click", handleAnswerClick);
  }
}

function handleHomeView(event) {
  // Handle menu button click
  handleMenuButtonClick(event);
  var readyToLevelUp = false;
  const userAnsweredQuestions = currentUser.completed_questions.filter(
    (question) => question != null
  ).length;
  var userCorrectAnswers = 0;
  currentUser.completed_questions.forEach((question) => {
    //count correct questions
    if (question != null && Object.values(question)[0]) {
      userCorrectAnswers += 1;
    }
  });
  var userSuccessRate = 0;
  if (userAnsweredQuestions > 0) {
    userSuccessRate = (userCorrectAnswers / userAnsweredQuestions) * 100;
  }

  let remainingRequirements = null;
  let nextLevel = null;
  // Update user level if needed
  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    const { answeredQuestions, correctAnswersPercentage } = level.requirements;
    if (
      userAnsweredQuestions >= answeredQuestions &&
      userSuccessRate >= correctAnswersPercentage
    ) {
      currentUser.level = level.name;

      if (i < levels.length - 1) {
        nextLevel = levels[i + 1];
        const remainingAnsweredQuestions =
          nextLevel.requirements.answeredQuestions - userAnsweredQuestions;
        const remainingSuccessRate =
          nextLevel.requirements.correctAnswersPercentage;

        remainingRequirements = {
          answeredQuestions: Math.max(remainingAnsweredQuestions, 0),
          correctAnswersPercentage: Math.max(remainingSuccessRate, 0),
        };
      }
    }
  }

  const homeDiv = document.createElement("div");
  homeDiv.innerHTML = `
    <div class="grid-container">
      <div class="home-view-div" id="home-stats"></div>
      <div class="home-view-div" id="home-level"></div>
      <div class="home-view-div" id="home-leader">Leaderboard</div>
    </div>
    <div class="home-view-div trophy-container" id="home-trophy"></div>
  `;

  bodyDiv.appendChild(homeDiv);

  var homeLevelContainer = document.getElementById("home-level");
  // Generate HTML content for the user's level
  var levelHTML = "";

  levelHTML += "<p>Next level is " + nextLevel.name + "</p>";
  levelHTML +=
    "<p>To level up, you need to answer " +
    remainingRequirements.answeredQuestions +
    " more questions and maintain a success rate of " +
    remainingRequirements.correctAnswersPercentage +
    "%%.</p>";
  levelHTML += "<p id='level-up-text'></p>";
  levelHTML +=
    "<button id='level-up-btn' class='wrong-privilage-btn' style='margin: 0; margin-top: 10px; margin-bottom: 10px;'>LEVEL UP</button>";

  // Update the contents of the <div> element with the level HTML
  homeLevelContainer.innerHTML = levelHTML;

  // Check if the user is ready to level up
  if (
    remainingRequirements.answeredQuestions <= 0 &&
    remainingRequirements.correctAnswersPercentage <= userSuccessRate
  ) {
    readyToLevelUp = true;
    levelUpText = document.getElementById("level-up-text");
    levelUpText.innerHTML = "You are ready to level up!";
    levelUpButton = document.getElementById("level-up-btn");
    levelUpButton.className = "sidebar-btn";
    levelUpButton.addEventListener("click", function () {
      currentUser.level = nextLevel.name;
      handleUserUpdate_DB();
      handleHomeView(event);
    });
  } else {
    readyToLevelUp = false;
  }

  var leaderboardContainer = document.getElementById("home-leader");
  // Generate HTML content for the leaderboard
  var leaderboardHTML = "";
  userList.sort((a, b) => parseFloat(b.points) - parseFloat(a.points));
  if (!userList.length) {
    leaderboardContainer.innerHTML = "No users";
  } else {
    for (var i = 0; i < userList.length; i++) {
      var user = userList.sort()[i];
      leaderboardHTML += '<div class="leaderboard-user">';
      leaderboardHTML +=
        `<p>${i + 1}.&nbsp;</p>` +
        " " +
        "<p class='leaderboard-username'>" +
        user.user_name +
        "</p>";
      leaderboardHTML +=
        "<p class='leaderboard-points'>" + user.points + "</p>";
      leaderboardHTML += "</div>";
    }
  }
  // Update the contents of the <div> element with the leaderboard HTML
  leaderboardContainer.innerHTML = leaderboardHTML;

  var trophyContainer = document.getElementById("home-trophy");
  // Generate HTML content for the user's trophies
  var trophyHTML = "";

  if (!currentUser.trophies.length) {
    trophyHTML = "No trophies";
  } else {
    for (var i = 0; i < currentUser.trophies.length; i++) {
      var trophy = currentUser.trophies[i];
      trophyHTML += '<div class="trophy">';
      trophyHTML += "<p>" + trophy.name + "</p>";
      trophyHTML += "<p>" + trophy.description + "</p>";
      trophyHTML += "</div>";
    }
  }

  // Update the contents of the <div> element with the trophy HTML
  trophyContainer.innerHTML = trophyHTML;

  var statsContainer = document.getElementById("home-stats");
  // Create HTML content for the user's details
  var userDetailsHTML = "<p>Welcome back " + currentUser.user_name + "</p>";
  userDetailsHTML += "<p>Player Level: " + currentUser.level + "</p>";
  userDetailsHTML += "<p>Total Points: " + currentUser.points + "</p>";
  userDetailsHTML +=
    "<p>You have answered " + userAnsweredQuestions + " questions.</p>";
  userDetailsHTML += `<p>You have a ${userSuccessRate.toFixed(
    2
  )}%% success rate.</p>`;

  // Update the contents of the <div> element with the user details HTML
  statsContainer.innerHTML = userDetailsHTML;
}

function handleUserUpdate_DB() {
  // Update the user in the Firebase database
  const userKey = currentUser.db_key;
  const userPath = `/SkyWard/Users/${userKey}`;
  const userRef = firebase.database().ref(userPath);
  userRef
    .set(currentUser)
    .then(() => {
      console.log("User updated successfully");
    })
    .catch((error) => {
      console.error("Error updating user:", error);
    });
  console.log(currentUser);
}
