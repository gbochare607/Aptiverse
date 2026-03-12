const mongoose = require('mongoose');
const Question = require('../src/models/Question');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const verifyContent = async () => {
    await connectDB();

    console.log(`\n[VERIFY] Checking for Placeholder Text...`);

    const placeholders = await Question.countDocuments({ text: { $regex: /This is a practice question for/i } });
    console.log(`Questions with placeholder text: ${placeholders}`);

    if (placeholders === 0) {
        console.log(`[PASS] All placeholder questions removed/replaced.`);
    } else {
        console.warn(`[WARN] Still found ${placeholders} placeholder questions.`);
    }

    // Sample some new questions
    console.log(`\n[VERIFY] Sampling New Content:`);
    const samples = await Question.aggregate([{ $sample: { size: 5 } }]);
    samples.forEach((q, i) => {
        console.log(`${i + 1}. [${q.topics[0]}] ${q.text.substring(0, 80)}...`);
    });

    process.exit();
};

verifyContent();
