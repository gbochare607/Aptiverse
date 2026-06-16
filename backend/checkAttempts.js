require('dotenv').config();
const mongoose = require('mongoose');
const { Attempt } = require('./src/models/TestModels');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    // Find attempts that have selectedOption != null
    const atts = await Attempt.find({ "questions.selectedOption": { $ne: null, $exists: true } });
    console.log(`Attempts with at least 1 answered question: ${atts.length}`);
    
    if (atts.length > 0) {
        console.log("Sample attempt _id:", atts[0]._id, "type:", atts[0].type);
        const answeredCount = atts[0].questions.filter(q => q.selectedOption != null).length;
        console.log("Answered count:", answeredCount);
    }
    
    // Also check how many total attempts exist for the user we spotted
    const allAtts = await Attempt.find({ userId: '69b2c1adadfceb134c2bb55b' });
    console.log(`\nUser 69b2c1adadfceb134c2bb55b total attempts: ${allAtts.length}`);
    for(const a of allAtts.slice(-3)) {
        const answered = a.questions.filter(q => q.selectedOption != null).length;
        console.log(`Attempt ${a._id}: type=${a.type}, answered=${answered}, questionsLength=${a.questions.length}`);
    }

    // Checking Recently Activity
    const RecentActivity = require('./src/models/RecentActivity');
    const acts = await RecentActivity.find({ userId: '69b2c1adadfceb134c2bb55b' });
    for(const act of acts) {
        console.log(`Activity: ${act.title}`);
    }

    process.exit(0);
}

run();
