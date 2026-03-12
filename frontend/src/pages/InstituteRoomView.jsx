import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    UsersIcon, DocumentTextIcon, ArrowLeftIcon, PlusIcon, MegaphoneIcon
} from '@heroicons/react/24/outline';

export default function InstituteRoomView() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    // Add Test Modal State
    const [isAddTestModalOpen, setIsAddTestModalOpen] = useState(false);
    const [availableTests, setAvailableTests] = useState([]);
    const [selectedTestId, setSelectedTestId] = useState('');
    const [addingTest, setAddingTest] = useState(false);

    const fetchRoomDetails = async () => {
        try {
            const { data } = await api.get(`/rooms/institute/${roomId}`);
            setRoom(data);
        } catch (error) {
            console.error(error);
            alert("Failed to load room details");
            navigate('/institute-dashboard');
        } finally {
            setLoading(false);
        }
    };

    const fetchInstituteTests = async () => {
        try {
            // Note: Currently we don't have a direct /tests/institute route in testController that returns just your created tests easily without pagination.
            // As a fallback for this demo, we can assign a live test using its code if needed, but we'll try to fetch competitions/tests created by this user.
            // For now, let's assume we can fetch all created tests, or we just input a Test ID/Code manually.
            // To be accurate and reliable based on our API, let's use a simple input for the Test ID since the API needs an exact Test ID.
            // In a full scalable app, we'd add `exports.getInstituteTests` to `testController.js`.
            // Let's modify the Add Test feature to just accept a Test ObjectId for simplicity in this iteration.
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRoomDetails();
    }, [roomId]);

    const handleAddTest = async (e) => {
        e.preventDefault();
        if (!selectedTestId.trim()) return;
        setAddingTest(true);
        try {
            await api.post(`/rooms/institute/${roomId}/tests`, { testId: selectedTestId.trim() });
            setIsAddTestModalOpen(false);
            setSelectedTestId('');
            fetchRoomDetails();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to add test");
        } finally {
            setAddingTest(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!room) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <button 
                    onClick={() => navigate('/institute-dashboard')}
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{room.name}</h1>
                            <span className="bg-indigo-100 text-indigo-700 font-mono px-3 py-1 rounded-lg text-sm font-bold tracking-widest border border-indigo-200">
                                Code: {room.code}
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">{room.description || 'No description provided.'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{room.students.length}</div>
                            <div className="text-xs text-gray-500 uppercase font-semibold">Students</div>
                        </div>
                        <div className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{room.tests.length}</div>
                            <div className="text-xs text-gray-500 uppercase font-semibold">Tests</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tests List */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/80">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                            <DocumentTextIcon className="w-6 h-6 text-indigo-500" />
                            Assigned Tests
                        </h2>
                        <button 
                            onClick={() => setIsAddTestModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-2 transition-colors shadow-sm"
                        >
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6 flex-1 overflow-y-auto max-h-[500px]">
                        {room.tests.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No tests assigned to this room yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {room.tests.map(test => (
                                    <div key={test._id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-500 transition-colors flex justify-between items-center group">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{test.title}</h3>
                                            <p className="text-sm text-gray-500">{test.duration} mins • {test.type}</p>
                                        </div>
                                        <button className="text-indigo-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Results
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Students List */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/80">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                            <UsersIcon className="w-6 h-6 text-emerald-500" />
                            Enrolled Students
                        </h2>
                        <button className="text-sm text-indigo-600 font-semibold">Export CSV</button>
                    </div>
                    <div className="p-6 flex-1 overflow-y-auto max-h-[500px]">
                        {room.students.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                <UsersIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No students have joined this room yet.</p>
                                <p className="text-xs mt-2">Share the room code: <span className="font-mono bg-gray-100 px-1 rounded">{room.code}</span></p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {room.students.map((student, i) => (
                                    <div key={student._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-gray-900 dark:text-white">{student.name}</div>
                                            <div className="text-xs text-gray-500">{student.email}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Test Modal */}
            {isAddTestModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-baseline">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Assign Test to Room</h2>
                        </div>
                        <form onSubmit={handleAddTest} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Test Database ID</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
                                    placeholder="e.g. 64b2...1234"
                                    value={selectedTestId}
                                    onChange={(e) => setSelectedTestId(e.target.value)}
                                />
                                <p className="text-xs mt-2 text-gray-500">
                                    Tip: When you create a new Live Test, copy its MongoDB ID from the URL or database to paste here.
                                </p>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsAddTestModalOpen(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium">Cancel</button>
                                <button type="submit" disabled={addingTest} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm disabled:opacity-50 flex items-center gap-2">
                                    <PlusIcon className="w-4 h-4" />
                                    {addingTest ? 'Adding...' : 'Assign Test'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
