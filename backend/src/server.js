require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/questions', require('./routes/questionRoutes'));
app.use('/tests', require('./routes/testRoutes'));
app.use('/attempts', require('./routes/attemptRoutes'));
app.use('/api', require('./routes/dashboardRoutes')); // Mount dashboard under /api for now or /dashboard? User spec said GET /dashboard/:userId. Let's stick to /api to avoid root pollution or just use specific prefixes. Spec: GET /dashboard/:userId. So maybe `app.use('/', ...)`? No, unsafe. Let's use `app.use('/', require('./routes/dashboardRoutes'))` CAREFULLY or just specific paths.
// Let's mount dashboardRoutes at root but ensure no conflict.
// dashboardRoutes has /dashboard/:userId and /results/:userId.
app.use('/', require('./routes/dashboardRoutes'));
app.use('/institutes', require('./routes/instituteRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
