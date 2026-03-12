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

const verify = async () => {
    await connectDB();

    console.log(`\n[VERIFY] Checking Database Counts...`);

    // 1. Total Questions
    const total = await Question.countDocuments();
    console.log(`Total Questions: ${total}`);

    // 2. Company Check
    const companies = ['tcs', 'amazon', 'google'];
    for (const company of companies) {
        const count = await Question.countDocuments({ company: company });
        console.log(`Questions for Company '${company}': ${count}`);
    }

    // 3. Exam Check
    const exams = ['cat', 'gate', 'upsc'];
    for (const exam of exams) {
        const count = await Question.countDocuments({ exam: exam });
        console.log(`Questions for Exam '${exam}': ${count}`);
    }

    // 4. Topic Check
    const topics = ['percentages', 'coding-decoding'];
    for (const topic of topics) {
        const count = await Question.countDocuments({ topics: topic });
        console.log(`Questions for Topic '${topic}': ${count}`);
    }

    // 5. Test Query Construction (Matching Controller Logic)
    console.log(`\n[VERIFY] Simulating Controller Query for TCS...`);
    const tcsQuery = { company: 'tcs' };
    const tcsQuestions = await Question.find(tcsQuery).limit(5);
    console.log(`Fetched ${tcsQuestions.length} TCS questions.`);
    if (tcsQuestions.length > 0) {
        console.log(`Sample: ${tcsQuestions[0].text.substring(0, 50)}...`);
    }

    process.exit();
};

verify();
