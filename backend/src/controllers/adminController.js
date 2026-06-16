const Question = require('../models/Question');
const Admin = require('../models/Admin');
const User = require('../models/User');
const { Test, Attempt } = require('../models/TestModels');
const Room = require('../models/Room');
const crypto = require('crypto');
const fs = require('fs');
const csv = require('csv-parser');
const jwt = require('jsonwebtoken');

// @desc    Admin login
// @route   POST /admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const admin = await Admin.findOne({ email: email.toLowerCase() });
        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                email: admin.email,
                role: 'admin',
                token: jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' })
            });
        } else {
            res.status(401).json({ message: 'Invalid admin credentials' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get admin dashboard stats
// @route   GET /admin/dashboard
// @access  Admin
exports.getAdminDashboard = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalInstitutes = await User.countDocuments({ role: 'institute' });
        const totalTests = await Test.countDocuments();
        const totalAttempts = await Attempt.countDocuments();
        const totalRooms = await Room.countDocuments();
        const completedAttempts = await Attempt.countDocuments({ status: 'completed' });
        const recentRegistrations = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');

        res.json({
            totalStudents,
            totalInstitutes,
            totalTests,
            totalAttempts,
            totalRooms,
            completedAttempts,
            recentRegistrations
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all students
// @route   GET /admin/students
// @access  Admin
exports.getAdminStudents = async (req, res) => {
    const { search } = req.query;
    try {
        let query = { role: 'student' };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        const students = await User.find(query).sort({ createdAt: -1 }).select('-password');
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get student profile details
// @route   GET /admin/students/:id
// @access  Admin
exports.getAdminStudentDetails = async (req, res) => {
    try {
        const student = await User.findOne({ _id: req.params.id, role: 'student' }).select('-password');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const attempts = await Attempt.find({ userId: student._id }).sort({ startTime: -1 }).populate('testId', 'title');
        res.json({ student, attempts });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Toggle student status
// @route   PUT /admin/students/:id/status
// @access  Admin
exports.toggleStudentStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const student = await User.findOne({ _id: req.params.id, role: 'student' });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        student.status = status;
        await student.save();
        res.json({ message: `Student status updated to ${status}`, student });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Delete student account
// @route   DELETE /admin/students/:id
// @access  Admin
exports.deleteStudent = async (req, res) => {
    try {
        const student = await User.findOneAndDelete({ _id: req.params.id, role: 'student' });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        await Attempt.deleteMany({ userId: student._id });
        res.json({ message: 'Student account and associated attempts deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all institutes
// @route   GET /admin/institutes
// @access  Admin
exports.getAdminInstitutes = async (req, res) => {
    const { search } = req.query;
    try {
        let query = { role: 'institute' };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        const institutes = await User.find(query).sort({ createdAt: -1 }).select('-password');
        res.json(institutes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Approve/Reject institute registrations
// @route   PUT /admin/institutes/:id/approval
// @access  Admin
exports.updateInstituteApproval = async (req, res) => {
    const { approvalStatus } = req.body;
    try {
        const institute = await User.findOne({ _id: req.params.id, role: 'institute' });
        if (!institute) {
            return res.status(404).json({ message: 'Institute not found' });
        }
        institute.approvalStatus = approvalStatus;
        await institute.save();
        res.json({ message: `Institute registration set to ${approvalStatus}`, institute });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Toggle institute status
// @route   PUT /admin/institutes/:id/status
// @access  Admin
exports.toggleInstituteStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const institute = await User.findOne({ _id: req.params.id, role: 'institute' });
        if (!institute) {
            return res.status(404).json({ message: 'Institute not found' });
        }
        institute.status = status;
        await institute.save();
        res.json({ message: `Institute status set to ${status}`, institute });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Delete institute account
// @route   DELETE /admin/institutes/:id
// @access  Admin
exports.deleteInstitute = async (req, res) => {
    try {
        const institute = await User.findOneAndDelete({ _id: req.params.id, role: 'institute' });
        if (!institute) {
            return res.status(404).json({ message: 'Institute not found' });
        }
        await Test.deleteMany({ createdBy: institute._id });
        res.json({ message: 'Institute account and created tests deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all tests for administration
// @route   GET /admin/tests
// @access  Admin
exports.getAdminTests = async (req, res) => {
    const { search } = req.query;
    try {
        let query = {};
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        const tests = await Test.find(query).populate('createdBy', 'name email').sort({ createdAt: -1 });
        res.json(tests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Delete test by Admin
// @route   DELETE /admin/tests/:id
// @access  Admin
exports.deleteTestByAdmin = async (req, res) => {
    try {
        const test = await Test.findByIdAndDelete(req.params.id);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        await Attempt.deleteMany({ testId: test._id });
        res.json({ message: 'Test and associated attempts deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Upload CSV of questions
// @route   POST /admin/questions/upload-csv
// @access  Admin / Institute
exports.uploadQuestionsCsv = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];
    const errors = [];
    const ingestionId = 'ing_' + Date.now();

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
            try {
                if (!data.text || !data.correctOption) {
                    throw new Error('Missing required fields');
                }

                const options = [
                    { id: 1, text: data.option1 },
                    { id: 2, text: data.option2 },
                    { id: 3, text: data.option3 },
                    { id: 4, text: data.option4 },
                ].filter(o => o.text);

                const qHash = crypto.createHash('sha256').update(data.text).digest('hex').substring(0, 8);

                results.push({
                    questionId: `q_${qHash}`,
                    text: data.text,
                    options,
                    correctOption: parseInt(data.correctOption),
                    topics: data.topics ? data.topics.split('|').map(t => t.trim()) : [],
                    difficulty: parseFloat(data.difficulty) || 0.5,
                    explanation: data.explanation || '',
                    source: 'CSV',
                    ingestionId,
                    validated: true
                });
            } catch (err) {
                errors.push({ row: data, error: err.message });
            }
        })
        .on('end', async () => {
            let inserted = 0;
            let failed = 0;

            for (const q of results) {
                try {
                    const exists = await Question.findOne({ text: q.text });
                    if (!exists) {
                        await Question.create(q);
                        inserted++;
                    } else {
                        failed++;
                        errors.push({ question: q.text, error: 'Duplicate text' });
                    }
                } catch (err) {
                    failed++;
                    errors.push({ question: q.text, error: err.message });
                }
            }

            fs.unlinkSync(req.file.path);

            res.json({
                message: 'Upload processed',
                ingestionId,
                inserted,
                failed,
                errors
            });
        });
};

// @desc    Get all questions (paginated)
// @route   GET /admin/questions
// @access  Admin / Institute
exports.getQuestions = async (req, res) => {
    try {
        const pageSize = 20;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                text: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const count = await Question.countDocuments({ ...keyword });
        const questions = await Question.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ questions, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single question
// @route   GET /questions/:id
// @access  Private
exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findOne({ questionId: req.params.id });
        if (question) {
            res.json(question);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
