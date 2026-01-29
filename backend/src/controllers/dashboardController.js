const { Result } = require('../models/TestModels');

// @desc Get User Dashboard
// @route GET /dashboard/:userId
exports.getDashboard = async (req, res) => {
    try {
        if (req.user.id !== req.params.userId) { // Simple check, admin might override
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Fetch recent results
        const recentResults = await Result.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('testId', 'title');

        // Calculate aggregated stats
        const allResults = await Result.find({ userId: req.user.id });
        const totalTests = allResults.length;
        const avgScore = totalTests > 0 ? allResults.reduce((acc, r) => acc + r.score, 0) / totalTests : 0;

        // Mock AI Recommendations if not storing them
        // In real app, we fetch from 'Recommendation' model populated by AI service

        res.json({
            stats: {
                testsTaken: totalTests,
                averageScore: avgScore.toFixed(2),
                verifiedSkills: 3 // Mock
            },
            recentActivity: recentResults,
            recommendations: [
                { type: 'topic', id: 'Probability', reason: 'Low accuracy in last test' },
                { type: 'test', id: 'mock_1', reason: 'Recommended based on streak' }
            ]
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get User Results
// @route GET /results/:userId
exports.getResults = async (req, res) => {
    try {
        const results = await Result.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .populate('testId');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
