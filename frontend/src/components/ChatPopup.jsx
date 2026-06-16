import React, { useState, useRef, useEffect } from 'react';
import {
    XMarkIcon,
    PaperAirplaneIcon,
    SparklesIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function ChatPopup({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your AptiVerse AI assistant. How can I help you with your preparation today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newUserMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDytPVXOANWt29GZPNh8F7j0-7GpUjZEmk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: input }] }]
                })
            });
            const data = await response.json();
            
            let replyText = "I'm sorry, I couldn't process that request.";
            if (data.error) {
                console.error("Gemini API Error Detail:", data.error);
                replyText = `API Error: ${data.error.message}`;
            } else if (data.candidates && data.candidates.length > 0) {
                replyText = data.candidates[0].content.parts[0].text;
            }
            
            const aiMsg = {
                id: Date.now() + 1,
                text: replyText,
                sender: 'ai'
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error('Gemini API Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                sender: 'ai'
            }]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-[100px] right-8 w-[min(380px,90vw)] h-[min(550px,calc(100vh_-_140px))] z-[60] flex flex-col animate-in slide-in-from-bottom-5 duration-300">
            {/* Glass Background Shell */}
            <div className="flex-1 bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/60 dark:border-white/10 overflow-hidden flex flex-col">

                {/* Header */}
                <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                            <SparklesIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm tracking-tight">AptiVerse AI</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-[10px] text-white/70 font-medium font-mono uppercase tracking-wider">Online</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white/80 hover:text-white"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Chat Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar"
                >
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm transition-all
                                ${msg.sender === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                                    : 'bg-white dark:bg-white/5 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-white/10'
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5">
                    <form onSubmit={handleSend} className="relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="w-full bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-white/10 rounded-2xl py-3.5 pl-4 pr-14 text-sm focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 transition-all text-gray-900 dark:text-white shadow-inner"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
                        >
                            <PaperAirplaneIcon className="w-4 h-4" />
                        </button>
                    </form>
                    <p className="text-[10px] text-center mt-3 text-gray-400 font-medium">
                        AptiVerse AI can make mistakes. Verify important info.
                    </p>
                </div>
            </div>
        </div>
    );
}
