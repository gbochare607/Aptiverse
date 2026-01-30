import React, { useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import api from '../services/api';
import {
    ClockIcon,
    CheckCircleIcon,
    FireIcon,
    BoltIcon, // Goal
    ChatBubbleLeftRightIcon,
    ArrowRightIcon,
    StarIcon,
    ChevronRightIcon
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

// Icons need to be imported for SectionCard use below
import { TrophyIcon, BuildingOfficeIcon, UserGroupIcon } from '@heroicons/react/24/solid';

const KPI = ({ icon: Icon, title, value, color, progress, compact }) => (
    <div className={`bg-white dark:bg-gray-800 ${compact ? 'p-2' : 'p-4'} rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 transition-colors`}>
        <div className={`flex items-start justify-between ${compact ? 'mb-1' : 'mb-4'}`}>
            <div className={`${compact ? 'p-1.5' : 'p-3'} rounded-xl ${color}`}>
                <Icon className={`${compact ? 'w-4 h-4' : 'w-6 h-6'} text-white`} />
            </div>
        </div>
        <div>
            <p className={`${compact ? 'text-[10px]' : 'text-sm'} font-medium text-gray-500 dark:text-gray-400`}>{title}</p>
            <h4 className={`${compact ? 'text-lg' : 'text-2xl'} font-bold text-gray-900 dark:text-white mt-0.5`}>{value}</h4>
        </div>
        {progress && (
            <div className={`${compact ? 'mt-2' : 'mt-4'}`}>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        )}
    </div>
);

const SectionCard = ({ icon: Icon, title, desc, action, color, count, compact }) => (
    <div className={`bg-white dark:bg-gray-800 ${compact ? 'p-3' : 'p-4'} rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all relative overflow-hidden group`}>
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${compact ? 'mb-2' : 'mb-4'} ${color}`}>
                <Icon className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
            </div>
            <h3 className={`${compact ? 'text-sm' : 'text-lg'} font-bold text-gray-900 dark:text-white`}>{title}</h3>
            <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${compact ? 'mb-2 h-8' : 'mb-6 h-10'}`}>{desc}</p>

            <div className="flex items-center justify-between">
                <Link to={action} className="text-indigo-600 dark:text-indigo-400 font-medium text-xs flex items-center hover:opacity-80">
                    Get Started <ArrowRightIcon className="w-3 h-3 ml-1" />
                </Link>
                <span className="text-[10px] text-gray-400">{count} options</span>
            </div>
        </div>
        {/* Rec Label */}
        <div className="absolute top-4 right-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold px-2 py-1 rounded flex items-center">
            <StarIcon className="w-3 h-3 mr-1" /> Rec
        </div>
    </div>
);

export default function Dashboard() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Wait for user to be loaded
            if (!isLoaded || !isSignedIn) return;

            try {
                // Mock data fallback
                setData({
                    stats: { testsTaken: 12, averageScore: 87, verifiedSkills: 3 },
                    recommendations: []
                });
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, isLoaded, isSignedIn]);

    if (!isLoaded || loading) return <div className="p-10 dark:text-white">Loading Dashboard...</div>;

    return (
        <div className="pb-10">
            {/* Split Layout: Left Content (Hero + Paths) | Right Sidebar (Mentor + Activity) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* LEFT COLUMN - Span 2 */}
                <div className="lg:col-span-2 space-y-3 flex flex-col h-full">
                    {/* 1. Good Morning & Stats - SUPER COMPACT */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 relative overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 flex-none">
                        {/* Decorative BG */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-full -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="relative z-10 flex justify-between items-start mb-2">
                            <div>
                                <h1 className="text-base font-bold text-gray-900 dark:text-white flex items-center">
                                    Good morning, {user?.firstName}! <span className="ml-2">👋</span>
                                </h1>
                                <p className="text-[10px] text-gray-600 dark:text-gray-400">Let's achieve new milestones today</p>
                            </div>
                            <div className="bg-indigo-50 dark:bg-gray-700 p-1 rounded-lg shadow-sm">
                                <TrophyIcon className="w-3 h-3 text-yellow-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 relative z-10">
                            <KPI icon={BoltIcon} title="Daily Goal" value="15/20" color="bg-blue-500" progress={75} compact={true} />
                            <KPI icon={CheckCircleIcon} title="Accuracy" value={`${data?.stats?.averageScore || 0}%`} color="bg-green-500" progress={data?.stats?.averageScore || 0} compact={true} />
                            <KPI icon={ClockIcon} title="Time" value="2.5h" color="bg-purple-500" progress={40} compact={true} />
                            <KPI icon={FireIcon} title="Streak" value="12" color="bg-orange-500" progress={100} compact={true} />
                        </div>
                    </div>

                    {/* 2. Learning Paths - MOVED HERE (2x2 Grid) */}
                    <div className="flex-1 flex flex-col">
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Learning Paths</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                            <SectionCard
                                icon={BoltIcon}
                                title="Aptitude Practice"
                                desc="Topic-wise practice questions."
                                action="/practice"
                                color="bg-blue-500"
                                count="2"
                                compact={true}
                            />
                            <SectionCard
                                icon={BuildingOfficeIcon}
                                title="Company Assessment"
                                desc="Tests for top product companies."
                                action="/competitions"
                                color="bg-green-500"
                                count=">"
                                compact={true}
                            />
                            <SectionCard
                                icon={TrophyIcon}
                                title="Exam Oriented"
                                desc="Prep for CAT, GRE, GMAT."
                                action="/competitions"
                                color="bg-purple-500"
                                count="6"
                                compact={true}
                            />
                            <SectionCard
                                icon={UserGroupIcon}
                                title="Soft Skills"
                                desc="Communication mastery."
                                action="/study-room"
                                color="bg-orange-500"
                                count="5"
                                compact={true}
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Span 1 */}
                <div className="space-y-5 flex flex-col h-full">
                    {/* 3. AI Mentor - Existing */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col flex-1 min-h-[220px] max-h-[300px]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div className="p-2 bg-indigo-600 rounded-lg mr-3 shadow-lg shadow-indigo-200 dark:shadow-none">
                                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">AI Mentor</h3>
                                    <p className="text-xs text-gray-400">Smart insights</p>
                                </div>
                            </div>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded-full"># Live</span>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">• Master Data Structures</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded text-[10px]">Medium</span>
                                    <span>94% match</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">• Quant Enhancement</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px]">Easy</span>
                                    <span>88% match</span>
                                </div>
                            </div>
                        </div>

                        <button className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-md text-sm">
                            Ask AI
                        </button>
                    </div>

                    {/* 4. NEW Recent Activity */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col flex-1 min-h-[220px] max-h-[300px]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div className="p-2 bg-orange-500 rounded-lg mr-3 shadow-lg shadow-orange-200 dark:shadow-none">
                                    <ClockIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                                    <p className="text-xs text-gray-400">Continue learning</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-3">
                            {/* Activity Item 1 */}
                            <div className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mr-3">
                                    QA
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Quantitative Aptitude</p>
                                    <p className="text-xs text-gray-500">20 mins ago</p>
                                </div>
                                <div className="text-xs font-bold text-gray-900 dark:text-white">8/10</div>
                            </div>

                            {/* Activity Item 2 */}
                            <div className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs mr-3">
                                    VR
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Verbal Reasoning</p>
                                    <p className="text-xs text-gray-500">Yesterday</p>
                                </div>
                                <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                            </div>

                            {/* Activity Item 3 */}
                            <div className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs mr-3">
                                    LR
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Logical Reasoning</p>
                                    <p className="text-xs text-gray-500">2 days ago</p>
                                </div>
                                <div className="text-xs font-bold text-gray-900 dark:text-white">Pending</div>
                            </div>
                        </div>

                        <Link to="/analytics" className="mt-auto text-center text-sm text-indigo-600 font-medium hover:text-indigo-800">
                            View all history
                        </Link>
                    </div>
                </div>
            </div>

            {/* Chat Bubble Fixed */}
            <button className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform z-50">
                <ChatBubbleLeftRightIcon className="w-7 h-7" />
            </button>
        </div>
    );
}
