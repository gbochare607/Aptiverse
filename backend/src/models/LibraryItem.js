const mongoose = require('mongoose');

const libraryItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: { 
        type: String, 
        enum: ['note', 'video', 'pdf', 'material'], 
        required: true 
    },
    url: { type: String, required: true },
    thumbnail: { type: String },
    topic: { type: String },
    category: { type: String },
    duration: { type: String }, // For videos
    author: { type: String, default: 'Admin' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LibraryItem', libraryItemSchema);
