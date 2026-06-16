import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '@clerk/clerk-react';
import {
    AcademicCapIcon,
    LightBulbIcon,
    ChatBubbleBottomCenterTextIcon,
    ChartPieIcon,
    AdjustmentsHorizontalIcon,
    ArrowRightIcon,
    ClockIcon,
    StarIcon,
    CheckIcon,
    ArrowPathIcon,
    Squares2X2Icon,
    FireIcon,
    ChevronDownIcon,
    SparklesIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { allTopics, categoryMap } from '../constants/practice';



export default function PracticeHub() {
    const [loading, setLoading] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [competitions, setCompetitions] = useState([]);
    const [joinCode, setJoinCode] = useState('');

    const { getToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComps = async () => {
            try {
                const token = await getToken();
                const res = await api.get('/tests/competitions', { headers: { Authorization: `Bearer ${token}` } });
                setCompetitions(res.data);
            } catch (e) { console.error('Failed to load comps', e); }
        };
        fetchComps();
    }, [getToken]);

    const toggleCategory = (catKey) => {
        setExpandedCategory(prev => prev === catKey ? null : catKey);
    };

    const [configDuration, setConfigDuration] = useState(30);
    const [configDifficulty, setConfigDifficulty] = useState(0.5);
    const [configCount, setConfigCount] = useState(20);

    const startSession = async (topicId = '', category = 'quantitative', options = {}) => {
        setLoading(true);
        // alert("Starting session... please wait");
        try {
            const token = await getToken();
            if (!token) {
                alert('Session expired or not signed in. Please reload or sign in again.');
                setLoading(false);
                return;
            }
            // Default config for "Practice Mode" (Left side)
            const defaults = {
                testType: 'practice',
                count: 50, // Fetch all/many questions
                duration: 0, // No timer for practice
                difficulty: 0.5,
                topic: topicId,
                category: category
            };

            // Merge with options (Right side "Start Test" will override testType and duration)
            const config = {
                ...defaults,
                ...options,
                // Override count if it's a test (Right Side)
                ...(options.testType === 'test' && { count: configCount })
            };

            console.log("[PracticeHub] Starting session with config:", config);
            console.log("[PracticeHub] Token present:", !!token);

            const res = await api.post('/tests/start', config, { headers: { Authorization: `Bearer ${token}` } });

            console.log("[PracticeHub] Session started response:", res.data);
            if (res.data && res.data.attemptId) {
                // alert(`Session started! ID: ${res.data.attemptId}. Navigating...`);
                navigate(`/test/${res.data.attemptId}`);
            } else {
                alert("Server returned valid response but no attemptId.");
            }
        } catch (err) {
            console.error("[PracticeHub] Error starting session:", err);
            const msg = err.response?.data?.message || err.message || 'Failed to start practice';
            alert(`Error (${err.response?.status || 'Network'}): ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinTest = async (e) => {
        e.preventDefault();
        if (!joinCode.trim()) return;
        try {
            const token = await getToken();
            const res = await api.get(`/tests/code/${joinCode.trim().toUpperCase()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/test/${res.data._id}`);
        } catch (err) {
            alert(err.response?.data?.message || 'Invalid test code');
        }
    };

    return (
        <div className="min-h-screen py-10 relative overflow-hidden transition-colors duration-500">
            {/* HYPER-COLORFUL Background Blobs for Light Mode */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[700px] h-[700px] bg-indigo-400/30 dark:bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-300/20 dark:bg-blue-900/5 rounded-full blur-[100px] pointer-events-none animate-bounce" style={{ animationDuration: '15s' }} />
            <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-pink-300/20 dark:bg-pink-900/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">

                    {/* TOPIC SECTION */}
                    <div className="lg:col-span-8 flex flex-col">
                        <div className="relative group h-full flex flex-col">
                            <div className="relative bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-3xl p-8 rounded-[3rem] border border-indigo-100 dark:border-white/10 shadow-xl dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden h-full flex flex-col transition-all">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => navigate('/dashboard')}
                                            className="p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                            title="Back to Dashboard"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                            </svg>
                                        </button>
                                        <div className="p-2 bg-indigo-600/20 rounded-lg border border-indigo-600/30">
                                            <FireIcon className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <h1 className="text-xl font-black dark:font-bold text-gray-900 dark:text-white uppercase tracking-tight">Start Practice Questions</h1>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                    {/* Random Questions First */}
                                    <div className="group transition-all duration-300">
                                        <div className={`relative bg-gradient-to-br from-indigo-100/40 to-white/20 dark:from-white/10 dark:to-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/60 dark:border-white/10 hover:border-indigo-500/50 hover:bg-white/40 transition-all duration-300 shadow-xl`}>
                                            <button
                                                onClick={() => startSession('')}
                                                className="w-full flex items-center justify-between relative z-10"
                                            >
                                                <div className="flex items-center">
                                                    <div className={`p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mr-5`}>
                                                        <SparklesIcon className={`w-6 h-6 text-indigo-400`} />
                                                    </div>
                                                    <div className="text-left">
                                                        <h2 className="text-lg font-black dark:font-bold text-gray-900 dark:text-white tracking-wide">Mixed Practice</h2>
                                                        <span className="text-[10px] uppercase font-black dark:font-medium text-slate-900 dark:text-indigo-500/60 tracking-[0.2em]">
                                                            Random questions across all topics
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-2 rounded-xl bg-white/5 border border-white/10 opacity-40 group-hover:opacity-100 group-hover:bg-indigo-500/20 transition-all">
                                                    <ArrowRightIcon className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {Object.keys(categoryMap).map(catKey => {
                                        const cat = categoryMap[catKey];
                                        const topics = allTopics.filter(t => t.cat === catKey);
                                        const isExpanded = expandedCategory === catKey;

                                        return (
                                            <div key={catKey} className="group transition-all duration-300">
                                                <div className={`relative bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] border transition-all duration-300 ${isExpanded ? 'border-indigo-500/50 shadow-2xl scale-[1.01]' : 'border-white/60 dark:border-white/10 hover:border-indigo-400/50 shadow-lg'}`}>
                                                    <button
                                                        onClick={() => toggleCategory(catKey)}
                                                        className="w-full flex items-center justify-between relative z-10"
                                                    >
                                                        <div className="flex items-center">
                                                            <div className={`p-3 rounded-2xl bg-white dark:bg-white/5 border border-indigo-100 dark:border-white/10 mr-5 transition-transform duration-300 shadow-md ${isExpanded ? 'scale-110 ring-2 ring-indigo-500/20' : ''}`}>
                                                                <cat.icon className={`w-6 h-6 ${cat.accent}`} />
                                                            </div>
                                                            <div className="text-left">
                                                                <h2 className="text-lg font-black dark:font-bold text-gray-900 dark:text-white tracking-wide">{cat.name}</h2>
                                                                <span className="text-[10px] uppercase font-black dark:font-medium text-slate-900 dark:text-slate-500 tracking-[0.2em]">
                                                                    {topics.length} Subtopics
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            <div className={`p-2 rounded-xl bg-white/5 border border-white/10 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-indigo-500/10 border-indigo-500/20' : ''}`}>
                                                                <ChevronDownIcon className={`w-4 h-4 ${isExpanded ? 'text-indigo-400' : 'text-slate-500'}`} />
                                                            </div>
                                                        </div>
                                                    </button>

                                                    {isExpanded && (
                                                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 relative z-10 border-t border-white/5 pt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                                            {topics.map(topic => (
                                                                <button
                                                                    key={topic.id}
                                                                    onClick={() => startSession(topic.id, catKey)}
                                                                    className={`group/btn relative px-4 py-3.5 rounded-2xl transition-all duration-200 transform active:scale-95 topic-chip-unselected`}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className={`text-[11px] font-bold dark:font-medium tracking-wide transition-colors text-slate-900 dark:text-slate-400 group-hover/btn:text-white`}>
                                                                            {topic.name}
                                                                        </span>
                                                                        <ArrowRightIcon className="w-3 h-3 text-slate-500 group-hover/btn:text-indigo-400 transition-colors" />
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SETTINGS PANEL */}
                    <div className="lg:col-span-4 flex flex-col">
                        <div className="relative group h-full flex flex-col">
                            <div className="relative bg-gradient-to-br from-white/60 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-2xl p-8 rounded-[3.5rem] border border-white/60 dark:border-white/10 shadow-2xl dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden h-full flex flex-col transition-all">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-200/30 dark:bg-indigo-500/10 rounded-full blur-3xl" />
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center tracking-tight text-wrap">
                                    <div className="p-2 bg-indigo-600 rounded-xl mr-4 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/50">
                                        <AdjustmentsHorizontalIcon className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    START PRACTICE TEST
                                </h2>

                                <div className="space-y-10">

                                    <div className="space-y-8">
                                        {/* Customization Controls */}
                                        <div className="space-y-6 p-6 rounded-3xl bg-indigo-50/50 dark:bg-white/5 border border-indigo-100/50 dark:border-white/5">
                                            {/* Question Count Control - NEW */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span className="text-slate-900 dark:text-slate-400">Questions</span>
                                                    <span className="text-indigo-600 dark:text-white">{configCount} Qs</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="10"
                                                    max="50"
                                                    step="5"
                                                    value={configCount}
                                                    onChange={(e) => setConfigCount(parseInt(e.target.value))}
                                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                />
                                            </div>

                                            {/* Duration Control */}
                                            <div className="space-y-3 pt-4 border-t border-white/5">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-xs font-black text-slate-900 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                        <ClockIcon className="w-4 h-4 text-indigo-400" />
                                                        Time Bound
                                                    </label>
                                                    <span className="text-base font-black text-indigo-600 dark:text-white">{configDuration} min</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="5"
                                                    max="60"
                                                    step="5"
                                                    value={configDuration}
                                                    onChange={(e) => setConfigDuration(parseInt(e.target.value))}
                                                    className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                                                />
                                                <div className="flex justify-between text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                                                    <span>5m</span>
                                                    <span>30m</span>
                                                    <span>60m</span>
                                                </div>
                                            </div>

                                            {/* Difficulty Control */}
                                            <div className="space-y-3 pt-4 border-t border-white/5">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-xs font-black text-slate-900 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                        <ChartPieIcon className="w-4 h-4 text-pink-400" />
                                                        Difficulty
                                                    </label>
                                                    <span className={`text-xs font-black uppercase px-2 py-1 rounded bg-white/5 border ${configDifficulty < 0.4 ? 'text-emerald-400 border-emerald-500/20' : configDifficulty > 0.6 ? 'text-red-400 border-red-500/20' : 'text-amber-400 border-amber-500/20'}`}>
                                                        {configDifficulty < 0.4 ? 'Beginner' : configDifficulty > 0.6 ? 'Expert' : 'Intermediate'}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {[0.2, 0.5, 0.8].map((level) => (
                                                        <button
                                                            key={level}
                                                            onClick={() => setConfigDifficulty(level)}
                                                            className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${configDifficulty === level
                                                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/25'
                                                                : 'bg-slate-800/50 text-slate-500 border-transparent hover:bg-slate-700 hover:text-slate-300'
                                                                }`}
                                                        >
                                                            {level === 0.2 ? 'Easy' : level === 0.5 ? 'Medium' : 'Hard'}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Start Button */}
                                        <button
                                            onClick={() => startSession('', '', {
                                                testType: 'test',
                                                duration: configDuration,
                                                difficulty: configDifficulty
                                            })}
                                            className="w-full group relative flex items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black uppercase tracking-widest shadow-xl shadow-indigo-900/40 hover:shadow-2xl hover:shadow-indigo-600/30 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                            <RocketLaunchIcon className="w-5 h-5 text-indigo-100 animate-pulse" />
                                            <span className="relative z-10">Start Practice Test</span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                /* Custom Range Slider */
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #818cf8;
                    cursor: pointer;
                    box-shadow: 0 0 15px rgba(129, 140, 248, 0.4);
                    border: 3px solid white;
                    transition: all 0.2s;
                }
                input[type=range]::-webkit-slider-thumb:hover {
                    box-shadow: 0 0 25px rgba(129, 140, 248, 0.6);
                    transform: scale(1.1);
                }

                /* Chip Selection Effect */
                .topic-chip-selected {
                    box-shadow: inset 0 0 12px rgba(255,255,255,0.2), 0 10px 15px -3px rgba(79, 70, 229, 0.4);
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                    border: 1px solid rgba(255,255,255,0.3);
                }
                 .topic-chip-unselected {
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.12);
                    backdrop-blur: sm;
                }
                .topic-chip-unselected span {
                    color: #0f172a; /* slate-900 in light mode */
                }
                .dark .topic-chip-unselected span {
                    color: #cbd5e1; /* slate-300 in dark mode */
                }
                .topic-chip-unselected:hover {
                    background: rgba(255,255,255,0.15);
                    border: 1px solid rgba(255,255,255,0.25);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px -10px rgba(0,0,0,0.6);
                }
                .topic-chip-unselected:hover span {
                    color: #ffffff;
                }
            `}} />

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                        <p className="text-white font-medium">Starting your session...</p>
                    </div>
                </div>
            )}


        </div>
    );
}

