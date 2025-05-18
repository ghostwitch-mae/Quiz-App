
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in and load profile data
  checkAuthStatus();
  
  async function checkAuthStatus() {
    try {
      const response = await fetch('/api/auth-status');
      const data = await response.json();
      
      if (data.authenticated) {
        // User is logged in, display username
        const greeting = document.querySelector('#profile-greeting h2');
        if (greeting) {
          greeting.textContent = `Hello, ${data.username}!`;
        }
        
        const profileTitle = document.querySelector('#profile-greeting h1');
        if (profileTitle) {
          profileTitle.textContent = `${data.username}'s Profile`;
        }
        
        // Add logout functionality
        const logoutBtn = document.getElementById('logOut-btn');
        if (logoutBtn) {
          logoutBtn.href = '/logout';
        }
        
        // Fetch and display user's quiz history
        fetchUserProfile();
      } else {
        // Redirect to login if not authenticated
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  }
  
  async function fetchUserProfile() {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();
      
      if (data.success) {
        displayQuizHistory(data.user);
      } else {
        console.error('Failed to load profile:', data.message);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }
  
  function displayQuizHistory(user) {
    // Update quiz count
    const quizCount = document.querySelector('#profile-greeting h2:last-child');
    if (quizCount) {
      quizCount.textContent = `Quizzes Played: ${user.quizScores.length}`;
    }
    
    // Display quiz history
    const quizHistory = document.getElementById('quiz-history');
    if (quizHistory) {
      // Clear existing entries
      quizHistory.innerHTML = '';
      
      // Show message if no quizzes taken
      if (user.quizScores.length === 0) {
        quizHistory.innerHTML = '<p>You haven\'t taken any quizzes yet.</p>';
        return;
      }
      
      // Sort scores by date (newest first)
      const sortedScores = [...user.quizScores].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      
      // Display each quiz score
      sortedScores.forEach((score, index) => {
        const date = new Date(score.date);
        const formattedDate = date.toLocaleDateString();
        
        const entry = document.createElement('div');
        entry.className = 'history-entry';
        entry.innerHTML = `
          <h3>Quiz #${index + 1}</h3>
          <h3>Score: ${score.score}/${score.total} (${Math.round((score.score / score.total) * 100)}%)</h3>
          <h3>Date: ${formattedDate}</h3>
        `;
        
        quizHistory.appendChild(entry);
      });
    }
  }
});