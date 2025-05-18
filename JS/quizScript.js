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
    // Function to fetch random questions from the server
async function fetchQuestions() {
    try{
      const apiURL = `https://opentdb.com/api.php?amount=10`;
      const response = await fetch(apiURL);
      const data = await response.json();
      console.log(currentQuestions);
      if(!response.ok){
        throw new Error("Could not fetch questions");
      }
      if (data.response_code === 0 && data.results.length > 0) {
                currentQuestions = data.results;
                console.log(currentQuestions);
                renderQuestion();
                startTimer();
            } else {
                alert('Failed to load questions. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            alert('Failed to load questions. Please try again.');
        }
  
    
  //   // Start the quiz if questions loaded successfully
  //   if (currentQuestions.length > 0) {
  //     renderQuestion();
  //     startTimer();
  //   } else {
  //     alert('Failed to load questions. Please try again.');
  //   }
  // } catch (error) {
  //   console.error('Error fetching questions:', error);
  //   alert('Failed to load questions. Please try again.');
  // }
}
    
    // Function to render the current question
    function renderQuestion() {
        questionAnswered = false;
        const questionData = currentQuestions[currentQuestionIndex];
        console.log("Current question data:", questionData); // Debug: Log current question
        
        // Update question text and number
        // The API returns HTML entities like &quot; - let's decode them
        const decodedQuestion = decodeHtmlEntities(questionData.question);
        questionElement.textContent = `Question: ${decodedQuestion}`;
        questionNumberElement.textContent = `Question ${currentQuestionIndex + 1} out of ${currentQuestions.length}`;
        
        // Clear previous choices
        choicesContainer.innerHTML = '';
        
        // Combine correct and incorrect answers
        const correctAnswer = questionData.correct_answer;
        const incorrectAnswers = questionData.incorrect_answers || [];
        
        console.log("Correct answer:", correctAnswer); // Debug
        console.log("Incorrect answers:", incorrectAnswers); // Debug
        
        const allAnswers = [correctAnswer, ...incorrectAnswers];
        console.log("All answers before shuffle:", allAnswers); // Debug
        
        // Shuffle answers for random order
        const shuffledAnswers = shuffleArray(allAnswers);
        console.log("Shuffled answers:", shuffledAnswers); // Debug
        
        // Create buttons for each choice
        const choices = ['A', 'B', 'C', 'D'];
        shuffledAnswers.forEach((answer, index) => {
            if (index < choices.length) { // Ensure we don't exceed our choice letters
                const button = document.createElement('button');
                const decodedAnswer = decodeHtmlEntities(answer);
                console.log(`Creating button ${choices[index]} with answer: ${decodedAnswer}`); // Debug
                
                button.textContent = `${choices[index]}: ${decodedAnswer}`;
                button.dataset.choice = choices[index];
                button.dataset.answer = answer;
                
                button.addEventListener('click', () => {
                  selectAnswer(button, correctAnswer);
                });
                
                choicesContainer.appendChild(button);
            }
        });
    }
    
    // Function to handle answer selection
    function selectAnswer(selectedButton, correctAnswer) {
        if (questionAnswered) return; // Prevent multiple selections
        
        questionAnswered = true;
        const selectedAnswer = selectedButton.dataset.answer;
        console.log(`Selected: ${selectedAnswer}, Correct: ${correctAnswer}`); // Debug
        
        // Get all choice buttons
        const buttons = choicesContainer.querySelectorAll('button');
        
        // Disable all buttons
        buttons.forEach(btn => {
            btn.disabled = true;
        });
        
        // Check if the selected answer is correct
        if (selectedAnswer === correctAnswer) {
            selectedButton.style.backgroundColor = '#4CAF50'; // Green for correct
            score++;
        } else {
            selectedButton.style.backgroundColor = '#f44336'; // Red for incorrect
            
            // Highlight the correct answer
            buttons.forEach(btn => {
                // Compare the raw answer values to find the correct one
                if (btn.dataset.answer === correctAnswer) {
                    btn.style.backgroundColor = '#4CAF50'; // Green for correct
                    console.log("Found correct button:", btn.textContent);
                }
            });
        }
        
        // Show the next button
        if (nextButton) {
            nextButton.style.display = 'block';
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

    // Helper function to shuffle an array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    // Helper function to decode HTML entities
    function decodeHtmlEntities(text) {
        if (!text) return ''; // Guard against undefined or null
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }
  });