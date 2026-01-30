import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';

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

                // Calculate time left
                const start = new Date(attemptData.startTime).getTime();
                const now = new Date().getTime();
                const elapsedSeconds = Math.floor((now - start) / 1000);
                const totalSeconds = attemptData.duration * 60;
                setTimeLeft(Math.max(0, totalSeconds - elapsedSeconds));

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
        if (timeLeft === null || timeLeft <= 0 || submitting) return;

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
            await api.post(`/tests/${attemptId}/submit`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Submit failed');
        }
        setSubmitting(false);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Preparing your session...</p>
        </div>
    );

    const currentQ = questions[currentQIndex];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            {/* Header / StatusBar */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-md">{testTitle}</h1>
                        <p className="text-xs text-gray-500 font-medium">Question {currentQIndex + 1} of {questions.length}</p>
                    </div>

                    <div className={`px-4 py-2 rounded-xl font-mono text-lg font-bold flex items-center shadow-inner ${timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-indigo-50 text-indigo-600'}`}>
                        <ClockIcon2 className="w-5 h-5 mr-2" />
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto py-8 px-4">
                <QuestionCard
                    question={currentQ}
                    selectedOption={answers[currentQ._id]}
                    onSelect={handleSelect}
                />

                <div className="mt-10 flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <button
                        disabled={currentQIndex === 0}
                        onClick={handlePrev}
                        className="px-6 py-2.5 rounded-xl border-2 border-gray-100 dark:border-gray-700 font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 transition-all text-sm"
                    >
                        Previous
                    </button>

                    <div className="hidden sm:flex gap-1">
                        {questions.map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i === currentQIndex ? 'bg-indigo-600' : answers[questions[i]._id] ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        ))}
                    </div>

                    {currentQIndex === questions.length - 1 ? (
                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={submitting}
                            className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all text-sm"
                        >
                            {submitting ? 'Submitting...' : 'Finish Test'}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all text-sm"
                        >
                            Next Question
                        </button>
                    )}
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
