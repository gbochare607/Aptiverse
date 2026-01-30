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
    HashtagIcon
} from '@heroicons/react/24/outline';

const defaultNavigation = [
    { name: 'Library', href: '/library', icon: BookOpenIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Study Planner', href: '/planner', icon: CalendarIcon },
    { name: 'Rewards', href: '/rewards', icon: GiftIcon },
    { name: 'Community', href: '/community', icon: UserGroupIcon },
];

const testNavigation = [
    { name: 'Browse Tests', href: '/tests', icon: BookOpenIcon },
    { name: 'My Attempts', href: '/tests/attempts', icon: ClockIcon },
    { name: 'Performance', href: '/analytics', icon: ChartBarIcon }, // Reuse analytics
    { name: 'Saved Questions', href: '/tests/saved', icon: BookmarkIcon },
    { name: 'Completed', href: '/tests/completed', icon: CheckBadgeIcon },
];

const competitionNavigation = [
    { name: 'All Challenges', href: '/competitions', icon: TrophyIcon },
    { name: 'My Registrations', href: '/competitions/registered', icon: UserCircleIcon },
    { name: 'Leaderboards', href: '/competitions/leaderboards', icon: HashtagIcon },
    { name: 'Institutes', href: '/competitions/institutes', icon: BuildingOfficeIcon },
    { name: 'Prizes & Rewards', href: '/rewards', icon: GiftIcon }, // Reuse rewards
];

export default function Sidebar() {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    // Determine which navigation to use
    let navigation = defaultNavigation;
    if (location.pathname.startsWith('/tests')) {
        navigation = testNavigation;
    } else if (location.pathname.startsWith('/competitions')) {
        navigation = competitionNavigation;
    }

    const NavItem = ({ item }) => {
        const isActive = location.pathname.startsWith(item.href);
        return (
            <Link
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all relative ${isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600'
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
            className={`${collapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col pt-4 pb-4 transition-all duration-300 ease-in-out`}
        >
            {/* Collapse Button - Top of Sidebar */}
            <div className={`px-4 mb-6 transition-all duration-300 ${collapsed ? 'flex justify-center' : ''}`}>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center justify-center w-full py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                >
                    {collapsed ? (
                        <ChevronRightIcon className="w-5 h-5" />
                    ) : (
                        <>
                            <ChevronLeftIcon className="w-5 h-5 mr-1" />
                            <span className="text-sm font-medium">Collapse</span>
                        </>
                    )}
                </button>
            </div>

            {/* Navigation (Study Tools only) */}
            <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => (
                    <NavItem key={item.name} item={item} />
                ))}
            </nav>
        </div>
    );
}
