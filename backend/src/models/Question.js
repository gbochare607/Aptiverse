const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionId: {
        type: String,
        required: true,
        unique: true,
    },
    text: {
        type: String,
        required: true,
    },
    options: [{
        id: Number,
        text: String,
    }],
    correctOption: {
        type: Number,
        required: true,
    },
    explanation: {
        type: String,
        default: 'Detailed explanation not available.'
    },
    topics: [String],
    category: {
        type: String,
        index: true
    },
    company: {
        type: [String],
        index: true
    },
    exam: {
        type: [String],
        index: true
    },
    difficulty: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5,
    },
    explanation: String,
    tags: [String],
    source: {
        type: String,
        enum: ['CSV', 'API', 'Manual'],
        default: 'Manual',
    },
    version: {
        type: String,
        default: 'v1',
    },
    ingestionId: String,
    validated: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for search suggestions and duplicate checking
questionSchema.index({ text: 'text' });
questionSchema.index({ topics: 1 });

module.exports = mongoose.model('Question', questionSchema);
