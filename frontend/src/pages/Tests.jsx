import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon, PlusIcon, MegaphoneIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useAuth, useUser } from '@clerk/clerk-react';

export default function Tests() {
    const [joinRoomCode, setJoinRoomCode] = useState('');
    const [joinTestCode, setJoinTestCode] = useState('');
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [joinedItems, setJoinedItems] = useState([]); // Placeholder for joined assessments
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { user } = useUser();

    useEffect(() => {
        const checkRole = async () => {
            if (user?.publicMetadata?.role) {
                setUserRole(user.publicMetadata.role);
            } else {
                try {
                    const token = await getToken();
                    if (token) {
                        const { data } = await api.get('/auth/me', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setUserRole(data.role);
                    }
                } catch (e) {
                    console.error('Failed to fetch role', e);
                }
            }
        };
        if (user) checkRole();
    }, [user, getToken]);

    const handleJoin = async (e, code, type) => {
        e.preventDefault();
        setError('');
        if (!code.trim()) return;

        try {
            const token = await getToken();
            const res = await api.get(`/tests/code/${code.trim().toUpperCase()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const test = res.data;
            navigate(`/test/${test._id}`);
        } catch (err) {
            setError(err.response?.data?.message || `Invalid ${type} code`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Test Room</h1>
                    <p className="text-gray-500 mt-1">Manage assessments, join rooms, and track your progress.</p>
                </div>

                {(userRole === 'institute' || userRole === 'admin') && (
                    <button
                        onClick={() => navigate('/create-test')}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:scale-105 active:scale-95"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Create Assessment
                    </button>
                )}
            </div>

            {/* Compact Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {/* Join Test Room */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3">
                            <MegaphoneIcon className="w-6 h-6" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Join Test Room</h2>
                    </div>
                    <form onSubmit={(e) => handleJoin(e, joinRoomCode, 'room')} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Room Code"
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-mono text-sm"
                            value={joinRoomCode}
                            onChange={(e) => setJoinRoomCode(e.target.value)}
                            maxLength={6}
                        />
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">
                            Join
                        </button>
                    </form>
                </div>

                {/* Join Individual Test */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
                            <RocketLaunchIcon className="w-6 h-6" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Join Test</h2>
                    </div>
                    <form onSubmit={(e) => handleJoin(e, joinTestCode, 'test')} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Test Code"
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none uppercase font-mono text-sm"
                            value={joinTestCode}
                            onChange={(e) => setJoinTestCode(e.target.value)}
                            maxLength={6}
                        />
                        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 transition-colors">
                            Join
                        </button>
                    </form>
                </div>

                {/* Info Card or Promo for Mobile */}
                <div className="hidden lg:flex bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-2xl border border-dashed border-indigo-200 dark:border-gray-600 items-center">
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                        Enter a unique code to unlock your personalized assessment or join a collaborative study batch.
                    </p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-lg">
                    {error}
                </div>
            )}

            {/* My Joined Content Section */}
            <div className="mt-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Assessments</h2>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Showing {joinedItems.length} Recent</span>
                </div>

                {joinedItems.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl py-20 border-2 border-dashed border-gray-200 dark:border-gray-800 text-center">
                        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                            <LockClosedIcon className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No joined items yet</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mb-6">Enter an access code above to join a test room or individual assessment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Assessments would go here */}
                    </div>
                )}
            </div>
        </div>
    );
}
