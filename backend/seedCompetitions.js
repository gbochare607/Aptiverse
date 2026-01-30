const mongoose = require('mongoose');
const { Test } = require('./src/models/TestModels'); // Adjust path as needed
const User = require('./src/models/User'); // Adjust path as needed
require('dotenv').config();

const seedCompetitions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aptiverse');
        console.log('MongoDB Connected');

        // Find an admin or institute user to be the creator
        // If none, create a dummy one or fail
        // For simplicity, let's just use the first user found or create one
        let creator = await User.findOne({ role: 'institute' });
        if (!creator) {
            creator = await User.findOne({ role: 'admin' });
        }
        if (!creator) {
            console.log('No institute/admin found. Creating dummy institute.');
            // This part might fail if User schema has strict validation, but let's try
            // Actually, let's skip creation if no user, users should register first. 
            // Or better, fetch ANY user for now if permissions are loose in seed.
            creator = await User.findOne({});
        }

        if (!creator) {
            console.log('No users found. Creating default admin user.');
            creator = await User.create({
                name: "Admin User",
                email: "admin@aptiverse.com",
                password: "password123", // In real app, this should be hashed
                role: "admin"
            });
        }

        const competitions = [
            {
                title: "All India Aptitude Challenge 2026",
                description: "Compete with the best minds across the country. Test your logical reasoning and quantitative aptitude.",
                type: "competition",
                duration: 60,
                startTime: new Date(Date.now() + 86400000), // Tomorrow
                endTime: new Date(Date.now() + 172800000), // Day after tomorrow
                createdBy: creator._id,
                isPublic: true,
                bannerUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800",
                prizes: ["₹10,000 First Prize", "Certificate of Merit"],
                rules: "1. No cheating.\n2. Complete within 60 mins.",
                registrationCount: 120
            },
            {
                title: "Weekly Coding & Logic Sprint",
                description: "A fast-paced competition to check your speed and accuracy.",
                type: "competition",
                duration: 30,
                startTime: new Date(Date.now() - 3600000), // Started 1 hour ago (Live)
                endTime: new Date(Date.now() + 3600000), // Ends in 1 hour
                createdBy: creator._id,
                isPublic: true,
                bannerUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
                prizes: ["Exclusive Badges"],
                rules: "Speed is key.",
                registrationCount: 45
            },
            {
                title: "Logical Reasoning Mastery",
                description: "Deep dive into logical reasoning puzzles.",
                type: "competition",
                duration: 90,
                startTime: new Date(Date.now() + 604800000), // Next week
                endTime: new Date(Date.now() + 608400000),
                createdBy: creator._id,
                isPublic: true,
                bannerUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800",
                prizes: ["Internship Opportunity"],
                rules: "Solve complex puzzles.",
                registrationCount: 12
            }
        ];

        await Test.insertMany(competitions);
        console.log('Competitions seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding competitions:', error);
        process.exit(1);
    }
};

seedCompetitions();
