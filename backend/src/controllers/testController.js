const mongoose = require('mongoose');
const { Test, Attempt, Result } = require('../models/TestModels');
const Question = require('../models/Question');
const User = require('../models/User');
const axios = require('axios');
const { fetchAndStoreQuestions } = require('../utils/questionService');
const RecentActivity = require('../models/RecentActivity');

// Helper to log user activity
const logActivity = async (userId, attempt) => {
    try {
        // Check if activity already exists for this attempt
        const existing = await RecentActivity.findOne({ 'metadata.testId': attempt._id });
        if (existing) return;

        let activityType = 'practice_questions';
        let title = `Practice - ${attempt.practiceTopic || attempt.practiceCategory || 'General'}`;
        let metadata = {
            category: attempt.practiceCategory,
            subTopic: attempt.practiceTopic,
            testId: attempt._id
        };

        if (attempt.type === 'test') {
            activityType = 'practice_test';
            title = `Test Completed - ${attempt.testId ? 'Assessment' : 'Mock Test'}`;
            metadata.score = attempt.score;
            metadata.totalQuestions = attempt.questions.length;
            metadata.testId = attempt.testId || attempt._id;
        } else {
            if (attempt.practiceCompany) {
                activityType = 'company_practice';
                title = `Company Oriented - ${attempt.practiceCompany.toUpperCase()}`;
                metadata.company = attempt.practiceCompany;
            } else if (attempt.practiceExam) {
                activityType = 'exam_practice';
                title = `Exam Oriented - ${attempt.practiceExam.toUpperCase()}`;
                metadata.exam = attempt.practiceExam;
            } else if (attempt.practiceCategory === 'soft-skills') {
                activityType = 'soft_skill';
                const skillName = attempt.practiceTopic ? attempt.practiceTopic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Communication';
                title = `Soft Skill - ${skillName}`;
                metadata.skill = attempt.practiceTopic;
            }
        }

        await RecentActivity.create({
            userId: userId,
            activityType: activityType,
            title: title,
            metadata: metadata
        });
    } catch (err) {
        console.error('[RecentActivity] Error logging activity:', err.message);
    }
};

