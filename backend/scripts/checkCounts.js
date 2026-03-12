const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Question = require('../src/models/Question');

const checkCounts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected`);

        const aggregation = await Question.aggregate([
            { $unwind: "$topics" },
            { $group: { _id: "$topics", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        console.log("\n--- Real Question Counts by Topic ---");
        aggregation.forEach(item => {
            console.log(`${item._id}: ${item.count}`);
        });

        const total = await Question.countDocuments();
        console.log(`\nTotal Questions: ${total}`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkCounts();
