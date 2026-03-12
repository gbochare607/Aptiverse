const mongoose = require('mongoose');

const userPerformanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    totalQuestionsSolved: { type: Number, default: 0 },
    totalCorrectAnswers: { type: Number, default: 0 },
    totalTestsTaken: { type: Number, default: 0 }, // Specific for completed tests

    // Detailed breakdown by Topic
    topicPerformance: {
        type: Map,
        of: new mongoose.Schema({
            total: { type: Number, default: 0 },
            correct: { type: Number, default: 0 }
        }, { _id: false })
    },

    lastActive: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserPerformance', userPerformanceSchema);
