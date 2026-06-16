import React, { useEffect, useState } from 'react';
import { 
    TrashIcon, 
    MagnifyingGlassIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

export default function AdminInstitutes() {
    const [institutes, setInstitutes] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchInstitutes = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get(`/admin/institutes?search=${search}`);
            setInstitutes(data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch institutes.');
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (id, status) => {
        if (!window.confirm(`Are you sure you want to set this institute status to ${status}?`)) return;
        try {
            await api.put(`/admin/institutes/${id}/approval`, { approvalStatus: status });
            fetchInstitutes();
        } catch (err) {
            alert('Failed to update approval status.');
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
        if (!window.confirm(`Are you sure you want to set this institute to ${newStatus}?`)) return;
        try {
            await api.put(`/admin/institutes/${id}/status`, { status: newStatus });
            fetchInstitutes();
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('WARNING: Deleting this institute will permanently remove their profile and all tests created by them. Proceed?')) return;
        try {
            await api.delete(`/admin/institutes/${id}`);
            fetchInstitutes();
        } catch (err) {
            alert('Failed to delete institute.');
        }
    };

    useEffect(() => {
        fetchInstitutes();
    }, [search]);

    return (
        <div className="space-y-8">
            
            {/* Header */}
            <div>
                <h1 className="text-2xl font-extrabold text-white">Institutes Management</h1>
                <p className="text-xs text-slate-400 mt-1">Approve registrations, toggle accounts, and monitor trainer roles</p>
            </div>

            {/* Filter controls */}
            <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input 
                        type="text"
                        placeholder="Search institute by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-white/5 text-white h-9 pl-9 pr-4 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 outline-none text-xs transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-950/45 border border-white/5 rounded-2xl p-6">
                {loading ? (
                    <div className="py-12 flex justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    </div>
                ) : error ? (
                    <p className="text-center text-rose-400 text-xs py-6">{error}</p>
                ) : institutes.length === 0 ? (
                    <p className="text-center text-slate-500 text-xs py-6">No institutes found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="pb-3 pl-2">Institute Name</th>
                                    <th className="pb-3">Email Address</th>
                                    <th className="pb-3">Approval</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3 text-right pr-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                {institutes.map((inst) => (
                                    <tr key={inst._id} className="hover:bg-slate-900/35">
                                        <td className="py-3.5 pl-2 font-bold text-slate-200">{inst.name}</td>
                                        <td className="py-3.5 text-slate-400">{inst.email}</td>
                                        <td className="py-3.5">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                inst.approvalStatus === 'approved' 
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                                : inst.approvalStatus === 'rejected'
                                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                                            }`}>
                                                {inst.approvalStatus || 'pending'}
                                            </span>
                                        </td>
                                        <td className="py-3.5">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                inst.status === 'disabled' 
                                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            }`}>
                                                {inst.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 text-right pr-2 space-x-1">
                                            {/* Approval controls */}
                                            {inst.approvalStatus !== 'approved' && (
                                                <button 
                                                    onClick={() => handleApproval(inst._id, 'approved')}
                                                    className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all inline-flex items-center"
                                                    title="Approve registration"
                                                >
                                                    <CheckIcon className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            {inst.approvalStatus !== 'rejected' && (
                                                <button 
                                                    onClick={() => handleApproval(inst._id, 'rejected')}
                                                    className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all inline-flex items-center"
                                                    title="Reject registration"
                                                >
                                                    <XMarkIcon className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            
                                            {/* Enable/Disable toggle */}
                                            <button 
                                                onClick={() => handleToggleStatus(inst._id, inst.status || 'active')}
                                                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                                                    inst.status === 'disabled'
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                                                }`}
                                            >
                                                {inst.status === 'disabled' ? 'Enable' : 'Disable'}
                                            </button>

                                            {/* Delete */}
                                            <button 
                                                onClick={() => handleDelete(inst._id)}
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

        </div>
    );
}
