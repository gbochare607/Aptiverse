const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Institute
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    topics: [String],
    duration: Number, // in minutes
    startTime: Date,
    endTime: Date,

    accessCode: String, // for private tests
    isPublic: { type: Boolean, default: false },
    type: { type: String, enum: ['practice', 'test', 'competition'], default: 'test' },
    bannerUrl: String,
    prizes: [String],
    rules: String,
    registrationCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const attemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' }, // Optional if practice
    type: { type: String, enum: ['practice', 'test', 'competition'], required: true },
    questions: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selectedOption: Number,
        timeTaken: Number, // seconds
        isCorrect: Boolean,
        marks: Number
    }],
    currentQuestionIndex: { type: Number, default: 0 },
    status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
    score: Number,
    percentage: Number,
    duration: Number, // custom duration for practice
    difficulty: Number, // custom difficulty for practice
    startTime: { type: Date, default: Date.now },
    endTime: Date,
});

const resultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attemptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attempt', required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
    score: Number,
    totalQuestions: Number,
    correctAnswers: Number,
    accuracy: Number,
    topicPerformance: Object, // { "Algebra": 0.8, "Geometry": 0.5 }
    createdAt: { type: Date, default: Date.now }
});

module.exports = {
    Test: mongoose.model('Test', testSchema),
    Attempt: mongoose.model('Attempt', attemptSchema),
    Result: mongoose.model('Result', resultSchema)
};
