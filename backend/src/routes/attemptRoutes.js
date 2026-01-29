const express = require('express');
const router = express.Router();
const { saveAnswer } = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');

// /attempts prefix
router.post('/:attemptId/answer', protect, saveAnswer);

module.exports = router;
