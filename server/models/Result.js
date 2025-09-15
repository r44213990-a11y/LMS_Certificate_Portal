const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: [{ type: String }],
  passed: { type: Boolean, required: true },
  certificateGenerated: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Result', ResultSchema);
