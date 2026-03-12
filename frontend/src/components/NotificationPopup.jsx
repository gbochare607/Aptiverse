import React from 'react';
import {
    XMarkIcon,
    BellAlertIcon,
    AcademicCapIcon,
    TrophyIcon,
    SparklesIcon,
    BellIcon
} from '@heroicons/react/24/outline';

const notifications = [
    {
        id: 1,
        title: "Mock Test Scheduled",
        desc: "New Quantitative Aptitude mock test is live. Challenge yourself now!",
        time: "2 mins ago",
        icon: BellAlertIcon,
        color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400",
        unread: true
    },
    {
        id: 2,
        title: "Performance Milestone",
        desc: "Congratulations! You've improved your Verbal Reasoning score by 15%.",
        time: "1 hour ago",
        icon: TrophyIcon,
        color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400",
        unread: true
    },
    {
        id: 3,
        title: "New Subtopic Added",
        desc: "Check out the new 'Syllogism' subtopic in Logical Reasoning section.",
        time: "5 hours ago",
        icon: AcademicCapIcon,
        color: "text-violet-600 bg-violet-50 dark:bg-violet-900/30 dark:text-violet-400",
        unread: false
    },
    {
        id: 4,
        title: "AI Analysis Ready",
        desc: "Your detailed performance report for the last mock test is ready to view.",
        time: "Yesterday",
        icon: SparklesIcon,
        color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400",
        unread: false
    }
];

export default function NotificationPopup({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            {/* Backdrop with Blur */}
            <div
                className="absolute inset-0 bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
                onClick={onClose}
            ></div>

            {/* Popup Container (Floating Card Style) */}
            <div className="absolute top-20 right-8 w-[min(400px,90vw)] max-h-[min(600px,calc(100vh_-_120px))] z-[101] flex flex-col animate-in zoom-in-95 slide-in-from-top-2 origin-top-right duration-300">
                <div className="flex-1 bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/60 dark:border-white/10 overflow-hidden flex flex-col">

                    {/* Header - Gradient style matching AI Chat */}
                    <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                <BellIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm tracking-tight">Notifications</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] text-white/70 font-medium font-mono uppercase tracking-wider">Live Updates</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white/80 hover:text-white"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`group p-4 rounded-3xl transition-all duration-200 cursor-pointer flex items-start gap-3 relative border ${notif.unread
                                    ? 'bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-100/50 dark:border-indigo-500/10'
                                    : 'bg-white dark:bg-white/5 border-transparent hover:border-gray-100 dark:hover:border-white/5'
                                    }`}
                            >
                                <div className={`p-2.5 rounded-xl flex-shrink-0 ${notif.color}`}>
                                    <notif.icon className="w-5 h-5" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate pr-2">
                                            {notif.title}
                                        </h4>
                                        <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap">
                                            {notif.time}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 font-medium">
                                        {notif.desc}
                                    </p>
                                </div>

                                {notif.unread && (
                                    <div className="absolute top-4 right-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5">
                        <button
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-[0.98]"
                            onClick={onClose}
                        >
                            Mark all as read
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
