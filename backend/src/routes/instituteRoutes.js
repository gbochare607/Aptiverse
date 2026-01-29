const express = require('express');
const router = express.Router();
const { getInstituteReports, createInstituteTest } = require('../controllers/instituteController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/:id/reports', protect, authorize('institute', 'admin'), getInstituteReports);
router.post('/:id/create-test', protect, authorize('institute', 'admin'), createInstituteTest);

module.exports = router;
