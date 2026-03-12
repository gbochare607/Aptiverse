const express = require('express');
const router = express.Router();
const { getRecentActivities } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware'); // Assuming this exists for auth

// All activity routes are protected
router.get('/recent', protect, getRecentActivities);

module.exports = router;
