import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
    ChartBarIcon, 
    UserGroupIcon, 
    BuildingOfficeIcon, 
    ClipboardDocumentListIcon, 
    ArrowLeftStartOnRectangleIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login', { replace: true });
    };

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: ChartBarIcon },
        { name: 'Students', href: '/admin/students', icon: UserGroupIcon },
        { name: 'Institutes', href: '/admin/institutes', icon: BuildingOfficeIcon },
        { name: 'Tests', href: '/admin/tests', icon: ClipboardDocumentListIcon },
    ];

    const NavLink = ({ item }) => {
        const isActive = location.pathname === item.href;
        return (
            <Link
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all ${
                    isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
            >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.name}
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex relative overflow-hidden font-sans">
            
            {/* Background glowing spheres */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] pointer-events-none" />
            </div>

            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-64 bg-slate-950/80 backdrop-blur-xl border-r border-white/5 relative z-10 shrink-0">
                <div className="h-20 border-b border-white/5 flex items-center px-6 gap-3 shrink-0">
                    <div className="p-1.5 bg-indigo-600 rounded-lg">
                        <span className="text-white font-extrabold text-sm tracking-widest">A</span>
                    </div>
                    <div>
                        <span className="font-extrabold text-white text-sm tracking-wider">AptiVerse</span>
                        <span className="block text-[9px] text-indigo-400 font-bold tracking-widest uppercase">Admin Terminal</span>
                    </div>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-1.5">
                    {navigation.map((item) => (
                        <NavLink key={item.name} item={item} />
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5 shrink-0">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                    >
                        <ArrowLeftStartOnRectangleIcon className="w-5 h-5 shrink-0" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header Bar */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                <header className="lg:hidden h-16 bg-slate-950/90 border-b border-white/5 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-1 bg-indigo-600 rounded-md">
                            <span className="text-white font-extrabold text-xs">A</span>
                        </div>
                        <span className="font-bold text-white text-sm">AptiVerse Admin</span>
                    </div>

                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg border border-white/5"
                    >
                        <Bars3Icon className="w-5 h-5" />
                    </button>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-5xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/40 backdrop-blur-sm">
                    <div className="w-64 bg-slate-950 border-r border-white/10 flex flex-col justify-between animate-fade-in">
                        <div>
                            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6">
                                <span className="font-bold text-white text-sm">Admin Controls</span>
                                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <nav className="p-4 space-y-1">
                                {navigation.map((item) => (
                                    <NavLink key={item.name} item={item} />
                                ))}
                            </nav>
                        </div>

                        <div className="p-4 border-t border-white/10">
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                            >
                                <ArrowLeftStartOnRectangleIcon className="w-5 h-5 shrink-0" />
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
