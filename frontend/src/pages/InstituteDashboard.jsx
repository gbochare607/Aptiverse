import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    UsersIcon,
    DocumentTextIcon,
    PlayCircleIcon,
    TrophyIcon,
    PlusIcon,
    KeyIcon,
    ClockIcon,
    CheckCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const KPICard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`p-4 rounded-full ${color} bg-opacity-10 dark:bg-opacity-20`}>
            <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        </div>
    </div>
);

const QuickActionButton = ({ title, icon: Icon, to, onClick, color }) => {
    const Component = to ? Link : 'button';
    return (
        <Component to={to} onClick={onClick} className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all group w-full">
            <div className={`p-3 rounded-full ${color} text-white mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</span>
        </Component>
    );
};

export default function InstituteDashboard() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Data State
    const [rooms, setRooms] = useState([]);
    
    // Modal State
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [newRoomData, setNewRoomData] = useState({ name: '', description: '' });
    const [roomSubmitting, setRoomSubmitting] = useState(false);

    // Mock Data for other sections
    const stats = {
        totalStudents: 1250,
        totalTestsCreated: 45,
        liveTestsRunning: 3,
        totalCompetitions: 12
    };

    const upcomingTests = [
        { id: 1, name: "Mid-Term Aptitude", room: "Room A", datetime: "Oct 25, 2026 • 10:00 AM" }
    ];

    const competitions = [
        { id: 1, name: "Annual Tech Fest", startDate: "Nov 01, 2026", participants: 450 }
    ];

    const recentActivity = [
        { id: 1, action: "Dashboard loaded", details: "Welcome back", time: "Just now" }
    ];

    const fetchData = async () => {
        try {
            const { data: userData } = await api.get('/auth/me', {
                headers: { 'X-Requested-Role': 'institute' }
            });
            setUser(userData);

            const { data: roomsData } = await api.get('/rooms/institute');
            setRooms(roomsData);

        } catch (e) {
            console.error("Failed to load dashboard data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        setRoomSubmitting(true);
        try {
            await api.post('/rooms/institute', newRoomData);
            setIsRoomModalOpen(false);
            setNewRoomData({ name: '', description: '' });
            fetchData(); // Refresh list
        } catch (e) {
            console.error(e);
            alert("Failed to create room.");
        } finally {
            setRoomSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 pb-20 bg-gray-50/50 dark:bg-transparent min-h-screen">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Here is what's happening today.</p>
            </div>

            {/* 1. Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Total Students" value={stats.totalStudents} icon={UsersIcon} color="text-blue-500 bg-blue-500" />
                <KPICard title="Total Tests Created" value={stats.totalTestsCreated} icon={DocumentTextIcon} color="text-indigo-500 bg-indigo-500" />
                <KPICard title="Live Tests Running" value={stats.liveTestsRunning} icon={PlayCircleIcon} color="text-green-500 bg-green-500" />
                <KPICard title="Total Competitions" value={stats.totalCompetitions} icon={TrophyIcon} color="text-purple-500 bg-purple-500" />
            </div>

            {/* 2. Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <QuickActionButton title="Create Live Test" icon={PlusIcon} to="/create-test" color="bg-indigo-600" />
                    <QuickActionButton title="Create Test Room" icon={KeyIcon} onClick={() => setIsRoomModalOpen(true)} color="bg-emerald-500" />
                    <QuickActionButton title="Add Competition" icon={TrophyIcon} to="#" color="bg-orange-500" />
                    <QuickActionButton title="Add Students" icon={UsersIcon} to="#" color="bg-rose-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 3. Upcoming Tests Section (2 Cols) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/80">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <ClockIcon className="w-5 h-5 text-indigo-500" />
                                Upcoming Tests
                            </h2>
                            <button className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-100 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4">Test Name</th>
                                        <th className="px-6 py-4">Test Room</th>
                                        <th className="px-6 py-4">Date & Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {upcomingTests.map(test => (
                                        <tr key={test.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{test.name}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                                                <span className="bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md text-xs font-semibold">{test.room}</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">{test.datetime}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* 4. Test Rooms Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/80">
                                <h2 className="text-base font-bold text-gray-900 dark:text-white">Test Rooms</h2>
                                <Link to="/institute/test-rooms" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">View All</Link>
                            </div>
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                {rooms.length === 0 ? (
                                    <li className="px-6 py-8 text-center text-gray-500 text-sm">No rooms created yet.</li>
                                ) : (
                                    rooms.map(room => (
                                        <Link to={`/institute/room/${room._id}`} key={room._id} className="block px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="font-semibold text-gray-900 dark:text-white">{room.name}</div>
                                                <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">{room.code}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                                <span>{room.students.length} Students</span>
                                                <span>{room.tests.length} Tests</span>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </ul>
                        </div>

                        {/* 5. Competitions Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/80">
                                <h2 className="text-base font-bold text-gray-900 dark:text-white">Competitions</h2>
                                <Link to="/institute/competitions" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">View All</Link>
                            </div>
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                {competitions.map(comp => (
                                    <li key={comp.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                        <div className="font-semibold text-gray-900 dark:text-white mb-1">{comp.name}</div>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                            <span>Starts: {comp.startDate}</span>
                                            <span>{comp.participants} Participants</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 6. Recent Activity Section (Sidebar) */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                            Recent Activity
                        </h2>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
                            {recentActivity.map((activity, index) => (
                                <div key={activity.id} className="relative flex items-start gap-4 z-10 w-full mb-6">
                                    <div className="mt-1 h-5 w-5 rounded-full border-4 border-white dark:border-gray-800 bg-indigo-500 shadow-sm shrink-0 relative z-20"></div>
                                    <div className="flex-1 min-w-0 bg-white dark:bg-gray-800 pl-4">
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{activity.action}</h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{activity.details}</p>
                                        <span className="text-[10px] uppercase font-bold text-gray-400 mt-2 block">{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-6 w-full py-2.5 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">
                            View All History
                        </button>
                    </div>
                </div>
            </div>

            {/* Room Creation Modal */}
            {isRoomModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Test Room</h2>
                            <button onClick={() => setIsRoomModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateRoom} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. IT Batch 2026"
                                    value={newRoomData.name}
                                    onChange={(e) => setNewRoomData({ ...newRoomData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Room for final year students..."
                                    rows="3"
                                    value={newRoomData.description}
                                    onChange={(e) => setNewRoomData({ ...newRoomData, description: e.target.value })}
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsRoomModalOpen(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium">Cancel</button>
                                <button type="submit" disabled={roomSubmitting} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm disabled:opacity-50">
                                    {roomSubmitting ? 'Creating...' : 'Create Room'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
