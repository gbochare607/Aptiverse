const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    time: {
        type: String, // e.g., "30 mins"
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        default: 'General'
    },
    dueDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const StudyPlanSchema = new mongoose.Schema({
    userId: {
        type: String, // Clerk User ID
        required: true,
        unique: true
    },
    tasks: [TaskSchema]
}, { timestamps: true });

module.exports = mongoose.model('StudyPlan', StudyPlanSchema);
