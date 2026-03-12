const mongoose = require('mongoose');

const recentActivitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    activityType: {
        type: String,
        enum: ['practice_test', 'practice_questions', 'company_practice', 'exam_practice', 'soft_skill'],
        required: true
    },
    title: { type: String, required: true },
    metadata: {
        category: String,
        subTopic: String,
        company: String,
        exam: String,
        skill: String,
        testId: { type: mongoose.Schema.Types.ObjectId },
        score: Number,
        totalQuestions: Number
    },
    completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RecentActivity', recentActivitySchema);
