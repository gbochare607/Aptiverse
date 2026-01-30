import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Outlet, useLocation } from 'react-router-dom';

export default function DashboardLayout() {
    const location = useLocation();
    const isPracticePage = location.pathname === '/practice';

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-gray-900 transition-colors">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                {!isPracticePage && <Sidebar />}
                <main className={`flex-1 relative overflow-y-auto focus:outline-none scrollbar-hide ${isPracticePage ? 'w-full' : ''}`}>
                    <div className="py-6">
                        <div className={`px-4 mx-auto max-w-7xl sm:px-6 md:px-8 ${isPracticePage ? 'max-w-none' : ''}`}>
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
