const express = require('express');
const Question = require('../models/Question');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get quiz information
router.get('/', async (req, res) => {
  try {
    const quiz = await Quiz.findOne().sort({ createdAt: -1 });
    if (!quiz) {
      return res.status(404).json({ message: 'No quiz found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get quiz questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find({ quizId: 'default-quiz' }).select('-correctAnswer');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit quiz
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.user.userId;

    // Get questions with correct answers
    const questions = await Question.find({ quizId: 'default-quiz' });
    
    let correctAnswers = 0;
    const submittedAnswers = [];

    // Calculate score
    questions.forEach((question, index) => {
      submittedAnswers.push(answers[index] || '');
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= 70; // 70% passing score

    // Save result
    const result = new Result({
      userId,
      quizId: 'default-quiz',
      score,
      totalQuestions: questions.length,
      answers: submittedAnswers,
      passed
    });

    await result.save();

    res.json({
      score,
      totalQuestions: questions.length,
      correctAnswers,
      passed,
      resultId: result._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
