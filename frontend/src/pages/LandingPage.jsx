import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    RocketLaunchIcon,
    AcademicCapIcon,
    ChartBarIcon,
    BuildingLibraryIcon,
    UserGroupIcon,
    ClockIcon,
    SparklesIcon,
    ArrowRightIcon,
    CpuChipIcon,
    BookOpenIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    CommandLineIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [demoScore, setDemoScore] = useState(null);
    
    // Room Lobbies state
    const [rooms, setRooms] = useState([
        { id: 1, name: 'TCS Digital Mock Sprint', active: 4, max: 5, time: '3m ago' },
        { id: 2, name: 'CAT Quantitative Prep', active: 3, max: 5, time: 'Just now' },
        { id: 3, name: 'Google DSA Challenge', active: 1, max: 3, time: '12m ago' }
    ]);
    const [activeRoomId, setActiveRoomId] = useState(1);

    // AI Coach micro-sprint state
    const [aiStep, setAiStep] = useState(1);
    const [aiSprintLoading, setAiSprintLoading] = useState(false);

    // Scroll listener for sticky header
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        if (option === 'B') {
            setDemoScore('correct');
        } else {
            setDemoScore('incorrect');
        }
    };

    const startAiSprint = () => {
        setAiSprintLoading(true);
        setTimeout(() => {
            setAiSprintLoading(false);
            setAiStep(2);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-indigo-500/30 font-sans overflow-x-hidden relative">
            
            {/* High-Fidelity Background FX */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Glowing orbs */}
                <div className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse-glow" />
                <div className="absolute top-[40%] right-[-15%] w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[140px] animate-pulse-glow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
                
                {/* Grid overlays */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.25] pointer-events-none" />
                <div className="absolute inset-0 bg-dot-pattern opacity-[0.2] pointer-events-none" />
                
                {/* Visual horizontal separator line */}
                <div className="absolute top-[100vh] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </div>

            {/* Premium Sticky Header */}
            <header className="fixed top-0 w-full z-50 transition-all duration-500 pt-5 px-6">
                <div className={`max-w-5xl mx-auto px-6 py-2.5 rounded-full transition-all duration-300 flex items-center justify-between ${
                    scrolled 
                    ? 'bg-slate-950/65 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
                    : 'bg-transparent border border-transparent'
                }`}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25">
                            <RocketLaunchIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white">
                            AptiVerse
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
                        <a href="#features" className="hover:text-white transition-colors">Core Features</a>
                        <a href="#bento" className="hover:text-white transition-colors">Platform Hub</a>
                        <a href="#cta" className="hover:text-white transition-colors">Get Started</a>
                    </nav>

                    <div className="flex items-center gap-2">
                        <Link to="/admin/login" className="text-xs text-slate-500 hover:text-white transition-colors px-3 py-2 font-semibold">
                            Admin Portal
                        </Link>
                        <Link to="/login?role=student" className="text-xs font-bold text-slate-400 hover:text-white transition-colors px-4 py-2">
                            Log In
                        </Link>
                        <Link to="/register?role=student" className="px-5 py-2 text-xs font-bold bg-white text-slate-950 rounded-full hover:bg-slate-100 transition-all shadow-md hover:scale-105 active:scale-95">
                            Register
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 pt-44 pb-24 px-6 max-w-6xl mx-auto flex flex-col items-center">
                
                {/* Premium Spinning Tag */}
                <div className="relative p-[1px] rounded-full overflow-hidden inline-flex items-center mb-8 animate-fade-in-up">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-rotate-gradient pointer-events-none" />
                    <div className="relative bg-slate-950/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-indigo-300">
                        ✨ AptiVerse Studio 2.0 is live
                    </div>
                </div>

                {/* Hero Title */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-center max-w-4xl leading-[1.05] mb-8 text-white">
                    Master Technical Placements with{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
                        Adaptive AI Training
                    </span>
                </h1>

                {/* Hero Description */}
                <p className="max-w-2xl text-center text-sm sm:text-base text-slate-400 mb-12 leading-relaxed font-medium">
                    The intelligence-driven platform empowering candidates to crack company assessment tests, and providing institutes with live placement analytical pipelines.
                </p>

                {/* Action Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-24 z-20">
                    <Link to="/register?role=student" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-full transition-all hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:scale-[1.03]">
                        Begin Free Practice
                        <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                    <a href="#bento" className="flex items-center justify-center px-8 py-3.5 bg-slate-900/60 hover:bg-slate-800 border border-white/10 text-slate-300 font-bold text-xs rounded-full transition-all hover:border-white/20">
                        Explore Platform
                    </a>
                </div>

                {/* Platform Overview Bento Grid */}
                <div id="bento" className="w-full space-y-12">
                    
                    {/* Header for Grid */}
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Platform Architecture</h2>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                            Discover how our integrated tools create a continuous loop of learning, competition, and candidate diagnostics.
                        </p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        
                        {/* Bento Item 1: Adaptive Testing (Col-span 2, Row-span 2) */}
                        <div className="lg:col-span-2 bg-slate-950/45 border border-white/15 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between group min-h-[420px]">
                            <div className="absolute top-0 right-0 w-[260px] h-[260px] bg-indigo-500/5 rounded-full blur-[90px] pointer-events-none" />
                            
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                                        <CpuChipIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Adaptive Practice Engine</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Company-Specific Placement Tests</h3>
                                <p className="text-xs text-slate-400 leading-relaxed max-w-md mb-6">
                                    Calibrates question difficulty in real-time based on your responses, mimicking assessments from TCS, Cognizant, and Wipro.
                                </p>
                            </div>

                            {/* Interactive Question Board */}
                            <div className="bg-[#070b19]/90 border border-indigo-500/20 rounded-2xl p-5 shadow-2xl relative">
                                <div className="flex items-center justify-between mb-3 border-b border-indigo-500/10 pb-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                                        <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-widest">Quantitative Analytics</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Difficulty: Medium</span>
                                </div>

                                <p className="text-xs font-bold text-slate-200 leading-relaxed mb-4">
                                    Q1: A train 120m long passes a telegraph post in 6 seconds. Find the speed of the train in km/hr.
                                </p>

                                <div className="grid sm:grid-cols-2 gap-2.5 mb-4">
                                    {[
                                        { key: 'A', text: '60 km/hr' },
                                        { key: 'B', text: '72 km/hr' },
                                        { key: 'C', text: '80 km/hr' },
                                        { key: 'D', text: '90 km/hr' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.key}
                                            onClick={() => handleOptionSelect(opt.key)}
                                            className={`flex items-center gap-2.5 px-3 py-2.5 text-left text-xs font-semibold rounded-lg border transition-all ${
                                                selectedOption === opt.key 
                                                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' 
                                                : 'bg-slate-900/50 border-white/5 text-slate-300 hover:bg-slate-900 hover:border-white/10'
                                            }`}
                                        >
                                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] ${
                                                selectedOption === opt.key ? 'bg-indigo-500 border-indigo-400 text-white' : 'border-slate-700 text-slate-500'
                                            }`}>
                                                {opt.key}
                                            </span>
                                            {opt.text}
                                        </button>
                                    ))}
                                </div>

                                {/* Evaluation panel */}
                                {demoScore && (
                                    <div className={`p-3 rounded-xl border flex gap-2.5 items-start ${
                                        demoScore === 'correct' 
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                                        : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                                    }`}>
                                        <CheckCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
                                        <div className="text-[10px]">
                                            <p className="font-bold">{demoScore === 'correct' ? 'Correct Selection!' : 'Calculated Incorrectly'}</p>
                                            <p className="opacity-85 mt-0.5 leading-relaxed">
                                                {demoScore === 'correct' 
                                                ? 'Calculation: 120m / 6s = 20 m/s. 20 * (18/5) = 72 km/hr.' 
                                                : 'Tip: Speed = Distance / Time. Check the units conversion factor (m/s to km/hr is * 18/5).'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bento Item 2: Study Room (Col-span 1, Row-span 2) */}
                        <div className="bg-slate-950/45 border border-white/15 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between group min-h-[420px]">
                            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400">
                                        <UserGroupIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Live Study Lobbies</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Peer Classrooms</h3>
                                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                    Collaborative study rooms where peers compile answers, coordinate speeds, and compete in friendly sprints.
                                </p>
                            </div>

                            {/* Lobby Mock Panel */}
                            <div className="space-y-2 bg-slate-900/60 border border-white/5 p-4 rounded-2xl">
                                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 block mb-2">Active Rooms</span>
                                {rooms.map((rm) => (
                                    <button 
                                        key={rm.id}
                                        onClick={() => setActiveRoomId(rm.id)}
                                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                                            activeRoomId === rm.id 
                                            ? 'bg-purple-600/10 border-purple-500/30 text-white' 
                                            : 'bg-slate-900/30 border-transparent text-slate-400 hover:bg-slate-900'
                                        }`}
                                    >
                                        <div className="space-y-0.5">
                                            <p className="text-[11px] font-bold text-slate-200">{rm.name}</p>
                                            <p className="text-[9px] opacity-70">Active: {rm.active}/{rm.max} candidates</p>
                                        </div>
                                        <span className="text-[9px] font-medium text-purple-400 shrink-0">{rm.time}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bento Item 3: AI Coach Diagnostics (Col-span 1, Row-span 1) */}
                        <div className="bg-slate-950/45 border border-white/15 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between group min-h-[300px]">
                            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-pink-500/5 rounded-full blur-[80px] pointer-events-none" />

                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-1.5 bg-pink-500/10 rounded-lg text-pink-400">
                                        <SparklesIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Intelligent Mentorship</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">AI Diagnostic Coach</h3>
                                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                    Deep evaluation of your time utilization per category, building custom remedial sprints.
                                </p>
                            </div>

                            {/* Chat Mockup */}
                            <div className="bg-[#0b0713]/80 border border-pink-500/15 p-3 rounded-2xl">
                                {aiStep === 1 ? (
                                    <div className="space-y-2">
                                        <p className="text-[9px] leading-relaxed text-slate-300">
                                            📊 Accuracy in *Permutations & Combinations* is 40%. Ready to boost this section?
                                        </p>
                                        <button 
                                            onClick={startAiSprint}
                                            disabled={aiSprintLoading}
                                            className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-pink-600 hover:bg-pink-500 disabled:bg-pink-850 text-white font-bold text-[9px] rounded-lg transition-all"
                                        >
                                            {aiSprintLoading ? 'Preparing Sprint...' : 'Start 10m Micro-Sprint'}
                                            <ArrowRightIcon className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-[8px] font-bold text-pink-400 uppercase tracking-widest mb-1">
                                            <span>Active Sprint: Question 1</span>
                                            <span>Time: 09:58</span>
                                        </div>
                                        <p className="text-[10px] font-semibold text-slate-200">
                                            How many arrangements can be made out of the letters of the word 'COMMITTEE'?
                                        </p>
                                        <button 
                                            onClick={() => setAiStep(1)} 
                                            className="text-[9px] text-slate-400 hover:text-white underline block"
                                        >
                                            Reset Demo
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bento Item 4: Institution Analytics (Col-span 2, Row-span 1) */}
                        <div className="lg:col-span-2 bg-slate-950/45 border border-white/15 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between group min-h-[300px]">
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400">
                                        <ChartBarIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Institution Control Center</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Classroom Placement Pipelines</h3>
                                <p className="text-xs text-slate-400 leading-relaxed max-w-md mb-6">
                                    Enables college administrations to monitor student groups, assign custom rooms, analyze placement indexes, and drive campus success.
                                </p>
                            </div>

                            {/* Funnel Diagram Mockup */}
                            <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4">
                                {[
                                    { step: 'Trained', count: '1,240', progress: '100%', color: 'from-blue-600/30 to-blue-500/5' },
                                    { step: 'Assessment Cleared', count: '1,080', progress: '87%', color: 'from-indigo-600/30 to-indigo-500/5' },
                                    { step: 'Offers Secured', count: '940', progress: '75%', color: 'from-purple-600/30 to-purple-500/5' }
                                ].map((col, idx) => (
                                    <div key={idx} className={`bg-gradient-to-b ${col.color} border border-white/5 rounded-xl p-3 text-center`}>
                                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{col.step}</span>
                                        <p className="text-sm font-extrabold text-white mt-1">{col.count}</p>
                                        <span className="text-[9px] font-semibold text-slate-400 block mt-1">Index: {col.progress}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Cohesive Core Features Grid */}
                <div id="features" className="w-full mt-36 max-w-5xl">
                    <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Full-Suite Features</h2>
                        <p className="text-xs sm:text-sm text-slate-400">
                            Equipped with high-performance modules engineered for deep technical preparation.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Integrated Study Rooms',
                                desc: 'Peer-to-peer lobbies featuring synchronized timers, live whiteboard options, and shared text compilation boxes.',
                                icon: UserGroupIcon,
                                color: 'text-indigo-400 bg-indigo-500/10'
                            },
                            {
                                title: 'Company Mock Library',
                                desc: 'An extensive archive of mock exams matched to recent placements (TCS Digital, Wipro Elite, Infosys, Capgemini).',
                                icon: BookOpenIcon,
                                color: 'text-purple-400 bg-purple-500/10'
                            },
                            {
                                title: 'AI Study Planners',
                                desc: 'Automated study planners generated based on student weaknesses, adapting goals on the fly to maximize coverage.',
                                icon: SparklesIcon,
                                color: 'text-pink-400 bg-pink-500/10'
                            },
                            {
                                title: 'Real-Time Leaderboards',
                                desc: 'Gamified platform competition displaying global and room ranks, keeping candidates constantly motivated.',
                                icon: ChartBarIcon,
                                color: 'text-blue-400 bg-blue-500/10'
                            },
                            {
                                title: 'Proctored Test Runner',
                                desc: 'Focus tracker detects screen changes, multi-window shifts, and tab leaves to maintain high integrity.',
                                icon: ShieldCheckIcon,
                                color: 'text-emerald-400 bg-emerald-500/10'
                            },
                            {
                                title: 'Institute Analytics Suite',
                                desc: 'Exportable spreadsheets, progress monitoring, batch registration, and classroom analytics for trainers.',
                                icon: CommandLineIcon,
                                color: 'text-amber-400 bg-amber-500/10'
                            }
                        ].map((feat, index) => (
                            <div key={index} className="bg-slate-950/30 border border-white/5 hover:border-indigo-500/20 hover:bg-slate-950/70 p-6 rounded-[20px] transition-all duration-300 group">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${feat.color} group-hover:scale-105 transition-transform`}>
                                    <feat.icon className="w-5.5 h-5.5" />
                                </div>
                                <h4 className="text-xs font-bold text-white mb-2">{feat.title}</h4>
                                <p className="text-[11px] leading-relaxed text-slate-400">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Redesigned Call to Action Selector Cards */}
                <div className="w-full mt-36 max-w-4xl grid md:grid-cols-2 gap-6">
                    {/* Card 1: Students */}
                    <div className="group relative p-8 rounded-3xl bg-slate-950/50 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between">
                        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-3xl" />
                        
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-all">
                                <AcademicCapIcon className="w-6 h-6" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-3">Practice as Candidate</h4>
                            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                                Join active student rooms, analyze your speed index, clear mock sprints, and prepare for placement tests.
                            </p>
                        </div>

                        <div>
                            <Link to="/login?role=student" className="flex items-center justify-between w-full px-5 py-3 bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-md">
                                Candidate Portal
                                <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                            <div className="mt-4 text-center">
                                <Link to="/register?role=student" className="text-[10px] text-slate-500 hover:text-indigo-400 font-semibold transition-colors">
                                    Need a practice account? Create one here &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Institutes */}
                    <div className="group relative p-8 rounded-3xl bg-slate-950/50 border border-white/10 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between">
                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-3xl" />
                        
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-all">
                                <BuildingLibraryIcon className="w-6 h-6" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-3">Host as Institution</h4>
                            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                                Configure mock tests, run class proctored runs, track student performance, and view placement readiness scores.
                            </p>
                        </div>

                        <div>
                            <Link to="/login?role=institute" className="flex items-center justify-between w-full px-5 py-3 bg-purple-650 hover:bg-purple-600 text-white text-xs font-bold rounded-xl transition-all shadow-md">
                                Institution Console
                                <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                            <div className="mt-4 text-center">
                                <Link to="/register?role=institute" className="text-[10px] text-slate-500 hover:text-purple-400 font-semibold transition-colors">
                                    Register your Institute Console &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Interactive CTA Banner */}
                <div id="cta" className="w-full mt-36 max-w-4xl relative p-8 sm:p-12 rounded-3xl overflow-hidden border border-white/10 bg-slate-950/20 backdrop-blur-md text-center flex flex-col items-center">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
                    
                    <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">Accelerate Placement Readiness</h3>
                    <p className="max-w-md text-xs sm:text-sm text-slate-400 mb-8 leading-relaxed">
                        Master the recruitment algorithms. Set up your learning portfolio or configure your classroom pipeline in under 2 minutes.
                    </p>
                    
                    <Link to="/register?role=student" className="px-8 py-3.5 bg-white text-slate-950 text-xs font-bold rounded-full hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-xl">
                        Register Account Now
                    </Link>
                </div>

            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-[#01030b] py-16 px-6 relative z-10">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
                    
                    {/* Brand column */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-indigo-600 rounded-lg">
                                <RocketLaunchIcon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-white text-base">AptiVerse</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
                            AptiVerse is an intelligence-fueled student assessment training ecosystem built to streamline placements and diagnostic metrics.
                        </p>
                    </div>

                    {/* Resources */}
                    <div>
                        <h6 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Navigation</h6>
                        <ul className="space-y-2.5 text-[11px] text-slate-400 font-semibold">
                            <li><a href="#features" className="hover:text-indigo-400 transition-colors">Platform Features</a></li>
                            <li><a href="#bento" className="hover:text-indigo-400 transition-colors">Architecture Hub</a></li>
                            <li><Link to="/login?role=student" className="hover:text-indigo-400 transition-colors">Candidate Terminal</Link></li>
                            <li><Link to="/login?role=institute" className="hover:text-indigo-400 transition-colors">Institute Console</Link></li>
                            <li><Link to="/admin/login" className="hover:text-indigo-400 transition-colors text-slate-500">Admin Terminal</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h6 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Corporate</h6>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            &copy; {new Date().getFullYear()} AptiVerse Inc.<br />
                            Engineered for professional readiness.
                        </p>
                        <div className="flex gap-4 mt-4 text-[10px] text-slate-400">
                            <a href="#" className="hover:underline">Privacy Policy</a>
                            <span>&bull;</span>
                            <a href="#" className="hover:underline">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
