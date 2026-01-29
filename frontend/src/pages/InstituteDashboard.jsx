import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function InstituteDashboard() {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                // We need to know who we are, assuming auth context calls this for institute
                // Or get ID from user context.
                // We will fetch from /institutes/me/reports ideally, or pass ID.
                // Backend route: /institutes/:id/reports.
                const { data: userData } = await api.get('/auth/me');
                const { data } = await api.get(`/institutes/${userData._id}/reports`);
                setReports(data);
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchReports();
    }, []);

    if (loading) return <div>Loading Reports...</div>;

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Institute Dashboard</h1>
                <Link to="/create-test" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    Create New Test
                </Link>
            </div>

            {/* Analytics Overview */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Tests Created</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{reports?.overview?.totalTests || 0}</dd>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                    <dt className="text-sm font-medium text-gray-500 truncate">Students Evaluated</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{reports?.overview?.totalStudentsEvaluated || 0}</dd>
                </div>
            </div>

            {/* Test Analytics Table */}
            <h2 className="mt-8 text-lg font-medium leading-6 text-gray-900">Cohort Performance</h2>
            <div className="flex flex-col mt-4">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempts</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Top Performer</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reports?.testAnalytics && Object.entries(reports.testAnalytics).map(([testName, stats]) => (
                                        <tr key={testName}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{testName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.attempts}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.averageScore.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.topPerformer}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
