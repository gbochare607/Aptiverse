import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import api from '../services/api';
import { ArrowLeftIcon, PlayCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function StudentRoomView() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const token = await getToken();
                const { data } = await api.get(`/rooms/student/${roomId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRoom(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load room or unauthorized');
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [roomId, getToken]);

    const handleStartTest = async (testId) => {
        try {
            const token = await getToken();
            const { data } = await api.post('/tests/start', 
                { testId, testType: 'test' },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            navigate(`/test/${data.attemptId}`);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to start test');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error || !room) return (
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-500 font-bold">
            {error || 'Room not found'}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <button 
                    onClick={() => navigate('/tests')}
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back to Rooms
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{room.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400">Instructor/Institute: <span className="font-semibold text-gray-700 dark:text-gray-300">{room.instituteId?.name || 'Unknown'}</span></p>
                        {room.description && (
                            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-3xl">{room.description}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Test List */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Available Assessments</h2>
                {room.tests.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-12 text-center border border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500">No tests have been assigned to this room yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {room.tests.map(test => (
                            <div key={test._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{test.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4"/> {test.duration} mins</span>
                                        <span className="capitalize px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md text-xs font-semibold">{test.type}</span>
                                    </div>
                                    {test.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">{test.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleStartTest(test._id)}
                                    className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                                >
                                    <PlayCircleIcon className="w-5 h-5 mr-2" />
                                    Start Test
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
