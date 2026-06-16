import React, { useContext, useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import api from '../services/api';
import {
    ClockIcon,
    CheckCircleIcon,
    FireIcon,
    BoltIcon, // Goal
    ChatBubbleLeftRightIcon,
    ArrowRightIcon,
    StarIcon,
    ChevronRightIcon,
    SparklesIcon,
    CalendarIcon
} from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import ChatPopup from '../components/ChatPopup';

// Icons need to be imported for SectionCard use below
import { TrophyIcon, BuildingOfficeIcon, UserGroupIcon } from '@heroicons/react/24/solid';

const KPI = ({ icon: Icon, title, value, color, progress, compact }) => (
    <div className={`bg-white/40 dark:bg-white/5 backdrop-blur-xl ${compact ? 'p-2' : 'p-4'} rounded-2xl shadow-xl border border-white/60 dark:border-white/10 transition-all hover:shadow-2xl hover:translate-y-[-2px] group relative overflow-hidden`}>
        {/* Subtle Inner Glow for light mode only */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 dark:hidden" />

        <div className={`flex items-start justify-between ${compact ? 'mb-1' : 'mb-4'}`}>
            <div className={`${compact ? 'p-1.5' : 'p-3'} rounded-xl ${color}`}>
                <Icon className={`${compact ? 'w-4 h-4' : 'w-6 h-6'} text-white`} />
            </div>
        </div>
        <div>
            <p className={`${compact ? 'text-[10px]' : 'text-sm'} font-bold dark:font-medium text-slate-900 dark:text-gray-400`}>{title}</p>
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

const SectionCard = ({ icon: Icon, title, desc, action, state, color, count, compact }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(action, { state })}
            className={`cursor-pointer bg-gradient-to-br from-indigo-50/80 to-white/40 dark:from-indigo-500/10 dark:via-transparent dark:to-purple-500/10 backdrop-blur-2xl ${compact ? 'p-4' : 'p-8'} rounded-[2rem] shadow-xl border border-white/60 dark:border-white/10 hover:shadow-2xl hover:scale-[1.02] transition-all relative overflow-hidden group`}
        >
            {/* Animated Accent Sparkle - Light Mode Only */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 dark:bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

            <div className="relative z-10 flex flex-col h-full">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${compact ? 'mb-2' : 'mb-6'} ${color} shadow-lg shadow-black/5`}>
                    <Icon className={`${compact ? 'w-5 h-5' : 'w-7 h-7'} text-white`} />
                </div>
                <div>
                    <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-gray-900 dark:text-white`}>{title}</h3>
                    <p className={`text-[10px] leading-tight font-bold dark:font-medium text-slate-700 dark:text-gray-400 mt-1 ${compact ? 'mb-2' : 'mb-8'}`}>{desc}</p>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <div className="text-indigo-600 dark:text-indigo-400 font-bold text-[10px] flex items-center group-hover:translate-x-1 transition-transform">
                        Get Started <ArrowRightIcon className="w-3 h-3 ml-1" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState([]);
    const [aiInsights, setAiInsights] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const navigate = useNavigate();
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            // Wait for user to be loaded
            if (!isLoaded || !isSignedIn) return;

            try {
                // Check user role for redirection
                const { data: userData } = await api.get('/auth/me');

                if (userData && (userData.role === 'institute' || userData.role === 'admin')) {
                    console.log("Redirecting institute/admin to correct dashboard...");
                    navigate('/institute-dashboard', { replace: true });
                    return;
                }

                // Fetch Activities
                const token = await getToken();
                if (token) {
                    const { data: actData } = await api.get('/activities/recent', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setActivities(actData || []);
                }

                // Fetch Dashboard Data (Stats, Recommendations)
                const { data: dashboardData } = await api.get(`/dashboard/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setData(dashboardData || {
                    stats: { testsTaken: 0, averageScore: 0, verifiedSkills: 0, accuracy: 0 },
                    recommendations: []
                });

                // Fetch Performance Data for AI Mentor
                try {
                    const { data: perfData } = await api.get(`/performance/${user.id}?range=all`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setAiInsights(perfData?.stats?.aiInsights || null);
                } catch (err) {
                    console.error("Failed to fetch AI Insights", err);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, isLoaded, isSignedIn, navigate, getToken]);

    if (!isLoaded || loading) return <div className="p-10 dark:text-white">Loading Dashboard...</div>;

    return (
        <div className="pb-10 relative overflow-hidden">
            {/* HYPER-COLORFUL Background Blobs for Light Mode - Hidden/Subtle in Dark Mode */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-indigo-400/30 dark:bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[10%] left-0 -ml-20 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[30%] left-[20%] w-80 h-80 bg-blue-300/30 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none animate-bounce" style={{ animationDuration: '10s' }} />
            <div className="absolute bottom-0 right-[20%] w-72 h-72 bg-pink-300/20 dark:bg-pink-900/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Split Layout: Left Content (Hero + Paths) | Right Sidebar (Mentor + Activity) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                    {/* LEFT COLUMN - Span 2 */}
                    <div className="lg:col-span-2 space-y-4 flex flex-col h-full">
                        {/* 1. Good Morning & Stats - SUPER COMPACT */}
                        <div className="bg-gradient-to-br from-indigo-600/10 via-white/40 to-purple-600/10 dark:from-indigo-500/10 dark:via-transparent dark:to-purple-500/10 backdrop-blur-2xl rounded-[3rem] p-6 relative overflow-hidden shadow-2xl border border-white/60 dark:border-white/5 flex-none">
                            {/* Decorative BG */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full -mr-24 -mt-24 pointer-events-none"></div>

                            <div className="relative z-10 flex justify-between items-start mb-2">
                                <div>
                                    <h1 className="text-base font-bold text-gray-900 dark:text-white flex items-center">
                                        Good morning, {user?.firstName}! <span className="ml-2">👋</span>
                                    </h1>
                                    <p className="text-[10px] font-bold dark:font-medium text-slate-900 dark:text-gray-400 uppercase tracking-wide">Let's achieve new milestones today</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="bg-indigo-50 dark:bg-gray-700 p-1 rounded-lg shadow-sm">
                                        <TrophyIcon className="w-3 h-3 text-yellow-500" />
                                    </div>
                                    <button
                                        onClick={() => navigate('/profile', { state: { activeTab: 'planner' } })}
                                        className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-amber-200 dark:border-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-all flex items-center shadow-sm"
                                    >
                                        <CalendarIcon className="w-2.5 h-2.5 mr-1" />
                                        View Planner
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 relative z-10">
                                <KPI icon={BoltIcon} title="Daily Goal" value={data?.stats?.dailyGoal || "0/20"} color="bg-blue-500" progress={parseInt((data?.stats?.dailyGoal || "0").split('/')[0]) * 5} compact={true} />
                                <KPI icon={CheckCircleIcon} title="Accuracy" value={`${data?.stats?.accuracy || 0}%`} color="bg-green-500" progress={data?.stats?.accuracy || 0} compact={true} />
                                <KPI icon={ClockIcon} title="Time" value={data?.stats?.timeSpent || "0m"} color="bg-purple-500" progress={Math.min(100, (parseInt(data?.stats?.timeSpent || 0) / 120) * 100)} compact={true} />
                                <KPI icon={FireIcon} title="Streak" value={data?.stats?.streak || "0"} color="bg-orange-500" progress={Math.min(100, (data?.stats?.streak || 0) * 10)} compact={true} />
                            </div>
                        </div>

                        {/* 2. Learning Paths - MOVED HERE (2x2 Grid) */}
                        <div className="flex-1 flex flex-col">
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Learning Paths</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                <SectionCard
                                    icon={BoltIcon}
                                    title="Aptitude Practice"
                                    desc="Topic-wise practice questions."
                                    action="/practice"
                                    color="bg-indigo-600 shadow-indigo-200 dark:shadow-none"
                                    count="2"
                                    compact={true}
                                />
                                <SectionCard
                                    icon={BuildingOfficeIcon}
                                    title="Company Assessment"
                                    desc="Tests for top product companies."
                                    action="/company-practice"
                                    color="bg-slate-800 shadow-slate-200 dark:bg-slate-700 dark:shadow-none"
                                    count=">"
                                    compact={true}
                                />
                                <SectionCard
                                    icon={TrophyIcon}
                                    title="Exam Oriented"
                                    desc="Prep for CAT, GRE, GMAT."
                                    action="/exam-practice"
                                    color="bg-violet-600 shadow-violet-200 dark:shadow-none"
                                    count="6"
                                    compact={true}
                                />
                                <SectionCard
                                    icon={UserGroupIcon}
                                    title="Soft Skills"
                                    desc="Communication mastery."
                                    action="/soft-skills"
                                    color="bg-emerald-600 shadow-emerald-200 dark:shadow-none"
                                    count="5"
                                    compact={true}
                                />
                            </div>
                        </div>

                        {/* 5. Previous Test Records */}
                        <div className="flex-1 flex flex-col mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Previous Records</h2>
                                <Link to="/profile" state={{ activeTab: 'performance' }} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View All</Link>
                            </div>
                            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-sm border border-white/60 dark:border-white/10 p-4">
                                {data?.recentActivity?.length > 0 ? (
                                    <div className="space-y-3">
                                        {data.recentActivity.map((record) => (
                                            <div key={record._id} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                                        <CheckCircleIcon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{record.testId?.title || 'Test Assessment'}</p>
                                                        <p className="text-[10px] font-medium text-gray-500">{new Date(record.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">{record.score} pts</p>
                                                    <p className="text-[10px] font-bold text-gray-500">{Math.round((record.correctAnswers / record.totalQuestions) * 100)}% Accuracy</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-sm font-bold text-gray-500">No previous records available.</p>
                                        <button onClick={() => navigate('/tests')} className="mt-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700">Take a Test</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Span 1 */}
                    <div className="space-y-6 flex flex-col h-full">
                        {/* 3. AI Mentor - Existing */}
                        <div className="bg-gradient-to-br from-indigo-50/80 to-white/40 dark:from-white/5 dark:to-white/[0.02] backdrop-blur-2xl rounded-[3.5rem] p-6 shadow-2xl border border-white/60 dark:border-white/10 flex flex-col flex-1 min-h-[220px] max-h-[300px] relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-200/20 dark:bg-indigo-500/10 rounded-full blur-2xl" />
                            <div className="relative z-10 flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="p-2.5 bg-indigo-600 rounded-xl mr-3 shadow-lg shadow-indigo-300 dark:shadow-indigo-900/50">
                                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">AI Mentor</h3>
                                        <p className="text-xs font-bold text-slate-800 dark:text-gray-400">Smart insights</p>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded-full"># Live</span>
                            </div>

                            <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                                {aiInsights?.recommendations?.length > 0 ? (
                                    aiInsights.recommendations.slice(0, 2).map((rec, i) => (
                                        <div key={rec.id || i} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">• {rec.title}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] ${rec.type === 'theory' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                    {rec.type === 'theory' ? 'Theory' : 'Practice'}
                                                </span>
                                                <span>Duration: {rec.duration}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-xs font-bold text-slate-400">Keep practicing to unlock insights!</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => navigate('/profile', { state: { activeTab: 'ai-mentor' } })}
                                className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-md text-sm"
                            >
                                View Details
                            </button>
                        </div>

                        {/* 4. NEW Recent Activity */}
                        <div className="bg-gradient-to-br from-orange-50/80 to-white/40 dark:from-white/5 dark:to-white/[0.02] backdrop-blur-2xl rounded-[3.5rem] p-6 shadow-2xl border border-white/60 dark:border-white/10 flex flex-col flex-1 min-h-[220px] max-h-[300px] relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-200/20 dark:bg-orange-500/10 rounded-full blur-2xl" />
                            <div className="relative z-10 flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="p-2.5 bg-orange-500 rounded-xl mr-3 shadow-lg shadow-orange-300 dark:shadow-orange-900/50">
                                        <ClockIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                                        <p className="text-xs font-bold text-slate-800 dark:text-gray-400">Continue learning</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                                {activities.length > 0 ? (
                                    activities.slice(0, 3).map((act) => {
                                        const getTimeAgo = (date) => {
                                            const now = new Date();
                                            const past = new Date(date);
                                            const diff = Math.floor((now - past) / 60000); // mins
                                            if (diff < 1) return 'Just now';
                                            if (diff < 60) return `${diff}m ago`;
                                            if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
                                            return `${Math.floor(diff / 1440)}d ago`;
                                        };

                                        const getIconColor = (type) => {
                                            switch (type) {
                                                case 'practice_test': return 'bg-green-100 text-green-600';
                                                case 'practice_questions': return 'bg-blue-100 text-blue-600';
                                                case 'company_practice': return 'bg-indigo-100 text-indigo-600';
                                                case 'exam_practice': return 'bg-purple-100 text-purple-600';
                                                case 'soft_skill': return 'bg-orange-100 text-orange-600';
                                                default: return 'bg-gray-100 text-gray-600';
                                            }
                                        };

                                        return (
                                            <div
                                                key={act._id}
                                                onClick={() => act.activityType === 'practice_test' ? navigate(`/profile`, { state: { activeTab: 'activity' } }) : null}
                                                className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-white/[0.03] rounded-lg transition-colors cursor-pointer group"
                                            >
                                                <div className={`w-10 h-10 rounded-full ${getIconColor(act.activityType)} flex items-center justify-center font-bold text-[10px] mr-3 shrink-0`}>
                                                    {act.activityType === 'practice_test' ? 'TEST' :
                                                        act.activityType === 'practice_questions' ? 'PRAC' :
                                                            act.activityType === 'soft_skill' ? 'SOFT' : 'PREP'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                        {act.title}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-500 group-hover:text-slate-700 dark:group-hover:text-gray-400">
                                                        {getTimeAgo(act.completedAt)}
                                                    </p>
                                                </div>
                                                {act.activityType === 'practice_test' && (
                                                    <div className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                                                        {act.metadata?.score}/{act.metadata?.totalQuestions}
                                                    </div>
                                                )}
                                                <ChevronRightIcon className="w-4 h-4 text-gray-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-xs font-bold text-slate-400">No recent activity yet</p>
                                    </div>
                                )}
                            </div>

                            <Link
                                to="/profile"
                                state={{ activeTab: 'activity' }}
                                className="mt-auto text-center text-sm text-indigo-600 font-medium hover:text-indigo-800"
                            >
                                View all history
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Backdrop Blur - Only when open */}
            {isChatOpen && (
                <div
                    className="fixed inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-sm z-[55] transition-all duration-300 animate-in fade-in"
                    onClick={() => setIsChatOpen(false)}
                />
            )}

            {/* Chat Popup Component */}
            <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

            {/* Chat Bubble Fixed */}
            <button
                onClick={() => setIsChatOpen(prev => !prev)}
                className={`fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all z-[70]
                ${isChatOpen ? 'bg-rose-500 rotate-90 shadow-rose-200 dark:shadow-rose-900/40' : 'bg-indigo-600 shadow-indigo-200 dark:shadow-indigo-900/40 animate-float hover:[animation-play-state:paused]'}`}
            >
                {isChatOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <SparklesIcon className="w-7 h-7" />
                )}
            </button>
        </div>
    );
}
