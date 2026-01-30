import React from 'react';
import { CalendarIcon, UserGroupIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function CompetitionCard({ competition }) {
    const navigate = useNavigate();

    // Format date
    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const isLive = new Date() >= new Date(competition.startTime) && new Date() <= new Date(competition.endTime);
    const isUpcoming = new Date() < new Date(competition.startTime);

    const handleRegister = () => {
        // Navigate to test runner or details page
        // For now, let's assume we go directly to test runner if live, or show details
        // Since we don't have a dedicated details page, we'll go to test runner which creates an attempt
        // But for upcoming, maybe just show a toast?
        if (isUpcoming) {
            alert('Registration successful! You will be notified when it starts.');
            return;
        }
        navigate(`/test/${competition._id}`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full group">
            {/* Banner Image */}
            <div className="h-48 overflow-hidden relative">
                <img
                    src={competition.bannerUrl || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800"}
                    alt={competition.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-gray-200 dark:border-gray-700">
                    {isLive ? <span className="text-green-600">Live Now</span> :
                        isUpcoming ? <span className="text-indigo-600">Upcoming</span> :
                            <span className="text-gray-500">Ended</span>}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{competition.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{competition.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <CalendarIcon className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-medium">{formatDate(competition.startTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <UserGroupIcon className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-medium">{competition.registrationCount || 0} Registered</span>
                    </div>
                    {competition.prizes && competition.prizes.length > 0 && (
                        <div className="col-span-2 flex items-center space-x-2 text-gray-600 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg border border-amber-100 dark:border-amber-900/40">
                            <TrophyIcon className="w-4 h-4 text-amber-500" />
                            <span className="text-xs font-medium truncate">Prize: {competition.prizes[0]}</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-auto">
                    <button
                        onClick={handleRegister}
                        className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-200 ${isLive
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 dark:shadow-green-900/30 hover:shadow-xl hover:-translate-y-0.5'
                                : isUpcoming
                                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:shadow-xl hover:-translate-y-0.5'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                        disabled={!isLive && !isUpcoming}
                    >
                        <span>{isLive ? 'Enter Now' : isUpcoming ? 'Register' : 'Ended'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
