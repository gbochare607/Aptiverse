import React from 'react';

export default function QuestionCard({ question, selectedOption, onSelect }) {
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {question.text}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Topic: {question.topics?.join(', ')} | Difficulty: {question.difficulty}
                </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                    {question.options.map((option) => (
                        <div
                            key={option.id}
                            className={`py-4 sm:py-5 sm:px-6 cursor-pointer hover:bg-gray-50 flex items-center ${selectedOption === option.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
                            onClick={() => onSelect(option.id)}
                        >
                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center mr-3 ${selectedOption === option.id ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}>
                                {selectedOption === option.id && <div className="h-2 w-2 rounded-full bg-white" />}
                            </div>
                            <dt className="text-sm font-medium text-gray-500">
                                {option.text}
                            </dt>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}
