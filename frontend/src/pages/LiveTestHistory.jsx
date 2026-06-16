import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { 
    ClockIcon, 
    ArrowRightIcon, 
    TrophyIcon, 
    CheckCircleIcon,
    CalendarIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@clerk/clerk-react';

export default function LiveTestHistory() {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const token = await getToken();
                const { data } = await api.get('/tests/my-attempts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAttempts(data);
            } catch (err) {
                console.error('Failed to fetch attempts:', err);
                setError('Failed to load your test history.');
            } finally {
                setLoading(false);
            }
        };

        fetchAttempts();
    }, [getToken]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#020617]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Loading your test history...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Live Test Attempted</h1>
                <p className="text-gray-500 mt-2 font-medium">Review your performance in past live assessments.</p>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-sm font-bold rounded-r-xl flex items-center gap-3">
                    <ExclamationCircleIcon className="w-5 h-5" />
                    {error}
                </div>
            )}

            {attempts.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 p-16 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-center shadow-sm">
                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ClockIcon className="w-10 h-10 text-indigo-200" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No attempts found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">You haven't participated in any live tests yet. Join a test using an access code to see your history here.</p>
                    <button 
                        onClick={() => navigate('/tests')}
                        className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                    >
                        Explore Tests
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {attempts.map((attempt) => (
                        <div 
                            key={attempt._id}
                            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-indigo-500 transition-all group"
                        >
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <TrophyIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                                        {attempt.testId?.title || 'Standalone Test'}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarIcon className="w-4 h-4" />
                                            {formatDate(attempt.startTime)}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                                            {attempt.status}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-center">
                                    <div className="text-2xl font-black text-gray-900 dark:text-white">{attempt.score || 0}</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Score</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                        {attempt.status === 'completed' ? `${Math.round(attempt.percentage || (attempt.score / 10 * 100))}%` : '-'}
                                    </div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accuracy</div>
                                </div>
                                <button 
                                    onClick={() => navigate(`/test/${attempt._id}`)}
                                    className="p-3 bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-xl transition-all"
                                >
                                    <ArrowRightIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
