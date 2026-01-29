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
    StarIcon
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const KPI = ({ icon: Icon, title, value, color, progress }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h4>
        </div>
        {progress && (
            <div className="mt-4">
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        )}
    </div>
);

const SectionCard = ({ icon: Icon, title, desc, action, color, count }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all relative overflow-hidden group">
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6 h-10">{desc}</p>

            <div className="flex items-center justify-between">
                <Link to={action} className="text-indigo-600 dark:text-indigo-400 font-medium text-sm flex items-center hover:opacity-80">
                    Get Started <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>
                <span className="text-xs text-gray-400">{count} options</span>
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
                // TODO: Sync with backend. For now, fetch via Clerk ID if possible, or skip
                // const { data: dashboardData } = await api.get(`/dashboard/${user.id}`);
                // setData(dashboardData);

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
            {/* Welcome & AI Mentor Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Welcome & Stats */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8 relative overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
                    {/* Decorative BG - Lighter in light mode */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-full -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="relative z-10 flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                                Good morning, {user?.firstName}! <span className="ml-2">👋</span>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Let's achieve new milestones today</p>
                        </div>
                        <div className="bg-indigo-50 dark:bg-gray-700 p-2 rounded-lg shadow-sm">
                            <TrophyIcon className="w-6 h-6 text-yellow-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                        <KPI icon={BoltIcon} title="Daily Goal" value="15/20" color="bg-blue-500" progress={75} />
                        <KPI icon={CheckCircleIcon} title="Accuracy" value={`${data?.stats?.averageScore || 0}%`} color="bg-green-500" progress={data?.stats?.averageScore || 0} />
                        <KPI icon={ClockIcon} title="Study Time" value="2.5h" color="bg-purple-500" progress={40} />
                        <KPI icon={FireIcon} title="Streak" value="12 days" color="bg-orange-500" progress={100} />
                    </div>
                </div>

                {/* AI Mentor Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-indigo-100 dark:border-gray-700 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-indigo-600 rounded-xl mr-3 shadow-lg shadow-indigo-200 dark:shadow-none">
                                <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">AI Mentor</h3>
                                <p className="text-xs text-gray-400">Smart insights</p>
                            </div>
                        </div>
                        <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs font-bold rounded-full"># Live</span>
                    </div>

                    <div className="flex-1 space-y-4">
                        {/* Mock Recommendations from AI or fallback */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white mb-2">• Master Data Structures</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Medium</span>
                                <span>94% match</span>
                            </div>
                            <div className="mt-2 h-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full">
                                <div className="h-full bg-indigo-500 w-[94%] rounded-full"></div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white mb-2">• Quant Enhancement</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">Easy</span>
                                <span>88% match</span>
                            </div>
                            <div className="mt-2 h-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full">
                                <div className="h-full bg-indigo-500 w-[88%] rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <button className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-200 dark:shadow-none">
                        View Details
                    </button>
                </div>
            </div>

            {/* Learning Paths */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Learning Paths</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">Choose your specialization and start learning</p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <SectionCard
                    icon={BoltIcon}
                    title="Aptitude Practice"
                    desc="Build your fundamentals with topic-wise practice questions."
                    action="/test/practice"
                    color="bg-blue-500"
                    count="2"
                />
                <SectionCard
                    icon={BuildingOfficeIcon}
                    title="Company Assessment"
                    desc="Industry-specific tests for top product companies."
                    action="/competitions"
                    color="bg-green-500"
                    count=">"
                />
                <SectionCard
                    icon={TrophyIcon}
                    title="Exam Oriented"
                    desc="Competitive exam preparation for CAT, GRE, GMAT."
                    action="/competitions"
                    color="bg-purple-500"
                    count="6"
                />
                <SectionCard
                    icon={UserGroupIcon}
                    title="Soft Skills"
                    desc="Personal development and communication mastery."
                    action="/study-room"
                    color="bg-orange-500"
                    count="5"
                />
            </div>

            {/* Chat Bubble Fixed */}
            <button className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform z-50">
                <ChatBubbleLeftRightIcon className="w-7 h-7" />
            </button>
        </div>
    );
}

// Icons imports helper since we need them in SectionCard
import { TrophyIcon, BuildingOfficeIcon, UserGroupIcon } from '@heroicons/react/24/solid';
