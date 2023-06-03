const bodyDiv = document.getElementById('body');
let answersList = [];
let questionsList = [];
let codesList = [];
let correctAnswersList = [];
let questionIdList = [];

let currentUser = JSON.parse('%s');

let currentIndex = 0;

let number_of_question = 0;
let number_of_correct_answer = 0;



firebaseConfig = {
  "databaseURL" : 'https://trivia-game-6a531-default-rtdb.firebaseio.com/'
}

firebase.initializeApp(firebaseConfig);
database = firebase.database().ref("SkyWard/Questions");




const playButton = document.getElementById('play-btn');
playButton.addEventListener('click', handleGameInfoView);

const homeButton = document.getElementById('home-btn');
homeButton.addEventListener('click', handleHomeView);


const configButton = document.getElementById('config-btn');
configButton.addEventListener('click', handleConfigView);

const menuButtons = [];
menuButtons.push(playButton, homeButton, configButton);

function handleMenuButtonClick(event) {
  // Clear view
  bodyDiv.innerHTML = "";
  // Enable all menu buttons
  menuButtons.forEach(button => {
    button.disabled = false;
  });
  // Disabled active button
  event.target.disabled = true;
}

function fetchQuestionsFromDB(difficultyLevel) {
  answersList = [];
  questionsList = [];
  codesList = [];
  correctAnswersList = [];
  questionIdList = [];
  database.orderByChild('difficulty').equalTo(difficultyLevel).once('value')
      .then(function(snapshot) {
        // Handle the retrieved data here
        snapshot.forEach(function(childSnapshot) {
          var question = childSnapshot.val();
          answersList.push(question.answers)
          questionsList.push(question.question)
          codesList.push(question.code)
          correctAnswersList.push(question.correctAnswer)
          questionIdList.push(question.question_id)
          console.log(question)
        });
      })
      .catch(function(error) {
        console.error(error);
    });    
}

