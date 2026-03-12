const mongoose = require('mongoose');
const Question = require('../models/Question');
require('dotenv').config();

const inspectQuestions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Check Blood Relations as an example
        const topic = 'blood-relations';
        const questions = await Question.find({ topics: topic }).limit(3);

        console.log(`--- Inspecting ${topic} ---`);
        if (questions.length === 0) {
            console.log("No questions found for this topic.");
        } else {
            questions.forEach((q, i) => {
                console.log(`[Q${i + 1}] ${q.text}`);
                console.log(`   Options: ${q.options.map(o => o.text).join(', ')}`);
            });
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

inspectQuestions();
