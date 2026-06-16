require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const { Attempt, Result } = require('./src/models/TestModels');
const RecentActivity = require('./src/models/RecentActivity');
const UserPerformance = require('./src/models/UserPerformance');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({});
    console.log("Users:", users.map(u => ({ id: u._id, clerk: u.clerkId })));
    
    for (let u of users) {
        console.log(`\n--- User ${u._id} ---`);
        const acts = await RecentActivity.find({ userId: u._id });
        console.log(`Activities: ${acts.length}`);
        const atts = await Attempt.find({ userId: u._id });
        console.log(`Attempts: ${atts.length}`);
        const resps = await Result.find({ userId: u._id });
        console.log(`Results: ${resps.length}`);
        const perfs = await UserPerformance.find({ userId: u._id });
        console.log(`Perfs: ${perfs.length}`);
        if(atts.length > 0) {
            console.log("Sample attempt _id:", atts[0]._id, "status:", atts[0].status);
        }
    }
    process.exit(0);
}

run();
