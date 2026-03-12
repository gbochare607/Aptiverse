const Room = require('../models/Room');
const { Test } = require('../models/TestModels');
const User = require('../models/User');

// @desc Create a new Test Room
// @route POST /rooms/institute
exports.createRoom = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // Generate a random 6-character alphanumeric code
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        const room = await Room.create({
            name,
            description,
            code,
            instituteId: req.user._id
        });

        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all rooms for an institute
// @route GET /rooms/institute
exports.getInstituteRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ instituteId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('tests', 'title type duration startTime accessCode isPublic')
            .populate('students', 'name email');
        
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get details of a specific room
// @route GET /rooms/institute/:id or /rooms/student/:id
exports.getRoomDetails = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id)
            .populate('instituteId', 'name email')
            .populate('students', 'name email')
            .populate('tests', 'title type description duration startTime endTime accessCode isPublic registrationCount rules prizes');

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Access control: Ensure user is the institute owner or an enrolled student
        const isOwner = req.user.role === 'institute' && room.instituteId._id.toString() === req.user._id.toString();
        const isEnrolled = room.students.some(s => s._id.toString() === req.user._id.toString());
        
        if (!isOwner && !isEnrolled && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this room' });
        }

        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Add an existing test to a room
// @route POST /rooms/institute/:id/tests
exports.addTestToRoom = async (req, res) => {
    try {
        const { testId } = req.body;
        const room = await Room.findOne({ _id: req.params.id, instituteId: req.user._id });

        if (!room) {
            return res.status(404).json({ message: 'Room not found or unauthorized' });
        }

        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        if (room.tests.includes(testId)) {
            return res.status(400).json({ message: 'Test is already added to this room' });
        }

        room.tests.push(testId);
        await room.save();

        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Join a room using a code (Student)
// @route POST /rooms/join
exports.joinRoom = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ message: 'Room code is required' });

        const room = await Room.findOne({ code: code.toUpperCase().trim() });
        
        if (!room) {
            return res.status(404).json({ message: 'Invalid room code' });
        }

        if (room.students.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already in this room' });
        }

        room.students.push(req.user._id);
        await room.save();

        res.json({ message: 'Successfully joined room', roomId: room._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all rooms a student has joined
// @route GET /rooms/student
exports.getStudentRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ students: req.user._id })
            .populate('instituteId', 'name')
            .populate('tests', 'title type duration startTime')
            .sort({ createdAt: -1 });
            
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
