const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// Initialize sample data
async function initializeData() {
  try {
    // Check if quiz exists
    const existingQuiz = await Quiz.findOne();
    if (!existingQuiz) {
      const quiz = new Quiz({
        title: 'LMS Micro-Certification Quiz',
        description: 'Test your knowledge with this comprehensive quiz',
        passingScore: 70,
        timeLimit: 30
      });
      await quiz.save();
      console.log('Sample quiz created');
    }

    // Check if questions exist
    const existingQuestions = await Question.find();
    if (existingQuestions.length === 0) {
      const sampleQuestions = [
        {
          quizId: 'default-quiz',
          questionText: 'What does LMS stand for?',
          options: ['Learning Management System', 'Library Management System', 'Logistics Management System', 'Legal Management System'],
          correctAnswer: 'Learning Management System'
        },
        {
          quizId: 'default-quiz',
          questionText: 'Which of the following is NOT a feature of modern LMS?',
          options: ['Quiz Creation', 'Video Streaming', 'Social Media Integration', 'Gaming Console Support'],
          correctAnswer: 'Gaming Console Support'
        },
        {
          quizId: 'default-quiz',
          questionText: 'What is the primary purpose of micro-certifications?',
          options: ['To replace degrees', 'To provide quick skill validation', 'To reduce learning time', 'To eliminate assessments'],
          correctAnswer: 'To provide quick skill validation'
        },
        {
          quizId: 'default-quiz',
          questionText: 'Which database is commonly used with Node.js applications?',
          options: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'],
          correctAnswer: 'MongoDB'
        },
        {
          quizId: 'default-quiz',
          questionText: 'What does API stand for?',
          options: ['Application Programming Interface', 'Automated Program Integration', 'Advanced Programming Instruction', 'Application Process Integration'],
          correctAnswer: 'Application Programming Interface'
        }
      ];

      await Question.insertMany(sampleQuestions);
      console.log('Sample questions created');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

module.exports = initializeData;
