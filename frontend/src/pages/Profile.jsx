import React, { useState } from 'react';
import { useUser, SignOutButton, useClerk, useAuth } from '@clerk/clerk-react';
import {
    ChartBarIcon,
    CpuChipIcon,
    ClockIcon,
    UserIcon,
    ArrowLeftOnRectangleIcon,
    ChevronRightIcon,
    ArrowUpRightIcon,
    CheckBadgeIcon,
    TrophyIcon,
    RocketLaunchIcon,
    PencilSquareIcon,
    ArrowLeftIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    AcademicCapIcon,
    FireIcon,
    CalendarIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';


export default function Profile() {
    const { user } = useUser();
    const { openUserProfile } = useClerk();
    const navigate = useNavigate();
    const location = useLocation();
    const { getToken } = useAuth();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'performance');
    const [activities, setActivities] = useState([]);
    const [performance, setPerformance] = useState(null);
    const [studyPlan, setStudyPlan] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loadingActivities, setLoadingActivities] = useState(false);
    const [loadingPerformance, setLoadingPerformance] = useState(false);
    const [loadingStudyPlan, setLoadingStudyPlan] = useState(false);

    React.useEffect(() => {
        const fetchActivities = async () => {
            setLoadingActivities(true);
            try {
                const token = await getToken();
                if (token) {
                    const { data } = await api.get('/activities/recent', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setActivities(data || []);
                }
            } catch (err) {
                console.error('Error fetching activities:', err);
            } finally {
                setLoadingActivities(false);
            }
        };

        const fetchPerformance = async () => {
            if (!user) return;
            setLoadingPerformance(true);
            try {
                const token = await getToken();
                if (token) {
                    const { data } = await api.get(`/dashboard/performance/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setPerformance(data.stats);
                }
            } catch (err) {
                console.error('Error fetching performance:', err);
            } finally {
                setLoadingPerformance(false);
            }
        };

        const fetchStudyPlan = async () => {
            if (!user) return;
            setLoadingStudyPlan(true);
            try {
                const token = await getToken();
                if (token) {
                    const { data } = await api.get('/study-plan', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setStudyPlan(data);
                }
            } catch (err) {
                console.error('Error fetching study plan:', err);
            } finally {
                setLoadingStudyPlan(false);
            }
        };

        fetchActivities();
        fetchPerformance();
        fetchStudyPlan();
    }, [getToken, user?.id]);

    const tabs = [
        { id: 'performance', title: 'Performance', icon: ChartBarIcon, color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-100 dark:bg-indigo-900/40' },
        { id: 'ai-mentor', title: 'AI Mentor', icon: CpuChipIcon, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/40' },
        { id: 'planner', title: 'Study Planner', icon: CalendarIcon, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/40' },
        { id: 'activity', title: 'Recent Activity', icon: ClockIcon, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/40' }
    ];

    const addTask = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const task = {
            text: formData.get('text'),
            time: formData.get('time'),
            category: formData.get('category') || 'General',
            dueDate: selectedDate
        };

        try {
            const token = await getToken();
            const { data } = await api.post('/study-plan/task', task, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudyPlan(data);
            e.target.reset();
        } catch (err) {
            console.error('Error adding task:', err);
        }
    };

    const toggleTask = async (taskId, currentStatus) => {
        try {
            const token = await getToken();
            const { data } = await api.put(`/study-plan/task/${taskId}`, { isCompleted: !currentStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudyPlan(data);
        } catch (err) {
            console.error('Error toggling task:', err);
        }
    };

    const deleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            const token = await getToken();
            const { data } = await api.delete(`/study-plan/task/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudyPlan(data);
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    const renderStudyPlanner = () => {
        const activeDays = performance?.activeDays || [];
        const weeklyProgress = performance?.weeklyProgress || ['0%', '0%', '0%', '0%', '0%', '0%', '0%'];

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                        <h4 className="text-gray-900 dark:text-white font-black text-lg mb-4">Daily Study Goals</h4>

                        {/* Add Task Form */}
                        <form onSubmit={addTask} className="mb-6 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5 space-y-3">
                            <input
                                name="text"
                                required
                                placeholder="What are you studying today?"
                                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <div className="flex gap-2">
                                <input
                                    name="time"
                                    required
                                    placeholder="Time (e.g. 45 mins)"
                                    className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-500 transition-all shadow-md active:scale-95">
                                    Add Goal
                                </button>
                            </div>
                        </form>

                        <div className="space-y-3">
                            {loadingStudyPlan ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mx-auto"></div>
                                </div>
                            ) : studyPlan?.tasks?.length > 0 ? (
                                studyPlan.tasks.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 group">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => toggleTask(item._id, item.isCompleted)}
                                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${item.isCompleted ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500'}`}
                                            >
                                                {item.isCompleted && <CheckBadgeIcon className="w-3 h-3 text-white" />}
                                            </button>
                                            <span className={`text-sm font-bold ${item.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>{item.text}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{item.time}</span>
                                            <button
                                                onClick={() => deleteTask(item._id)}
                                                className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <TrashIcon className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No goals set for today</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-gray-900 dark:text-white font-black text-lg">My Activity</h4>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Study</span>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="flex-1 flex flex-col">
                            <div className="grid grid-cols-7 mb-2 text-center">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                    <span key={d} className="text-[10px] font-black text-gray-400">{d}</span>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center flex-1">
                                {Array.from({ length: 35 }).map((_, i) => {
                                    const today = new Date();
                                    const currentDay = today.getDate();
                                    // Offset to align month start (simplified logic, usually needs full calendar math)
                                    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
                                    const dayNum = i - firstDayOfMonth + 1;
                                    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

                                    const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
                                    const isToday = dayNum === currentDay;
                                    const hasActivity = isCurrentMonth && activeDays.includes(dayNum);

                                    return (
                                        <div key={i} className={`aspect-square flex items-center justify-center rounded-lg text-xs font-bold relative group
                                        ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-700' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}
                                        ${isToday ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : ''}
                                    `}>
                                            {isCurrentMonth ? dayNum : ''}
                                            {hasActivity && !isToday && (
                                                <div className="absolute bottom-1 w-1 h-1 bg-indigo-500 rounded-full"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            onClick={() => setActiveTab('activity')}
                            className="mt-4 w-full py-2 bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-100 transition-all"
                        >
                            View Full History
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                    <h4 className="text-gray-900 dark:text-white font-black text-lg mb-4">Weekly Progress</h4>
                    <div className="grid grid-cols-7 gap-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                            const isToday = new Date().getDay() === (idx + 1) % 7;
                            const progress = weeklyProgress[idx] || '0%';
                            return (
                                <div key={idx} className="text-center group">
                                    <p className={`text-[10px] font-black uppercase mb-2 ${isToday ? 'text-indigo-600' : 'text-gray-500'}`}>{day}</p>
                                    <div className={`relative h-12 rounded-lg border flex items-center justify-center transition-all overflow-hidden ${isToday ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-500/20 dark:text-indigo-400 font-black shadow-sm' : 'border-gray-100 dark:border-white/5 text-gray-300'} hover:border-indigo-300 dark:hover:border-indigo-500/50`}>
                                        <div className="absolute bottom-0 left-0 w-full bg-indigo-100/50 dark:bg-indigo-900/30" style={{ height: progress, transition: 'height 1s ease-in-out' }}></div>
                                        <span className="relative z-10 text-xs font-bold">{progress}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )
    };

    const renderPerformance = () => {
        if (loadingPerformance) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white dark:bg-gray-900/50 h-32 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm"></div>
                    ))}
                </div>
            );
        }

        const stats = performance || {
            averageScore: 0,
            totalTests: 0,
            accuracy: 0,
            totalQuestionsSolved: 0,
            topTopic: 'N/A',
            weakTopic: 'N/A',
            performanceTrend: 0
        };

        const trendValue = parseFloat(stats.performanceTrend);

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Average Score */}
                <div className="bg-white dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
                            <TrophyIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                    <h4 className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest">Average Score</h4>
                    <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stats.averageScore}%</p>
                    <div className={`mt-3 flex items-center text-[11px] font-bold ${trendValue >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trendValue >= 0 ? <ArrowTrendingUpIcon className="w-3 h-3 mr-1" /> : <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />}
                        <span>{trendValue >= 0 ? '+' : ''}{trendValue}% vs last period</span>
                    </div>
                </div>

                {/* Tests Completed */}
                <div className="bg-white dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-xl">
                            <CheckBadgeIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <h4 className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest">Tests Completed</h4>
                    <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stats.totalTests}</p>
                    <p className="mt-3 text-gray-400 text-[11px] font-medium">{stats.totalQuestionsSolved} questions solved</p>
                </div>

                {/* Accuracy */}
                <div className="bg-white dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl">
                            <FireIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <h4 className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest">Overall Accuracy</h4>
                    <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stats.accuracy}%</p>
                    <p className="mt-3 text-gray-400 text-[11px] font-medium">Global benchmark: 72%</p>
                </div>

                {/* Top Topic */}
                <div className="bg-white dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-xl">
                            <AcademicCapIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>
                    <h4 className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest">Mastered Topic</h4>
                    <p className="text-lg font-black text-gray-900 dark:text-white mt-1 truncate">{stats.topTopic}</p>
                    <p className="mt-3 text-emerald-500 text-[11px] font-bold uppercase tracking-widest">Strength</p>
                </div>

                {/* Weak Topic */}
                <div className="bg-white dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-rose-100 dark:bg-rose-900/40 rounded-xl">
                            <ChartBarIcon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        </div>
                    </div>
                    <h4 className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest">Attention Needed</h4>
                    <p className="text-lg font-black text-gray-900 dark:text-white mt-1 truncate">{stats.weakTopic}</p>
                    <p className="mt-3 text-rose-500 text-[11px] font-bold uppercase tracking-widest">Weakness</p>
                </div>

                {/* Analysis Link */}
                <div className="bg-white dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-white/10 cursor-pointer group hover:border-indigo-500/50 transition-all shadow-sm" onClick={() => setActiveTab('performance')}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
                            <ChartBarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                    <h4 className="text-gray-900 dark:text-white text-base font-bold">Deep Analysis</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-1 font-medium leading-tight">Detailed skill gap analysis and performance trends.</p>
                    <div className="mt-4 flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                        <span>View Insights</span>
                        <ChevronRightIcon className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        );
    };

    const renderAIMentor = () => (
        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                    <RocketLaunchIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-xl font-black text-gray-900 dark:text-white mb-1">Smart Path Recommended</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium max-w-2xl leading-relaxed">
                        Your AI Mentor suggests focusing on <span className="text-purple-600 dark:text-purple-400 font-bold">Logical Reasoning</span>. Current mastery: 68%. Target: 85%.
                    </p>
                    <button className="mt-4 px-6 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-500 transition-all shadow-md active:scale-95">
                        Start Lesson
                    </button>
                </div>
            </div>
        </div>
    );

    const [activityPage, setActivityPage] = useState(1);
    const itemsPerPage = 5;

    const renderActivity = () => {
        const startIndex = (activityPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentActivities = activities.slice(startIndex, endIndex);
        const totalPages = Math.ceil(activities.length / itemsPerPage);

        return (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {loadingActivities ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading activity...</p>
                    </div>
                ) : activities.length > 0 ? (
                    <>
                        <div className="space-y-3 min-h-[400px]">
                            {currentActivities.map((act) => (
                                <div key={act._id} className="bg-white dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition-all shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                                            <ClockIcon className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{act.title}</h3>
                                            <p className="text-[10px] font-bold text-slate-500">
                                                {new Date(act.completedAt).toLocaleDateString()} • {new Date(act.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {act.activityType === 'practice_test' && (
                                            <div className="text-right mr-4">
                                                <p className="text-xs font-black text-indigo-600 dark:text-indigo-400">{act.metadata?.score}/{act.metadata?.totalQuestions}</p>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Score</p>
                                            </div>
                                        )}
                                        {act.activityType === 'practice_test' ? (
                                            <button
                                                onClick={() => navigate(`/test/${act.metadata?.testId}`)}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                                            >
                                                Review
                                                <ArrowUpRightIcon className="w-3 h-3" />
                                            </button>
                                        ) : (
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-lg">
                                                Completed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                                <button
                                    onClick={() => setActivityPage(prev => Math.max(prev - 1, 1))}
                                    disabled={activityPage === 1}
                                    className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Page {activityPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setActivityPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={activityPage === totalPages}
                                    className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white dark:bg-gray-900/50 p-12 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 text-center">
                        <p className="text-sm font-bold text-slate-400">No activity logged yet.</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-[#020617] transition-colors duration-300">
            <div className="max-w-[1300px] mx-auto px-4 md:px-6 py-4 space-y-4">

                {/* Back Navigation */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors group px-1"
                >
                    <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Back to Dashboard</span>
                </button>

                {/* Header Profile Section - Compacted */}
                <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-4 md:p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="relative group">
                                <img
                                    src={user.imageUrl}
                                    alt={user.fullName}
                                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-indigo-500/10 shadow-md group-hover:scale-102 transition-transform duration-300"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-indigo-600 p-1.5 rounded-lg border-2 border-white dark:border-gray-900">
                                    <UserIcon className="w-3 h-3 text-white" />
                                </div>
                            </div>

                            <div className="text-center md:text-left">
                                <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                                    {user.fullName}
                                </h1>
                                <p className="text-gray-500 dark:text-indigo-200/50 text-xs font-bold leading-tight uppercase tracking-tight">
                                    {user.primaryEmailAddress?.emailAddress}
                                </p>

                                <div className="mt-2 flex items-center justify-center md:justify-start gap-2">
                                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-[9px] font-black border border-indigo-200 dark:border-indigo-500/10 uppercase tracking-widest">
                                        Student
                                    </span>
                                    <button
                                        onClick={() => openUserProfile()}
                                        className="inline-flex items-center gap-1 text-[9px] font-black text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-widest"
                                    >
                                        <PencilSquareIcon className="w-3 h-3" />
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <SignOutButton>
                                <button className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-rose-50 dark:bg-rose-900/5 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/5 text-xs font-black hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all duration-300 active:scale-95 shadow-sm">
                                    <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </SignOutButton>
                        </div>
                    </div>
                </div>

                {/* Vertical Layout Grid */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Vertical Sidebar Navigation */}
                    <div className="md:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-2.5 flex flex-col gap-1.5 shadow-sm sticky top-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-300 font-bold text-xs tracking-tight ${activeTab === tab.id
                                        ? `${tab.bgColor} ${tab.color} border border-white/5 shadow-md`
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.03]'
                                        }`}
                                >
                                    <tab.icon className={`w-4 h-4 transition-transform duration-500 ${activeTab === tab.id ? 'scale-110' : ''}`} />
                                    <span>{tab.title}</span>
                                    {activeTab === tab.id && <ChevronRightIcon className="w-3 h-3 ml-auto opacity-50" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Detail Area */}
                    <div className="flex-1">
                        <div className="min-h-[300px]">
                            {activeTab === 'performance' && renderPerformance()}
                            {activeTab === 'ai-mentor' && renderAIMentor()}
                            {activeTab === 'planner' && renderStudyPlanner()}
                            {activeTab === 'activity' && renderActivity()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
