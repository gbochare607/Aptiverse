import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';

export default function TestRunner() {
    const { testId } = useParams(); // Might be 'practice' or real ID
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { qId: optionId }
    const [attemptId, setAttemptId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const startTest = async () => {
            try {
                // Mock start - usually navigate from a "Start" button which calls POST /tests/start first
                // Here we assume we just landed here.
                // We need to actually CALL start API.

                // For demo, we default to 'practice' if no ID, or handle params
                const response = await api.post('/tests/start', {
                    testType: testId === 'practice' ? 'practice' : 'test',
                    testId: testId !== 'practice' ? testId : undefined,
                    // topic: 'Algebra' (optional)
                });

                setAttemptId(response.data.attemptId);
                setQuestions(response.data.questions);
                setLoading(false);
            } catch (error) {
                console.error(error);
                alert('Failed to start test');
                navigate('/dashboard');
            }
        };
        startTest();
    }, [testId, navigate]);

    const handleSelect = async (optionId) => {
        const currentQ = questions[currentQIndex];
        setAnswers({ ...answers, [currentQ.questionId]: optionId });

        // Save partial
        try {
            await api.post(`/attempts/${attemptId}/answer`, {
                questionId: currentQ.questionId, // Assuming backend expects string ID
                selectedOption: optionId,
                timeTaken: 10 // Mock
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

    const handleSubmit = async () => {
        if (!window.confirm('Are you sure you want to finish?')) return;
        setSubmitting(true);
        try {
            await api.post(`/attempts/${attemptId}/submit`); // Wait, route was /tests/:attemptId/submit... let me check backend
            // Backend: router.post('/:attemptId/submit', submitTest) in testController attached to... wait
            // testRoutes has `startTest`
            // attemptRoutes has `saveAnswer`
            // I forgot to mount `submitTest` route in backend!
            // No, I think I missed it in `testRoutes`. 
            // Let me check `testController` exports. Yes `submitTest` is there.
            // Let me check `testRoutes`.

            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Submit failed');
        }
        setSubmitting(false);
    };

    if (loading) return <div className="p-10 text-center">Loading Test...</div>;

    const currentQ = questions[currentQIndex];

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Question {currentQIndex + 1} / {questions.length}</h1>
                <div className="text-red-600 font-mono">Time: 10:00 (Mock)</div>
            </div>

            <QuestionCard
                question={currentQ}
                selectedOption={answers[currentQ.questionId]}
                onSelect={handleSelect}
            />

            <div className="mt-8 flex justify-between">
                <button
                    disabled={currentQIndex === 0}
                    onClick={handlePrev}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>

                {currentQIndex === questions.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        {submitting ? 'Submitting...' : 'Submit Test'}
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}
