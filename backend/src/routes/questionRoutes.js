const express = require('express');
const router = express.Router();
const { getQuestionById, getQuestions } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', protect, getQuestionById);
router.get('/', protect, getQuestions);

module.exports = router;
