import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreateTest() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        questions: [],
        duration: 30,
    });
    const [createdTest, setCreatedTest] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState('');

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
        try {
            const { data: user } = await api.get('/auth/me');
            const { data: test } = await api.post(`/institutes/${user._id}/create-test`, {
                ...formData,
                startTime: new Date(),
                endTime: new Date(Date.now() + 86400000 * 7), // 7 days
            });
            
            // If room assigned, link it
            if (selectedRoomId) {
                await api.post(`/rooms/institute/${selectedRoomId}/tests`, { testId: test._id });
            }

            setCreatedTest(test);
        } catch (e) {
            console.error(e);
            alert('Failed to create test');
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
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Create New Assessment</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Test Title</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                    <input
                        type="number"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.duration}
                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Assign to Room (Optional)</label>
                    <select
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                        value={selectedRoomId}
                        onChange={e => setSelectedRoomId(e.target.value)}
                    >
                        <option value="">-- No Room (Standalone Test) --</option>
                        {rooms.map(room => (
                            <option key={room._id} value={room._id}>{room.name} ({room.code})</option>
                        ))}
                    </select>
                </div>

                <p className="text-sm text-gray-500">
                    * Question selection is handled via CSV upload in the admin panel or added later. This creates the test shell.
                </p>

                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Create Test
                </button>
            </form>
        </div>
    );
}
