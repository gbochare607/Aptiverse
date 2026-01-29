const Question = require('../models/Question');
const crypto = require('crypto');
const fs = require('fs');
const csv = require('csv-parser');

// @desc    Upload CSV of questions
// @route   POST /admin/questions/upload-csv
// @access  Admin
exports.uploadQuestionsCsv = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];
    const errors = [];
    const ingestionId = 'ing_' + Date.now();

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
            // Simple mapping - assumes CSV headers match loose equivalents
            // Expected headers: text, option1, option2, option3, option4, correctOption, topics, difficulty, explanation
            try {
                if (!data.text || !data.correctOption) {
                    throw new Error('Missing required fields');
                }

                const options = [
                    { id: 1, text: data.option1 },
                    { id: 2, text: data.option2 },
                    { id: 3, text: data.option3 },
                    { id: 4, text: data.option4 },
                ].filter(o => o.text); // Filter empty options if any

                // Generate Question ID hash to dedupe loosely or just use count
                const qHash = crypto.createHash('sha256').update(data.text).digest('hex').substring(0, 8);

                results.push({
                    questionId: `q_${qHash}`,
                    text: data.text,
                    options,
                    correctOption: parseInt(data.correctOption),
                    topics: data.topics ? data.topics.split('|').map(t => t.trim()) : [],
                    difficulty: parseFloat(data.difficulty) || 0.5,
                    explanation: data.explanation || '',
                    source: 'CSV',
                    ingestionId,
                    validated: true
                });
            } catch (err) {
                errors.push({ row: data, error: err.message });
            }
        })
        .on('end', async () => {
            // Bulk insert
            let inserted = 0;
            let failed = 0;

            for (const q of results) {
                try {
                    // Check specific duplicate logic if needed, otherwise rely on unique questionId or text index
                    // Using upsert or just insert. Here we just insert and catch duplicates.
                    const exists = await Question.findOne({ text: q.text });
                    if (!exists) {
                        await Question.create(q);
                        inserted++;
                    } else {
                        failed++;
                        errors.push({ question: q.text, error: 'Duplicate text' });
                    }
                } catch (err) {
                    failed++;
                    errors.push({ question: q.text, error: err.message });
                }
            }

            // Cleanup file
            fs.unlinkSync(req.file.path);

            res.json({
                message: 'Upload processed',
                ingestionId,
                inserted,
                failed,
                errors
            });
        });
};

// @desc    Get all questions (paginated)
// @route   GET /admin/questions
// @access  Admin / Institute
exports.getQuestions = async (req, res) => {
    try {
        const pageSize = 20;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                text: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const count = await Question.countDocuments({ ...keyword });
        const questions = await Question.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ questions, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single question
// @route   GET /questions/:id
// @access  Private
exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findOne({ questionId: req.params.id });
        if (question) {
            res.json(question);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
