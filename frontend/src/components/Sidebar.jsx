import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    BookOpenIcon,
    ChartBarIcon,
    CalendarIcon,
    TrophyIcon,
    UserGroupIcon,
    ChevronLeftIcon
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Library', href: '/library', icon: BookOpenIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Study Planner', href: '/planner', icon: CalendarIcon },
    { name: 'Rewards', href: '/rewards', icon: TrophyIcon },
    { name: 'Community', href: '/community', icon: UserGroupIcon },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col pt-4 pb-4">
            {/* Back Button / Collapse */}
            <div className="px-4 mb-6">
                <button className="flex items-center justify-center w-full py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
                    <ChevronLeftIcon className="w-5 h-5 mr-1" />
                    <span className="text-sm font-medium">Collapse</span>
                </button>
            </div>

            <div className="px-6 mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Study Tools</p>
                <p className="text-xs text-gray-400 mb-4">Quick access</p>
            </div>

            <nav className="flex-1 px-4 space-y-3">
                {navigation.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActive
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600'
                                }`}
                        >
                            <div className={`mr-3 p-1.5 rounded-lg ${isActive ? 'bg-indigo-500' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-indigo-100'}`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom User or Info */}
        </div>
    );
}
