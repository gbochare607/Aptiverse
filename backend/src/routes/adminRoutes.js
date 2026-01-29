const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadQuestionsCsv, getQuestions } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

router.post('/questions/upload-csv', protect, authorize('admin', 'institute'), upload.single('file'), uploadQuestionsCsv);
router.get('/questions', protect, getQuestions);

module.exports = router;
