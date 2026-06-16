import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    UserGroupIcon, 
    BuildingOfficeIcon, 
    ClipboardDocumentListIcon, 
    ClockIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchStats = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get('/admin/dashboard');
            setStats(data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login', { replace: true });
            } else {
                setError('Failed to fetch dashboard stats.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    <span className="text-xs text-slate-400 font-bold">Synchronizing Terminal...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center">
                <p className="text-sm font-bold text-rose-400">{error}</p>
                <button onClick={fetchStats} className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-all">
                    Retry Sync
                </button>
            </div>
        );
    }

    const cards = [
        { title: 'Total Candidates', value: stats.totalStudents, icon: UserGroupIcon, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
        { title: 'Registered Institutes', value: stats.totalInstitutes, icon: BuildingOfficeIcon, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
        { title: 'Aptitude Tests', value: stats.totalTests, icon: ClipboardDocumentListIcon, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
        { title: 'Total Attempts', value: stats.totalAttempts, icon: ClockIcon, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    ];

    return (
        <div className="space-y-8">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">System Diagnostics</h1>
                    <p className="text-xs text-slate-400 mt-1">Platform overview metrics and database counts</p>
                </div>
                <button 
                    onClick={fetchStats} 
                    className="p-2 bg-slate-950 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold"
                >
                    <ArrowPathIcon className="w-4 h-4 shrink-0" />
                    Refresh Stats
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{card.title}</span>
                            <h3 className="text-2xl font-black text-white">{card.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl border ${card.color}`}>
                            <card.icon className="w-6 h-6 shrink-0" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Analytics Rows */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Analytics card: Activities */}
                <div className="lg:col-span-2 bg-slate-950/45 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-white mb-4">Classroom Engagements</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900 border border-white/5 rounded-xl p-4 text-center">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Active Study Rooms</span>
                            <p className="text-xl font-extrabold text-white mt-1">{stats.totalRooms}</p>
                            <span className="text-[10px] text-slate-500 block mt-1">Live lobbies</span>
                        </div>
                        <div className="bg-slate-900 border border-white/5 rounded-xl p-4 text-center">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Completed Sprints</span>
                            <p className="text-xl font-extrabold text-white mt-1">{stats.completedAttempts}</p>
                            <span className="text-[10px] text-slate-500 block mt-1">Evaluated items</span>
                        </div>
                    </div>
                </div>

                {/* Quick actions panel */}
                <div className="bg-slate-950/45 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-white mb-2">Shortcut Actions</h3>
                        <p className="text-[10px] text-slate-400 leading-relaxed mb-4">Quick navigation tools for administration control.</p>
                    </div>
                    <div className="space-y-2">
                        <button onClick={() => navigate('/admin/students')} className="w-full text-left px-4 py-2.5 bg-slate-900 border border-white/5 hover:border-indigo-500/20 text-xs font-bold rounded-xl text-slate-200 transition-all">
                            Manage Candidates &rarr;
                        </button>
                        <button onClick={() => navigate('/admin/institutes')} className="w-full text-left px-4 py-2.5 bg-slate-900 border border-white/5 hover:border-purple-500/20 text-xs font-bold rounded-xl text-slate-200 transition-all">
                            Manage Institutes &rarr;
                        </button>
                        <button onClick={() => navigate('/admin/tests')} className="w-full text-left px-4 py-2.5 bg-slate-900 border border-white/5 hover:border-blue-500/20 text-xs font-bold rounded-xl text-slate-200 transition-all">
                            Manage Test Bank &rarr;
                        </button>
                    </div>
                </div>

            </div>

            {/* Recent Registrations Table */}
            <div className="bg-slate-950/45 border border-white/5 rounded-2xl p-6">
                <div className="mb-4">
                    <h3 className="text-sm font-bold text-white">Recent Accounts Created</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">List of the last 5 users registered on the platform</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                <th className="pb-3 pl-2">Name</th>
                                <th className="pb-3">Email</th>
                                <th className="pb-3">Role</th>
                                <th className="pb-3 text-right pr-2">Date Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs">
                            {stats.recentRegistrations.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center text-slate-500 text-xs">No recent accounts.</td>
                                </tr>
                            ) : (
                                stats.recentRegistrations.map((user, idx) => (
                                    <tr key={idx} className="hover:bg-slate-900/40">
                                        <td className="py-3.5 pl-2 font-bold text-slate-200">{user.name}</td>
                                        <td className="py-3.5 text-slate-400">{user.email}</td>
                                        <td className="py-3.5">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                user.role === 'institute' 
                                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                                                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3.5 text-right pr-2 text-slate-500 text-[11px]">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
