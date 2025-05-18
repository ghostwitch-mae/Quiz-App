// Updated leaderboardScript.js

document.addEventListener('DOMContentLoaded', () => {
  // Fetch leaderboard data
  fetchLeaderboard();
  
  // Check if user is logged in
  checkAuthStatus();
  
  // Default leaderboard data (as a fallback)
  const defaultLeaderboardData = [
    { username: 'User1', highScore: 30 },
    { username: 'User2', highScore: 20 },
    { username: 'User3', highScore: 10 },
    { username: 'User4', highScore: 5 },
    { username: 'User5', highScore: 0 },
  ];
  
  async function fetchLeaderboard() {
    try {
      const response = await fetch('/api/leaderboard');
      
      if (!response.ok) {
        console.warn('API request failed, using default data');
        populateLeaderboard(defaultLeaderboardData);
        return;
      }
      
      const data = await response.json();
      
      if (data.success && data.leaderboard) {
        console.log('Leaderboard data received:', data);
        populateLeaderboard(data.leaderboard);
      } else {
        console.error('Failed to load leaderboard:', data.message);
        populateLeaderboard(defaultLeaderboardData);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      populateLeaderboard(defaultLeaderboardData);
    }
  }
  
  function populateLeaderboard(users) {
    // Get the container for board entries
    const boardContainer = document.querySelector('.board-cont');
    if (!boardContainer) {
      console.error('Board container not found');
      return;
    }
    
    // Clear existing entries but keep the header and horizontal rule
    // Remove old entries
    const oldEntries = boardContainer.querySelectorAll('.board-entry');
    oldEntries.forEach(entry => entry.remove());
    
    // Add entries to the DOM
    users.forEach((user, index) => {
      const entry = document.createElement('div');
      entry.className = 'board-entry';
      
      // Use highScore directly as it's already calculated on the server
      const scoreDisplay = user.highScore ? Math.round(user.highScore) : 0;
      
      entry.innerHTML = `
        <h3>${index + 1}</h3>
        <h3>${user.username}</h3>
        <h3>${scoreDisplay}%</h3>
      `;
      
      boardContainer.appendChild(entry);
    });
  }
  
  async function checkAuthStatus() {
    try {
      const response = await fetch('/api/auth-status');
      const data = await response.json();
      
      if (data.authenticated) {
        const logoutBtn = document.getElementById('logOut-btn');
        if (logoutBtn) {
          logoutBtn.href = '/logout';
        }
      } else {
        // Redirect to login if not authenticated
        // Uncomment if you want to enforce authentication
        // window.location.href = '/';
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  }
});