function handleConfigView(event) {
  // Handle menu button click
  handleMenuButtonClick(event);
  // A form to add questions to the database
  const configDiv = document.createElement('div');
  configDiv.innerHTML = `
    <div class="form-container">
        <div class="columns">
            <div class="questionAdd-config">
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
                <button id = "submit-question" class="submit-button" type="submit" value="Submit">Submit</button>
              </div>


            </div>
        </div>
        <div>
          </div>
            <div class='submit-message-box' style='text-align: center; font-size: 1em;'></div>

        </div>       
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
  let difficultyValue = 'easy';

  const questionInput = document.getElementById('question');
  const codeInput = document.getElementById('code-snippet');

  const firstAnswerInput = document.getElementById('answer1');
  const secondAnswerInput = document.getElementById('answer2');
  const thirdAnswerInput = document.getElementById('answer3');
  const forthAnswerInput = document.getElementById('answer4');

  const difficultySelector = document.getElementById('difficulty');
  difficultySelector.value = 'easy'
  document.getElementById('submit-question').setAttribute('difficulty', difficultyValue);

  questionInput.addEventListener('change', function(event) {
  questionValue = questionInput.value;
  document.getElementById('submit-question').setAttribute('question', questionValue);
  });

  codeInput.addEventListener('change', function(event) {
  codeValue = codeInput.value;
  document.getElementById('submit-question').setAttribute('code', codeValue);

  });

  firstAnswerInput.addEventListener('change', function(event) {
  firstAnswerValue = firstAnswerInput.value;
  document.getElementById('submit-question').setAttribute('firstAnswer', firstAnswerValue);

  });

  secondAnswerInput.addEventListener('change', function(event) {
  secondAnswerValue = secondAnswerInput.value;
  document.getElementById('submit-question').setAttribute('secondAnswer', secondAnswerValue);

  });

  thirdAnswerInput.addEventListener('change', function(event) {
  thirdAnswerValue = thirdAnswerInput.value;
  document.getElementById('submit-question').setAttribute('thirdAnswer', thirdAnswerValue);

  });

  forthAnswerInput.addEventListener('change', function(event) {
  forthAnswerValue = forthAnswerInput.value;
  document.getElementById('submit-question').setAttribute('forthAnswer', forthAnswerValue);

  });


  const radioButtons = document.querySelectorAll('input[name="correct-answer"]');

  radioButtons.forEach(function(radioButton) {
    radioButton.addEventListener('change', function(event) {
      radioButtons.forEach(function(rb) {
        if(rb.checked){
          correctAnswerValue = rb.value;
          document.getElementById('submit-question').setAttribute('correctAnswer', correctAnswerValue);
        }
      });
    });
  });

  difficultySelector.addEventListener('change', function(){
    difficultyValue = difficultySelector.value;
    document.getElementById('submit-question').setAttribute('difficulty', difficultyValue);
  });

  
  document.getElementById('submit-question').addEventListener('click', handleAddQuestion);
}


function handleAddQuestion(event){
  const resultMsgBox = document.querySelector('.submit-message-box')
  if (!checkInputs()) {
    resultMsgBox.textContent = " * Please fill all fields"
    return;
  }
  const questionValue = event.target.getAttribute('question');
  const codeValue = event.target.getAttribute('code');
  const firstAnswerValue = event.target.getAttribute('firstAnswer');
  const secondAnswerValue = event.target.getAttribute('secondAnswer');
  const thirdAnswerValue = event.target.getAttribute('thirdAnswer');
  const forthAnswerValue = event.target.getAttribute('forthAnswer');
  const correctAnswer = event.target.getAttribute('correctAnswer');
  const difficultyValue = event.target.getAttribute('difficulty');

  let amountOfQuestion = null;
  let errorFlag = false;

  database.once("value")
    .then(function(snapshot){
      var value = snapshot.val();
      amountOfQuestion = snapshot.numChildren();

      const questionData = {
      question: questionValue,
      question_id: (amountOfQuestion + 1),
      code: codeValue,
      answers: [firstAnswerValue, secondAnswerValue, thirdAnswerValue, forthAnswerValue],
      correctAnswer: correctAnswer,
      difficulty: difficultyValue
      };

      database.push().set(questionData)
      .then(() => {
        console.log("Data inserted successfully!");
      })
      .catch((error) => {
        console.error("Error inserting data:", error);
        resultMsgBox.style.color = "red";
        resultMsgBox.textContent = "Error inserting question to database, check console for further information.";
        errorFlag = true;
      });
    });

    if (!errorFlag) {
      resultMsgBox.style.color = "white";
      resultMsgBox.textContent = "Question inserted succesfuly to database, clearing all inputs.";
    }
    setTimeout(function() {
        clearInputs();
        resultMsgBox.textContent = "";
    }, 5000);

}

function checkInputs() {
  const questionInput = document.getElementById('question').value;
  const codeInput = document.getElementById('code-snippet').value;
  const firstAnswerInput = document.getElementById('answer1').value;
  const secondAnswerInput = document.getElementById('answer2').value;
  const thirdAnswerInput = document.getElementById('answer3').value;
  const forthAnswerInput = document.getElementById('answer4').value;
  const difficultySelector = document.getElementById('difficulty').value;

  if (
    questionInput === '' ||
    codeInput === '' ||
    firstAnswerInput === '' ||
    secondAnswerInput === '' ||
    thirdAnswerInput === '' ||
    forthAnswerInput === '' ||
    difficultySelector === '' ||
    document.querySelector('input[name="correct-answer"]:checked') === null
  ) {
    return false;
  }
  return true;
}

function clearInputs() {
    const questionInput = document.getElementById('question').value = '';
    const codeInput = document.getElementById('code-snippet').value = '';
    const firstAnswerInput = document.getElementById('answer1').value = '';
    const secondAnswerInput = document.getElementById('answer2').value = '';
    const thirdAnswerInput = document.getElementById('answer3').value = '';
    const forthAnswerInput = document.getElementById('answer4').value = '';
    const difficultySelector = document.getElementById('difficulty').value = '';

    const radioButtons = document.querySelectorAll('input[name="correct-answer"]');
    radioButtons.forEach((radioButton) => {
      if (radioButton.checked) {
        radioButton.checked = false;
      }
    });
}

function handleGameInfoView(event) {
  currentIndex = 0;
  // Handle menu button click
  handleMenuButtonClick(event);
  // Set the gameInfo div
  const gameInfoDiv = document.createElement('div');
  gameInfoDiv.innerHTML = `<div class="grid-container">
    <div class = "game-description">

        "Skyward" is a captivating trivia game designed to challenge your Python programming skills.<br><br>
        Test your knowledge of Python syntax, data types, control flow, and more in this engaging game.<br><br>
        Each question presents a code snippet, and you'll have to review it and choose the best answer from four options provided.<br><br>
        With a wide range of difficulty levels, from Easy to Hard, the game caters to Python enthusiasts of all skill levels.<br><br>
        Explore real-world coding scenarios and puzzles that will enhance your understanding of Python concepts.

    </div>

    <div class="game-config">
      <div>
        <select id="choose-difficulty" name="difficulty" value="Easy">
          <option value="" disabled selected>Game Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <button id="start-game-btn" class = "start-btn" >Start Game</button>
      <div class='error-msg-box'>

    </div>
  </div>`;

  bodyDiv.appendChild(gameInfoDiv);
  
  const difficultySelector = document.getElementById('choose-difficulty');
  difficultySelector.value = '';
  difficultySelector.addEventListener('change', function(){
    difficultyValue = difficultySelector.value;
    document.getElementById('start-game-btn').setAttribute('difficulty', difficultyValue);
    fetchQuestionsFromDB(difficultyValue);
  });
  document.getElementById('start-game-btn').addEventListener('click', checkChooseDifficulty);
}

function checkChooseDifficulty(event){
  const resultMsgBox = document.querySelector('.error-msg-box');
  if (document.getElementById('choose-difficulty').value === '') {
    resultMsgBox.textContent = " * Please choose the game's difficulty";
    return;
  }
  else
    handlePlayView(event);
}

function handlePlayView(event) {
  currentIndex = 0;
  // Handle menu button click
  handleMenuButtonClick(event);
  // Set the game div
  const gameDiv = document.createElement('div');
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
      <textarea id="code-text"></textarea>
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
  

  const answerButtons = document.querySelectorAll('#answers-box > button');

  function displayProgressNode(index) {
    const divNode = document.createElement('div');
    divNode.classList.add(`prog-node-${index}`);
    return divNode;
  }

  const progressBox = document.getElementById('progress-box');
  for (let i = 0; i < questionsList.length; i++) {
    progressBox.appendChild(displayProgressNode(i));
  }

  function setQuestion() {
    // Display answers
    answerButtons.forEach((element, index) => element.innerHTML = answersList[currentIndex][index]);
    // Set the question
    document.getElementById('question-text').innerHTML = questionsList[currentIndex];
    // Set the code
    document.getElementById('code-text').value = codesList[currentIndex];
  }

  function handleGameOver() {
    answersList = [];
    questionsList = [];
    codesList = [];
    correctAnswersList = [];
    questionIdList = [];
    bodyDiv.innerHTML = '';
    const gameDiv = document.createElement('div');

    gameDiv.innerHTML = `<div class="end-game">
      END GAME!
      <canvas id="chartCanvas"></canvas>
    </div>`;

    bodyDiv.appendChild(gameDiv);

    const chartCanvas = document.getElementById('chartCanvas');
    const chartData = {
      labels: ['Correct', 'Incorrect'],
      datasets: [{
        label: 'Question Results',
        data: [number_of_correct_answer, number_of_question - number_of_correct_answer],
        backgroundColor: ['green', 'red'],
      }],
    };

    new Chart(chartCanvas, {
      type: 'bar',
      data: chartData,
      options: {
        scales: {
         y: {
            beginAtZero: true,
            max: number_of_question,
            ticks: {
              color: 'white', 
            },
          },
         x: {
            ticks: {
              color: 'white', 
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Question Results',
            color: 'white', 
          },
        },
      },
    });

    number_of_question = 0;
    number_of_correct_answer = 0;
  }


  function handleUserUpdate(isCorrect) {
    // Update user
    currentUser.completed_questions[questionIdList[currentIndex]] = isCorrect;
    number_of_question = Number(number_of_question) + 1 + '';
    if (isCorrect){ 
      currentUser.points = Number(currentUser.points) + 2 + '';
      number_of_correct_answer = Number(number_of_correct_answer) + 1 + '';
    }
    console.log(currentUser);

  
  }

  function handleAnswerClick(event) { 
    const buttonIndex = event.target.getAttribute('data-index').toString();
    console.log(buttonIndex);
    console.log(currentIndex);
    console.log(questionsList); 
    console.log(correctAnswersList);  
    console.log(Number(correctAnswersList[currentIndex])-1 + '');
    trackProgress(buttonIndex == (Number(correctAnswersList[currentIndex])-1 + ''), buttonIndex); 
    handleUserUpdate(buttonIndex == (Number(correctAnswersList[currentIndex])-1 + ''));
    currentIndex = currentIndex + 1;
    if (currentIndex === questionsList.length) {
      setTimeout(function() {
        handleGameOver();
      }, 2500);
    }
    else {
      setTimeout(function() {
        setQuestion();
      }, 2500);
    }
  }

  function trackProgress(isCorrect, buttonIndex) {
    const progressNode = document.querySelector(`.prog-node-${currentIndex}`);
    const currentButton = document.querySelector(`#answer-btn-${buttonIndex}`);
    if (isCorrect) {
      progressNode.style.backgroundColor = 'green';
      currentButton.style.backgroundColor = 'green';
    } else {
      progressNode.style.backgroundColor = 'red';
      currentButton.style.backgroundColor = 'red';
    }
    setTimeout(function() {
      currentButton.style.backgroundColor = '';
      answerButtons.forEach(button => {
        button.disabled = false;
      });
    }, 2500);
    answerButtons.forEach(button => {
      button.disabled = true;
    });
  }

  setQuestion();
  for (let i = 0; i < answerButtons.length; i++) {
    var answerBtn = document.getElementById(`answer-btn-${i}`);
    // Add an index attribute for each button
    answerBtn.setAttribute('data-index', i);
    // Add event listeners to the buttons to handle question answering
    answerBtn.addEventListener('click', handleAnswerClick);
  }
}

function handleHomeView(event) {
  // Handle menu button click
  handleMenuButtonClick(event);

 

  const homeDiv = document.createElement('div');
  homeDiv.innerHTML = `
    <div class="headline">
      <h1>Welcome to SkyWard!</h1>
    </div>
    <div class="grid-container">



        <div class="element" id="home-stats">Stats</div>
        <div class="element" id="home-leader">Leaderboard</div>
        

    </div>
    <div class="element" id="home-trophy">Trophies</div>
  `;

  // Add classes and styles to the home div


  bodyDiv.appendChild(homeDiv);
}

