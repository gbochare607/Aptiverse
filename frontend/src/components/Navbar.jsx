import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { BellIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    return (
        <div className="h-20 bg-white dark:bg-gray-900 flex items-center justify-between px-8 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-20">
            {/* Brand */}
            <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-indigo-200 dark:shadow-none">
                    <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">AptiVerse</span>
            </div>

            {/* Center Navigation Pills - Only visible if signed in usually, or public links */}
            <SignedIn>
                <div className="hidden md:flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full space-x-1">
                    <Link to="/dashboard" className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${location.pathname === '/dashboard'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600'
                        }`}>
                        Dashboard
                    </Link>
                    <Link to="/competitions" className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${location.pathname === '/competitions'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600'
                        }`}>
                        Competitions
                    </Link>
                    <Link to="/tests" className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${location.pathname === '/tests'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600'
                        }`}>
                        Test Room
                    </Link>
                </div>
            </SignedIn>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
                <button onClick={toggleTheme} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                    {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
                </button>

                <SignedIn>
                    <button className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                        <BellIcon className="w-6 h-6" />
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                    </button>

                    <div className="ml-4">
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </SignedIn>

                <SignedOut>
                    <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                        Sign In
                    </Link>
                </SignedOut>
            </div>
        </div>
    );
}
