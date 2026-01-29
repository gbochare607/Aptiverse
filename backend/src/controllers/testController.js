const { Test, Attempt, Result } = require('../models/TestModels');
const Question = require('../models/Question');
const User = require('../models/User');
const axios = require('axios');

// @desc Start a test or practice session
// @route POST /tests/start
exports.startTest = async (req, res) => {
    try {
        const { testId, testType, topic, difficulty, count } = req.body;
        // testType: 'test' | 'practice'

        let questions = [];

        if (testType === 'test' && testId) {
            const test = await Test.findById(testId).populate('questions');
            if (!test) return res.status(404).json({ message: 'Test not found' });
            questions = test.questions;
        } else if (testType === 'practice') {
            // Fetch random questions based on criteria
            const query = {};
            if (topic) query.topics = topic;
            if (difficulty) query.difficulty = difficulty;

            questions = await Question.aggregate([
                { $match: query },
                { $sample: { size: count || 10 } }
            ]);
        }

        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for criteria' });
        }

        const attempt = await Attempt.create({
            userId: req.user.id,
            testId: testId || null,
            type: testType,
            questions: questions.map(q => ({
                questionId: q._id || q.questionId, // Handle aggregate result vs mongoose doc
                // init other fields
            })),
            startTime: new Date()
        });

        // Return questions without correct option
        // We need to fetch full question details for the frontend ? 
        // Or frontend fetches them one by one?
        // Usually, for security, we send specific fields.
        // But for simplicity, let's send the IDs or the full objects (sanitized).

        // Populate if it was aggregate (which returns plain objects)
        // If aggregate, 'questions' has the data.

        const sanitizedQuestions = questions.map(q => ({
            questionId: q.questionId,
            _id: q._id,
            text: q.text,
            options: q.options,
            // NO correctOption
        }));

        res.json({
            attemptId: attempt._id,
            questions: sanitizedQuestions
        });

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
        // We might need to handle 'questionId' as Object ID or string id.
        // Our Question model uses _id as ObjectId and questionId as string.
        // Let's assume frontend sends _id for simplicity in array finding.

        const qIndex = attempt.questions.findIndex(q => q.questionId.toString() === questionId);

        if (qIndex > -1) {
            attempt.questions[qIndex].selectedOption = selectedOption;
            attempt.questions[qIndex].timeTaken = timeTaken;
            await attempt.save();
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

        // Trigger AI Update (Fire and forget or await?)
        // Spec says: "trigger AI update".
        // We'll call the AI service here.
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

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Create a Test (Institute)
// @route POST /institutes/:id/create-test
exports.createTest = async (req, res) => {
    try {
        const { title, description, questions, duration, startTime, endTime } = req.body;
        // Check institute role
        if (req.user.role !== 'institute' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const test = await Test.create({
            title,
            description,
            questions,
            duration,
            startTime,
            endTime,
            createdBy: req.user.id,
            isPublic: true // or false
        });

        res.status(201).json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
