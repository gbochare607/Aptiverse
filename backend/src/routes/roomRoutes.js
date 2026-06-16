const express = require('express');
const router = express.Router();
const {
    createRoom,
    deleteRoom,
    getInstituteRooms,
    getRoomDetails,
    joinRoom,
    getStudentRooms,
    addTestToRoom
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Institute Routes
router.post('/institute', protect, authorize('institute', 'admin'), createRoom);
router.delete('/institute/:id', protect, authorize('institute', 'admin'), deleteRoom);
router.get('/institute', protect, authorize('institute', 'admin'), getInstituteRooms);
router.get('/institute/:id', protect, authorize('institute', 'admin'), getRoomDetails);
router.post('/institute/:id/tests', protect, authorize('institute', 'admin'), addTestToRoom);

// Student Routes
router.post('/join', protect, joinRoom);
router.get('/student', protect, getStudentRooms);
router.get('/student/:id', protect, getRoomDetails); 

module.exports = router;
