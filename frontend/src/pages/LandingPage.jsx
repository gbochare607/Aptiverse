import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    RocketLaunchIcon,
    AcademicCapIcon,
    ChartBarIcon,
    BuildingLibraryIcon,
    UserGroupIcon,
    CheckBadgeIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

const Background = () => (
    <div className="absolute inset-0 z-0 overflow-hidden text-neutral-900/10 dark:text-neutral-100/10 pointer-events-none">
        <svg className="absolute top-0 right-0 w-[100%] h-[100%] -translate-y-1/2 translate-x-1/2 opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
                <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="currentColor" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]" />
    </div>
);

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-indigo-500/30 font-sans">
            <Background />

            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/20">
                            <RocketLaunchIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            AptiVerse
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
                        <a href="#about" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">About</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="hidden md:flex text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Log In
                        </Link>
                        <Link to="/register" className="px-5 py-2.5 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center text-center mb-16">

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in-up">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            Next Gen Aptitude Training
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                            Master Your Future with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
                                Artificial Intelligence
                            </span>
                        </h1>

                        <p className="max-w-2xl text-lg text-gray-400 mb-10 leading-relaxed">
                            The ultimate platform for students to excel in career assessments and for institutes to drive placement success through data-driven insights.
                        </p>
                    </div>

                    {/* Dual Login/Entry Options */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-24">
                        {/* Student Card */}
                        <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-2xl" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                                    <AcademicCapIcon className="w-7 h-7" />
                                </div>
                                <h2 className="text-2xl font-bold mb-3">For Students</h2>
                                <p className="text-gray-400 mb-8 flex-grow">
                                    Adaptive practice tests, AI-driven performance analysis, and personalized learning paths to crack your dream job.
                                </p>
                                <Link to="/login?role=student" className="flex items-center justify-between w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition-all group-hover:shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                                    Student Login
                                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <div className="mt-4 text-center">
                                    <Link to="/register" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">
                                        New here? Create Account
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Institute Card */}
                        <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-2xl" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                                    <BuildingLibraryIcon className="w-7 h-7" />
                                </div>
                                <h2 className="text-2xl font-bold mb-3">For Institutes</h2>
                                <p className="text-gray-400 mb-8 flex-grow">
                                    Comprehensive dashboards, student tracking, bulk test creation, and placement analytics to boost success rates.
                                </p>
                                <Link to="/login?role=institute" className="flex items-center justify-between w-full px-6 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition-all group-hover:shadow-[0_0_30px_rgba(147,51,234,0.3)]">
                                    Institute Login
                                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <div className="mt-4 text-center">
                                    <span className="text-sm text-gray-500 cursor-not-allowed">
                                        Request Access
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats / Social Proof */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-white/5 bg-white/[0.01]">
                        <StatItem label="Active Students" value="10k+" />
                        <StatItem label="Questions Attempted" value="1M+" />
                        <StatItem label="Partner Institutes" value="50+" />
                        <StatItem label="Success Rate" value="92%" />
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-[#050505] py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <RocketLaunchIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-400 font-semibold">AptiVerse</span>
                    </div>
                    <div className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} AptiVerse Inc. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function StatItem({ value, label }) {
    return (
        <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">{label}</div>
        </div>
    );
}
