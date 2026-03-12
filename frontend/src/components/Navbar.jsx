import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { BellIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserButton, SignedIn, SignedOut, SignInButton, useUser } from '@clerk/clerk-react';
import { ChartBarIcon, CpuChipIcon, ClockIcon } from '@heroicons/react/24/outline';
import NotificationPopup from './NotificationPopup';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    return (
        <>
            <div className="h-20 bg-indigo-50/30 dark:bg-[#020617]/80 backdrop-blur-3xl flex items-center justify-between px-8 border-b border-white/60 dark:border-white/10 shadow-sm sticky top-0 z-20 transition-all">
                {/* Brand */}
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-indigo-300 dark:shadow-none">
                        <span className="text-white font-bold text-xl">A</span>
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">AptiVerse</span>
                </div>

                {/* Center Navigation Pills - Only visible if signed in usually, or public links */}
                <SignedIn>
                    <div className="hidden md:flex bg-indigo-100/50 dark:bg-gray-800 p-1 rounded-full space-x-1 border border-white/40 dark:border-transparent backdrop-blur-md">
                        <Link 
                            to={user?.publicMetadata?.role === 'institute' ? '/institute-dashboard' : '/dashboard'} 
                            className={`px-6 py-2 rounded-full text-sm font-bold dark:font-medium transition-all ${(location.pathname === '/dashboard' || location.pathname === '/institute-dashboard')
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                            : 'text-slate-900 dark:text-gray-300 hover:text-indigo-600'
                            }`}>
                            Dashboard
                        </Link>
                        <Link 
                            to={user?.publicMetadata?.role === 'institute' ? '/institute/competitions' : '/competitions'} 
                            className={`px-6 py-2 rounded-full text-sm font-bold dark:font-medium transition-all ${(location.pathname === '/competitions' || location.pathname === '/institute/competitions')
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                            : 'text-slate-900 dark:text-gray-300 hover:text-indigo-600'
                            }`}>
                            Competitions
                        </Link>
                        <Link 
                            to={user?.publicMetadata?.role === 'institute' ? '/institute/test-rooms' : '/tests'} 
                            className={`px-6 py-2 rounded-full text-sm font-bold dark:font-medium transition-all ${(location.pathname === '/tests' || location.pathname.startsWith('/institute/room') || location.pathname === '/institute/test-rooms')
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                            : 'text-slate-900 dark:text-gray-300 hover:text-indigo-600'
                            }`}>
                            Test Room
                        </Link>
                    </div>
                </SignedIn>

                {/* Right Actions */}
                <div className="flex items-center space-x-4">
                    <SignedIn>
                        <div className="hidden sm:flex items-center px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50">
                            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
                                {user?.publicMetadata?.role === 'institute' ? 'Institute' : 'Student'}
                            </span>
                        </div>
                    </SignedIn>

                    <button onClick={toggleTheme} className="p-2 text-slate-800 dark:text-gray-400 hover:text-indigo-600 transition-colors">
                        {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
                    </button>

                    <SignedIn>
                        <button
                            onClick={() => setIsNotificationsOpen(true)}
                            className="relative p-2 text-slate-800 dark:text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                            <BellIcon className="w-6 h-6" />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                        </button>

                        <div className="ml-4">
                            <Link to="/profile" className="block relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                                <img
                                    src={user?.imageUrl}
                                    alt="Profile"
                                    className="relative w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 shadow-md group-hover:scale-105 transition-transform duration-300 object-cover"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                            </Link>
                        </div>
                    </SignedIn>

                    <SignedOut>
                        <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                            Sign In
                        </Link>
                    </SignedOut>
                </div>
            </div>

            {/* Notification Popup with Backdrop */}
            <NotificationPopup
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
            />
        </>
    );
}
