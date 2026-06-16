const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
    loginAdmin, 
    getAdminDashboard, 
    getAdminStudents, 
    getAdminStudentDetails, 
    toggleStudentStatus, 
    deleteStudent, 
    getAdminInstitutes, 
    updateInstituteApproval, 
    toggleInstituteStatus, 
    deleteInstitute, 
    getAdminTests, 
    deleteTestByAdmin,
    uploadQuestionsCsv, 
    getQuestions 
} = require('../controllers/adminController');

const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

// Public Admin Auth
router.post('/login', loginAdmin);

// Protected Admin Actions
router.get('/dashboard', protectAdmin, getAdminDashboard);

// Student Management
router.get('/students', protectAdmin, getAdminStudents);
router.get('/students/:id', protectAdmin, getAdminStudentDetails);
router.put('/students/:id/status', protectAdmin, toggleStudentStatus);
router.delete('/students/:id', protectAdmin, deleteStudent);

// Institute Management
router.get('/institutes', protectAdmin, getAdminInstitutes);
router.put('/institutes/:id/approval', protectAdmin, updateInstituteApproval);
router.put('/institutes/:id/status', protectAdmin, toggleInstituteStatus);
router.delete('/institutes/:id', protectAdmin, deleteInstitute);

// Test Management
router.get('/tests', protectAdmin, getAdminTests);
router.delete('/tests/:id', protectAdmin, deleteTestByAdmin);

// CSV Upload & Questions (legacy/retained)
router.post('/questions/upload-csv', protect, authorize('admin', 'institute'), upload.single('file'), uploadQuestionsCsv);
router.get('/questions', protect, getQuestions);

module.exports = router;
