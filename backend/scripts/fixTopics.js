const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Question = require('../src/models/Question');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const fixTopics = async () => {
    await connectDB();
    console.log('[MIGRATION] Starting Topic Fix...');

    // 1. Find all questions that have a 'subtopic' field (from previous run)
    // We want to move that subtopic to 'topics' [subtopic]
    // And remove 'subtopic' field.

    // Also check for questions that DON'T have subtopic field but have 'topics' with Category
    // We can't easily fix those unless we infer from content or just delete them.
    // For now, let's fix the ones we just added in the last 15-20 mins.

    const questions = await Question.find({});
    console.log(`[MIGRATION] Scanning ${questions.length} questions.`);

    let fixedCount = 0;
    for (const q of questions) {
        let changed = false;

        // If subtopic field exists, it is the source of truth for the topic
        if (q.subtopic) {
            q.topics = [q.subtopic];
            q.subtopic = undefined; // Trigger unset
            changed = true;
        }

        // If topics contains a Category name (e.g. 'Quantitative'), and NO subtopic,
        // we might have a problem. But if we have another string in topics, use that.
        // e.g. ['number-system', 'Quantitative'] -> ['number-system']
        if (q.topics && q.topics.length > 1) {
            const categories = ['Quantitative', 'Logical', 'Verbal', 'Data', 'General'];
            const cleanTopics = q.topics.filter(t => !categories.includes(t));
            if (cleanTopics.length > 0 && cleanTopics.length < q.topics.length) {
                q.topics = cleanTopics;
                changed = true;
            }
        }

        if (changed) {
            await Question.updateOne({ _id: q._id }, {
                $set: { topics: q.topics },
                $unset: { subtopic: "" }
            });
            fixedCount++;
        }
    }

    console.log(`[MIGRATION] Fixed ${fixedCount} questions.`);
    process.exit();
};

fixTopics();
