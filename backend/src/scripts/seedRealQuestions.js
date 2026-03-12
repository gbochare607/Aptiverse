const mongoose = require('mongoose');
const Question = require('../models/Question');
require('dotenv').config();

const realQuestions = [
    // --- BLOOD RELATIONS ---
    {
        questionId: 'br_001',
        text: 'Pointing to a photograph of a boy, Suresh said, "He is the son of the only son of my mother." How is Suresh related to that boy?',
        options: [
            { id: 1, text: 'Brother' },
            { id: 2, text: 'Uncle' },
            { id: 3, text: 'Cousin' },
            { id: 4, text: 'Father' }
        ],
        correctOption: 4,
        topics: ['blood-relations', 'logical'],
        difficulty: 0.5,
        source: 'Manual'
    },
    {
        questionId: 'br_002',
        text: 'If A is the brother of B; B is the sister of C; and C is the father of D, how D is related to A?',
        options: [
            { id: 1, text: 'Brother' },
            { id: 2, text: 'Sister' },
            { id: 3, text: 'Nephew' },
            { id: 4, text: 'Cannot be determined' }
        ],
        correctOption: 4, // Could be nephew or niece
        topics: ['blood-relations', 'logical'],
        difficulty: 0.6,
        source: 'Manual'
    },
    {
        questionId: 'br_003',
        text: 'Introducing a woman, Shashank said, "She is the mother of the only daughter of my son." How is that woman related to Shashank?',
        options: [
            { id: 1, text: 'Daughter' },
            { id: 2, text: 'Sister-in-law' },
            { id: 3, text: 'Wife' },
            { id: 4, text: 'Daughter-in-law' }
        ],
        correctOption: 4,
        topics: ['blood-relations', 'logical'],
        difficulty: 0.7,
        source: 'Manual'
    },
    {
        questionId: 'br_004',
        text: 'A man said to a lady, "Your mother is the husband of my aunt." How is the lady related to the man?',
        options: [
            { id: 1, text: 'Sister' },
            { id: 2, text: 'Cousin' },
            { id: 3, text: 'Aunt' },
            { id: 4, text: 'Data inadequate' }
        ],
        correctOption: 2, // Actually "Your mother's husband is my aunt's husband" -> Uncle? The phrasing is weird in common puzzles, assumed standard riddle.
        // Let's use a cleaner one:
        // "Your mother's husband is the sister of my aunt" -> Impossible.
        // Let's replace with a standard one.
        text: 'Pointing to a man in a photograph, a woman said, "His brother\'s father is the only son of my grandfather." How is the woman related to the man in the photograph?',
        options: [
            { id: 1, text: 'Mother' },
            { id: 2, text: 'Aunt' },
            { id: 3, text: 'Sister' },
            { id: 4, text: 'Daughter' }
        ],
        correctOption: 3,
        topics: ['blood-relations', 'logical'],
        difficulty: 0.6,
        source: 'Manual'
    },
    {
        questionId: 'br_005',
        text: 'If P $ Q means P is the father of Q; P # Q means P is the mother of Q; P * Q means P is the sister of Q. Then how is Q related to N in N # L $ P * Q?',
        options: [
            { id: 1, text: 'Grandson' },
            { id: 2, text: 'Granddaughter' },
            { id: 3, text: 'Nephew' },
            { id: 4, text: 'Data inadequate' }
        ],
        correctOption: 4, // Sex of Q is unknown
        topics: ['blood-relations', 'logical'],
        difficulty: 0.8,
        source: 'Manual'
    },

    // --- NUMBER SYSTEM ---
    {
        questionId: 'ns_001',
        text: 'The sum of first five prime numbers is:',
        options: [
            { id: 1, text: '11' },
            { id: 2, text: '18' },
            { id: 3, text: '26' },
            { id: 4, text: '28' }
        ],
        correctOption: 4, // 2+3+5+7+11 = 28
        topics: ['number-system', 'quantitative'],
        difficulty: 0.3,
        source: 'Manual'
    },
    {
        questionId: 'ns_002',
        text: 'Which of the following numbers is divisible by 3?',
        options: [
            { id: 1, text: '24357806' },
            { id: 2, text: '35792' },
            { id: 3, text: '555555' },
            { id: 4, text: '64385' }
        ],
        correctOption: 3, // Sum=30
        topics: ['number-system', 'quantitative'],
        difficulty: 0.4,
        source: 'Manual'
    },
    {
        questionId: 'ns_003',
        text: 'The difference between the place value and the face value of 7 in the number 24749 is:',
        options: [
            { id: 1, text: '693' },
            { id: 2, text: '700' },
            { id: 3, text: '7' },
            { id: 4, text: '6993' }
        ],
        correctOption: 1, // 700 - 7 = 693
        topics: ['number-system', 'quantitative'],
        difficulty: 0.3,
        source: 'Manual'
    },
    {
        questionId: 'ns_004',
        text: 'What is the unit digit in (7^95 - 3^58)?',
        options: [
            { id: 1, text: '0' },
            { id: 2, text: '4' },
            { id: 3, text: '6' },
            { id: 4, text: '7' }
        ],
        correctOption: 2,
        topics: ['number-system', 'quantitative'],
        difficulty: 0.8,
        source: 'Manual'
    },

    // --- CODING DECODING ---
    {
        questionId: 'cd_001',
        text: 'In a certain code language, "TEACHER" is written as "VGCEJGT". How will "CHILDREN" be written in that code language?',
        options: [
            { id: 1, text: 'EJKNFTGP' },
            { id: 2, text: 'EJKNFGP' },
            { id: 3, text: 'EJKNFGTO' },
            { id: 4, text: 'None of these' }
        ],
        correctOption: 1, // +2 shift
        topics: ['coding-decoding', 'logical'],
        difficulty: 0.4,
        source: 'Manual'
    },
    {
        questionId: 'cd_002',
        text: 'If RAJU is coded as 18-1-10-21, then JUNED will be coded as?',
        options: [
            { id: 1, text: '10-21-14-5-4' },
            { id: 2, text: '11-21-14-3-4' },
            { id: 3, text: '10-21-14-4-5' },
            { id: 4, text: 'None of these' }
        ],
        correctOption: 1,
        topics: ['coding-decoding', 'logical'],
        difficulty: 0.3,
        source: 'Manual'
    },

    // --- SYLLOGISM ---
    {
        questionId: 'syl_001',
        text: 'Statements: Some actors are singers. All the singers are dancers.\nConclusions:\n(1) Some actors are dancers.\n(2) No singer is actor.',
        options: [
            { id: 1, text: 'Only (1) follows' },
            { id: 2, text: 'Only (2) follows' },
            { id: 3, text: 'Either (1) or (2) follows' },
            { id: 4, text: 'Neither (1) nor (2) follows' }
        ],
        correctOption: 1,
        topics: ['syllogism', 'logical'],
        difficulty: 0.6,
        source: 'Manual'
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. CLEAR BAD DATA (Source: 'API' for these topics)
        const targetTopics = ['blood-relations', 'number-system', 'coding-decoding', 'syllogism'];
        console.log(`Clearing existing API questions for: ${targetTopics.join(', ')}...`);
        const deleted = await Question.deleteMany({
            source: 'API',
            topics: { $in: targetTopics }
        });
        console.log(`Deleted ${deleted.deletedCount} incorrect/API questions.`);

        // 2. INSERT REAL QUESTIONS
        console.log('Inserting valid manual questions...');
        for (const q of realQuestions) {
            // Check dupes
            const exists = await Question.findOne({ questionId: q.questionId });
            if (!exists) {
                await Question.create(q);
                console.log(`Initialized: ${q.questionId}`);
            } else {
                console.log(`Skipped (Exists): ${q.questionId}`);
            }
        }

        console.log('Seeding Complete');
        process.exit();

    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seed();
