const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  quizId: { type: String, required: true },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
