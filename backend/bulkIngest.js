const { fetchAndStoreQuestions } = require('./src/utils/questionService');
const mongoose = require('mongoose');

const allTopics = [
    'number-system', 'percentages', 'profit-loss', 'ratio-proportion',
    'time-work', 'time-distance', 'algebra', 'geometry',
    'probability', 'si-ci', 'arithmetic', 'blood-relations',
    'coding-decoding', 'syllogism', 'series', 'seating',
    'puzzles', 'analogies', 'synonyms-antonyms', 'grammar',
    'cloze-test', 'reading-comp', 'vocabulary', 'data-interpretation',
    'charts', 'tables'
];

async function ingestAll() {
    try {
        console.log('🚀 Starting Bulk ETL Ingestion...');
        await mongoose.connect('mongodb://localhost:27017/aptiverse');
        console.log('✅ Connected to MongoDB.');

        for (const topic of allTopics) {
            console.log(`\n--- Processing Topic: ${topic} ---`);
            const questions = await fetchAndStoreQuestions(topic, 50);
            console.log(`✅ Loaded ${questions.length} questions for ${topic}`);

            // Wait 5 seconds between topics to respect API rate limits
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        const totalCount = await mongoose.connection.db.collection('questions').countDocuments();
        console.log(`\n🏁 Bulk Ingestion Complete!`);
        console.log(`📊 Total questions in database: ${totalCount}`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error during bulk ingestion:', err);
        process.exit(1);
    }
}

ingestAll();
