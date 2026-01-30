const express = require('express');
const router = express.Router();
const {
    startTest,
    saveAnswer,
    submitTest,
    getCompetitions,
    getTestByCode,
    getAttempt
} = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');

router.get('/competitions', protect, getCompetitions);
router.get('/code/:accessCode', protect, getTestByCode);
router.post('/start', protect, startTest);
router.get('/attempts/:attemptId', protect, getAttempt);
router.post('/:attemptId/answer', protect, saveAnswer);
router.post('/:attemptId/submit', protect, submitTest);

module.exports = router;
