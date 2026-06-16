import React, { useEffect, useState } from 'react';
import { 
    UserIcon, 
    TrashIcon, 
    XMarkIcon,
    MagnifyingGlassIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

export default function AdminStudents() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Detail Panel state
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [attempts, setAttempts] = useState([]);

    const fetchStudents = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get(`/admin/students?search=${search}`);
            setStudents(data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch students.');
        } finally {
            setLoading(false);
        }
    };

    const fetchDetails = async (id) => {
        setDetailLoading(true);
        try {
            const { data } = await api.get(`/admin/students/${id}`);
            setSelectedStudent(data.student);
            setAttempts(data.attempts);
        } catch (err) {
            alert('Failed to load student details.');
        } finally {
            setDetailLoading(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
        if (!window.confirm(`Are you sure you want to set this candidate status to ${newStatus}?`)) return;
        
        try {
            await api.put(`/admin/students/${id}/status`, { status: newStatus });
            // Refresh
            fetchStudents();
            if (selectedStudent && selectedStudent._id === id) {
                setSelectedStudent(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            alert('Failed to update student status.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('WARNING: Deleting this candidate will permanently delete their account and attempts from MongoDB. Proceed?')) return;
        
        try {
            await api.delete(`/admin/students/${id}`);
            fetchStudents();
            setSelectedStudent(null);
        } catch (err) {
            alert('Failed to delete student.');
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [search]);

    return (
        <div className="space-y-8 relative">
            
            {/* Header */}
            <div>
                <h1 className="text-2xl font-extrabold text-white">Candidates Management</h1>
                <p className="text-xs text-slate-400 mt-1">Audit, disable, or delete student profiles</p>
            </div>

            {/* Filter controls */}
            <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input 
                        type="text"
                        placeholder="Search candidate by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-white/5 text-white h-9 pl-9 pr-4 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 outline-none text-xs transition-all"
                    />
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-slate-950/45 border border-white/5 rounded-2xl p-6 overflow-hidden">
                {loading ? (
                    <div className="py-12 flex justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    </div>
                ) : error ? (
                    <p className="text-center text-rose-400 text-xs py-6">{error}</p>
                ) : students.length === 0 ? (
                    <p className="text-center text-slate-500 text-xs py-6">No candidates found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="pb-3 pl-2">Name</th>
                                    <th className="pb-3">Email Address</th>
                                    <th className="pb-3">Registration Date</th>
                                    <th className="pb-3">Account Status</th>
                                    <th className="pb-3 text-right pr-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                {students.map((std) => (
                                    <tr key={std._id} className="hover:bg-slate-900/35">
                                        <td className="py-3 pl-2 font-bold text-slate-200">
                                            <button onClick={() => fetchDetails(std._id)} className="hover:underline text-left">
                                                {std.name}
                                            </button>
                                        </td>
                                        <td className="py-3 text-slate-400">{std.email}</td>
                                        <td className="py-3 text-slate-500">{new Date(std.createdAt).toLocaleDateString()}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                std.status === 'disabled' 
                                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            }`}>
                                                {std.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="py-3 text-right pr-2 space-x-1">
                                            <button 
                                                onClick={() => handleToggleStatus(std._id, std.status || 'active')}
                                                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                                                    std.status === 'disabled'
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                                                }`}
                                            >
                                                {std.status === 'disabled' ? 'Enable' : 'Disable'}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(std._id)}
                                                className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all inline-flex items-center"
                                            >
                                                <TrashIcon className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Profile Detail Slide-over panel */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-slate-950 border-l border-white/10 flex flex-col justify-between animate-fade-in relative">
                        
                        {/* Header */}
                        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 shrink-0">
                            <div className="flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-indigo-400" />
                                <span className="font-bold text-white text-sm">Profile Details</span>
                            </div>
                            <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-white">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            
                            {/* Basic Info */}
                            <div className="space-y-4 bg-slate-900/60 border border-white/5 rounded-2xl p-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-extrabold text-white text-base">{selectedStudent.name}</h3>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        selectedStudent.status === 'disabled' 
                                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    }`}>
                                        {selectedStudent.status || 'active'}
                                    </span>
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Email Address</span>
                                        <span className="text-slate-300">{selectedStudent.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Clerk User Identifier</span>
                                        <span className="text-slate-300 font-mono text-[10px] select-all">{selectedStudent.clerkId}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Registration Date</span>
                                        <span className="text-slate-300">{new Date(selectedStudent.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Attempts List */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Test Attempt History</h4>
                                {detailLoading ? (
                                    <div className="py-6 flex justify-center">
                                        <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                                    </div>
                                ) : attempts.length === 0 ? (
                                    <p className="text-xs text-slate-500 py-3 text-center bg-slate-900/40 border border-white/5 rounded-xl">No attempts recorded.</p>
                                ) : (
                                    <div className="space-y-2.5">
                                        {attempts.map((att) => (
                                            <div key={att._id} className="bg-slate-900 border border-white/5 rounded-xl p-3.5 flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-bold text-slate-200">{att.testId?.title || 'Practice Hub Test'}</p>
                                                    <p className="text-[9px] text-slate-500">{new Date(att.startTime).toLocaleString()} &bull; Status: {att.status}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-white">{att.score || 0} pts</p>
                                                    <p className="text-[10px] text-indigo-400 font-bold">{att.percentage || 0}%</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Footer actions */}
                        <div className="p-4 border-t border-white/10 flex gap-2 shrink-0 bg-slate-950">
                            <button 
                                onClick={() => handleToggleStatus(selectedStudent._id, selectedStudent.status || 'active')}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                                    selectedStudent.status === 'disabled'
                                    ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20'
                                    : 'bg-amber-600/10 border-amber-500/30 text-amber-400 hover:bg-amber-600/20'
                                }`}
                            >
                                {selectedStudent.status === 'disabled' ? 'Enable Account' : 'Disable Account'}
                            </button>
                            <button 
                                onClick={() => handleDelete(selectedStudent._id)}
                                className="px-4 py-2 bg-rose-600/10 border border-rose-500/30 hover:bg-rose-605 text-rose-400 hover:text-white rounded-xl text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5"
                            >
                                <TrashIcon className="w-4 h-4 shrink-0" />
                                Delete User
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