// @desc Start a test or practice session
// @route POST /tests/start
exports.startTest = async (req, res) => {
    console.log(`[TestController] startTest triggered. User: ${req.user?._id}, Topic: ${req.body.topic}`);
    try {
        const { testId, testType, topic, company, exam, difficulty, count, duration } = req.body;
        // testType: 'test' | 'practice'

        let questions = [];

        if (testType === 'test' && testId) {
            const test = await Test.findById(testId).populate('questions');
            if (!test) return res.status(404).json({ message: 'Test not found' });
            questions = test.questions;
        } else if (testType === 'practice' || (testType === 'test' && !testId)) {
            // Practice Session OR Mock Test (Test without specific ID)
            console.log(`[TestController] ${testType === 'practice' ? 'Practice' : 'Mock Test'} Start Request: Topic=${topic}, Category=${req.body.category}`);

            // Build query for MongoDB
            const query = {};
            if (topic) {
                const isMainCategory = ['Quantitative', 'Logical', 'Verbal', 'Data'].includes(topic);
                if (isMainCategory) {
                    // If it's a main category, query by category field
                    query.category = topic;
                } else {
                    // If it's a specific subtopic, query by topics array
                    query.topics = topic;
                }
            }

            if (company) {
                query.company = company;
            }
            if (exam) {
                query.exam = exam;
            }

            if (difficulty) {
                query.difficulty = {
                    $gte: Math.max(0, difficulty - 0.25),
                    $lte: Math.min(1, difficulty + 0.25)
                };
            }

            // FETCHING LOGIC
            const targetCount = parseInt(count) || 20;

            // CASE A: General Mock Test (No specific topic/category)
            // We want a mix of Quantitative, Logical, Verbal, Data
            if (testType === 'test' && !topic && !req.body.category) {
                const categories = ['Quantitative', 'Logical', 'Verbal', 'Data'];
                const perCatCount = Math.floor(targetCount / categories.length);
                let allFetched = [];

                for (const cat of categories) {
                    const catQuestions = await Question.aggregate([
                        { $match: { category: cat } },
                        { $sample: { size: perCatCount } }
                    ]);
                    allFetched = [...allFetched, ...catQuestions];
                }

                // If we still need more (due to rounding or empty categories), fill from random
                if (allFetched.length < targetCount) {
                    const remaining = targetCount - allFetched.length;
                    const bonus = await Question.aggregate([
                        { $match: { _id: { $nin: allFetched.map(q => q._id) } } },
                        { $sample: { size: remaining } }
                    ]);
                    allFetched = [...allFetched, ...bonus];
                }
                questions = allFetched;
            }
            // CASE B: Specific Topic/Category (Practice or specific Mock Test)
            else {
                questions = await Question.aggregate([
                    { $match: query },
                    { $sample: { size: targetCount } }
                ]);
            }

            console.log(`[TestController] DB Query result: ${questions.length} questions found.`);

            // AUTO-SYNC / ETL TRIGGER: If we don't have enough questions (Threshold increased to 20)
            if (questions.length < 20) {
                console.log(`[TestController] Insufficient questions. Triggering ETL sync for: ${topic || req.body.category || 'general'}`);

                // Use specific topic if available, otherwise category
                const etlTopic = topic || req.body.category || 'quantitative';
                // Fire and forget - Don't await
                fetchAndStoreQuestions(etlTopic, count || 10).catch(err => console.error("Background ETL failed:", err));
            }
        }

        if (questions.length === 0) {
            console.log(`[TestController] Zero questions found for ${topic}. Returning empty set (User requested no demo).`);
            questions = [];
        }


        // Return questions without correct option
        // We need to fetch full question details for the frontend ? 
        // Or frontend fetches them one by one?
        // Usually, for security, we send specific fields.
        // But for simplicity, let's send the IDs or the full objects (sanitized).

        // Populate if it was aggregate (which returns plain objects)
        // If aggregate, 'questions' has the data.

        const sanitizedQuestions = questions.map(q => {
            const qObj = {
                questionId: q.questionId,
                _id: q._id,
                text: q.text,
                options: q.options,
                // Include correctOption for Practice sessions AND Mock Tests (where testId is null)
                // We hide it only for specific Assessments (which have a fixed testId)
                ...((testType === 'practice' || !testId) && { correctOption: q.correctOption })
            };
            return qObj;
        });

        const attempt = await Attempt.create({
            userId: req.user.id,
            testId: testId || null,
            type: testType,
            questions: sanitizedQuestions.map(q => ({ questionId: q._id || q.questionId })),
            duration: duration || 30, // Default 30 mins
            difficulty: difficulty || 0.5,
            practiceTopic: topic,
            practiceCompany: company,
            practiceExam: exam,
            practiceCategory: req.body.category,
            startTime: new Date()
        });

        res.json({
            attemptId: attempt._id,
            questions: sanitizedQuestions
        });

        // --- REMOVED: Logging activity here, moved to submit ---

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Save partial answer
// @route POST /attempts/:attemptId/answer
exports.saveAnswer = async (req, res) => {
    try {
        const { questionId, selectedOption, timeTaken } = req.body;
        const attempt = await Attempt.findById(req.params.attemptId);

        if (!attempt) return res.status(404).json({ message: 'Attempt not found' });
        if (attempt.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        // Find the question in attempt
        const qIndex = attempt.questions.findIndex(q => q.questionId.toString() === questionId);

        if (qIndex > -1) {
            const isFirstAnswer = !attempt.questions.some(q => q.selectedOption !== undefined && q.selectedOption !== null);

            // Check correctness immediately
            const Question = require('../models/Question');
            const questionDoc = await Question.findById(attempt.questions[qIndex].questionId);
            const isCorrect = questionDoc ? (questionDoc.correctOption === selectedOption) : false;

            // Detect if this is a NEW answer or CHANGING an answer
            const previousOption = attempt.questions[qIndex].selectedOption;
            const previousIsCorrect = attempt.questions[qIndex].isCorrect;
            const isNewAnswer = (previousOption === undefined || previousOption === null);
            const isAnswerChanged = (!isNewAnswer && previousOption !== selectedOption);

            // Update in-memory attempt
            attempt.questions[qIndex].selectedOption = selectedOption;
            attempt.questions[qIndex].timeTaken = timeTaken;
            attempt.questions[qIndex].isCorrect = isCorrect;

            await attempt.save();

            // --- REAL-TIME PERFORMANCE UPDATE ---
            if (attempt.type === 'practice') {
                try {
                    const UserPerformance = require('../models/UserPerformance');
                    let userPerf = await UserPerformance.findOne({ userId: req.user.id });

                    if (!userPerf) {
                        userPerf = await UserPerformance.create({ userId: req.user.id });
                    }

                    // Determine Topic
                    const topic = attempt.practiceTopic || attempt.practiceCategory || 'General';

                    // Initialize topic if missing
                    if (!userPerf.topicPerformance) { userPerf.topicPerformance = new Map(); }
                    if (!userPerf.topicPerformance.has(topic)) {
                        userPerf.topicPerformance.set(topic, { total: 0, correct: 0 });
                    }
                    const topicStats = userPerf.topicPerformance.get(topic);

                    if (isNewAnswer) {
                        userPerf.totalQuestionsSolved = (userPerf.totalQuestionsSolved || 0) + 1;
                        topicStats.total += 1;
                        if (isCorrect) {
                            userPerf.totalCorrectAnswers = (userPerf.totalCorrectAnswers || 0) + 1;
                            topicStats.correct += 1;
                        }
                    } else if (isAnswerChanged) {
                        // Answer changed: adjust correctness counts
                        if (previousIsCorrect && !isCorrect) {
                            // Was correct, now wrong -> decrement correct count
                            userPerf.totalCorrectAnswers = Math.max(0, (userPerf.totalCorrectAnswers || 0) - 1);
                            topicStats.correct = Math.max(0, topicStats.correct - 1);
                        } else if (!previousIsCorrect && isCorrect) {
                            // Was wrong, now correct -> increment correct count
                            userPerf.totalCorrectAnswers = (userPerf.totalCorrectAnswers || 0) + 1;
                            topicStats.correct += 1;
                        }
                        // Total questions solved remains same as it's the same question
                    }

                    userPerf.lastActive = new Date();
                    userPerf.markModified('topicPerformance');
                    await userPerf.save();
                } catch (perfError) {
                    console.error("UserPerformance Update Error:", perfError);
                    // Don't fail the request, just log
                }
            }

            // Smart Logging: Log practice as soon as first question is answered
            if (attempt.type === 'practice' && isFirstAnswer) {
                logActivity(req.user.id, attempt);
            }
        }

        res.json({ message: 'Saved' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Submit test
// @route POST /tests/:attemptId/submit
exports.submitTest = async (req, res) => {
    try {
        const attempt = await Attempt.findById(req.params.attemptId).populate('questions.questionId');
        if (!attempt) return res.status(404).json({ message: 'Attempt not found' });
        if (attempt.status === 'completed') return res.status(400).json({ message: 'Already submitted' });

        let score = 0;
        let correctAnswers = 0;
        const topicStats = {};

        // Calculate score
        attempt.questions.forEach(aq => {
            const question = aq.questionId; // Populated
            if (question) {
                if (aq.selectedOption === question.correctOption) {
                    score += 1; // Needs defined marking scheme
                    correctAnswers += 1;
                    aq.isCorrect = true;
                } else {
                    aq.isCorrect = false;
                }

                // Topic stats
                question.topics.forEach(t => {
                    if (!topicStats[t]) topicStats[t] = { total: 0, correct: 0 };
                    topicStats[t].total++;
                    if (aq.isCorrect) topicStats[t].correct++;
                });
            }
        });

        attempt.score = score;
        attempt.status = 'completed';
        attempt.endTime = new Date();
        await attempt.save();

        // Create Result
        const topicPerformance = {};
        Object.keys(topicStats).forEach(t => {
            topicPerformance[t] = topicStats[t].correct / topicStats[t].total;
        });

        const result = await Result.create({
            userId: req.user.id,
            attemptId: attempt._id,
            testId: attempt.testId,
            score,
            totalQuestions: attempt.questions.length,
            correctAnswers,
            accuracy: attempt.questions.length > 0 ? correctAnswers / attempt.questions.length : 0,
            topicPerformance
        });

        // Trigger AI Update
        try {
            if (process.env.AI_SERVICE_URL) {
                await axios.post(`${process.env.AI_SERVICE_URL}/predict`, {
                    userId: req.user.id,
                    attemptSummary: {
                        score,
                        topicPerformance
                    }
                });
            }
        } catch (e) {
            console.error('AI Service Error:', e.message);
        }

        // Also update UserPerformance for Test Submissions?
        // Requirement said "real-time updates after every question attempt".
        // For tests, we don't update real-time to avoid exam anxiety/cheating?
        // But we SHOULD update it on submission.

        try {
            const UserPerformance = require('../models/UserPerformance');
            let userPerf = await UserPerformance.findOne({ userId: req.user.id });
            if (!userPerf) userPerf = await UserPerformance.create({ userId: req.user.id });

            userPerf.totalTestsTaken = (userPerf.totalTestsTaken || 0) + 1;

            // Update topic stats from this test
            if (!userPerf.topicPerformance) userPerf.topicPerformance = new Map();

            Object.keys(topicStats).forEach(t => {
                const sessionStat = topicStats[t];
                if (!userPerf.topicPerformance.has(t)) {
                    userPerf.topicPerformance.set(t, { total: 0, correct: 0 });
                }
                const globalStat = userPerf.topicPerformance.get(t);
                globalStat.total += sessionStat.total;
                globalStat.correct += sessionStat.correct;
            });

            // Also update total questions/correct globally
            userPerf.totalQuestionsSolved = (userPerf.totalQuestionsSolved || 0) + attempt.questions.length; // Or just answered ones?
            userPerf.totalCorrectAnswers = (userPerf.totalCorrectAnswers || 0) + correctAnswers;

            userPerf.markModified('topicPerformance');
            await userPerf.save();

        } catch (perfError) {
            console.error("UserPerformance Update on Submit Error:", perfError);
        }

        res.json(result);

        // --- Log Activity (Smart) ---
        // For tests, log on submission. For practice, log if not already logged in saveAnswer.
        logActivity(req.user.id, attempt);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Create a Test or Competition (Institute)
// @route POST /institutes/:id/create-test
exports.createTest = async (req, res) => {
    try {
        const {
            title, description, questions, duration, startTime, endTime,
            type, bannerUrl, prizes, rules
        } = req.body;

        // Check institute role
        if (req.user.role !== 'institute' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Generate unique access code
        const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const test = await Test.create({
            title,
            description,
            questions,
            duration,
            startTime,
            endTime,
            createdBy: req.user.id,
            isPublic: true, // or false
            type: type || 'test',
            bannerUrl,
            prizes,
            rules,
            accessCode
        });

        res.status(201).json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get test by access code
// @route GET /tests/code/:accessCode
exports.getTestByCode = async (req, res) => {
    try {
        const { accessCode } = req.params;
        const test = await Test.findOne({ accessCode }).select('-questions.correctOption'); // Hide answers? questions not populated yet..

        if (!test) {
            return res.status(404).json({ message: 'Invalid test code' });
        }

        // Populate question count without revealing questions if needed, or just basic info
        // For preview, we just need title, description, duration, institute name
        await test.populate('createdBy', 'name');

        res.json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all active competitions
// @route GET /tests/competitions
exports.getCompetitions = async (req, res) => {
    try {
        const competitions = await Test.find({
            type: 'competition',
            // Optional: Filter by end time to show only upcoming/active?
            // endTime: { $gte: new Date() } 
        })
            .sort({ startTime: 1 })
            .populate('createdBy', 'name'); // Populate institute name

        res.json(competitions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get attempt details
// @route GET /tests/attempts/:attemptId
exports.getAttempt = async (req, res) => {
    try {
        const attempt = await Attempt.findById(req.params.attemptId).populate('questions.questionId');
        if (!attempt) return res.status(404).json({ message: 'Attempt not found' });
        if (attempt.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        let resultData = null;
        if (attempt.status === 'completed') {
            const Result = mongoose.model('Result');
            resultData = await Result.findOne({ attemptId: attempt._id });
        }

        const sanitizedQuestions = attempt.questions.reduce((acc, aq) => {
            const q = aq.questionId;
            if (q) {
                acc.push({
                    _id: q._id,
                    text: q.text,
                    options: q.options,
                    // Include correctOption for Practice sessions AND Mock Tests (where testId is null)
                    ...((attempt.type === 'practice' || !attempt.testId) && { correctOption: q.correctOption })
                });
            }
            return acc;
        }, []);

        res.json({
            attemptId: attempt._id,
            type: attempt.type,
            title: attempt.type === 'practice' ? 'Practice Session' : (attempt.testId ? 'Assessment' : 'Mock Test'),
            duration: attempt.duration || 30,
            questions: sanitizedQuestions,
            status: attempt.status,
            startTime: attempt.startTime,
            result: resultData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
