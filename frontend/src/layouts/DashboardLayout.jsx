import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-gray-900 transition-colors">
            <Sidebar />
            <div className="flex flex-col flex-1 w-0 overflow-hidden">
                <Navbar />
                <main className="flex-1 relative overflow-y-auto focus:outline-none scrollbar-hide">
                    <div className="py-6">
                        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
