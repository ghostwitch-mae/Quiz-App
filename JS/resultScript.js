document.addEventListener('DOMContentLoaded', () => {
    // Get the score from session storage
    const score = sessionStorage.getItem('quizScore') || 0;
    const total = sessionStorage.getItem('quizTotal') || 10;
    
    // Update the score display
    const scoreDisplay = document.querySelector('#score_val');
    scoreDisplay.textContent = `Your score is: ${score}/${total}`;
    console.log("score is " + score);
    
    // Optional: Add message based on score
    const scoreTitle = document.querySelector('#score-title');
    if (scoreTitle) {
      if (score === total) {
        scoreTitle.textContent = 'Perfect Score! Amazing!';
      } else if (score >= total * 0.8) {
        scoreTitle.textContent = 'Great Job!';
      } else if (score >= total * 0.6) {
        scoreTitle.textContent = 'Good Effort!';
      } else {
        scoreTitle.textContent = 'Keep Practicing!';
      }
    }
    
    // Save score to user profile if logged in
    saveScore(score, total);
    
    // Reset the quiz when the 'Try Again' button is clicked
    const replayButton = document.getElementById('replay-btn');
    if (replayButton) {
      replayButton.addEventListener('click', (e) => {
        // Clear the session storage
        sessionStorage.removeItem('quizScore');
        sessionStorage.removeItem('quizTotal');
        
        // Let the default link behavior proceed
        // (which will navigate to quiz.html)
      });
    }
    
    // Check if user is logged in and display profile info
    checkAuthStatus();
    
    // Function to save score
    async function saveScore(score, total) {
      try {
        const response = await fetch('/api/score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ score, total })
        });
        
        const data = await response.json();
        console.log('Score saving status:', data.success);
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
    
    // Function to check auth status and display user info
    async function checkAuthStatus() {
      try {
        const response = await fetch('/api/auth-status');
        const data = await response.json();
        
        if (data.authenticated) {
          // Display welcome message with username
          const userWelcome = document.createElement('div');
          userWelcome.id = 'user-welcome';
          userWelcome.innerHTML = `<p>Welcome back, ${data.username}!</p>`;
          
          // Add logout button
          const logoutBtn = document.createElement('button');
          logoutBtn.textContent = 'Logout';
          logoutBtn.id = 'logout-btn';
          logoutBtn.addEventListener('click', () => {
            window.location.href = '/logout';
          });
          
          userWelcome.appendChild(logoutBtn);
          
          // Add to page
          document.querySelector('.score-container').prepend(userWelcome);
          
          // Fetch and display user history
          fetchUserHistory();
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    }
    
    // Function to fetch and display user quiz history
    async function fetchUserHistory() {
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        
        if (data.success && data.user.quizScores.length > 0) {
          // Create history section
          const historySection = document.createElement('div');
          historySection.id = 'quiz-history';
          historySection.innerHTML = '<h3>Your Quiz History</h3>';
          
          // Create table for scores
          const table = document.createElement('table');
          table.innerHTML = `
            <thead>
              <tr>
                <th>Date</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody id="history-body"></tbody>
          `;
          
          historySection.appendChild(table);
          
          // Add to page before the replay button
          const replayBtn = document.getElementById('replay-btn');
          replayBtn.parentNode.insertBefore(historySection, replayBtn);
          
          // Add history rows
          const tableBody = document.getElementById('history-body');
          data.user.quizScores.slice(-5).reverse().forEach(item => {
            const row = document.createElement('tr');
            const date = new Date(item.date);
            
            row.innerHTML = `
              <td>${date.toLocaleDateString()}</td>
              <td>${item.score}/${item.total}</td>
            `;
            
            tableBody.appendChild(row);
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
  });