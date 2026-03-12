import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function QuestionCard({ question, selectedOption, onSelect, isPractice, correctAnswer }) {
    if (!question) return null;

    return (
        <div className="relative group">
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-[#0f172a]/95 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                {question.topics?.[0] || 'Aptitude'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${question.difficulty > 0.6
                                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                }`}>
                                {question.difficulty > 0.6 ? 'Genius' : 'Rookie'}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white leading-relaxed tracking-tight pr-4">
                            {question.text}
                        </h3>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <SparklesIcon className="w-6 h-6 text-indigo-400/50" />
                    </div>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options.map((option) => {
                        let statusColor = 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10';
                        let icon = null;

                        if (selectedOption !== null && selectedOption !== undefined) {
                            if (isPractice) {
                                // Practice Mode Logic
                                if (option.id === correctAnswer) {
                                    statusColor = 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]';
                                    icon = <CheckCircleIcon className="w-5 h-5 text-emerald-400" />;
                                } else if (selectedOption === option.id) {
                                    statusColor = 'bg-red-500/20 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]';
                                    icon = <XCircleIcon className="w-5 h-5 text-red-400" />;
                                } else {
                                    statusColor = 'opacity-50';
                                }
                            } else {
                                // Test Mode Logic (Just highlight selected)
                                if (selectedOption === option.id) {
                                    statusColor = 'bg-indigo-600 border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.3)]';
                                }
                            }
                        }

                        const hasSelected = selectedOption !== null && selectedOption !== undefined;

                        // Default styles
                        let badgeStyle = 'bg-white/10 text-slate-400 group-hover/opt:bg-white/20 group-hover/opt:text-white';
                        let textStyle = 'text-slate-300 group-hover/opt:text-white';

                        if (hasSelected) {
                            if (isPractice) {
                                if (option.id === correctAnswer) {
                                    badgeStyle = 'bg-emerald-500 text-white';
                                    textStyle = 'text-white';
                                } else if (selectedOption === option.id) {
                                    badgeStyle = 'bg-red-500 text-white';
                                    textStyle = 'text-white';
                                }
                            } else {
                                if (selectedOption === option.id) {
                                    badgeStyle = 'bg-white text-indigo-600';
                                    textStyle = 'text-white';
                                }
                            }
                        } else if (selectedOption === option.id) {
                            // Fallback for immediate click visual before logic (though handled above)
                            badgeStyle = 'bg-white text-indigo-600';
                            textStyle = 'text-white';
                        }

                        return (
                            <button
                                key={option.id}
                                onClick={() => !selectedOption && onSelect(option.id)} // Disable changing answer in practice after selection if desired, or allow change? 
                                // Taking "immediate feedback" usually implies "lock" or just "show". 
                                // Let's keep it simple: allow selection, but once selected, show colors.
                                className={`group/opt relative text-left p-5 rounded-2xl transition-all duration-300 transform border ${statusColor}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-colors shadow-inner ${badgeStyle}`}>
                                        {String.fromCharCode(64 + option.id)}
                                    </div>
                                    <span className={`text-sm font-semibold transition-colors flex-1 ${textStyle}`}>
                                        {option.text}
                                    </span>
                                    {icon}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
