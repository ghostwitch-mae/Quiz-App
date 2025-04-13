document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const questionElement = document.querySelector('#question h2');
    const questionNumberElement = document.querySelector('#question h1');
    const choicesContainer = document.getElementById('choices');
    const nextButton = document.getElementById('next-btn');
    const timerElement = document.querySelector('#clock');
    
    // Quiz state variables
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft = 60; // 60 seconds for the quiz
    let timer;
    let questionAnswered = false;
    
    // Start the quiz by fetching questions
    fetchQuestions();
    
    // Event listener for the next button
    nextButton.addEventListener('click', () => {
      if (questionAnswered) {
        // Move to the next question
        currentQuestionIndex++;
        
        if (currentQuestionIndex < currentQuestions.length) {
          renderQuestion();
        } else {
          // Quiz completed, save score and redirect to results page
          endQuiz();
        }
      } else {
        alert('Please select an answer before proceeding!');
      }
    });
    
    // Function to fetch random questions from the server
    async function fetchQuestions() {
      try {
        const response = await fetch('/questions.json');        currentQuestions = await response.json();
        
        // Start the quiz if questions loaded successfully
        if (currentQuestions.length > 0) {
          renderQuestion();
          startTimer();
        } else {
          alert('Failed to load questions. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        alert('Failed to load questions. Please try again.');
      }
    }
    
    // Function to render the current question
    function renderQuestion() {
      questionAnswered = false;
      const question = currentQuestions[currentQuestionIndex];
      
      // Update question text and number
      questionElement.textContent = `Question: ${question.question}`;
      questionNumberElement.textContent = `Question ${currentQuestionIndex + 1} out of ${currentQuestions.length}`;
      
      // Clear previous choices
      choicesContainer.innerHTML = '';
      
      // Create buttons for each choice
      const choices = ['A', 'B', 'C', 'D'];
      choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = `${choice}: ${question[choice]}`;
        button.dataset.choice = choice;
        
        button.addEventListener('click', () => selectAnswer(choice, question.answer, button));
        
        choicesContainer.appendChild(button);
      });
    }
    
    // Function to handle answer selection
    function selectAnswer(choice, correctAnswer, selectedButton) {
      if (questionAnswered) return; // Prevent multiple selections
      
      questionAnswered = true;
      
      // Get all choice buttons
      const buttons = choicesContainer.querySelectorAll('button');
      
      // Disable all buttons
      buttons.forEach(btn => {
        btn.disabled = true;
      });
      
      // Check if the selected answer is correct
      if (choice === correctAnswer) {
        selectedButton.style.backgroundColor = '#4CAF50'; // Green for correct
        score++;
      } else {
        selectedButton.style.backgroundColor = '#f44336'; // Red for incorrect
        
        // Highlight the correct answer
        buttons.forEach(btn => {
          if (btn.dataset.choice === correctAnswer) {
            btn.style.backgroundColor = '#4CAF50';
          }
        });
      }
    }
    
    // Function to start the timer
    function startTimer() {
      timeLeft = 600; // Reset to 60 seconds
      updateTimerDisplay();
      
      clearInterval(timer); // Clear any existing timer
      timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
          clearInterval(timer);
          endQuiz();
        }
      }, 1000);
    }
    
    // Function to update the timer display
    function updateTimerDisplay() {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerElement.textContent = `Time Remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Function to end the quiz
    function endQuiz() {
      clearInterval(timer);
      
      // Save score to session storage
      sessionStorage.setItem('quizScore', score);
      sessionStorage.setItem('quizTotal', currentQuestions.length);
      
      // Redirect to results page
      window.location.href = 'results.html';
    }
  });