const { Result, Test } = require('../models/TestModels');
const User = require('../models/User');

// @desc Get Institute Reports
// @route GET /institutes/:id/reports
exports.getInstituteReports = async (req, res) => {
    try {
        // req.params.id should match req.user.id
        if (req.user.id !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Get all tests created by this institute
        const tests = await Test.find({ createdBy: req.params.id });
        const testIds = tests.map(t => t._id);

        // Get all results for these tests
        const results = await Result.find({ testId: { $in: testIds } }).populate('userId', 'name email');

        // Aggregate data
        // Cohort analytics: Average score per test
        const testAnalytics = {};
        tests.forEach(t => {
            const testResults = results.filter(r => r.testId.toString() === t._id.toString());
            const avg = testResults.length > 0 ? testResults.reduce((acc, r) => acc + r.score, 0) / testResults.length : 0;
            testAnalytics[t.title] = {
                attempts: testResults.length,
                averageScore: avg,
                topPerformer: testResults.sort((a, b) => b.score - a.score)[0]?.userId?.name || 'N/A'
            };
        });

        res.json({
            overview: {
                totalTests: tests.length,
                totalStudentsEvaluated: new Set(results.map(r => r.userId.toString())).size
            },
            testAnalytics,
            recentResults: results.slice(0, 20)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Create a Test (Institute) - Wrapped here or use testController?
// Using testController is fine, but maybe we want specific institute route 
// /institutes/:id/create-test. We can re-export or re-implement.
// Let's use the one in testController but route it here? 
// No, stick to functional separation. 
// We will add createTest here if we want strict resource nesting, otherwise `/tests` is RESTful.
// Spec says: POST /institutes/:id/create-test.
// So we will implement a wrapper here.

const { createTest } = require('./testController');
exports.createInstituteTest = createTest; // Reuse logic
