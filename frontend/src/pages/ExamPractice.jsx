import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '@clerk/clerk-react';
import {
    AcademicCapIcon,
    ArrowRightIcon,
    BookOpenIcon,
    BriefcaseIcon,
    MagnifyingGlassIcon,
    ScaleIcon,
    BanknotesIcon,
    BuildingLibraryIcon,
    ComputerDesktopIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';

const exams = [
    {
        id: 'cat',
        name: 'CAT',
        description: 'Common Admission Test for MBA',
        icon: AcademicCapIcon,
        color: 'bg-indigo-500',
        textColor: 'text-indigo-400',
        borderColor: 'border-indigo-500/20',
        gradient: 'from-indigo-500/20 to-blue-500/20'
    },
    {
        id: 'gate',
        name: 'GATE',
        description: 'Graduate Aptitude Test in Engineering',
        icon: ComputerDesktopIcon,
        color: 'bg-blue-500',
        textColor: 'text-blue-400',
        borderColor: 'border-blue-500/20',
        gradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
        id: 'upsc',
        name: 'UPSC CSAT',
        description: 'Civil Services Aptitude Test',
        icon: ScaleIcon,
        color: 'bg-amber-500',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/20',
        gradient: 'from-amber-500/20 to-orange-500/20'
    },
    {
        id: 'banking',
        name: 'Banking Exams',
        description: 'IBPS, SBI PO & Clerk Prep',
        icon: BanknotesIcon,
        color: 'bg-emerald-500',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/20',
        gradient: 'from-emerald-500/20 to-green-500/20'
    },
    {
        id: 'gre',
        name: 'GRE',
        description: 'Graduate Record Examination',
        icon: GlobeAltIcon,
        color: 'bg-purple-500',
        textColor: 'text-purple-400',
        borderColor: 'border-purple-500/20',
        gradient: 'from-purple-500/20 to-fuchsia-500/20'
    },
    {
        id: 'gmat',
        name: 'GMAT',
        description: 'Graduate Management Admission Test',
        icon: BuildingLibraryIcon,
        color: 'bg-rose-500',
        textColor: 'text-rose-400',
        borderColor: 'border-rose-500/20',
        gradient: 'from-rose-500/20 to-pink-500/20'
    },
    {
        id: 'ssc',
        name: 'SSC CGL',
        description: 'Staff Selection Commission Exams',
        icon: BriefcaseIcon,
        color: 'bg-orange-500',
        textColor: 'text-orange-400',
        borderColor: 'border-orange-500/20',
        gradient: 'from-orange-500/20 to-yellow-500/20'
    },
    {
        id: 'sat',
        name: 'SAT',
        description: 'Scholastic Assessment Test',
        icon: BookOpenIcon,
        color: 'bg-cyan-500',
        textColor: 'text-cyan-400',
        borderColor: 'border-cyan-500/20',
        gradient: 'from-cyan-500/20 to-teal-500/20'
    },
    {
        id: 'placements',
        name: 'Placement Papers',
        description: 'Common College Placement Aptitude',
        icon: AcademicCapIcon,
        color: 'bg-slate-500',
        textColor: 'text-slate-400',
        borderColor: 'border-slate-500/20',
        gradient: 'from-slate-500/20 to-gray-500/20'
    }
];

export default function ExamPractice() {
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const startExamSession = async (examId) => {
        setLoading(true);
        try {
            const token = await getToken();
            if (!token) {
                alert('Session expired. Please sign in again.');
                return;
            }

            const config = {
                testType: 'practice',
                count: 30,
                duration: 0,
                difficulty: 0.5,
                topic: '', // Global
                exam: examId
            };

            const res = await api.post('/tests/start', config, { headers: { Authorization: `Bearer ${token}` } });

            if (res.data && res.data.attemptId) {
                navigate(`/test/${res.data.attemptId}`);
            } else {
                alert("Could not start session. Please try again.");
            }
        } catch (err) {
            console.error("Error starting exam session:", err);
            alert('Failed to start session. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredExams = exams.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen py-10 relative overflow-hidden transition-colors duration-500">
            {/* HYPER-COLORFUL Background Blobs for Light Mode - Deep/Subtle in Dark Mode */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-purple-400/30 dark:bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-indigo-400/30 dark:bg-indigo-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-[20%] w-[40%] h-[40%] bg-blue-400/20 dark:bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-white/10 rounded-xl transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-3xl font-black dark:font-bold text-slate-900 dark:text-white tracking-tight">Exam Oriented Practice</h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1 font-medium">Specialized Prep for GATE, CAT, UPSC, and Banking exams</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search exams (CAT, GATE...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-white/10 rounded-xl leading-5 bg-white/50 dark:bg-white/5 text-slate-900 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:border-purple-500/50 dark:focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 sm:text-sm transition-all shadow-sm dark:shadow-lg"
                        />
                    </div>
                </div>

                {/* Exam Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredExams.map((exam) => (
                        <div key={exam.id} className="group relative">
                            {/* Hover Gradient Effect */}
                            <div className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${exam.gradient} opacity-0 group-hover:opacity-100 blur transition duration-500`} />

                            <button
                                onClick={() => startExamSession(exam.id)}
                                disabled={loading}
                                className="relative w-full text-left bg-gradient-to-br from-white/70 to-white/40 dark:from-white/10 dark:to-white/5 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/60 dark:border-white/10 hover:border-purple-500/40 dark:hover:border-white/10 transition-all duration-300 group-hover:translate-y-[-5px] h-full flex flex-col shadow-2xl"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-4 rounded-2xl ${exam.color}/10 border ${exam.borderColor} ${exam.textColor}`}>
                                        <exam.icon className="w-8 h-8" />
                                    </div>
                                    <div className="p-2 rounded-full bg-slate-100 dark:bg-white/5 group-hover:bg-indigo-50 dark:group-hover:bg-white/10 transition-colors">
                                        <ArrowRightIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-white" />
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <h3 className="text-xl font-bold dark:font-semibold text-slate-900 dark:text-white mb-1">{exam.name}</h3>
                                    <p className="text-sm text-slate-900 dark:text-slate-400 font-medium">{exam.description}</p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                    <span>30 Questions</span>
                                    <span className={`${exam.textColor} font-black`}>Start Test</span>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Loading Overlay */}
                {loading && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                            <p className="text-white font-medium">Preparing your exam...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
