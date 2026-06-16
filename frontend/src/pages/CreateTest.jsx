import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreateTest() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        topic: 'Mixed', // Default topic
        numberOfQuestions: 20, // Default count
        duration: 30, // in minutes
        expiryDays: 7, // days from now
    });
    const [createdTest, setCreatedTest] = useState(null);
    const [creating, setCreating] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState('');

    const CATEGORIES = [
        "Mixed",
        "Quantitative",
        "Logical",
        "Verbal",
        "Data"
    ];

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const { data } = await api.get('/rooms/institute');
                setRooms(data);
            } catch (err) {
                console.error("Failed to fetch rooms for dropdown", err);
            }
        };
        fetchRooms();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const { data: user } = await api.get('/auth/me');
            const { data: test } = await api.post(`/institutes/${user._id}/create-test`, {
                title: formData.title,
                description: formData.description,
                topic: formData.topic,
                numberOfQuestions: parseInt(formData.numberOfQuestions, 10),
                duration: parseInt(formData.duration, 10),
                startTime: new Date(),
                endTime: new Date(Date.now() + 86400000 * parseFloat(formData.expiryDays)),
                type: 'test'
            });
            
            // If room assigned, link it
            if (selectedRoomId) {
                await api.post(`/rooms/institute/${selectedRoomId}/tests`, { testId: test._id });
            }

            setCreatedTest(test);
        } catch (e) {
            console.error(e);
            alert('Failed to create test: ' + (e.response?.data?.message || e.message));
        } finally {
            setCreating(false);
        }
    };

    if (createdTest) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 text-center">
                <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Test Created Successfully!</h2>
                <p className="text-gray-600 mb-8">Share this access code with your students to let them join the test.</p>

                <div className="bg-gray-100 p-6 rounded-xl inline-block mb-8">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-2">Access Code</p>
                    <div className="text-5xl font-mono font-bold tracking-widest text-indigo-600 select-all">
                        {createdTest.accessCode}
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(createdTest.accessCode);
                            alert('Copied!');
                        }}
                        className="px-6 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Copy Code
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2 bg-indigo-600 rounded-lg font-medium text-white hover:bg-indigo-700"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-transparent min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create Live Test</h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Configure a new assessment. The system will automatically select random questions based on your criteria and generate a unique join code.
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-8 shadow-sm border border-gray-100 dark:border-gray-700 rounded-2xl">
                
                {/* Basic Info */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold leading-6 text-gray-900 dark:text-white pb-3 border-b border-gray-200 dark:border-gray-700">Basic Information</h3>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Test Title</label>
                        <input
                            type="text"
                            required
                            className="block w-full border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            placeholder="e.g. Midterm Quantitative Assessment"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description (Optional)</label>
                        <textarea
                            className="block w-full border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Instructions or details for the students..."
                            rows="2"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                {/* Test Configuration */}
                <div className="space-y-6 pt-6">
                    <h3 className="text-lg font-bold leading-6 text-gray-900 dark:text-white pb-3 border-b border-gray-200 dark:border-gray-700">Test Configuration</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Topic / Category</label>
                            <select
                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                                value={formData.topic}
                                onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                required
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <p className="mt-2 text-xs text-gray-500">System will pull random questions from this topic.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Number of Questions</label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="100"
                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                value={formData.numberOfQuestions}
                                onChange={e => setFormData({ ...formData, numberOfQuestions: e.target.value })}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Duration (minutes)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                value={formData.duration}
                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Test Expires In (Days)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                step="0.5"
                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                value={formData.expiryDays}
                                onChange={e => setFormData({ ...formData, expiryDays: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Assignment & Visibility */}
                <div className="space-y-6 pt-6">
                    <h3 className="text-lg font-bold leading-6 text-gray-900 dark:text-white pb-3 border-b border-gray-200 dark:border-gray-700">Assignment</h3>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Assign to Test Room (Optional)</label>
                        <select
                            className="block w-full border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                            value={selectedRoomId}
                            onChange={e => setSelectedRoomId(e.target.value)}
                        >
                            <option value="">-- Standalone Test (No specific room) --</option>
                            {rooms.map(room => (
                                <option key={room._id} value={room._id}>{room.name} (Code: {room.code})</option>
                            ))}
                        </select>
                        <p className="mt-2 text-xs text-gray-500">If unassigned, you can just share the generated Test Code directly with students.</p>
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={creating}
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                    >
                        {creating ? 'Generating Test...' : 'Create & Generate Code'}
                    </button>
                </div>
            </form>
        </div>
    );
}
