import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, LogOut, Plus, Sparkles, MessageSquare, Menu, X } from 'lucide-react';

const Dashboard = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeSessionId, setActiveSessionId] = useState(null);

    const messagesEndRef = useRef(null);

    // Get user email from localStorage
    const savedEmail = localStorage.getItem('user_email');
    const [userEmail, setUserEmail] = useState(savedEmail || "");

    useEffect(() => {
        if (!savedEmail) {
            window.location.href = '/login';
        }
    }, [savedEmail]);

    // Use the email for display
    const user = {
        name: userEmail ? userEmail.split('@')[0] : "User",
        email: userEmail,
        initials: userEmail ? userEmail.substring(0, 2).toUpperCase() : "US"
    };

    // --- Speech Recognition ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    useEffect(() => {
        if (recognition) {
            recognition.continuous = false;
            recognition.onresult = (event) => {
                setInput(event.results[0][0].transcript);
                setIsListening(false);
            };
            recognition.onend = () => setIsListening(false);
        }
    }, [recognition]);

    const toggleListening = () => {
        if (isListening) recognition?.stop();
        else { setIsListening(true); recognition?.start(); }
    };

    // --- History & Session Management ---
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/chat_history?email=${userEmail}`);
                if (response.ok) {
                    const data = await response.json();
                    setHistory(data.history || []);
                }
            } catch (err) {
                console.error("Failed to load history:", err);
            }
        };

        fetchChatHistory();
    }, []);

    // Scroll to bottom whenever messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const startNewChat = () => {
        setMessages([]);
        setActiveSessionId(null);
        setInput('');
    };

    const loadSession = async (sessionId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/chat_history/${sessionId}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data.messages);
                setActiveSessionId(sessionId);
            }
        } catch (err) {
            console.error("Error loading chat:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAsk = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('http://127.0.0.1:8000/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.content,
                    user_email: userEmail,
                    session_id: activeSessionId,
                    system_prompt: "You are a helpful assistant."
                }),
            });

            if (!res.ok) throw new Error('Backend failed');

            const data = await res.json();
            setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]); // Assuming backend returns { response: "..." }

            // If this was a new session, update active ID and refresh history
            if (!activeSessionId && data.session_id) {
                setActiveSessionId(data.session_id);
                // Optionally refresh history list here
                const historyRes = await fetch(`http://127.0.0.1:8000/chat_history?email=${userEmail}`);
                if (historyRes.ok) {
                    const historyData = await historyRes.json();
                    setHistory(historyData.history || []);
                }
            }
        } catch (e) {
            setMessages((prev) => [...prev, { role: 'assistant', content: "Connection error. Ensure your backend is running." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        console.log("Logging out user...");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    };

    return (
        <div className="flex h-screen bg-[#171717] text-white font-sans overflow-hidden">

            {/* --- Sidebar --- */}
            <aside
                className={`${isSidebarOpen ? 'w-[260px]' : 'w-0'} bg-[#212121] flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden flex flex-col border-r border-white/5`}
            >
                <div className="p-3">
                    <button
                        onClick={startNewChat}
                        className="flex items-center gap-3 px-3 py-3 w-full text-sm text-white bg-transparent hover:bg-[#2f2f2f] rounded-lg transition-colors border border-white/10 hover:border-white/5"
                    >
                        <div className="p-1 bg-white text-black rounded-full"><Plus size={14} strokeWidth={3} /></div>
                        <span className="font-medium">New Chat</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-2">
                    <div className="text-xs font-medium text-gray-500 mb-2 px-2">Recent</div>
                    <div className="space-y-1">
                        {history.length > 0 ? history.map((item, idx) => (
                            <button
                                key={item.id || idx}
                                onClick={() => loadSession(item.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate flex items-center gap-2 transition-colors ${activeSessionId === item.id ? 'bg-[#2f2f2f] text-white' : 'text-gray-300 hover:bg-[#2f2f2f]'}`}
                            >
                                <MessageSquare size={14} className="opacity-70" />
                                <span className="truncate">{item.title || `Conversation ${idx + 1}`}</span>
                            </button>
                        )) : (
                            <p className="text-xs text-gray-500 px-2 italic">No chat history</p>
                        )}
                    </div>
                </div>

                <div className="p-3 border-t border-white/5">
                    <div className="group relative">
                        <button className="flex items-center gap-3 w-full px-2 py-2 hover:bg-[#2f2f2f] rounded-lg transition-colors text-left">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold ring-1 ring-white/10">
                                {user.initials}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                            </div>
                        </button>
                        {/* Mini User Popover (Simulated) */}
                        <div className="absolute bottom-full left-0 w-full mb-2 bg-[#2f2f2f] rounded-xl border border-white/10 shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2">
                                <LogOut size={16} /> Log out
                            </button>
                        </div>
                    </div>
                </div>
            </aside>


            {/* --- Main Content Area --- */}
            <main className="flex-1 flex flex-col relative min-w-0">

                {/* Mobile Sidebar Toggle (visible only when sidebar is closed or on mobile) */}
                <div className="absolute top-4 left-4 z-20">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                    >
                        {isSidebarOpen ? <Menu size={20} className="hidden md:block" /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Top Bar */}
                <header className="w-full p-4 flex justify-between items-center bg-transparent z-10">
                    <div className="flex items-center gap-2 mx-auto md:ml-12">
                        {/* Replaced 'ChatGPT' with 'Model X' or similar generic name as requested */}
                        <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-lg cursor-pointer transition text-gray-300 font-medium">
                            <span>AI Assistant</span>
                            <span className="text-gray-500 text-xs">▼</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2"></div>
                </header>


                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto px-4 md:px-6 scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-white/90">
                            <div className="bg-white/10 p-4 rounded-full mb-6">
                                <Sparkles size={32} className="text-white" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-medium mb-4">How can I help you today?</h1>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto py-6 space-y-6">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role !== 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 mt-1">AI</div>
                                    )}
                                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-[#2f2f2f] text-white rounded-tr-sm'
                                        : 'text-gray-200'
                                        }`}>
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 mt-1">AI</div>
                                    <div className="flex items-center gap-1 h-8 mt-1">
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>


                {/* Input Area */}
                <div className="p-4 md:p-6 pb-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative flex items-center bg-[#2f2f2f]/80 backdrop-blur-sm border border-white/10 rounded-3xl p-2 pl-4 focus-within:border-white/20 transition-all shadow-xl">
                            <button className="p-2 text-white/40 hover:text-white transition rounded-full hover:bg-white/5">
                                <Plus size={20} />
                            </button>

                            <form onSubmit={handleAsk} className="flex-1 flex">
                                <input
                                    type="text"
                                    placeholder="Message AI Assistant..."
                                    className="flex-1 bg-transparent py-3 px-3 outline-none text-base text-white placeholder-white/30"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                            </form>

                            <div className="flex items-center gap-1.5 pr-2">
                                <button
                                    onClick={toggleListening}
                                    className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
                                >
                                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                                </button>

                                <button
                                    onClick={handleAsk}
                                    disabled={loading || !input.trim()}
                                    className={`p-2 rounded-full transition-all ${input.trim()
                                        ? 'bg-white text-black hover:bg-gray-200'
                                        : 'bg-white/10 text-white/20 cursor-not-allowed'
                                        }`}
                                >
                                    {loading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <Send size={20} />}
                                </button>
                            </div>
                        </div>
                        <div className="text-center mt-3">
                            <p className="text-xs text-gray-500">AI can make mistakes. Consider checking important information.</p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;