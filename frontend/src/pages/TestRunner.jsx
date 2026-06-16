import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';
import { useAuth } from '@clerk/clerk-react';
import { PlayCircleIcon, BookOpenIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { allTopics } from '../constants/practice';

export default function TestRunner() {
    const { testId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [attemptId, setAttemptId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null); // in seconds
    const [testTitle, setTestTitle] = useState('Assessment');
    const [testResult, setTestResult] = useState(null); // Score Analysis
    const [showTutorial, setShowTutorial] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [topicMetadata, setTopicMetadata] = useState(null);

    useEffect(() => {
        const initializeTest = async () => {
            try {
                const token = await getToken();
                let attemptData;

                try {
                    // Try to fetch as existing attempt first
                    const res = await api.get(`/tests/attempts/${testId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    attemptData = res.data;
                } catch (e) {
                    // If not an attempt, start a new one (it's a Test ID)
                    const res = await api.post('/tests/start', {
                        testType: 'test',
                        testId: testId
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    // Fetch the newly created attempt to get questions and duration
                    const attemptRes = await api.get(`/tests/attempts/${res.data.attemptId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    attemptData = attemptRes.data;
                }

                setAttemptId(attemptData.attemptId);
                setQuestions(attemptData.questions);
                setTestTitle(attemptData.title);

                if (attemptData.status === 'completed' && attemptData.result) {
                    setTestResult(attemptData.result);
                }

                const start = new Date(attemptData.startTime).getTime();
                const now = new Date().getTime();
                const elapsedSeconds = Math.floor((now - start) / 1000);
                const totalSeconds = attemptData.duration * 60;
                setTimeLeft(Math.max(0, totalSeconds - elapsedSeconds));

                // Find topic metadata for tutorial
                if (attemptData.practiceTopic) {
                    const meta = allTopics.find(t => t.id === attemptData.practiceTopic);
                    setTopicMetadata(meta);
                }

                setLoading(false);
            } catch (error) {
                console.error(error);
                alert('Failed to initialize test. Make sure you are authorized.');
                navigate('/dashboard');
            }
        };
        initializeTest();
    }, [testId, navigate, getToken]);

    // Timer logic
    useEffect(() => {
        if (testTitle === 'Practice Session' || timeLeft === null || timeLeft <= 0 || submitting) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true); // Auto-submit
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, submitting]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleSelect = async (optionId) => {
        const currentQ = questions[currentQIndex];
        setAnswers({ ...answers, [currentQ._id]: optionId });

        try {
            const token = await getToken();
            await api.post(`/tests/${attemptId}/answer`, {
                questionId: currentQ._id,
                selectedOption: optionId,
                timeTaken: 10
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (e) { console.error('Auto-save failed', e); }
    };

    const handleNext = () => {
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentQIndex > 0) {
            setCurrentQIndex(currentQIndex - 1);
        }
    };

    const handleSubmit = async (isAuto = false) => {
        if (!isAuto && !window.confirm('Are you sure you want to finish?')) return;
        setSubmitting(true);
        try {
            const token = await getToken();
            const res = await api.post(`/tests/${attemptId}/submit`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Show Result View instead of navigating
            if (testTitle !== 'Practice Session') {
                setTestResult(res.data);
            } else {
                navigate('/practice');
            }
        } catch (error) {
            console.error(error);
            alert('Submit failed');
        }
    };

    const handleBackToPractice = () => {
        navigate('/practice');
    };

    // --- RENDER RESULT VIEW ---
    if (testResult) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl max-w-2xl w-full p-8 border border-gray-100 dark:border-gray-700">
                    <div className="text-center mb-8">
                        <div className="inline-flex p-4 rounded-full bg-green-100 text-green-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Test Completed!</h2>
                        <p className="text-gray-500">Here is your performance summary</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-center">
                            <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-1">Score</div>
                            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{testResult.score} / {questions.length}</div>
                        </div>
                        <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-center">
                            <div className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-1">Accuracy</div>
                            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{Math.round((testResult.correctAnswers / questions.length) * 100)}%</div>
                        </div>
                        <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl text-center">
                            <div className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-1">Correct</div>
                            <div className="text-3xl font-black text-purple-600 dark:text-purple-400">{testResult.correctAnswers}</div>
                        </div>
                    </div>

                    <button
                        onClick={handleBackToPractice}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                        Back to Practice Hub
                    </button>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Preparing your session...</p>
        </div>
    );

    const currentQ = questions[currentQIndex];

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-500 font-medium">No questions found for this session.</p>
                <button onClick={() => navigate('/practice')} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            {/* Header / StatusBar */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Go Back"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-md">{testTitle}</h1>
                            <p className="text-xs text-gray-500 font-medium">Question {currentQIndex + 1} of {questions.length}</p>
                        </div>
                    </div>

                    {/* Navigation Tabs for Practice */}
                    {testTitle === 'Practice Session' && topicMetadata?.youtubeId && (
                        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-2xl border border-gray-200 dark:border-gray-600">
                            <button
                                onClick={() => { setShowTutorial(true); setShowSummary(false); }}
                                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all ${
                                    showTutorial 
                                    ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <PlayCircleIcon className="w-4 h-4" />
                                Watch Tutorial
                            </button>
                            <button
                                onClick={() => setShowTutorial(false)}
                                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all ${
                                    !showTutorial 
                                    ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <BookOpenIcon className="w-4 h-4" />
                                Practice Questions
                            </button>
                        </div>
                    )}

                    {/* Only show timer if NOT practice */}
                    {testTitle !== 'Practice Session' && (
                        <div className={`px-4 py-2 rounded-xl font-mono text-lg font-bold flex items-center shadow-inner ${timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-indigo-50 text-indigo-600'}`}>
                            <ClockIcon2 className="w-5 h-5 mr-2" />
                            {formatTime(timeLeft)}
                        </div>
                    )}
                </div>
            </div>

            <div className={`max-w-7xl mx-auto py-8 px-4`}>
                <div className={`grid grid-cols-1 ${showTutorial ? 'lg:grid-cols-4' : 'lg:grid-cols-4'} gap-8`}>
                    
                    {/* Sidebar Progress Panel - Hide in Tutorial Mode */}
                    {!showTutorial && (
                        <div className="lg:col-span-1 order-2 lg:order-1">
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm sticky top-24">
                                <h3 className="text-xs font-black text-slate-900 dark:text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-indigo-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25v-2.25z" />
                                    </svg>
                                    Question Paper
                                </h3>

                                <div className="grid grid-cols-5 g-2 gap-2">
                                    {questions.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentQIndex(i)}
                                            className={`h-10 w-10 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center border-2 ${i === currentQIndex
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none scale-110 z-10'
                                                : answers[questions[i]._id]
                                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-900/30'
                                                    : 'bg-gray-50 border-gray-100 text-gray-400 dark:bg-gray-700/50 dark:border-gray-700 dark:text-gray-500 hover:border-indigo-200 hover:text-indigo-500'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-700 space-y-4">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                        Answered: {Object.keys(answers).length}
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
                                        Remaining: {questions.length - Object.keys(answers).length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content Area */}
                    <div className={`${showTutorial ? 'lg:col-span-4 max-w-4xl mx-auto w-full' : 'lg:col-span-3'} order-1 lg:order-2 transition-all duration-500`}>
                        {showTutorial && topicMetadata?.youtubeId ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-2xl">
                                    <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-500/10 rounded-xl">
                                                <PlayCircleIcon className="w-5 h-5 text-red-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">{topicMetadata.name} Tutorial</h3>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Mastering the Concepts</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Reduced Height Video Container */}
                                    <div className="relative w-full overflow-hidden bg-black" style={{ height: '320px' }}>
                                        <iframe
                                            className="absolute inset-0 w-full h-full"
                                            src={`https://www.youtube.com/embed/${topicMetadata.youtubeId}?autoplay=1`}
                                            title="Tutorial"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                    
                                    {/* Footer Actions */}
                                    <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <button 
                                            onClick={() => setShowSummary(!showSummary)}
                                            className={`px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 ${
                                                showSummary 
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                                                : 'bg-white dark:bg-gray-700 text-indigo-600 border border-indigo-100 dark:border-gray-600 hover:bg-indigo-50'
                                            }`}
                                        >
                                            <BookOpenIcon className="w-4 h-4" />
                                            {showSummary ? 'Hide Summary' : 'Summarize Video'}
                                        </button>
                                        
                                        <button 
                                            onClick={() => setShowTutorial(false)}
                                            className="px-8 py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl"
                                        >
                                            Go to Practice →
                                        </button>
                                    </div>
                                </div>

                                {/* Summary Section */}
                                {showSummary && topicMetadata.summary && (
                                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] p-8 border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
                                        <h4 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <div className="w-1 h-4 bg-indigo-600 rounded-full" />
                                            Key Concepts Summary
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {topicMetadata.summary.split('\n').map((point, i) => (
                                                <div key={i} className="flex items-start gap-3 bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-white dark:border-gray-700 shadow-sm transition-all hover:translate-x-1">
                                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{point.replace('• ', '')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <QuestionCard
                                    question={currentQ}
                                    selectedOption={currentQ ? answers[currentQ._id] : null}
                                    onSelect={handleSelect}
                                    isPractice={testTitle === 'Practice Session'}
                                    correctAnswer={testTitle === 'Practice Session' ? currentQ.correctOption : null}
                                />

                                {/* Navigation Buttons */}
                                <div className="flex justify-center items-center gap-6 mt-10">
                                    <button
                                        disabled={currentQIndex === 0}
                                        onClick={handlePrev}
                                        className="px-8 py-3 rounded-2xl border-2 border-indigo-100 dark:border-gray-700 font-bold text-slate-500 hover:border-indigo-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white dark:hover:border-indigo-500 disabled:opacity-30 disabled:hover:border-indigo-100 transition-all text-sm flex items-center gap-2 group"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                        </svg>
                                        Previous
                                    </button>

                                    {currentQIndex === questions.length - 1 ? (
                                        <>
                                            {testTitle !== 'Practice Session' && (
                                                <button
                                                    onClick={() => handleSubmit(false)}
                                                    disabled={submitting}
                                                    className="px-10 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all text-sm flex items-center gap-2 hover:scale-105"
                                                >
                                                    {submitting ? 'Submitting...' : 'Finish Test'}
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                </button>
                                            )}
                                            {testTitle === 'Practice Session' && (
                                                <div className="px-6 py-3 text-sm font-bold text-slate-400 italic bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                                    End of Questions
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleNext}
                                            className="px-10 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all text-sm flex items-center gap-2 group hover:scale-105"
                                        >
                                            Next
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const ClockIcon2 = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
