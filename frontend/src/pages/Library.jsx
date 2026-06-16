import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth, useUser } from '@clerk/clerk-react';
import {
    BookOpenIcon,
    VideoCameraIcon,
    DocumentTextIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ClockIcon,
    ArrowDownTrayIcon,
    AcademicCapIcon,
    SparklesIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

const Library = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeType, setActiveType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    const { getToken } = useAuth();
    const { user } = useUser();
    const initialTopic = searchParams.get('topic');

    const types = [
        { id: 'all', name: 'All Resources', icon: BookOpenIcon },
        { id: 'note', name: 'Notes', icon: DocumentTextIcon },
        { id: 'video', name: 'Videos', icon: VideoCameraIcon },
        { id: 'pdf', name: 'Handouts', icon: ArrowDownTrayIcon },
        { id: 'material', name: 'Others', icon: AcademicCapIcon }
    ];

    useEffect(() => {
        fetchLibraryItems();
    }, [getToken, searchParams]);

    const fetchLibraryItems = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const topic = searchParams.get('topic');
            const url = topic ? `/library?topic=${topic}` : '/library';
            const res = await api.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItems(res.data);
        } catch (error) {
            console.error('Error fetching library items:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = items.filter(item => {
        const matchesType = activeType === 'all' || item.type === activeType;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.topic?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    const getTypeStyles = (type) => {
        switch (type) {
            case 'video': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case 'note': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'pdf': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            default: return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'video': return <VideoCameraIcon className="w-5 h-5" />;
            case 'note': return <DocumentTextIcon className="w-5 h-5" />;
            case 'pdf': return <ArrowDownTrayIcon className="w-5 h-5" />;
            default: return <AcademicCapIcon className="w-5 h-5" />;
        }
    };

    return (
        <div className="min-h-screen bg-transparent p-6 lg:p-10">
            {/* Header Section */}
            <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                        <BookOpenIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                        Digital Library
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                        Access premium study materials, expert notes, and curated video lectures.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative group">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by topic or title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/5 rounded-2xl w-full sm:w-80 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Type Filters */}
            <div className="flex overflow-x-auto gap-3 mb-8 pb-2 custom-scrollbar no-scrollbar">
                {types.map(type => (
                    <button
                        key={type.id}
                        onClick={() => setActiveType(type.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap border ${
                            activeType === type.id 
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-600/20' 
                            : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/5 hover:border-indigo-500/50'
                        }`}
                    >
                        <type.icon className="w-4 h-4" />
                        {type.name}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Knowledge Base...</p>
                </div>
            ) : filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {filteredItems.map(item => (
                        <div 
                            key={item._id}
                            className="group bg-white dark:bg-gray-800/50 backdrop-blur-md rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-500 flex flex-col"
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <img 
                                    src={item.thumbnail || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400'} 
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${getTypeStyles(item.type)}`}>
                                        {item.type}
                                    </span>
                                </div>
                                {item.duration && (
                                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
                                        <ClockIcon className="w-3 h-3" />
                                        {item.duration}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{item.topic || 'General'}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.category}</span>
                                </div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium line-clamp-2 mb-6">
                                    {item.description}
                                </p>
                                
                                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                            {getTypeIcon(item.type)}
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin</span>
                                    </div>
                                    <a 
                                        href={item.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all text-gray-400"
                                    >
                                        <ArrowDownTrayIcon className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-40 bg-white/50 dark:bg-gray-800/20 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-white/5">
                    <SparklesIcon className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">No contents found</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto">
                        We couldn't find any resources matching your search or filters. Try adjusting your exploration!
                    </p>
                    <button 
                        onClick={() => { setSearchQuery(''); setActiveType('all'); }}
                        className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
                    >
                        Reset All Filters
                    </button>
                </div>
            )}

            {/* Quick Tips or Featured Section */}
            <div className="mt-20 p-8 lg:p-12 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="max-w-xl text-center lg:text-left">
                        <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20">Learning Hack</span>
                        <h2 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight">Can't find what you're looking for?</h2>
                        <p className="text-indigo-100 font-medium text-lg leading-relaxed">
                            Our AI Mentor can suggest specific materials based on your performance. Head over to the AI Mentor tab for personalized recommendations.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <button className="px-10 py-5 bg-white text-indigo-600 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-2xl flex items-center gap-3">
                            Check AI Recommendations
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Library;
