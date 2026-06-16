import React, { useState, useEffect } from 'react';
import { useUser, SignOutButton, useClerk, useAuth } from '@clerk/clerk-react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ArcElement,
} from 'chart.js';
import { Radar, Line, Bar, Doughnut, Scatter } from 'react-chartjs-2';
import {
    ChartBarIcon,
    CpuChipIcon,
    ClockIcon,
    ArrowLeftOnRectangleIcon,
    ChevronRightIcon,
    ArrowUpRightIcon,
    CheckBadgeIcon,
    RocketLaunchIcon,
    PencilSquareIcon,
    AcademicCapIcon,
    FireIcon,
    CalendarIcon,
    TrashIcon,
    StarIcon,
    SparklesIcon,
    LightBulbIcon,
    ArrowTrendingUpIcon,
    ArrowDownTrayIcon,
    PlusIcon,
    CheckIcon,
    ChevronLeftIcon
} from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

ChartJS.register(
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler,
  Tooltip,
  Legend,
  ArcElement
);


export default function Profile() {
    const { user } = useUser();
    const { openUserProfile } = useClerk();
    const navigate = useNavigate();
    const location = useLocation();
    const { getToken } = useAuth();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'performance');
    const [activities, setActivities] = useState([]);
    const [performance, setPerformance] = useState(null);
    const [studyPlan, setStudyPlan] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loadingActivities, setLoadingActivities] = useState(false);
    const [loadingPerformance, setLoadingPerformance] = useState(false);
    const [loadingStudyPlan, setLoadingStudyPlan] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [dateRange, setDateRange] = useState('all'); // '7d', '30d', 'all'

    useEffect(() => {
        const fetchActivities = async () => {
            setLoadingActivities(true);
            try {
                const token = await getToken();
                if (token) {
                    const { data } = await api.get('/activities/recent', { headers: { Authorization: `Bearer ${token}` } });
                    setActivities(data || []);
                }
            } catch (err) { console.error('Error fetching activities:', err); }
            finally { setLoadingActivities(false); }
        };

        const fetchPerformance = async () => {
            if (!user) return;
            setLoadingPerformance(true);
            try {
                const token = await getToken();
                if (token) {
                    const { data } = await api.get(`/performance/${user.id}?range=${dateRange}`, { headers: { Authorization: `Bearer ${token}` } });
                    const stats = data.stats;
                    setPerformance(stats || { accuracy: 0, totalTests: 0, highestScore: 0, averageScore: 0, topicData: [], trendData: [], distributionData: [] });
                }
            } catch (err) { 
                console.error('Error fetching performance:', err); 
                setPerformance({ accuracy: 0, totalTests: 0, highestScore: 0, averageScore: 0, topicData: [], trendData: [], distributionData: [] });
            }
            finally { setLoadingPerformance(false); }
        };

        const fetchStudyPlan = async () => {
            if (!user) return;
            setLoadingStudyPlan(true);
            try {
                const token = await getToken();
                if (token) {
                    const { data } = await api.get('/study-plan', { headers: { Authorization: `Bearer ${token}` } });
                    setStudyPlan(data);
                }
            } catch (err) { console.error('Error fetching study plan:', err); }
            finally { setLoadingStudyPlan(false); }
        };

        fetchActivities(); fetchPerformance(); fetchStudyPlan();
    }, [getToken, user?.id, dateRange]);

    const tabs = [
        { id: 'performance', title: 'Performance', icon: ChartBarIcon },
        { id: 'ai-mentor', title: 'AI Mentor', icon: SparklesIcon },
        { id: 'planner', title: 'Study Planner', icon: CalendarIcon },
        { id: 'activity', title: 'Recent Activity', icon: ClockIcon }
    ];

    const toggleTask = async (taskId, currentStatus) => {
        try {
            const token = await getToken();
            const { data } = await api.put(`/study-plan/task/${taskId}`, { isCompleted: !currentStatus }, { headers: { Authorization: `Bearer ${token}` } });
            setStudyPlan(data);
        } catch (err) { console.error('Error toggling task:', err); }
    };

    const deleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            const token = await getToken();
            const { data } = await api.delete(`/study-plan/task/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
            setStudyPlan(data);
        } catch (err) { console.error('Error deleting task:', err); }
    };

    const addTask = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const task = { text: formData.get('text'), time: formData.get('time'), category: formData.get('category') || 'General', dueDate: selectedDate };
        try {
            const token = await getToken();
            const { data } = await api.post('/study-plan/task', task, { headers: { Authorization: `Bearer ${token}` } });
            setStudyPlan(data); e.target.reset();
        } catch (err) { console.error('Error adding task:', err); }
    };

    const handleDownloadReport = () => {
        const reportData = {
            user: user?.fullName,
            date: new Date().toLocaleDateString(),
            stats: performance
        };
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `aptitude_report_${user?.id}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderPerformance = () => {
        if (loadingPerformance) return <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">{[1, 2, 3, 4].map(i => <div key={i} className="bg-[#112240] h-28 rounded-2xl border border-white/5"></div>)}</div>;
        
        const stats = performance || { accuracy: 0, totalTests: 0, highestScore: 0, averageScore: 0, topicData: [], trendData: [], distributionData: [] };
        
        // Calculate total questions solved
        const totalQuestionsSolved = (stats.topicData || []).reduce((sum, topic) => sum + (topic.totalQuestions || 0), 0);

        const kpis = [
            { label: 'Exam Readiness', value: stats.averageScore + '%', icon: AcademicCapIcon, color: 'cyan' },
            { label: 'Questions Solved', value: totalQuestionsSolved, icon: SparklesIcon, color: 'emerald' },
            { label: 'Highest Score', value: stats.highestScore, icon: FireIcon, color: 'blue' }
        ];

        return (
            <div className="space-y-6 animate-in fade-in duration-500 pb-10">
                {/* Dashboard Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a192f]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
                            <ChartBarIcon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-black text-white tracking-tight">Student Performance</h3>
                    </div>
                </div>

                {/* Stat KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Overall Accuracy', value: `${stats.accuracy || 0}%`, sub: 'Across all tests', icon: SparklesIcon, color: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', text: 'text-cyan-400' },
                        { label: 'Total Tests Taken', value: stats.totalTests || 0, sub: 'All time', icon: ChartBarIcon, color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', text: 'text-purple-400' },
                        { label: 'Highest Score', value: `${stats.highestScore || 0}%`, sub: 'Best performance', icon: FireIcon, color: 'from-orange-500/20 to-red-500/20', border: 'border-orange-500/30', text: 'text-orange-400' },
                        { label: 'Questions Solved', value: (stats.topicData || []).reduce((s, t) => s + (t.totalQuestions || 0), 0), sub: 'Total attempts', icon: AcademicCapIcon, color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', text: 'text-green-400' },
                    ].map((kpi, i) => (
                        <div key={i} className={`bg-[#0a192f]/80 backdrop-blur-md p-4 rounded-2xl border ${kpi.border} shadow-lg flex items-center gap-3`}>
                            <div className={`p-2.5 bg-gradient-to-br ${kpi.color} rounded-xl border ${kpi.border} flex-shrink-0`}>
                                <kpi.icon className={`w-5 h-5 ${kpi.text}`} />
                            </div>
                            <div>
                                <p className={`text-xl font-black ${kpi.text}`}>{kpi.value}</p>
                                <p className="text-[11px] text-white font-semibold">{kpi.label}</p>
                                <p className="text-[10px] text-gray-500">{kpi.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* 1. Score Progress Over Time (Line Chart) */}
                    <div className="bg-[#0a192f]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col min-h-[300px] lg:col-span-2">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="text-white font-bold text-sm">Score Progress Over Time</h4>
                            <ArrowTrendingUpIcon className="w-4 h-4 text-cyan-400" />
                        </div>
                        <p className="text-[11px] text-gray-400 mb-4">How your accuracy has changed across your recent tests.</p>
                        <div className="flex-1 min-h-[200px] relative">
                            {stats.trendData && stats.trendData.length > 0 ? (
                                <Line
                                    data={{
                                        labels: stats.trendData.map(d => d.date),
                                        datasets: [{
                                            label: 'Accuracy %',
                                            data: stats.trendData.map(d => d.accuracy),
                                            borderColor: '#22d3ee',
                                            backgroundColor: 'rgba(34, 211, 238, 0.1)',
                                            borderWidth: 2,
                                            fill: true,
                                            tension: 0.4,
                                            pointBackgroundColor: '#22d3ee',
                                            pointBorderColor: '#fff',
                                            pointRadius: 4,
                                            pointHoverRadius: 6,
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: { backgroundColor: '#0a192f', titleColor: '#fff', bodyColor: '#22d3ee', borderColor: 'rgba(34,211,238,0.3)', borderWidth: 1 }
                                        },
                                        scales: {
                                            y: { beginAtZero: true, max: 100, tickCallback: v => v + '%', border: { display: false }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 10 }, callback: v => v + '%' } },
                                            x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } }
                                        }
                                    }}
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                    <ChartBarIcon className="w-8 h-8 text-gray-600" />
                                    <p className="text-xs text-gray-500">Take more tests to see your score progress</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. Subject-wise Accuracy (Horizontal Bar Chart) */}
                    <div className="bg-[#0a192f]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col min-h-[300px]">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="text-white font-bold text-sm">Subject-wise Accuracy</h4>
                            <ChartBarIcon className="w-4 h-4 text-purple-400" />
                        </div>
                        <p className="text-[11px] text-gray-400 mb-4">Your accuracy percentage per subject. Green = strong, Orange = needs work.</p>
                        <div className="flex-1 min-h-[200px] relative">
                            {stats.topicData && stats.topicData.length > 0 ? (
                                <Bar
                                    data={{
                                        labels: stats.topicData.slice(0, 7).map(t => t.name.length > 14 ? t.name.substring(0, 12) + '..' : t.name),
                                        datasets: [{
                                            label: 'Accuracy %',
                                            data: stats.topicData.slice(0, 7).map(t => parseFloat(t.accuracy)),
                                            backgroundColor: stats.topicData.slice(0, 7).map(t =>
                                                parseFloat(t.accuracy) >= 75 ? 'rgba(34, 197, 94, 0.75)' :
                                                parseFloat(t.accuracy) >= 50 ? 'rgba(251, 146, 60, 0.75)' :
                                                'rgba(239, 68, 68, 0.75)'
                                            ),
                                            borderRadius: 5,
                                            borderSkipped: false,
                                        }]
                                    }}
                                    options={{
                                        indexAxis: 'y',
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: { backgroundColor: '#0a192f', titleColor: '#fff', bodyColor: '#94a3b8', callbacks: { label: ctx => ` ${ctx.parsed.x}%` } }
                                        },
                                        scales: {
                                            x: { beginAtZero: true, max: 100, border: { display: false }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 10 }, callback: v => v + '%' } },
                                            y: { grid: { display: false }, ticks: { color: '#e2e8f0', font: { size: 11 } } }
                                        }
                                    }}
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                    <ChartBarIcon className="w-8 h-8 text-gray-600" />
                                    <p className="text-xs text-gray-500">No subject data yet. Start practicing!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. Correct vs Incorrect Answers (Pie Chart) */}
                    <div className="bg-[#0a192f]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col min-h-[300px]">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="text-white font-bold text-sm">Correct vs. Incorrect Answers</h4>
                            <CheckBadgeIcon className="w-4 h-4 text-green-400" />
                        </div>
                        <p className="text-[11px] text-gray-400 mb-4">Out of all questions you've attempted, how many did you get right?</p>
                        <div className="flex-1 flex items-center justify-center min-h-[200px] relative">
                            {(() => {
                                const totalQs = (stats.topicData || []).reduce((s, t) => s + (t.totalQuestions || 0), 0);
                                const totalCorrect = (stats.topicData || []).reduce((s, t) => s + (parseFloat(t.correctAnswers) || 0), 0);
                                const totalWrong = Math.max(0, totalQs - Math.round(totalCorrect));
                                return totalQs > 0 ? (
                                    <div className="w-full max-h-[200px]">
                                        <Doughnut
                                            data={{
                                                labels: ['Correct', 'Incorrect'],
                                                datasets: [{
                                                    data: [Math.round(totalCorrect), totalWrong],
                                                    backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.75)'],
                                                    borderColor: '#0a192f',
                                                    borderWidth: 3,
                                                }]
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                cutout: '65%',
                                                plugins: {
                                                    legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 }, usePointStyle: true, padding: 16 } },
                                                    tooltip: { backgroundColor: '#0a192f', titleColor: '#fff', bodyColor: '#94a3b8', callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} questions` } }
                                                }
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                        <CheckBadgeIcon className="w-8 h-8 text-gray-600" />
                                        <p className="text-xs text-gray-500">Complete tests to see your answer breakdown</p>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* 4. Recent Test Results (Column Bar Chart) */}
                    <div className="bg-[#0a192f]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col min-h-[300px] lg:col-span-2">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="text-white font-bold text-sm">Recent Test Scores</h4>
                            <RocketLaunchIcon className="w-4 h-4 text-orange-400" />
                        </div>
                        <p className="text-[11px] text-gray-400 mb-4">Your scores from the most recent tests. Each bar represent one test.</p>
                        <div className="flex-1 min-h-[200px] relative">
                            {stats.testHistory && stats.testHistory.length > 0 ? (
                                <Bar
                                    data={{
                                        labels: stats.testHistory.slice(0, 10).map((t, i) => t.testName?.length > 15 ? t.testName.substring(0, 13) + '..' : (t.testName || `Test ${i + 1}`)),
                                        datasets: [{
                                            label: 'Score %',
                                            data: stats.testHistory.slice(0, 10).map(t => t.accuracy || t.score || 0),
                                            backgroundColor: stats.testHistory.slice(0, 10).map(t => {
                                                const v = t.accuracy || t.score || 0;
                                                return v >= 75 ? 'rgba(34, 197, 94, 0.8)' : v >= 50 ? 'rgba(251, 146, 60, 0.8)' : 'rgba(239, 68, 68, 0.75)';
                                            }),
                                            borderRadius: 6,
                                            borderSkipped: false,
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: { backgroundColor: '#0a192f', titleColor: '#fff', bodyColor: '#94a3b8', callbacks: { label: ctx => ` Score: ${ctx.parsed.y}%` } }
                                        },
                                        scales: {
                                            y: { beginAtZero: true, max: 100, border: { display: false }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 10 }, callback: v => v + '%' } },
                                            x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 }, maxRotation: 30 } }
                                        }
                                    }}
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                    <RocketLaunchIcon className="w-8 h-8 text-gray-600" />
                                    <p className="text-xs text-gray-500">No tests completed yet. Take your first test!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Achievements List */}
                    <div className="bg-[#0a192f]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg relative flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-white font-bold text-sm">Recent High Scores</h4>
                            <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex-1 space-y-3 overflow-y-auto pr-2 thin-scrollbar">
                            {stats.testHistory && stats.testHistory.length > 0 ? (
                                (() => {
                                    // Group and filter real test history
                                    const topScores = [...stats.testHistory].sort((a,b) => b.score - a.score).slice(0, 4);
                                    return topScores.map((ach, i) => (
                                        <div key={i} onClick={() => navigate('/tests/attempts')} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                            <div className={`p-1.5 rounded-full ${ach.accuracy >= 80 ? 'bg-cyan-500/20 text-cyan-400 group-hover:scale-110' : 'bg-orange-500/20 text-orange-400 group-hover:scale-110'} transition-transform`}>
                                                <StarIcon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-gray-300 text-sm font-medium block truncate max-w-[160px]">{ach.testName}</span>
                                                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider opacity-70">Scored {ach.accuracy}% · {new Date(ach.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="font-bold text-sm text-white">{ach.score} pts</div>
                                        </div>
                                    ));
                                })()
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Complete tests to unlock<br/>achievements!</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    const renderAIMentor = () => {
        if (loadingPerformance) return <div className="animate-pulse space-y-6">{[1, 2, 3].map(i => <div key={i} className="bg-[#112240] h-40 rounded-3xl border border-white/5"></div>)}</div>;
        
        const stats = performance || {};
        const ai = stats.aiInsights || {};
        const weakTopics = (stats.topicData || []).filter(t => parseFloat(t.accuracy) < 60);
        
        return (
            <div className="space-y-6 animate-in fade-in duration-500 pb-10 w-full">
                {/* AI Mentor Header */}
                <div className="flex items-center gap-3 bg-[#0a192f]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30 relative z-10">
                        <SparklesIcon className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight relative z-10">AI Personal Mentor</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LEFT COLUMN: Main Insights & Recommendations (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Hero & Focus Areas Card */}
                        <div className="bg-[#0a192f]/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                            
                            <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                                <div className="relative w-20 h-20 flex-shrink-0">
                                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
                                    <LightBulbIcon className="w-full h-full text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-1">Hello {user?.firstName || 'Student'}!</h2>
                                    <p className="text-gray-400 text-sm">Based on your recent activity, here are your personalized focus areas to maximize score growth.</p>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <ArrowTrendingUpIcon className="w-4 h-4 text-cyan-400" /> High Impact Topics
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {weakTopics.slice(0, 4).map((topic, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => navigate(`/tests?topic=${topic.name}`)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e293b]/50 border border-[#334155] rounded-full text-[10px] font-bold text-gray-300 hover:text-white hover:border-purple-500/50 transition-all hover:scale-105"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                                                {topic.name}
                                            </button>
                                        ))}
                                        {weakTopics.length === 0 && <span className="text-xs text-gray-500 italic">No weak topics identified!</span>}
                                    </div>
                                </div>

                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <AcademicCapIcon className="w-4 h-4 text-purple-400" /> Mentorship Advice
                                    </h4>
                                    <ul className="space-y-2">
                                        {(ai.mentorship || ["Consistent practice is the key to success.", "Keep pushing your boundaries!"]).map((advice, i) => (
                                            <li key={i} className="text-[11px] text-gray-400 flex gap-2">
                                                <span className="text-purple-500 font-bold">•</span>
                                                {advice}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Recommendations Row */}
                        <div className="bg-[#0a192f]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-white font-bold">Suggested Learning Path</h4>
                                <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/20">Updated Live</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {ai.recommendations && ai.recommendations.length > 0 ? (
                                    ai.recommendations.map((rec, i) => (
                                        <div 
                                            key={rec.id || i} 
                                            onClick={() => navigate(rec.link)}
                                            className="group bg-white/5 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer flex flex-col h-full"
                                        >
                                            <div className={`w-8 h-8 rounded-lg ${i === 0 ? 'bg-blue-500/20 text-blue-400' : i === 1 ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                                <RocketLaunchIcon className="w-4 h-4" />
                                            </div>
                                            <h5 className="text-sm font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{rec.title}</h5>
                                            <div className="mt-auto flex items-center justify-between">
                                                <span className="text-[10px] text-gray-400 flex items-center gap-1"><ClockIcon className="w-3 h-3" /> {rec.duration}</span>
                                                <div className="text-[10px] text-purple-400 font-bold flex items-center group-hover:translate-x-1 transition-transform">
                                                    Start <ChevronRightIcon className="w-3 h-3 ml-0.5" />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-500 py-4 col-span-3 text-center italic">Take more tests to unlock personalized recommendations.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Stats & Comparison (1/3 width) */}
                    <div className="space-y-6">
                        
                        {/* Prediction Cards Stacked */}
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                            <div className="bg-gradient-to-br from-purple-900/40 to-[#0a192f] p-5 rounded-xl border border-purple-500/20 relative overflow-hidden shadow-lg">
                                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>
                                <h4 className="text-purple-300 text-[10px] font-black uppercase tracking-widest mb-1">AI Prediction</h4>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-3xl font-black text-white">{ai.predictedScore || '--'}%</span>
                                    <span className="text-green-400 text-[10px] font-bold flex items-center mb-1">
                                        <ArrowTrendingUpIcon className="w-3 h-3 mr-0.5" /> Trend
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-400 leading-tight">Projected score based on recent growth patterns.</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-900/40 to-[#0a192f] p-5 rounded-xl border border-blue-500/20 relative overflow-hidden shadow-lg">
                                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
                                <h4 className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">Daily Target</h4>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-3xl font-black text-white">{ai.recommendedPracticeTime || '30m'}</span>
                                    <span className="text-blue-200 text-[10px] font-bold mb-1">Optimal</span>
                                </div>
                                <p className="text-[10px] text-gray-400 leading-tight">Recommended practice to clear weak nodes.</p>
                            </div>
                        </div>

                        {/* Skill Radar Card */}
                        <div className="bg-[#0a192f]/80 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-white text-xs font-bold uppercase tracking-wider">Skill Spectrum</h4>
                                <SparklesIcon className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="h-[200px] relative">
                                {ai.skillRadar && ai.skillRadar.length > 2 ? (
                                    <Radar 
                                        data={{
                                            labels: ai.skillRadar.map(s => s.subject.length > 10 ? s.subject.substring(0, 8) + '..' : s.subject),
                                            datasets: [{
                                                label: 'Your Aptitude',
                                                data: ai.skillRadar.map(s => s.value),
                                                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                                                borderColor: '#a855f7',
                                                pointBackgroundColor: '#a855f7',
                                                borderWidth: 2,
                                            }, {
                                                label: 'Community Avg',
                                                data: ai.skillRadar.map(() => 65),
                                                backgroundColor: 'transparent',
                                                borderColor: 'rgba(56, 189, 248, 0.4)',
                                                borderWidth: 1,
                                                pointRadius: 0,
                                                borderDash: [5, 5]
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: {
                                                r: {
                                                    angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
                                                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                                                    pointLabels: { font: { size: 8 }, color: '#94a3b8' },
                                                    ticks: { display: false, min: 0, max: 100 }
                                                }
                                            },
                                            plugins: { legend: { display: false } }
                                        }}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-white/5 rounded-lg">
                                        <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">Processing Skills...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Community Standing Card */}
                        <div className="bg-[#0a192f]/80 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg">
                            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Peer Comparison</h4>
                            <div className="space-y-4">
                                {ai.communityComparison && ai.communityComparison.length > 0 ? (
                                    ai.communityComparison.slice(0, 3).map((comp, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-[11px] mb-1.5">
                                                <span className="text-gray-300 font-medium">{comp.subject}</span>
                                                <span className={comp.user >= comp.community ? 'text-green-400' : 'text-orange-400'}>{comp.user >= comp.community ? 'Above Avg' : 'Below Avg'}</span>
                                            </div>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                                                <div className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 z-10 shadow-[0_0_8px_rgba(34,211,238,0.8)]" style={{ left: `${comp.community}%` }}></div>
                                                <div className={`h-full rounded-full transition-all duration-1000 ${comp.user >= comp.community ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${comp.user}%` }}></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[10px] text-gray-500 text-center">Complete topics to see peer standing.</p>
                                )}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                <span>Global Percentile</span>
                                <span className="text-white">Calculating...</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    };


    const renderStudyPlanner = () => {
        const activeDays = performance?.activeDays || [];
        const weeklyProgress = performance?.weeklyProgress || ['0%', '0%', '0%', '0%', '0%', '0%', '0%'];
        
        // Filter tasks by selectedDate
        const filteredTasks = studyPlan?.tasks?.filter(task => {
            if (!task.dueDate) return false;
            return new Date(task.dueDate).toDateString() === selectedDate.toDateString();
        }) || [];
        
        const completedCount = filteredTasks.filter(t => t.isCompleted).length;
        const totalCount = filteredTasks.length;
        const progressValue = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

        const isPastDate = new Date(selectedDate.getTime()).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
        const isToday = new Date(selectedDate.getTime()).setHours(0,0,0,0) === new Date().setHours(0,0,0,0);
        
        const dayActivities = activities.filter(act => {
            return new Date(act.completedAt).toDateString() === selectedDate.toDateString();
        });

        const handleQuickAdd = async (text, category) => {
            try {
                const token = await getToken();
                await api.post('/study-plan/tasks', { text, time: '30m', category, dueDate: selectedDate }, { headers: { Authorization: `Bearer ${token}` } });
                fetchStudyPlan();
            } catch (err) { console.error(err); }
        };

        const getCategoryColors = (cat) => {
            switch(cat?.toLowerCase()) {
                case 'practice': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
                case 'theory': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
                case 'revision': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
                default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
            }
        };

        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    
                    {/* LEFT COLUMN: Goals & Tasks */}
                    <div className="xl:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl shadow-indigo-100/20 dark:shadow-none flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                        
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div>
                                <h4 className="text-gray-900 dark:text-white font-black text-lg tracking-tight">Daily Planner</h4>
                                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Completion</p>
                                    <p className="text-sm font-black text-gray-900 dark:text-white leading-none">{progressValue}%</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center p-1">
                                    <svg viewBox="0 0 36 36" className="w-full h-full text-indigo-600 circular-chart">
                                        <path className="text-gray-200 dark:text-gray-700" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path strokeDasharray={`${progressValue}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* AI Quick Adds - Hide if past */}
                        {!isPastDate && performance?.aiInsights?.recommendations?.length > 0 && (
                            <div className="mb-4 relative z-10">
                                <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 flex items-center gap-1"><SparklesIcon className="w-3 h-3 text-amber-500"/> AI Suggestions</p>
                                <div className="flex flex-wrap gap-2">
                                    {performance.aiInsights.recommendations.slice(0, 3).map((rec, i) => (
                                        <button key={i} onClick={() => handleQuickAdd(`AI: ${rec.title}`, rec.type === 'theory' ? 'Theory' : 'Practice')} className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded-lg border border-amber-200/50 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors flex items-center shadow-sm">
                                            <PlusIcon className="w-3 h-3 mr-1" /> {rec.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!isPastDate && (
                            <form onSubmit={addTask} className="mb-6 flex gap-2 relative z-10">
                                <input name="text" required placeholder="Custom task..." className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                                <select name="category" className="w-28 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm">
                                    <option value="Practice">Practice</option>
                                    <option value="Theory">Theory</option>
                                    <option value="Revision">Revision</option>
                                    <option value="General">General</option>
                                </select>
                                <input name="time" required placeholder="30m" defaultValue="30m" className="w-20 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 dark:text-white shadow-sm text-center" />
                                <button type="submit" className="px-4 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center shrink-0"><PlusIcon className="w-5 h-5"/></button>
                            </form>
                        )}

                        <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar relative z-10 min-h-[200px]">
                            {/* Combined View for filtered planned tasks + actual dayActivities */}
                            <div className="space-y-2 mb-4">
                                {isPastDate && dayActivities.length > 0 && (
                                    <>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1">
                                            <CheckBadgeIcon className="w-3 h-3"/> Completed Activities
                                        </p>
                                        {dayActivities.map(act => (
                                            <div key={act._id} className="flex items-center justify-between p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-500/20">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                        <ClockIcon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{act.title}</p>
                                                        <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-tight">Performed on this day</p>
                                                    </div>
                                                </div>
                                                {act.activityType === 'practice_test' && (
                                                    <span className="text-xs font-black text-emerald-600 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg border border-emerald-100 shadow-sm">{act.metadata?.score} Points</span>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>

                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2">Planned Objectives</p>
                            {loadingStudyPlan ? <div className="animate-spin h-6 w-6 border-b-2 border-indigo-600 mx-auto py-10"></div> : filteredTasks.length > 0 ? (
                                filteredTasks.map(item => (
                                    <div key={item._id} className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 group ${item.isCompleted ? 'bg-gray-50 dark:bg-gray-900/30 border-transparent opacity-60' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900'}`}>
                                        <div className="flex items-center gap-4 flex-1">
                                            <button 
                                                disabled={isPastDate}
                                                onClick={() => toggleTask(item._id, item.isCompleted)} 
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${item.isCompleted ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 dark:border-gray-500 hover:border-indigo-400'} ${isPastDate && 'cursor-not-allowed opacity-50'}`}>
                                                {item.isCompleted && <CheckIcon className="w-4 h-4 text-white" />}
                                            </button>
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-bold ${item.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-gray-200'}`}>{item.text}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border rounded-md ${getCategoryColors(item.category)}`}>{item.category || 'General'}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 flex items-center"><ClockIcon className="w-3 h-3 mr-1 opacity-70"/>{item.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {!isPastDate && (
                                            <button onClick={() => deleteTask(item._id)} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center mb-3"><SparklesIcon className="w-6 h-6 text-gray-300 dark:text-gray-600"/></div>
                                    <p className="text-sm font-bold text-gray-400">No planned objectives for this day.</p>
                                    {!isPastDate && <p className="text-[10px] text-gray-400/70 uppercase tracking-widest mt-1">Plan your next milestone!</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Calendar & Velocity */}
                    <div className="flex flex-col gap-6">
                        
                        {/* Interactive Calendar */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl shadow-indigo-100/20 dark:shadow-none">
                            <div className="flex items-center justify-between mb-5">
                                <h4 className="text-gray-900 dark:text-white font-black text-[12px] uppercase tracking-wider">Calendar</h4>
                                <div className="flex gap-1">
                                    <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400"><ChevronLeftIcon className="w-4 h-4"/></button>
                                    <p className="text-xs font-bold text-indigo-600 self-center min-w-[70px] text-center">{selectedDate.toLocaleString('default', { month: 'short', year: 'numeric' })}</p>
                                    <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400"><ChevronRightIcon className="w-4 h-4"/></button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-7 mb-2 text-center">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d} className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{d}</span>)}
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {Array.from({ length: 42 }).map((_, i) => {
                                    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
                                    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
                                    const dayNum = i - firstDay + 1; 
                                    const isCurr = dayNum > 0 && dayNum <= daysInMonth; 
                                    const isToday = new Date().toDateString() === new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dayNum).toDateString();
                                    const isSelected = selectedDate.getDate() === dayNum && isCurr;
                                    const hasData = isCurr && activeDays.includes(dayNum) && selectedDate.getMonth() === new Date().getMonth();
                                    
                                    return (
                                        <div key={i} 
                                             onClick={() => isCurr && setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dayNum))}
                                             className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-bold transition-all relative ${!isCurr ? 'opacity-0 pointer-events-none' : 'cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/30'} ${isSelected ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-none' : isToday ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : hasData ? 'bg-emerald-500/20 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {isCurr ? dayNum : ''}
                                            {hasData && !isSelected && <div className="w-1 h-1 rounded-full absolute bottom-1 bg-emerald-500"></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Velocity Breakdown */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl shadow-indigo-100/20 dark:shadow-none flex-1">
                            <h4 className="text-gray-900 dark:text-white font-black text-[12px] mb-6 uppercase tracking-widest text-center">Weekly Velocity</h4>
                            <div className="flex justify-between items-end h-32 px-2">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                                    const isToday = new Date().getDay() === (idx + 1) % 7; 
                                    const progress = weeklyProgress[idx] || '0%';
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-2 group cursor-default">
                                            <div className="w-6 relative h-full bg-gray-50 dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-700/50 overflow-hidden flex flex-col justify-end shadow-inner">
                                                <div className={`w-full transition-all duration-1000 ${isToday ? 'bg-gradient-to-t from-indigo-600 to-indigo-400' : 'bg-gradient-to-t from-indigo-300 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 group-hover:from-indigo-400 group-hover:to-indigo-300'}`} style={{ height: progress }}></div>
                                            </div>
                                            <p className={`text-[9px] font-black uppercase ${isToday ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>{day}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    };

    const renderActivity = () => (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Timeline Log</h4>
                <div className="flex bg-gray-100 dark:bg-gray-900/50 p-1 rounded-lg border border-gray-100 shadow-inner">
                    <button className="px-4 py-1 bg-white dark:bg-gray-800 text-indigo-600 text-[9px] font-black rounded-md uppercase tracking-widest shadow-sm">Full View</button>
                    <button className="px-4 py-1 text-gray-500 text-[9px] font-black rounded-md uppercase tracking-widest hover:text-indigo-600">Tests Only</button>
                </div>
            </div>
            {loadingActivities ? <div className="animate-spin h-6 w-6 border-b-2 border-indigo-600 mx-auto py-10"></div> : activities.length > 0 ? (
                <div className="space-y-3">
                    {activities.map((act) => (
                        <div key={act._id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between group hover:border-indigo-500/40 transition-all shadow-sm hover:shadow-lg">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center border group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"><ClockIcon className="w-6 h-6" /></div>
                                <div><h3 className="text-[14px] font-black text-gray-900 dark:text-white leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{act.title}</h3><p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{new Date(act.completedAt).toLocaleDateString()} &bull; {new Date(act.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></div>
                            </div>
                            <div className="flex items-center gap-6 h-full">
                                {act.activityType === 'practice_test' && (<div className="text-right px-4 h-10 border-r-2 border-dashed border-gray-100 dark:border-gray-700 flex flex-col justify-center"><p className="text-xl font-black text-indigo-600 leading-none">{act.metadata?.score}</p><p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Points</p></div>)}
                                <div className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-xl transition-all"><ArrowUpRightIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" /></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : <p className="text-center py-20 text-gray-300 font-black uppercase text-[12px] tracking-[0.2em] border-2 border-dashed border-gray-100 rounded-3xl">Timeline is empty</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a192f] to-[#020c1b] text-gray-100 transition-colors duration-500 overflow-x-hidden">
            <div className="max-w-full mx-auto px-6 py-8 space-y-8">
                
                {/* Minimal Header */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-[#112240]/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-6">
                        <img src={user?.imageUrl} alt={user?.fullName} className="w-16 h-16 rounded-full border-2 border-cyan-500/50 object-cover shadow-[0_0_15px_rgba(34,211,238,0.3)]" />
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-white">{user?.fullName}</h1>
                            <p className="text-xs text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
                        </div>
                    </div>
                    <SignOutButton>
                        <button className="flex items-center gap-2 px-6 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-xl hover:bg-rose-500 hover:text-white transition-all duration-300">
                            <ArrowLeftOnRectangleIcon className="w-4 h-4" /> Exit
                        </button>
                    </SignOutButton>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Navigation Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-[#112240]/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 space-y-2 sticky top-8 shadow-xl">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 py-3 opacity-70 border-b border-white/5 mb-2">Modules</p>
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 font-bold text-sm ${activeTab === tab.id ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'animate-pulse text-cyan-400' : ''}`} /><span>{tab.title}</span>{activeTab === tab.id && <ChevronRightIcon className="w-4 h-4 ml-auto opacity-70" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-h-[500px]">
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {activeTab === 'performance' && renderPerformance()}
                            {activeTab === 'ai-mentor' && renderAIMentor()}
                            {activeTab === 'planner' && renderStudyPlanner()}
                            {activeTab === 'activity' && renderActivity()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
