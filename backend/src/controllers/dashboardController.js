const { Result, Attempt } = require('../models/TestModels');
const RecentActivity = require('../models/RecentActivity');
const UserPerformance = require('../models/UserPerformance');

// @desc Get User Dashboard
// @route GET /dashboard/:userId
exports.getDashboard = async (req, res) => {
    try {
        if (req.user.clerkId !== req.params.userId && req.user.id !== req.params.userId) { // Simple check, admin might override
            return res.status(403).json({ message: 'Not authorized' });
        }

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
        if (req.user.clerkId !== req.params.userId && req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { range } = req.query;
        const mongoUserId = req.user._id;

        let dateFilter = {};
        if (range && range !== 'all') {
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - (range === '7d' ? 7 : 30));
            dateFilter = { $gte: cutoff };
        }

        // ── SOURCE 1: UserPerformance (per-question tracking, updated on every question answer) ──
        const userPerf = await UserPerformance.findOne({ userId: mongoUserId });

        // ── SOURCE 2: Result records (created when submitTest is called) ──
        const resultQuery = { userId: mongoUserId };
        if (Object.keys(dateFilter).length) resultQuery.createdAt = dateFilter;
        const results = await Result.find(resultQuery)
            .sort({ createdAt: 1 })
            .populate('testId', 'title');

        // ── SOURCE 3: Attempt records (practice sessions stay in-progress) ──
        const attemptQuery = { userId: mongoUserId };
        if (Object.keys(dateFilter).length) attemptQuery.startTime = dateFilter;
        // Don't filter by status='completed' because practice sessions are rarely 'submitted'
        const rawAttempts = await Attempt.find(attemptQuery)
            .sort({ endTime: 1, startTime: 1 })
            .select('type score questions practiceTopic practiceCategory startTime endTime');

        // Helper: normalize accuracy — stored as 0-1 decimal, we display as 0-100
        const toPercent = (val) => {
            if (val == null) return 0;
            return val <= 1 ? Math.round(val * 100 * 10) / 10 : Math.round(val * 10) / 10;
        };

        // ── Build testHistory: combine Result + practice Attempt records ──
        // Use Result records as the primary source (more complete data)
        const resultIds = new Set(results.map(r => r.attemptId?.toString()));

        const testHistory = [];
        results.forEach(r => {
            testHistory.push({
                id: r._id,
                testName: r.testId?.title || (r.testId ? 'Assessment' : 'Practice Session'),
                date: r.createdAt,
                score: r.score,
                accuracy: toPercent(r.accuracy),    // normalized to %
                totalQuestions: r.totalQuestions,
                correctAnswers: r.correctAnswers,
                type: r.testId ? 'test' : 'practice'
            });
        });
        // Add practice Attempts that have no corresponding Result
        rawAttempts.forEach(a => {
            if (!resultIds.has(a._id.toString())) {
                const answeredCount = a.questions.filter(q => q.selectedOption != null).length;
                if (answeredCount > 0) {
                    const correct = a.questions.filter(q => q.isCorrect).length;
                    const acc = Math.round((correct / answeredCount) * 100 * 10) / 10;
                    testHistory.push({
                        id: a._id,
                        testName: a.practiceTopic || a.practiceCategory || 'Practice Session',
                        date: a.endTime || a.startTime,
                        score: correct,
                        accuracy: acc,
                        totalQuestions: answeredCount,
                        correctAnswers: correct,
                        type: 'practice'
                    });
                }
            }
        });
        // Sort by date ascending for trendData, then reverse for display list
        testHistory.sort((a, b) => new Date(a.date) - new Date(b.date));

        // ── Build trendData (Score Progress line chart) ──
        const trendData = testHistory.map((entry, idx) => {
            const window = testHistory.slice(Math.max(0, idx - 2), idx + 1);
            const rollingAvg = Math.round(window.reduce((s, e) => s + e.accuracy, 0) / window.length);
            return {
                date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                score: entry.score,
                accuracy: entry.accuracy,
                rollingAverage: rollingAvg
            };
        });

        // ── Build merged topicMetrics from UserPerformance (most accurate source) ──
        // UserPerformance.topicPerformance is updated after EVERY question answered
        let topicMetrics = {};

        if (userPerf && userPerf.topicPerformance) {
            userPerf.topicPerformance.forEach((perf, topic) => {
                topicMetrics[topic] = {
                    totalQuestions: perf.total || 0,
                    correctAnswers: perf.correct || 0
                };
            });
        }

        // Also add topics from Result records (may have topics not in practice)
        results.forEach(r => {
            if (r.topicPerformance) {
                Object.entries(r.topicPerformance).forEach(([topic, acc]) => {
                    if (!topicMetrics[topic]) {
                        // acc is the fraction correct (0-1)
                        topicMetrics[topic] = { totalQuestions: 10, correctAnswers: Math.round(toPercent(acc) / 10) };
                    }
                });
            }
        });

        const topicData = Object.entries(topicMetrics)
            .filter(([, d]) => d.totalQuestions > 0)
            .map(([name, data]) => ({
                name,
                accuracy: Number((data.correctAnswers / data.totalQuestions) * 100).toFixed(1),
                totalQuestions: data.totalQuestions,
                correctAnswers: data.correctAnswers
            }));

        // ── KPI Stats ──
        const totalQuestionsSolved = userPerf?.totalQuestionsSolved
            || testHistory.reduce((s, h) => s + (h.totalQuestions || 0), 0);
        const totalCorrectAnswers = userPerf?.totalCorrectAnswers
            || testHistory.reduce((s, h) => s + (h.correctAnswers || 0), 0);
        const overallAccuracy = totalQuestionsSolved > 0
            ? Number((totalCorrectAnswers / totalQuestionsSolved) * 100).toFixed(1)
            : testHistory.length > 0
                ? Number(testHistory.reduce((s, h) => s + h.accuracy, 0) / testHistory.length).toFixed(1)
                : '0.0';

        // highestScore as percentage
        const highestScore = testHistory.length > 0
            ? Math.max(...testHistory.map(h => h.accuracy))
            : 0;

        const kpiStats = {
            averageScore: overallAccuracy,
            accuracy: overallAccuracy,
            totalTests: results.length,                  // Only real submitted tests
            totalSessions: testHistory.length,            // All sessions including practice
            highestScore: highestScore,
            totalQuestionsSolved,
            totalCorrectAnswers,
        };

        const sortedByAcc = [...topicData].sort((a, b) => parseFloat(a.accuracy) - parseFloat(b.accuracy));
        const weakTopic = sortedByAcc[0]?.name || 'N/A';
        const strongTopic = sortedByAcc[sortedByAcc.length - 1]?.name || 'N/A';

        // ── Active Days from RecentActivity (Calculate early for use in mentorship) ──
        const activeDays = [];
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const allActivities = await RecentActivity.find({ userId: mongoUserId });
        allActivities.forEach(act => {
            const d = new Date(act.completedAt);
            if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
                if (!activeDays.includes(d.getDate())) activeDays.push(d.getDate());
            }
        });

        const activeDaysCount = activeDays.length;

        // ── Real Community Data ──
        const communityStats = await UserPerformance.aggregate([
            { $project: { topicPerformance: { $objectToArray: "$topicPerformance" } } },
            { $unwind: "$topicPerformance" },
            { $group: {
                _id: "$topicPerformance.k",
                avgAccuracy: { $avg: { $cond: [{ $gt: ["$topicPerformance.v.total", 0] }, { $divide: ["$topicPerformance.v.correct", "$topicPerformance.v.total"] }, 0] } }
            } }
        ]);

        const communityMap = {};
        communityStats.forEach(stat => communityMap[stat._id] = stat.avgAccuracy * 100);

        // ── AI Insights ──
        // Calculate improved predicted score based on trend
        const last5Tests = testHistory.slice(-5);
        let predictedValue = parseFloat(overallAccuracy);
        if (last5Tests.length >= 2) {
            const firstAcc = last5Tests[0].accuracy;
            const lastAcc = last5Tests[last5Tests.length - 1].accuracy;
            const trend = (lastAcc - firstAcc) / (last5Tests.length - 1);
            predictedValue = Math.min(100, Math.max(0, lastAcc + trend));
        } else {
            predictedValue = Math.min(95, predictedValue + 2);
        }

        // Generate dynamic recommendations
        const dynamicRecommendations = [];
        if (weakTopic !== 'N/A') {
            const weakAcc = parseFloat(topicData.find(t => t.name === weakTopic)?.accuracy || 0);
            if (weakAcc < 40) {
                dynamicRecommendations.push({ id: 1, title: `Foundation: ${weakTopic} Theory`, type: 'theory', duration: '30m', link: `/library?topic=${weakTopic}` });
            } else {
                dynamicRecommendations.push({ id: 1, title: `Practice: ${weakTopic} Level 2`, type: 'practice', duration: '25m', link: `/tests?topic=${weakTopic}&diff=medium` });
            }
        }
        
        dynamicRecommendations.push({ id: 2, title: 'Speed Challenge: 10 Mixed Qs', type: 'test', duration: '10m', link: '/tests/random' });
        
        if (strongTopic !== 'N/A') {
            dynamicRecommendations.push({ id: 3, title: `Expert: ${strongTopic} Advanced`, type: 'practice', duration: '20m', link: `/tests?topic=${strongTopic}&diff=hard` });
        }

        // Mentorship Advice
        const mentorshipAdvice = [];
        if (parseFloat(overallAccuracy) > 80) {
            mentorshipAdvice.push("Top tier performance! Focus on minimizing time per question to gain a competitive edge.");
        } else if (parseFloat(overallAccuracy) > 50) {
            mentorshipAdvice.push(`Solid progress. Strengthening ${weakTopic} could increase your percentile significantly.`);
        } else {
            mentorshipAdvice.push("Building a strong foundation is key. Review basic concepts before attempting advanced tests.");
        }

        if (activeDaysCount < 3) {
            mentorshipAdvice.push("Consistency is the secret to mastery. Let's aim for a 3-day study streak!");
        } else {
            mentorshipAdvice.push(`Great job on your ${activeDaysCount}-day activity streak! Keep the momentum going.`);
        }

        const aiInsights = {
            predictedScore: predictedValue.toFixed(1),
            weakestTopic: weakTopic,
            strongestTopic: strongTopic,
            recommendedPracticeTime: parseFloat(overallAccuracy) < 50 ? '60 mins' : '30 mins',
            skillRadar: topicData.slice(0, 6).map(t => ({ subject: t.name, value: parseFloat(t.accuracy) })),
            communityComparison: topicData.slice(0, 6).map(t => ({
                subject: t.name,
                user: parseFloat(t.accuracy),
                community: Math.round(communityMap[t.name] || 65)
            })),
            recommendations: dynamicRecommendations,
            mentorship: mentorshipAdvice
        };

        // Score Distribution (Histogram) ──
        const scoreBuckets = { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 };
        testHistory.forEach(h => {
            const s = h.accuracy;
            if (s <= 20) scoreBuckets['0-20']++;
            else if (s <= 40) scoreBuckets['21-40']++;
            else if (s <= 60) scoreBuckets['41-60']++;
            else if (s <= 80) scoreBuckets['61-80']++;
            else scoreBuckets['81-100']++;
        });
        const distributionData = Object.entries(scoreBuckets).map(([range, count]) => ({ range, count }));

        res.json({
            stats: {
                ...kpiStats,
                topicData,
                trendData,
                distributionData,
                testHistory: testHistory.reverse(), // newest first
                aiInsights,
                activeDays
            }
        });

    } catch (error) {
        console.error('Error in getUserPerformance:', error);
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
