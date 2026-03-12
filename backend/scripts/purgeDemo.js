const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Question = require('../src/models/Question');

const purgeDemoQuestions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected`);

        // Find Count first
        const count = await Question.countDocuments({ questionId: { $regex: /^demo-/ } });
        console.log(`Found ${count} demo questions in DB.`);

        if (count > 0) {
            const result = await Question.deleteMany({ questionId: { $regex: /^demo-/ } });
            console.log(`Deleted ${result.deletedCount} demo questions.`);
        } else {
            console.log("No demo questions found to delete.");
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

purgeDemoQuestions();
