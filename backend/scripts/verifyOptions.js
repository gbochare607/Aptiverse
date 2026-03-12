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

const verifyOptions = async () => {
    await connectDB();

    console.log(`\n[VERIFY] Checking for Generic Options...`);

    // Check if any option text contains "Option A", "Option B", etc.
    const badOptions = await Question.countDocuments({ "options.text": { $regex: /Option [A-D]/ } });
    console.log(`Questions with generic 'Option X' text: ${badOptions}`);

    if (badOptions === 0) {
        console.log(`[PASS] All generic options removed/replaced.`);
    } else {
        console.warn(`[WARN] Still found ${badOptions} questions with generic options.`);
    }

    // Sample some new questions to show options
    console.log(`\n[VERIFY] Sampling New Content & Options:`);
    const samples = await Question.aggregate([{ $sample: { size: 5 } }]);
    samples.forEach((q, i) => {
        console.log(`${i + 1}. [${q.topics[0]}] ${q.text.substring(0, 60)}...`);
        console.log(`   Options: ${q.options.map(o => o.text).join(', ')}`);
        console.log(`   Correct: ${q.options.find(o => o.id === q.correctOption)?.text || 'Error'}`);
    });

    process.exit();
};

verifyOptions();
