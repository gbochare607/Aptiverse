import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

import { useSearchParams } from 'react-router-dom';

export default function Register() {
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role');
    const redirectUrl = role === 'institute' ? '/institute-dashboard' : '/dashboard';

    return (
        <div className="h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden px-4">

            {/* Minimalist Background Decoration */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
            </div>

            {/* Back Link */}
            <div className="absolute top-6 left-8 z-20">
                <Link to="/" className="group flex items-center text-gray-500 hover:text-white transition-colors text-xs font-medium">
                    <ArrowLeftIcon className="w-3.5 h-3.5 mr-1.5 group-hover:-translate-x-1 transition-transform" />
                    Back home
                </Link>
            </div>

            <div className="w-full max-w-[420px] relative z-10 flex flex-col items-center">
                {/* Brand Header - Compacted */}
                <div className="text-center mb-3">
                    <div className="inline-flex items-center justify-center w-9 h-9 bg-purple-600 rounded-xl shadow-xl shadow-purple-600/20 mb-2">
                        <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
                        Create {role === 'institute' ? 'Institute ' : ''}Account
                    </h1>
                </div>

                {/* Centered Register Card - Compacted */}
                <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/[0.05] rounded-[20px] p-0.5 shadow-2xl relative overflow-hidden group w-full">
                    {/* Subtle Internal Glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/15 transition-all duration-500"></div>

                    <SignUp
                        signInUrl={role === 'institute' ? "/login?role=institute" : "/login"}
                        forceRedirectUrl={redirectUrl}
                        appearance={{
                            layout: {
                                socialButtonsPlacement: 'bottom',
                                shimmer: true,
                                hideDivider: true
                            },
                            elements: {
                                rootBox: "w-full",
                                card: "shadow-none border-none bg-transparent w-full p-1 md:p-2",
                                header: "hidden",
                                formButtonPrimary: "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/15 border-none h-9 text-xs font-bold tracking-wide transition-all mt-2",
                                formFieldInput: "bg-white/[0.05] border-white/10 text-white h-9 px-3 rounded-lg focus:border-purple-500 focus:ring-purple-500/20 transition-all text-sm",
                                formFieldLabel: "text-gray-400 text-[10px] font-medium mb-1 ml-0.5",
                                footerActionText: "text-gray-500 text-[11px]",
                                footerActionLink: "text-purple-400 hover:text-purple-300 font-semibold text-[11px]",
                                identityPreviewText: "text-white text-xs",
                                socialButtonsBlockButton: "border-white/10 hover:bg-white/10 text-white h-9 rounded-lg transition-all text-xs",
                                dividerLine: "bg-white/5",
                                dividerText: "text-gray-500 text-[8px] uppercase tracking-[0.2em]",
                                formFieldErrorText: "text-rose-400 text-[9px] mt-0.5",
                                alert: "bg-rose-500/10 border-rose-500/20 text-rose-400 rounded-lg p-2 text-[10px]",
                            }
                        }}
                    />
                </div>

                <p className="mt-3 text-center text-gray-600 text-[9px]">
                    &copy; {new Date().getFullYear()} AptiVerse Platform
                </p>
            </div>
        </div>
    );
}
