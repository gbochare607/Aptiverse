import React, { useState } from 'react';
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
    SparklesIcon
} from '@heroicons/react/24/outline';

const categoryMap = {
    quantitative: {
        name: 'Quantitative',
        gradient: 'from-blue-500/20 to-cyan-500/20',
        accent: 'text-blue-500',
        bgAccent: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        icon: AcademicCapIcon
    },
    logical: {
        name: 'Logical',
        gradient: 'from-purple-500/20 to-pink-500/20',
        accent: 'text-purple-500',
        bgAccent: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20',
        icon: LightBulbIcon
    },
    verbal: {
        name: 'Verbal',
        gradient: 'from-emerald-500/20 to-teal-500/20',
        accent: 'text-emerald-500',
        bgAccent: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20',
        icon: ChatBubbleBottomCenterTextIcon
    },
    data: {
        name: 'Data & DI',
        gradient: 'from-orange-500/20 to-amber-500/20',
        accent: 'text-orange-500',
        bgAccent: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
        icon: ChartPieIcon
    },
};

const allTopics = [
    { id: 'number-system', name: 'Number System', cat: 'quantitative' },
    { id: 'percentages', name: 'Percentages', cat: 'quantitative' },
    { id: 'profit-loss', name: 'Profit & Loss', cat: 'quantitative' },
    { id: 'ratio-proportion', name: 'Ratio & Prop', cat: 'quantitative' },
    { id: 'time-work', name: 'Time & Work', cat: 'quantitative' },
    { id: 'time-distance', name: 'Time & Dist', cat: 'quantitative' },
    { id: 'algebra', name: 'Algebra', cat: 'quantitative' },
    { id: 'geometry', name: 'Geometry', cat: 'quantitative' },
    { id: 'probability', name: 'Probability', cat: 'quantitative' },
    { id: 'si-ci', name: 'SI & CI', cat: 'quantitative' },
    { id: 'blood-relations', name: 'Blood Relations', cat: 'logical' },
    { id: 'coding-decoding', name: 'Coding-Decoding', cat: 'logical' },
    { id: 'syllogism', name: 'Syllogism', cat: 'logical' },
    { id: 'series', name: 'Series', cat: 'logical' },
    { id: 'seating', name: 'Seating Arrangement', cat: 'logical' },
    { id: 'puzzles', name: 'Puzzles', cat: 'logical' },
    { id: 'analogies', name: 'Analogies', cat: 'logical' },
    { id: 'synonyms-antonyms', name: 'Syn/Antonyms', cat: 'verbal' },
    { id: 'grammar', name: 'Grammar', cat: 'verbal' },
    { id: 'cloze-test', name: 'Cloze Test', cat: 'verbal' },
    { id: 'reading-comp', name: 'RC Passage', cat: 'verbal' },
    { id: 'vocabulary', name: 'Vocabulary', cat: 'verbal' },
    { id: 'data-interpretation', name: 'Data Interpretation', cat: 'data' },
    { id: 'charts', name: 'Charts & Graphs', cat: 'data' },
    { id: 'tables', name: 'Tabular Data', cat: 'data' },
];

