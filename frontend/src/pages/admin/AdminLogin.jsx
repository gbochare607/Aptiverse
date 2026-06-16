import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/admin/login', { email, password });
            localStorage.setItem('adminToken', data.token);
            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden px-4 font-sans">
            
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
            </div>

            <div className="w-full max-w-[380px] relative z-10">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-xl shadow-xl shadow-indigo-600/20 mb-3">
                        <span className="text-white font-extrabold text-xl">A</span>
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Admin Console</h1>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">Enter credentials to establish terminal session</p>
                </div>

                {/* Card */}
                <div className="bg-slate-950/60 backdrop-blur-2xl border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                            <input 
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900 border border-white/5 text-white h-10 px-3.5 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 outline-none text-xs transition-all"
                                placeholder="name@domain.com"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Secure Password</label>
                            <input 
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900 border border-white/5 text-white h-10 px-3.5 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 outline-none text-xs transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 text-white font-bold h-10 rounded-lg text-xs transition-all shadow-lg shadow-indigo-600/15"
                        >
                            {loading ? 'Establishing Session...' : 'Authenticate Console'}
                            <ArrowRightIcon className="w-4 h-4 shrink-0" />
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-slate-600 text-[10px]">
                    &copy; {new Date().getFullYear()} AptiVerse Platform &bull; Secure Administrative Access
                </p>
            </div>
        </div>
    );
}
