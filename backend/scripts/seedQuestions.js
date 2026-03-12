const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // Explicitly resolve from script location to parent
const mongoose = require('mongoose');
const { fetchAndStoreQuestions } = require('../src/utils/questionService');
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

const topics = [
    // Quantitative
    'number-system', 'percentages', 'profit-loss', 'ratio-proportion',
    'time-work', 'time-distance', 'algebra', 'geometry',
    'probability', 'si-ci', 'arithmetic', 'quantitative',
    // Logical
    'blood-relations', 'coding-decoding', 'syllogism', 'series',
    'seating', 'puzzles', 'analogies', 'logical', 'reasoning',
    // Verbal
    'synonyms-antonyms', 'grammar', 'cloze-test', 'reading-comp',
    'vocabulary', 'verbal', 'english',
    // Data
    'data-interpretation', 'charts', 'tables', 'data'
];

const seed = async () => {
    await connectDB();

    console.log(`\n[SEED] Starting Batch Seeding for ${topics.length} topics...`);
    console.log(`[SEED] Target: 30 new questions per topic.\n`);

    console.log(`\n[SEED] Analyzing Topic Counts...`);

    // Get counts for all topics first
    const topicPriorities = [];
    for (const topic of topics) {
        const count = await Question.countDocuments({ topics: topic });
        topicPriorities.push({ name: topic, count });
    }

    // Sort: Low counts first
    topicPriorities.sort((a, b) => a.count - b.count);

    console.log(`[SEED] Priority List (Top 5):`, topicPriorities.slice(0, 5).map(t => `${t.name} (${t.count})`));

    for (const { name: topic, count: beforeCount } of topicPriorities) {
        console.log(`\n--- Processing Topic: ${topic} ---`);
        try {
            console.log(`[SEED] Existing count for ${topic}: ${beforeCount}`);

            if (beforeCount >= 10) { // Goal is at least 5-10
                console.log(`[SEED] Skipping ${topic} (Has enough questions: ${beforeCount})`);
                continue;
            }

            // Fetch questions with retry logic
            let fetched = [];
            let retries = 5; // Increased retries
            while (retries > 0) {
                try {
                    fetched = await fetchAndStoreQuestions(topic, 20);
                    if (fetched && fetched.length > 0) break;
                } catch (e) {
                    if (e.response && e.response.status === 429) {
                        console.log(`[SEED] Rate limited. Waiting 10s...`);
                        await new Promise(r => setTimeout(r, 10000)); // Longer wait
                    } else {
                        console.log(`[SEED] Error: ${e.message}`);
                        // Break on non-retryable errors? 
                        // No, try again maybe it was transient net error.
                    }
                }

                retries--;
                if (fetched.length === 0 && retries > 0) {
                    console.log(`[SEED] Retry ${5 - retries}/5...`);
                    await new Promise(r => setTimeout(r, 2000));
                }
            }

            // Wait 5 seconds between topics to avoid rate limits
            const waitTime = 5000;
            console.log(`[SEED] Waiting ${waitTime / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));

        } catch (err) {
            console.error(`[SEED] Failed to process ${topic}: ${err.message}`);
        }
    }

    console.log(`\n[SEED] Seeding Complete.`);
    process.exit();
};

seed();
