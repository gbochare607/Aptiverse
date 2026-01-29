const express = require('express');
const router = express.Router();
const { getDashboard, getResults } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard/:userId', protect, getDashboard);
router.get('/results/:userId', protect, getResults);

module.exports = router;