export default function PracticeHub() {
    const [loading, setLoading] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [isRandomMode, setIsRandomMode] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [testConfig, setTestConfig] = useState({ count: 20, duration: 30, difficulty: 0.6 });

    const { getToken } = useAuth();
    const navigate = useNavigate();

    const toggleTopic = (id) => {
        setIsRandomMode(false);
        setSelectedTopics(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
    };

    const toggleCategory = (catKey) => {
        setExpandedCategory(prev => prev === catKey ? null : catKey);
    };

    const enableRandomMode = () => {
        setSelectedTopics([]);
        setIsRandomMode(true);
        setExpandedCategory(null);
    };

    const startSession = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const config = {
                testType: 'practice',
                count: testConfig.count,
                duration: testConfig.duration,
                difficulty: testConfig.difficulty,
                topic: isRandomMode ? '' : selectedTopics.join(',')
            };
            const res = await api.post('/tests/start', config, { headers: { Authorization: `Bearer ${token}` } });
            navigate(`/test/${res.data.attemptId}`);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to start session');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-10 relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">

                    {/* TOPIC SECTION */}
                    {/* TOPIC SECTION */}
                    <div className="lg:col-span-8 flex flex-col">
                        <div className="relative group h-full flex flex-col">
                            <div className="relative bg-[#0f172a]/95 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden h-full flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-indigo-600/20 rounded-lg border border-indigo-600/30">
                                            <FireIcon className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <h1 className="text-xl font-black text-white uppercase tracking-tight">Start Practice Questions</h1>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                    {/* Random Questions First */}
                                    <div className="group transition-all duration-300">
                                        <div className={`relative bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border transition-all duration-300 ${isRandomMode ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-white/5 hover:border-white/10'}`}>
                                            <button
                                                onClick={enableRandomMode}
                                                className="w-full flex items-center justify-between relative z-10"
                                            >
                                                <div className="flex items-center">
                                                    <div className={`p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mr-5 transition-transform duration-300 ${isRandomMode ? 'scale-110' : ''}`}>
                                                        <SparklesIcon className={`w-6 h-6 text-indigo-400`} />
                                                    </div>
                                                    <div className="text-left">
                                                        <h2 className="text-lg font-black text-white tracking-wide">Random Questions</h2>
                                                        <span className="text-[10px] uppercase font-black text-indigo-500/60 tracking-[0.2em]">
                                                            Mix across all categories
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    {isRandomMode && (
                                                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                                                            <CheckIcon className="w-4 h-4 text-white stroke-[4px]" />
                                                        </div>
                                                    )}
                                                    {!isRandomMode && (
                                                        <div className="p-2 rounded-xl bg-white/5 border border-white/10 opacity-40">
                                                            <ArrowRightIcon className="w-4 h-4 text-slate-500" />
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {Object.keys(categoryMap).map(catKey => {
                                        const cat = categoryMap[catKey];
                                        const topics = allTopics.filter(t => t.cat === catKey);
                                        const isExpanded = expandedCategory === catKey;
                                        const hasSelections = topics.some(t => selectedTopics.includes(t.id));

                                        return (
                                            <div key={catKey} className="group transition-all duration-300">
                                                <div className={`relative bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border transition-all duration-300 ${isExpanded ? 'border-indigo-500/40' : 'border-white/5 hover:border-white/10'}`}>
                                                    <button
                                                        onClick={() => toggleCategory(catKey)}
                                                        className="w-full flex items-center justify-between relative z-10"
                                                    >
                                                        <div className="flex items-center">
                                                            <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 mr-5 transition-transform duration-300 ${isExpanded ? 'scale-110' : ''}`}>
                                                                <cat.icon className={`w-6 h-6 ${cat.accent}`} />
                                                            </div>
                                                            <div className="text-left">
                                                                <h2 className="text-lg font-black text-white tracking-wide">{cat.name}</h2>
                                                                <span className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">
                                                                    {topics.length} Subtopics
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            {hasSelections && (
                                                                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-black rounded-lg border border-indigo-500/30 tracking-tighter">
                                                                    {topics.filter(t => selectedTopics.includes(t.id)).length} ACTIVE
                                                                </span>
                                                            )}
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
                                                                    onClick={() => toggleTopic(topic.id)}
                                                                    className={`group/btn relative px-4 py-3.5 rounded-2xl transition-all duration-200 transform active:scale-95 ${selectedTopics.includes(topic.id)
                                                                        ? 'topic-chip-selected'
                                                                        : 'topic-chip-unselected'}`}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className={`text-[11px] font-bold tracking-wide transition-colors ${selectedTopics.includes(topic.id) ? 'text-white' : 'text-slate-400 group-hover/btn:text-slate-100'}`}>
                                                                            {topic.name}
                                                                        </span>
                                                                        {selectedTopics.includes(topic.id) && (
                                                                            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                                                                                <CheckIcon className="w-2.5 h-2.5 text-white stroke-[4px]" />
                                                                            </div>
                                                                        )}
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
                            <div className="relative bg-[#0f172a]/95 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden h-full flex flex-col">
                                <h2 className="text-2xl font-black text-white mb-8 flex items-center tracking-tight text-wrap">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg mr-4 border border-indigo-500/30">
                                        <AdjustmentsHorizontalIcon className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    Start test
                                </h2>

                                <div className="space-y-10">
                                    {/* Selection Preview */}
                                    <div className="p-5 rounded-3xl bg-white/5 border border-white/5 relative overflow-hidden">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Target Scope</span>
                                        </div>
                                        <div className="flex items-baseline space-x-2">
                                            <span className="text-3xl font-black text-white">{isRandomMode ? 'MIXED' : selectedTopics.length}</span>
                                            <span className="text-xs font-bold text-slate-500">{isRandomMode ? 'RANDOM QUESTIONS' : 'TOPICS SELECTED'}</span>
                                        </div>
                                        {selectedTopics.length > 0 && !isRandomMode && (
                                            <div className="mt-4 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                                                {selectedTopics.map(id => (
                                                    <span key={id} className="px-2 py-1 bg-white/10 text-white/80 text-[9px] font-black rounded-lg border border-white/5 uppercase tracking-tighter">
                                                        {allTopics.find(t => t.id === id)?.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Question Count */}
                                    <div>
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 block">Question Count</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[10, 20, 30, 50].map(val => (
                                                <button
                                                    key={val}
                                                    onClick={() => setTestConfig({ ...testConfig, count: val })}
                                                    className={`py-3 text-sm font-black rounded-2xl border transition-all duration-200 ${testConfig.count === val
                                                        ? 'bg-white text-indigo-900 border-white shadow-lg shadow-white/10'
                                                        : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10 hover:border-white/10'}`}
                                                >
                                                    {val}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Duration Slider */}
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Duration</label>
                                            <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                                                <span className="text-sm font-black text-indigo-400">{testConfig.duration} <span className="text-[10px] opacity-60 ml-0.5">MIN</span></span>
                                            </div>
                                        </div>
                                        <div className="relative h-6 flex items-center">
                                            <input
                                                type="range" min="10" max="60" step="5"
                                                value={testConfig.duration}
                                                onChange={(e) => setTestConfig({ ...testConfig, duration: parseInt(e.target.value) })}
                                                className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500 outline-none hover:bg-white/10 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Difficulty Tier */}
                                    <div>
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 block">Difficulty Tier</label>
                                        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            {[{ v: 0.3, l: 'ROOKIE' }, { v: 0.6, l: 'ELITE' }, { v: 0.9, l: 'GENIUS' }].map(d => (
                                                <button
                                                    key={d.l}
                                                    onClick={() => setTestConfig({ ...testConfig, difficulty: d.v })}
                                                    className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all duration-300 ${testConfig.difficulty === d.v
                                                        ? 'bg-white text-indigo-900 shadow-xl'
                                                        : 'text-slate-500 hover:text-slate-300'}`}
                                                >
                                                    {d.l}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <button
                                        onClick={startSession}
                                        disabled={loading || (!isRandomMode && selectedTopics.length === 0)}
                                        className="group/run w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-3xl flex items-center justify-center gap-4 shadow-2xl shadow-indigo-500/20 transition-all duration-300 transform hover:scale-[1.01] active:scale-95 disabled:grayscale disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="animate-spin h-6 w-6 border-4 border-white/30 border-t-white rounded-full" />
                                        ) : (
                                            <>
                                                <span className="text-lg uppercase tracking-widest font-black">Begin Test</span>
                                                <ArrowRightIcon className="w-5 h-5 group-hover/run:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center mt-6 text-[10px] font-medium text-slate-500 tracking-wider">SECURE ADAPTIVE TEST ENVIRONMENT</p>
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
                    color: #cbd5e1; /* slate-300 */
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
        </div>
    );
}
