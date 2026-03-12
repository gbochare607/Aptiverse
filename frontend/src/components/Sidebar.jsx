import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    BookOpenIcon,
    ChartBarIcon,
    CalendarIcon,
    UserGroupIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    GiftIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
    BookmarkIcon,
    CheckBadgeIcon,
    TrophyIcon,
    UserCircleIcon,
    BuildingOfficeIcon,
    HashtagIcon,
    PlusIcon
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Library', href: '/library', icon: BookOpenIcon },
    { name: 'Performance', href: '/profile', icon: ChartBarIcon, state: { activeTab: 'performance' } },
    { name: 'Study Planner', href: '/profile', icon: CalendarIcon, state: { activeTab: 'planner' } },
    { name: 'Rewards', href: '/rewards', icon: GiftIcon },
    { name: 'Community', href: '/community', icon: UserGroupIcon },
];

const testNavigation = [
    { name: 'Browse Tests', href: '/tests', icon: BookOpenIcon },
    { name: 'My Attempts', href: '/tests/attempts', icon: ClockIcon },
    { name: 'Performance', href: '/profile', icon: ChartBarIcon, state: { activeTab: 'performance' } },
    { name: 'Saved Questions', href: '/tests/saved', icon: BookmarkIcon },
    { name: 'Completed', href: '/tests/completed', icon: CheckBadgeIcon },
];

const competitionNavigation = [
    { name: 'All Challenges', href: '/competitions', icon: TrophyIcon },
    { name: 'My Registrations', href: '/competitions/registered', icon: UserCircleIcon },
    { name: 'Leaderboards', href: '/competitions/leaderboards', icon: HashtagIcon },
    { name: 'Institutes', href: '/competitions/institutes', icon: BuildingOfficeIcon },
    { name: 'Prizes & Rewards', href: '/rewards', icon: GiftIcon },
];

const instituteNavigation = [
    { name: 'Dashboard', href: '/institute-dashboard', icon: ChartBarIcon },
    { name: 'Create Test', href: '/create-test', icon: PlusIcon }, // Import PlusIcon or use similar
    { name: 'Student Performance', href: '/institute-analytics', icon: UserGroupIcon },
    { name: 'Question Bank', href: '/question-bank', icon: BookOpenIcon },
    { name: 'Settings', href: '/settings', icon: BuildingOfficeIcon },
];

export default function Sidebar() {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    // Determine which navigation to use
    let currentNavigation = navigation;
    if (location.pathname.startsWith('/tests')) {
        currentNavigation = testNavigation;
    } else if (location.pathname.startsWith('/competitions')) {
        currentNavigation = competitionNavigation;
    } else if (location.pathname.startsWith('/institute-dashboard') || location.pathname.startsWith('/create-test')) {
        currentNavigation = instituteNavigation;
    }

    const NavItem = ({ item }) => {
        const isActive = location.pathname.startsWith(item.href);
        return (
            <Link
                to={item.href}
                state={item.state}
                className={`group flex items-center px-4 py-3 text-sm font-bold dark:font-medium rounded-xl transition-all relative ${isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                    : 'bg-indigo-100/40 dark:bg-gray-800 text-slate-900 dark:text-gray-300 hover:bg-indigo-600/10 dark:hover:bg-gray-700 hover:text-indigo-600 border border-white/80 dark:border-transparent shadow-sm'
                    } ${collapsed ? 'justify-center' : ''}`}
            >
                <div className={`${collapsed ? '' : 'mr-3'} p-1.5 rounded-lg ${isActive ? 'bg-indigo-500' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-indigo-100'}`}>
                    <item.icon className="w-5 h-5" />
                </div>

                {!collapsed && (
                    <span className="whitespace-nowrap overflow-hidden transition-all duration-200">
                        {item.name}
                    </span>
                )}

                {/* Tooltip for collapsed state */}
                {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                        {item.name}
                    </div>
                )}
            </Link>
        );
    };

    return (
        <div
            className={`${collapsed ? 'w-20' : 'w-64'} bg-indigo-50/5 dark:bg-gray-900 border-r border-white/40 dark:border-gray-800 flex flex-col pt-4 pb-4 transition-all duration-300 ease-in-out backdrop-blur-2xl`}
        >
            {/* Collapse Button - Top of Sidebar */}
            <div className={`px-4 mb-6 transition-all duration-300 ${collapsed ? 'flex justify-center' : ''}`}>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center justify-center w-full py-2 bg-indigo-600/10 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-600/20 dark:hover:bg-indigo-900/40 transition-colors border border-white/40 dark:border-transparent"
                >
                    {collapsed ? (
                        <ChevronRightIcon className="w-5 h-5" />
                    ) : (
                        <>
                            <ChevronLeftIcon className="w-5 h-5 mr-1" />
                            <span className="text-sm font-bold dark:font-medium uppercase tracking-wide">Collapse</span>
                        </>
                    )}
                </button>
            </div>

            {/* Navigation (Study Tools only) */}
            <nav className="flex-1 px-4 space-y-2">
                {currentNavigation.map((item) => (
                    <NavItem key={item.name} item={item} />
                ))}
            </nav>
        </div>
    );
}
