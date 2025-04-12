const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 2000;

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Load questions from JSON file
const questions = JSON.parse(fs.readFileSync('./questions.json', 'utf8'));

// Route to serve the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to get random set of questions
app.get('/api/questions', (req, res) => {
  const count = req.query.count || 10; // Default to 10 questions or allow custom count
  const randomQuestions = getRandomQuestions(questions, parseInt(count));
  res.json(randomQuestions);
});

// Route to save score
app.post('/api/score', (req, res) => {
  const { score, total } = req.body;
  // Here you could save scores to a database if needed
  res.json({ success: true, message: 'Score saved successfully' });
});

// Helper function to get random questions
function getRandomQuestions(allQuestions, count) {
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to start the quiz`);
});