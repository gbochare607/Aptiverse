const RecentActivity = require('../models/RecentActivity');

// @desc Get last 10 activities of logged-in user
// @route GET /api/activities/recent
exports.getRecentActivities = async (req, res) => {
    try {
        const activities = await RecentActivity.find({ userId: req.user.id })
            .sort({ completedAt: -1 })
            .limit(10);

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
