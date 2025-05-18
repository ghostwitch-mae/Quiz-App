document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form');
  const loginButton = document.getElementById('login-btn');
  const signupButton = document.getElementById('signup-btn');
  const usernameInput = document.getElementById('user');
  const passwordInput = document.getElementById('pass');
  
  // Error message container
  let errorMessageElement = document.getElementById('error-message');
  if (!errorMessageElement) {
    errorMessageElement = document.createElement('div');
    errorMessageElement.id = 'error-message';
    errorMessageElement.style.color = 'red';
    errorMessageElement.style.marginTop = '10px';
    errorMessageElement.style.textAlign = 'center';
    document.getElementById('form').appendChild(errorMessageElement);
  }
  
  // Function to display error messages
  function showError(message) {
    errorMessageElement.textContent = message;
  }
  
  // Function to clear error messages
  function clearError() {
    errorMessageElement.textContent = '';
  }
  
  // Function to validate inputs
  function validateInputs() {
    if (!usernameInput.value.trim()) {
      showError('Username is required');
      return false;
    }
    
    if (!passwordInput.value.trim()) {
      showError('Password is required');
      return false;
    }
    
    if (passwordInput.value.trim().length < 6) {
      showError('Password must be at least 6 characters long');
      return false;
    }
    
    clearError();
    return true;
  }
  
  // Handle login form submission
  loginButton.addEventListener('click', async (e) => {
    e.preventDefault();
    
    if (!validateInputs()) return;
    
    try {
      const response = await fetch('/login-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: usernameInput.value.trim(),
          pass: passwordInput.value.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Redirect to quiz page on successful login
        window.location.href = data.redirect;
      } else {
        showError(data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('An error occurred during login. Please try again.');
    }
  });
  
  // Handle signup button click
  signupButton.addEventListener('click', async (e) => {
    e.preventDefault();
    
    if (!validateInputs()) return;
    
    try {
      const response = await fetch('/signup-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: usernameInput.value.trim(),
          pass: passwordInput.value.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Redirect to quiz page on successful signup
        window.location.href = data.redirect;
      } else {
        showError(data.message || 'Error creating account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      showError('An error occurred during signup. Please try again.');
    }
  });
});