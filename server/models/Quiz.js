const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  _id: { type: String, default: 'default-quiz' },
  title: { type: String, required: true },
  description: { type: String },
  passingScore: { type: Number, default: 70 },
  timeLimit: { type: Number, default: 30 }, // in minutes
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
