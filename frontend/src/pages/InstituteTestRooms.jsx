import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { KeyIcon, PlusIcon, ArrowLeftIcon, UsersIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function InstituteTestRooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const { data } = await api.get('/rooms/institute');
                setRooms(data);
            } catch (e) {
                console.error("Failed to load rooms", e);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <button 
                        onClick={() => navigate('/institute-dashboard')}
                        className="flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-4 transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                        <KeyIcon className="w-8 h-8 text-emerald-500" />
                        All Test Rooms
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Manage all your physical and virtual testing environments here.</p>
                </div>
            </div>

            {rooms.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                    <KeyIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Test Rooms Yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">Create your first test room from the dashboard to start organizing your students and assessments.</p>
                    <Link to="/institute-dashboard" className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        Go to Dashboard
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map(room => (
                        <div key={room._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors flex flex-col group">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{room.name}</h3>
                                <span className="bg-indigo-50 text-indigo-700 text-xs font-mono font-bold px-2.5 py-1 rounded-md border border-indigo-100">
                                    {room.code}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-1 line-clamp-2">
                                {room.description || 'No description provided.'}
                            </p>
                            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <UsersIcon className="w-4 h-4" /> {room.students.length}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <DocumentTextIcon className="w-4 h-4" /> {room.tests.length}
                                </div>
                            </div>
                            <Link 
                                to={`/institute/room/${room._id}`}
                                className="w-full block text-center py-2.5 bg-gray-50 hover:bg-indigo-50 dark:bg-gray-700 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-semibold transition-colors"
                            >
                                Manage Room
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
