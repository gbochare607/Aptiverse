import React from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { EnvelopeIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';

export default function InstitutePending() {
    const { signOut } = useClerk();
    const { user } = useUser();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        localStorage.removeItem('userRole');
        localStorage.removeItem('requestedRole');
        navigate('/', { replace: true });
    };

    return (
        <div className="h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden px-4 font-sans">
            
            {/* Background glowing spheres */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
            </div>

            <div className="w-full max-w-[420px] relative z-10 text-center space-y-6">
                
                {/* Brand Logo */}
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-2xl shadow-xl shadow-purple-600/20 mb-2">
                    <span className="text-white font-extrabold text-2xl">A</span>
                </div>

                {/* Card Container */}
                <div className="bg-slate-950/60 backdrop-blur-2xl border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-5">
                    
                    {/* Pulsing Status Dot */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-3.5 h-3.5 bg-amber-500 rounded-full animate-ping absolute" />
                            <div className="w-3.5 h-3.5 bg-amber-500 rounded-full relative" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-lg font-bold text-white tracking-tight">Registration Under Review</h1>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Hello <span className="text-white font-bold">{user?.fullName || 'Trainer'}</span>, your institute registration has been successfully received and is currently under review by our administrator.
                        </p>
                    </div>

                    <div className="border-t border-white/5 pt-4 space-y-3.5">
                        <p className="text-[11px] text-slate-500 leading-normal">
                            Once approved, you will automatically gain access to candidate tracking, classroom creation, and test metrics.
                        </p>

                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-white/5 rounded-xl py-2.5 px-4 max-w-xs mx-auto">
                            <EnvelopeIcon className="w-4 h-4 text-purple-400 shrink-0" />
                            <span className="select-all">gbochare482@gmail.com</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-white/5 pt-4">
                        <button 
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-rose-400 hover:text-rose-300 font-bold border border-white/5 hover:border-white/10 rounded-xl text-xs transition-all shadow-md"
                        >
                            <ArrowLeftStartOnRectangleIcon className="w-4 h-4 shrink-0" />
                            Sign Out Account
                        </button>
                    </div>
                </div>

                <p className="text-[10px] text-slate-600">
                    &copy; {new Date().getFullYear()} AptiVerse Platform &bull; Institute Verification Loop
                </p>
            </div>
        </div>
    );
}
