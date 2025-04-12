document.addEventListener('DOMContentLoaded', () => {
    // Get the score from session storage
    const score = sessionStorage.getItem('quizScore') || 0;
    const total = sessionStorage.getItem('quizTotal') || 10;
    
    // Update the score display
    const scoreDisplay = document.querySelector('#score h2');
    scoreDisplay.textContent = `Your score is: ${score}/${total}`;
    
    // Optional: Add message based on score
    const scoreTitle = document.querySelector('#score h1');
    if (score === total) {
      scoreTitle.textContent = 'Perfect Score! Amazing!';
    } else if (score >= total * 0.8) {
      scoreTitle.textContent = 'Great Job!';
    } else if (score >= total * 0.6) {
      scoreTitle.textContent = 'Good Effort!';
    } else {
      scoreTitle.textContent = 'Keep Practicing!';
    }
    
    // Reset the quiz when the 'Try Again' button is clicked
    const replayButton = document.getElementById('replay-btn');
    replayButton.addEventListener('click', (e) => {
      // Clear the session storage
      sessionStorage.removeItem('quizScore');
      sessionStorage.removeItem('quizTotal');
      
      // Let the default link behavior proceed
      // (which will navigate to quiz.html)
    });
  });