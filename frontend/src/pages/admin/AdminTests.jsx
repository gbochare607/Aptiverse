import React, { useEffect, useState } from 'react';
import { 
    TrashIcon, 
    MagnifyingGlassIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

export default function AdminTests() {
    const [tests, setTests] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTests = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get(`/admin/tests?search=${search}`);
            setTests(data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch tests.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this test? This will also delete any student attempt records associated with this test.')) return;
        try {
            await api.delete(`/admin/tests/${id}`);
            fetchTests();
        } catch (err) {
            alert('Failed to delete test.');
        }
    };

    useEffect(() => {
        fetchTests();
    }, [search]);

    return (
        <div className="space-y-8">
            
            {/* Header */}
            <div>
                <h1 className="text-2xl font-extrabold text-white">Aptitude Tests Bank</h1>
                <p className="text-xs text-slate-400 mt-1">Audit active tests, view creator details, or remove inappropriate content</p>
            </div>

            {/* Filter controls */}
            <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input 
                        type="text"
                        placeholder="Search test by title..."
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
                ) : tests.length === 0 ? (
                    <p className="text-center text-slate-500 text-xs py-6">No aptitude tests found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="pb-3 pl-2">Test Title</th>
                                    <th className="pb-3">Creator / Institute</th>
                                    <th className="pb-3 text-center">Questions</th>
                                    <th className="pb-3 text-center">Duration</th>
                                    <th className="pb-3">Classification</th>
                                    <th className="pb-3 text-right pr-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                {tests.map((test) => (
                                    <tr key={test._id} className="hover:bg-slate-900/35">
                                        <td className="py-3.5 pl-2 font-bold text-slate-200">
                                            <div className="flex items-center gap-2">
                                                <AcademicCapIcon className="w-4 h-4 text-slate-500 shrink-0" />
                                                <span>{test.title}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5">
                                            {test.createdBy ? (
                                                <div className="space-y-0.5">
                                                    <p className="text-slate-200 font-medium">{test.createdBy.name}</p>
                                                    <p className="text-[10px] text-slate-500">{test.createdBy.email}</p>
                                                </div>
                                            ) : (
                                                <span className="text-slate-500 font-semibold italic">System / Admin</span>
                                            )}
                                        </td>
                                        <td className="py-3.5 text-center text-slate-300 font-bold">
                                            {test.questions ? test.questions.length : 0}
                                        </td>
                                        <td className="py-3.5 text-center text-slate-400 font-medium">
                                            {test.duration ? `${test.duration} min` : 'N/A'}
                                        </td>
                                        <td className="py-3.5">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                test.type === 'practice' 
                                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                                                : test.type === 'competition'
                                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                            }`}>
                                                {test.type || 'test'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 text-right pr-2">
                                            <button 
                                                onClick={() => handleDelete(test._id)}
                                                className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all inline-flex items-center"
                                                title="Delete test"
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
