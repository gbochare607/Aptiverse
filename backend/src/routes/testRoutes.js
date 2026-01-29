const express = require('express');
const router = express.Router();
const { startTest, saveAnswer, submitTest } = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startTest);
router.post('/:attemptId/answer', protect, saveAnswer); // This matches /attempts/:attemptId/answer if mounted at /attempts... wait, let's fix mounting
// The user spec says: 
// POST /tests/start
// POST /attempts/:attemptId/answer
// POST /tests/:attemptId/submit

// We should split or route carefully.
// Let's keep it simple.

module.exports = router;
