const { Result, Attempt } = require('../models/TestModels');
const RecentActivity = require('../models/RecentActivity');

// @desc Get User Dashboard
// @route GET /dashboard/:userId
exports.getDashboard = async (req, res) => {
    try {
        if (req.user.clerkId !== req.params.userId && req.user.id !== req.params.userId) { // Simple check, admin might override
            return res.status(403).json({ message: 'Not authorized' });
        }

        const UserPerformance = require('../models/UserPerformance');

        // Fetch recent results (for records)
        const recentResults = await Result.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('testId', 'title');

        // Fetch Real-time aggregated stats from UserPerformance
        let userPerf = await UserPerformance.findOne({ userId: req.user._id });

        let accuracy = 0;
        let totalTests = 0;
        let avgScore = 0;

        if (userPerf) {
            const totalQuestionsSolved = userPerf.totalQuestionsSolved || 0;
            const totalCorrect = userPerf.totalCorrectAnswers || 0;
            accuracy = totalQuestionsSolved > 0 ? ((totalCorrect / totalQuestionsSolved) * 100).toFixed(2) : 0;
            totalTests = userPerf.totalTestsTaken || 0;
            avgScore = accuracy;
        }

        // Calculate Streak, Time, Daily Goal
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Daily Goal & Time Spent (approximate using attempts today vs total)
        // For time spent, we'll sum up duration from Attempts
        const userAttempts = await Attempt.find({ userId: req.user._id, status: 'completed' });
        let totalMinutesSpent = 0;
        let questionsAnsweredToday = 0;

        userAttempts.forEach(att => {
            // Rough estimation of time spent based on duration
            if (att.duration) totalMinutesSpent += att.duration;
            else totalMinutesSpent += 15; // fallback
        });

        // 2. Activities for Streak & Calendars
        const allActivities = await RecentActivity.find({ userId: req.user._id }).sort({ completedAt: -1 });

        // Determine Streak
        let streak = 0;
        let currentDateToCheck = new Date(today);

        // Group activities by date string (YYYY-MM-DD)
        const activityDates = new Set();
        let questionsToday = 0;

        allActivities.forEach(act => {
            const d = new Date(act.completedAt);
            const dateStr = d.toISOString().split('T')[0];
            activityDates.add(dateStr);

            // Check Daily Goal logic (assuming logic is # of questions answered today)
            if (d >= today) {
                if (act.metadata?.totalQuestions) {
                    questionsToday += act.metadata.totalQuestions;
                } else {
                    questionsToday += 5; // approximate
                }
            }
        });

        const sortedDates = Array.from(activityDates).sort().reverse();

        let checkedDate = new Date();
        checkedDate.setHours(0, 0, 0, 0);
        let checkedStr = checkedDate.toISOString().split('T')[0];

        // Check if active today
        if (activityDates.has(checkedStr)) {
            streak++;
            checkedDate.setDate(checkedDate.getDate() - 1);
            checkedStr = checkedDate.toISOString().split('T')[0];
        } else {
            // Check if active yesterday (meaning streak is alive but not updated today)
            checkedDate.setDate(checkedDate.getDate() - 1);
            checkedStr = checkedDate.toISOString().split('T')[0];
            if (activityDates.has(checkedStr)) {
                // Streak is alive from yesterday
            } else {
                streak = 0; // Streak broken
            }
        }

        // Count backwards to find full streak
        while (activityDates.has(checkedStr) && streak > 0) {
            streak++;
            checkedDate.setDate(checkedDate.getDate() - 1);
            checkedStr = checkedDate.toISOString().split('T')[0];
        }

        const hours = Math.floor(totalMinutesSpent / 60);
        const minutes = totalMinutesSpent % 60;
        const timeSpentStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

        res.json({
            stats: {
                testsTaken: totalTests,
                averageScore: Number(avgScore),
                accuracy: Number(accuracy),
                verifiedSkills: 3,
                timeSpent: timeSpentStr,
                streak: streak,
                dailyGoal: `${Math.min(questionsToday, 20)}/20`
            },
            recentActivity: recentResults,
            recommendations: [
                { type: 'topic', id: 'Probability', reason: 'Low accuracy in last test' },
                { type: 'test', id: 'mock_1', reason: 'Recommended based on streak' }
            ]
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get User Performance Metrics
// @route GET /dashboard/performance/:userId
exports.getUserPerformance = async (req, res) => {
    try {
        if (req.user.clerkId !== req.params.userId && req.user.id !== req.params.userId) { // Simple check, admin might override
            return res.status(403).json({ message: 'Not authorized' });
        }

        const UserPerformance = require('../models/UserPerformance');

        const userPerf = await UserPerformance.findOne({ userId: req.user._id });

        if (!userPerf) {
            return res.json({
                stats: {
                    averageScore: 0,
                    totalTests: 0,
                    accuracy: 0,
                    totalQuestionsSolved: 0,
                    topTopic: 'N/A',
                    weakTopic: 'N/A',
                    performanceTrend: 0,
                    weeklyProgress: ['0%', '0%', '0%', '0%', '0%', '0%', '0%'],
                    activeDays: []
                }
            });
        }

        const totalQuestionsSolved = userPerf.totalQuestionsSolved || 0;
        const totalCorrect = userPerf.totalCorrectAnswers || 0;
        const accuracy = totalQuestionsSolved > 0 ? ((totalCorrect / totalQuestionsSolved) * 100).toFixed(2) : 0;
        const averageScore = accuracy;
        const totalTests = userPerf.totalTestsTaken || 0;

        let topTopic = 'N/A';
        let weakTopic = 'N/A';
        let maxAcc = -1;
        let minAcc = 101;

        if (userPerf.topicPerformance) {
            userPerf.topicPerformance.forEach((data, topic) => {
                if (data.total > 0) {
                    const acc = data.correct / data.total;
                    if (acc > maxAcc) {
                        maxAcc = acc;
                        topTopic = topic;
                    }
                    if (acc < minAcc) {
                        minAcc = acc;
                        weakTopic = topic;
                    }
                }
            });
        }

        const performanceTrend = 0;

        // Calculate Weekly Progress & Active Days from RecentActivity
        const allActivities = await RecentActivity.find({ userId: req.user._id }).sort({ completedAt: -1 });

        let weeklyProgress = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
        let activeDays = [];

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        allActivities.forEach(act => {
            const d = new Date(act.completedAt);

            // Populate activeDays for Profile calendar
            if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
                if (!activeDays.includes(d.getDate())) {
                    activeDays.push(d.getDate());
                }
            }

            // Populate weeklyProgress
            const diffTime = Math.abs(now - Math.max(d.getTime(), now.getTime() - 8 * 24 * 60 * 60 * 1000)); // prevent large outliers breaking math
            const diffDays = Math.ceil((now - d) / (1000 * 60 * 60 * 24));

            if (diffDays <= 7 && diffDays > 0) {
                // Determine day of week index (0=Mon, 6=Sun)
                let dayIdx = d.getDay() - 1;
                if (dayIdx < 0) dayIdx = 6;
                weeklyProgress[dayIdx] += 1; // Count activities per day
            }
            // Include today as well (diffDays could be 0)
            if (d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
                let dayIdx = d.getDay() - 1;
                if (dayIdx < 0) dayIdx = 6;
                weeklyProgress[dayIdx] += 1; // Count activities per day
            }
        });

        // Normalize weekly progress to percentages for the frontend
        const maxActivity = Math.max(...weeklyProgress, 1);
        const weeklyProgressPercentages = weeklyProgress.map(val => `${Math.round((val / maxActivity) * 100)}%`);

        res.json({
            stats: {
                averageScore,
                totalTests,
                accuracy,
                totalQuestionsSolved,
                topTopic,
                weakTopic,
                performanceTrend,
                weeklyProgress: weeklyProgressPercentages,
                activeDays
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get User Results
// @route GET /results/:userId
exports.getResults = async (req, res) => {
    try {
        const results = await Result.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .populate('testId');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
