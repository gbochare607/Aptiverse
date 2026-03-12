const express = require('express');
const router = express.Router();
const { getStudyPlan, addTask, updateTask, removeTask } = require('../controllers/studyPlanController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getStudyPlan);
router.post('/task', addTask);
router.put('/task/:taskId', updateTask);
router.delete('/task/:taskId', removeTask);

module.exports = router;
