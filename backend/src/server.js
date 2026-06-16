require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    if (req.headers.authorization) {
        console.log(`[Request] Auth Header: Bearer ${req.headers.authorization.substring(7, 27)}...`);
    } else {
        console.log(`[Request] Auth Header: MISSING`);
    }
    next();
});
app.use(cors());
app.use(express.json());



// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/attempts', require('./routes/attemptRoutes'));
app.use('/api/institutes', require('./routes/instituteRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/study-plan', require('./routes/studyPlanRoutes'));
app.use('/api/library', require('./routes/libraryRoutes'));
app.use('/api', require('./routes/dashboardRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const seedAdmin = async () => {
    try {
        const Admin = require('./models/Admin');
        const adminEmail = 'gbochare482@gmail.com';
        const exists = await Admin.findOne({ email: adminEmail });
        if (!exists) {
            console.log(`[Admin Seeding] Admin account not found. Creating default admin...`);
            await Admin.create({
                email: adminEmail,
                password: 'admin@123'
            });
            console.log(`[Admin Seeding] Default admin account created successfully!`);
        } else {
            console.log(`[Admin Seeding] Admin account already exists.`);
        }
    } catch (err) {
        console.error(`[Admin Seeding Error]:`, err.message);
    }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        await seedAdmin();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (e) {
        console.error("Failed to start server:", e);
    }
};

startServer();
