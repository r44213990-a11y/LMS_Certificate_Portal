const express = require('express');
const Result = require('../models/Result');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user results
router.get('/user/results', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const results = await Result.find({ userId }).sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
