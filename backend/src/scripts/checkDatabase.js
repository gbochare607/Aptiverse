const mongoose = require('mongoose');
const Question = require('../models/Question');
require('dotenv').config();

const checkTopics = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const questions = await Question.find({});
        console.log(`Total Questions: ${questions.length}`);

        const topicCounts = {};
        questions.forEach(q => {
            q.topics.forEach(t => {
                topicCounts[t] = (topicCounts[t] || 0) + 1;
            });
        });

        console.log('--- Topic Counts ---');
        console.table(topicCounts);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkTopics();
