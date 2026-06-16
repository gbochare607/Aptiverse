import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function DashboardLayout() {
    const location = useLocation();
    const { user } = useUser();
    const role = (user?.publicMetadata?.role || user?.unsafeMetadata?.role || '').toLowerCase();

    // Determine if institute globally
    const isInstitute = role === 'institute' || localStorage.getItem('userRole') === 'institute';

    // Base hidden paths
    const hideSidebarPaths = [
        '/practice',
        '/company-practice',
        '/exam-practice',
        '/soft-skills',
        '/profile',
        '/institute-dashboard',
        '/institute/test-rooms',
        '/institute/competitions',
        '/create-test'
    ];

    // If institute, hide the generic student paths
    if (isInstitute) {
        hideSidebarPaths.push('/competitions');
        hideSidebarPaths.push('/tests');
    }

    const shouldHideSidebar = hideSidebarPaths.includes(location.pathname) || location.pathname.startsWith('/institute/room/');

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-transparent dark:bg-gray-900 transition-colors">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                {!shouldHideSidebar && <Sidebar />}
                <main className="flex-1 relative overflow-y-auto focus:outline-none scrollbar-hide">
                    <div className="relative">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
