import React from 'react';
import { Link } from 'react-router-dom';
import {
    AcademicCapIcon,
    ArrowRightIcon,
    BoltIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

const features = [
    {
        name: 'Personalized Learning Paths',
        description: 'Our AI analyzes your performance to create a custom study plan that focuses on your weak areas.',
        icon: BoltIcon,
    },
    {
        name: 'Real-time Analytics',
        description: 'Track your progress with detailed insights, accuracy reports, and skill mastery levels.',
        icon: ChartBarIcon,
    },
    {
        name: 'Industry Standard Tests',
        description: 'Practice with questions curated from top company recruitment drives and competitive exams.',
        icon: AcademicCapIcon,
    },
];

export default function LandingPage() {
    return (
        <div className="bg-white">
            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">A</div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-indigo-600">AptiVerse</span>
                </div>
                <div className="hidden md:flex space-x-8">
                    <a href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900">Features</a>
                    <a href="#about" className="text-sm font-medium text-gray-500 hover:text-gray-900">About</a>
                    <a href="#testimonials" className="text-sm font-medium text-gray-500 hover:text-gray-900">Success Stories</a>
                </div>
                <div className="flex items-center space-x-4">
                    <Link to="/login?role=student" className="text-sm font-medium text-gray-500 hover:text-gray-900">Log in</Link>
                    <Link to="/register?role=student" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
                        <div className="md:max-w-2xl md:mx-auto lg:col-span-6 text-center lg:text-left">
                            <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-6 tracking-wide uppercase">
                                AI-Powered Aptitude Platform
                            </span>
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-6">
                                Master your skills with <span className="text-indigo-600">Personalized AI</span>
                            </h1>
                            <p className="mt-4 text-lg text-gray-500 mb-8 leading-relaxed">
                                Stop practicing blindly. AptiVerse uses advanced AI to identify your gaps and provides a tailored learning journey to crack your dream job.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/login?role=student" className="flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-transform transform hover:-translate-y-1">
                                    Student Login <ArrowRightIcon className="w-5 h-5 ml-2" />
                                </Link>
                                <Link to="/login?role=institute" className="flex items-center justify-center px-8 py-4 text-base font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                                    Institute Login
                                </Link>
                            </div>
                            <div className="mt-8 flex items-center justify-center lg:justify-start space-x-4 text-sm text-gray-400">
                                <span className="flex items-center"><BoltIcon className="w-4 h-4 mr-1 text-green-500" /> Free Trial</span>
                                <span className="flex items-center"><UserGroupIcon className="w-4 h-4 mr-1 text-blue-500" /> 10k+ Students</span>
                            </div>
                        </div>

                        <div className="mt-16 lg:mt-0 lg:col-span-6 relative">
                            {/* Decorative Background Blob */}
                            <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

                            {/* Glassmorphism Card */}
                            <div className="relative bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-10 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <p className="text-sm text-gray-500">Your Current Level</p>
                                        <h3 className="text-2xl font-bold text-gray-800">Advanced</h3>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <AcademicCapIcon className="w-6 h-6" />
                                    </div>
                                </div>

                                {/* Skill Bars */}
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-semibold text-gray-700">Quantitative Aptitude</span>
                                            <span className="text-indigo-600 font-bold">85%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 w-[85%] rounded-full"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-semibold text-gray-700">Logical Reasoning</span>
                                            <span className="text-indigo-600 font-bold">92%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 w-[92%] rounded-full"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-semibold text-gray-700">Verbal Ability</span>
                                            <span className="text-indigo-600 font-bold">78%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 w-[78%] rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs`}>User</div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500">Join top performers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-20 bg-gray-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to excel
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div key={feature.name} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.name}</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper icon import (duplicated in file but needed for standalone component)
import { UserGroupIcon } from '@heroicons/react/24/solid';
