import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrophyIcon, ArrowLeftIcon, CalendarIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function InstituteCompetitions() {
    const navigate = useNavigate();

    // Mock data for now, until backend competition endpoints are fully built for institutes
    const competitions = [
        { id: 1, name: "Annual Tech Fest 2026", startDate: "Nov 01, 2026", participants: 450, status: 'Upcoming' },
        { id: 2, name: "Spring Coding Challenge", startDate: "Mar 15, 2026", participants: 1200, status: 'Active' },
        { id: 3, name: "Freshman Aptitude Series", startDate: "Jan 10, 2026", participants: 800, status: 'Completed' }
    ];

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Completed': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

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
                        <TrophyIcon className="w-8 h-8 text-purple-500" />
                        Institute Competitions
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Manage all your hosted challenges and tournaments.</p>
                </div>
                <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm transition-colors">
                    Create Competition
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Competitions</h2>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {competitions.map(comp => (
                        <div key={comp.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{comp.name}</h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(comp.status)}`}>
                                        {comp.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4"/> Starts: {comp.startDate}</span>
                                    <span className="flex items-center gap-1.5"><UsersIcon className="w-4 h-4"/> {comp.participants} Participants</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                    Edit
                                </button>
                                <button className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                                    Manage
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
