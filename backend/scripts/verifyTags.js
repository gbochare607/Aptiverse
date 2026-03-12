const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Question = require('../src/models/Question');

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const count = await Question.countDocuments();
        console.log(`Total Questions: ${count}`);

        const companies = ['tcs', 'infosys', 'wipro', 'accenture', 'amazon', 'google', 'deloitte', 'capgemini', 'cognizant', 'microsoft', 'ibm', 'oracle', 'goldman', 'jpmorgan', 'adobe'];
        const exams = ['cat', 'gate', 'upsc', 'banking', 'gre', 'gmat', 'ssc', 'sat', 'placements'];

        console.log('\n--- COMPANY COUNTS ---');
        for (const c of companies) {
            const count = await Question.countDocuments({ company: c });
            console.log(`${c.padEnd(12)}: ${count} ${count < 10 ? '❌ LOW' : '✅'}`);
        }

        console.log('\n--- EXAM COUNTS ---');
        for (const e of exams) {
            const count = await Question.countDocuments({ exam: e });
            console.log(`${e.padEnd(12)}: ${count} ${count < 10 ? '❌ LOW' : '✅'}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
};

verify();
