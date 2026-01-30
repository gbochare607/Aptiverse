const mongoose = require('mongoose');
const Question = require('./src/models/Question');

const dummyQuestions = [
    // Quantitative
    {
        questionId: 'Q001',
        text: 'What is the value of 25% of 80?',
        options: [{ id: 1, text: '15' }, { id: 2, text: '20' }, { id: 3, text: '25' }, { id: 4, text: '30' }],
        correctOption: 2,
        topics: ['quantitative'],
        difficulty: 0.3,
        explanation: '25/100 * 80 = 20'
    },
    {
        questionId: 'Q002',
        text: 'Simple interest on $1000 for 2 years at 10% per annum is?',
        options: [{ id: 1, text: '$100' }, { id: 2, text: '$200' }, { id: 3, text: '$250' }, { id: 4, text: '$150' }],
        correctOption: 2,
        topics: ['quantitative'],
        difficulty: 0.4
    },
    // Logical
    {
        questionId: 'L001',
        text: 'If A is the brother of B, and B is the sister of C, what is A to C?',
        options: [{ id: 1, text: 'Father' }, { id: 2, text: 'Brother' }, { id: 3, text: 'Cousin' }, { id: 4, text: 'Uncle' }],
        correctOption: 2,
        topics: ['logical'],
        difficulty: 0.3
    },
    {
        questionId: 'L002',
        text: 'Complete the series: 2, 4, 8, 16, ?',
        options: [{ id: 1, text: '24' }, { id: 2, text: '32' }, { id: 3, text: '28' }, { id: 4, text: '30' }],
        correctOption: 2,
        topics: ['logical'],
        difficulty: 0.2
    },
    // Verbal
    {
        questionId: 'V001',
        text: 'Synonym of Abandon?',
        options: [{ id: 1, text: 'Stay' }, { id: 2, text: 'Desert' }, { id: 3, text: 'Hold' }, { id: 4, text: 'Keep' }],
        correctOption: 2,
        topics: ['verbal'],
        difficulty: 0.3
    }
];

mongoose.connect('mongodb://localhost:27017/aptiverse')
    .then(async () => {
        console.log('Connected to MongoDB for seeding Questions...');
        await Question.deleteMany({});
        await Question.insertMany(dummyQuestions);
        console.log('Seeded 5 dummy questions!');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
