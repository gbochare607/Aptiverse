require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const { Attempt, Result } = require('./src/models/TestModels');
const RecentActivity = require('./src/models/RecentActivity');
const UserPerformance = require('./src/models/UserPerformance');
const dashboardController = require('./src/controllers/dashboardController');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const req = {
        user: { _id: new mongoose.Types.ObjectId('69b2c1adadfceb134c2bb55b'), clerkId: 'user_38wDeHsQOSBOcO0mbvTHJ1BMiGb', id: 'user_38wDeHsQOSBOcO0mbvTHJ1BMiGb' },
        params: { userId: 'user_38wDeHsQOSBOcO0mbvTHJ1BMiGb' },
        query: { range: 'all' }
    };
    
    const res = {
        status: (code) => ({ json: (data) => console.log('STATUS', code, JSON.stringify(data, null, 2)) }),
        json: (data) => console.log('SUCCESS:', JSON.stringify(data, null, 2))
    };
    
    await dashboardController.getUserPerformance(req, res);
    process.exit(0);
}

run();
