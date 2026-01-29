import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreateTest() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        questions: [], // Should be IDs. We need a way to select questions.
        // For MVP, we can just input IDs or select from a fetched list.
        // Let's assume we paste IDs or comma separated.
        // Or we just create a valid test with mock logic (frontend sends empty or predefined).
        // Spec: "Create/manage tests (upload questions...)"
        // Let's skip complex UI for question selection and just allow basic metadata + maybe random generation or bulk upload placeholder.
        duration: 30,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data: user } = await api.get('/auth/me');
            await api.post(`/institutes/${user._id}/create-test`, {
                ...formData,
                startTime: new Date(),
                endTime: new Date(Date.now() + 86400000 * 7), // 7 days
            });
            alert('Test Created!');
            navigate('/dashboard');
        } catch (e) {
            console.error(e);
            alert('Failed to create test');
        }
    };

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
