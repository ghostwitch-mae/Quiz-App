const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const connectDB = require('./db');
const User = require('./models/User');
const app = express();
const PORT = process.env.PORT || 2000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'wefuhlefwuhwefuhEFWuhleuhekjfzz', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 3600000 } // 1 hour
}));

// Route to serve the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.use(express.static(path.join(__dirname)));

app.post('/login-submit', async (req, res) => {
  try {
    const { user, pass } = req.body;
    
    // Find user by username
    const foundUser = await User.findOne({ username: user });
    
    // If user not found or password doesn't match
    if (!foundUser) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
    
    // Check password
    const isMatch = await foundUser.comparePassword(pass);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
    
    // Set user session
    req.session.user = {
      id: foundUser._id,
      username: foundUser.username
    };
    
    // Redirect to quiz page
    res.json({ success: true, redirect: '/index.html' });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Signup route
app.post('/signup-submit', async (req, res) => {
  try {
    const { user, pass } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username: user });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    
    // Create new user
    const newUser = new User({
      username: user,
      password: pass
    });
    
    // Save user to database
    await newUser.save();
    
    // Set user session
    req.session.user = {
      id: newUser._id,
      username: newUser.username
    };
    
    // Success response
    res.json({ success: true, redirect: '/index.html' });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Route to save score with user association
app.post('/api/score', async (req, res) => {
  try {
    const { score, total } = req.body;
    
    // If user is logged in, save score to their profile
    if (req.session.user) {
      const user = await User.findById(req.session.user.id);
      if (user) {
        user.quizScores.push({ score, total });
        await user.save();
      }
    }
    
    res.json({ success: true, message: 'Score saved successfully' });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ success: false, message: 'Error saving score' });
  }
});

// User profile route to get history
app.get('/api/profile', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: 'Not logged in' });
  }
  
  try {
    const user = await User.findById(req.session.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Check authentication status
app.get('/api/auth-status', (req, res) => {
  if (req.session.user) {
    res.json({ 
      authenticated: true, 
      username: req.session.user.username 
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Route to get leaderboard data (Top 5)
app.get('/api/leaderboard', async (req, res) => {
  try {
    // Find users with quiz scores
    const users = await User.find({ 'quizScores.0': { $exists: true } })
      .select('username quizScores')  // Select username and quizScores array
      .limit(20);  // Get more than 5 initially as we'll calculate scores and sort
    
    // Process users to calculate their best score percentage
    const processedUsers = users.map(user => {
      let bestPercentage = 0;
      
      // Calculate best percentage from quiz scores
      if (user.quizScores && user.quizScores.length > 0) {
        user.quizScores.forEach(quiz => {
          if (quiz && typeof quiz.score === 'number' && typeof quiz.total === 'number' && quiz.total > 0) {
            const percentage = (quiz.score / quiz.total) * 100;
            if (percentage > bestPercentage) {
              bestPercentage = percentage;
            }
          }
        });
      }
      
      return {
        username: user.username,
        highScore: bestPercentage  // Return as highScore for compatibility with client
      };
    });
    
    // Sort by best percentage (highest first)
    processedUsers.sort((a, b) => b.highScore - a.highScore);
    
    // Return only top 5
    const topFive = processedUsers.slice(0, 5);
    
    res.json({ success: true, leaderboard: topFive });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update the score saving route to update the high score
app.post('/api/score', async (req, res) => {
  try {
    const { score, total } = req.body;
    
    // If user is logged in, save score to their profile
    if (req.session.user) {
      const user = await User.findById(req.session.user.id);
      if (user) {
        // Add the new score to the user's scores array
        user.quizScores.push({ score, total });
        
        // Calculate percentage score
        const percentageScore = (score / total) * 100;
        
        // Update high score if this score is higher
        if (percentageScore > user.highScore) {
          user.highScore = percentageScore;
        }
        
        await user.save();
      }
    }
    
    res.json({ success: true, message: 'Score saved successfully' });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ success: false, message: 'Error saving score' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to start the quiz`);
});