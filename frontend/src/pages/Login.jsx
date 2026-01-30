import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900">

            {/* Background Gradients */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            </div>

            {/* Back Button */}
            <div className="absolute top-8 left-8 z-20">
                <Link to="/" className="flex items-center text-white/70 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 hover:bg-white/20">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Home
                </Link>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8 relative overflow-hidden">

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-indigo-500 rounded-xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4">
                            <span className="text-white font-bold text-xl">A</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back!</h1>
                        <p className="text-indigo-200 text-sm">Sign in to continue your progress</p>
                    </div>

                    {/* Clerk Component - styled to fit */}
                    <div className="flex justify-center">
                        <SignIn
                            signUpUrl="/register"
                            forceRedirectUrl="/dashboard"
                            appearance={{
                                layout: { socialButtonsPlacement: 'bottom' },
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-none border-none bg-transparent w-full p-0",
                                    headerTitle: "hidden",
                                    headerSubtitle: "hidden",
                                    formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 border-none",
                                    formFieldInput: "bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20",
                                    formFieldLabel: "text-indigo-200",
                                    footerActionText: "text-indigo-200",
                                    footerActionLink: "text-white hover:text-indigo-300 font-bold",
                                    identityPreviewText: "text-white",
                                    socialButtonsBlockButton: "border-gray-600 hover:bg-gray-800 text-white",
                                    dividerLine: "bg-gray-700",
                                    dividerText: "text-gray-400"
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
