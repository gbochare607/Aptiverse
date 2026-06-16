require('dotenv').config();
const mongoose = require('mongoose');
const LibraryItem = require('../models/LibraryItem');

const items = [
    {
        title: 'Introduction to Probability',
        description: 'Comprehensive notes covering the basics of probability, including conditional probability and Bayes theorem.',
        type: 'pdf',
        url: 'https://example.com/probability-basics.pdf',
        topic: 'Probability',
        category: 'Quantitative Aptitude',
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=200'
    },
    {
        title: 'Mastering Logical Reasoning',
        description: 'Video lecture discussing various shortcuts and strategies for solving complex logical reasoning puzzles.',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Xn7K77uH3mY',
        topic: 'Logical Reasoning',
        category: 'Reasoning',
        duration: '25m',
        thumbnail: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=200'
    },
    {
        title: 'Verbal Ability: Sentence Correction',
        description: 'A collection of common errors and rules for sentence correction in competitive exams.',
        type: 'note',
        url: 'https://example.com/sentence-correction.html',
        topic: 'Verbal Ability',
        category: 'Verbal',
        thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200'
    },
    {
        title: 'Quantitative Aptitude Formula Sheet',
        description: 'All essential formulas for Quantitative Aptitude in one place.',
        type: 'material',
        url: 'https://example.com/formula-sheet.pdf',
        topic: 'Quantitative Aptitude',
        category: 'Quantitative Aptitude',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=200'
    }
];

const seedLibrary = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aptiverse');
        console.log('MongoDB Connected for Seeding...');
        
        await LibraryItem.deleteMany();
        console.log('Cleared existing library items.');
        
        await LibraryItem.insertMany(items);
        console.log('Successfully seeded library items.');
        
        process.exit();
    } catch (error) {
        console.error('Error seeding library:', error);
        process.exit(1);
    }
};

seedLibrary();
