import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Cpu } from 'lucide-react';
import MagneticButton from './ui/MagneticButton';

// Module-level constants — stable references, never recreated
const INITIAL_MESSAGES = [
    { id: 1, text: "System Initialized. I am ToyBot v2.0. 🤖", sender: 'bot' },
    { id: 2, text: "Ready to assist with your interstellar toy mission.", sender: 'bot' }
];

const SUGGESTIONS = [
    "Tell me a joke! 😂",
    "Best boys 3-5? 🚗",
    "Track my order 📦",
    "Do you like tech? 💻"
];

const JOKES = [
    "Why did the toy car stop? ... It was tired! 🚗💤",
    "What do you call a bear with no teeth? ... A gummy bear! 🐻🍬",
    "Why did the robot go to school? ... To get smarter! 🎓🤖"
];

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    // Store the timeout id so we can clear it on unmount — prevents setState on unmounted component
    const typingTimerRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, scrollToBottom]);

    // Clear the timeout on unmount to prevent potential memory leak / state update on unmounted component
    useEffect(() => {
        return () => {
            if (typingTimerRef.current) {
                clearTimeout(typingTimerRef.current);
            }
        };
    }, []);

    const handleSend = useCallback((text) => {
        const userText = text || inputValue.trim();
        if (!userText) return;

        setMessages((prev) => [...prev, { id: Date.now(), text: userText, sender: 'user' }]);
        setInputValue("");
        setIsTyping(true);

        typingTimerRef.current = setTimeout(() => {
            let botResponse = "Processing... Data not found in local nebula. 🧠";
            const lowerText = userText.toLowerCase();

            if (lowerText.includes('joke')) {
                botResponse = JOKES[Math.floor(Math.random() * JOKES.length)];
            } else if (lowerText.includes('track') || lowerText.includes('order')) {
                botResponse = "Accessing logistics mainframe... Please provide your Tracking ID (Designation #12345).";
            } else if (lowerText.includes('best') || lowerText.includes('recommend')) {
                botResponse = "Analysis complete. For young cadets, the 'Safe & Soft' pod is optimal. For veteran pilots, I recommend the 'Speed Demon' class!";
            } else if (lowerText.includes('tech') || lowerText.includes('robot')) {
                botResponse = "Affirmative! My logic cores beat for technology. My cousin is currently exploring the Martian surface! 🚀";
            } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
                botResponse = "Greetings, user! Status: Online and ready.";
            }

            setMessages((prev) => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
            setIsTyping(false);
        }, 1200);
    }, [inputValue]);

    const handleToggle = useCallback(() => setIsOpen((o) => !o), []);

    return (
        <>
            {/* Toggle Button */}
            <motion.div
                className="fixed bottom-6 right-6 z-[100]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <MagneticButton
                    onClick={handleToggle}
                    className="w-16 h-16 bg-black/80 backdrop-blur-md rounded-full border border-toy-neonBlue/50 shadow-[0_0_30px_rgba(0,255,255,0.3)] flex items-center justify-center text-white relative group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-toy-blue via-transparent to-toy-purple opacity-50 group-hover:opacity-100 transition-opacity" />
                    {isOpen ? <X size={28} className="relative z-10" /> : <Cpu size={28} className="relative z-10 text-toy-neonBlue" />}

                    {/* Ring Pulse */}
                    {!isOpen && <span className="absolute inset-0 rounded-full border border-toy-neonBlue/30 animate-ping" />}
                </MagneticButton>
            </motion.div>

            {/* Chat Window - Holographic Style */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[600px] bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-[100] overflow-hidden flex flex-col"
                        style={{ boxShadow: '0 0 50px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.05)' }}
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-white/10 flex items-center gap-4 bg-gradient-to-r from-toy-blue/10 to-transparent">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shadow-lg relative">
                                <Sparkles className="w-6 h-6 text-toy-neonBlue animate-pulse" />
                                <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-white text-xl tracking-wide">TOYBOT <span className="text-toy-neonBlue text-xs align-top">v2.0</span></h3>
                                <p className="text-gray-400 text-xs font-mono uppercase tracking-wider flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    System Online
                                </p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-4 rounded-2xl relative ${msg.sender === 'user'
                                                ? 'bg-gradient-to-r from-toy-purple to-toy-blue text-white rounded-br-sm shadow-lg shadow-toy-purple/20'
                                                : 'bg-white/5 text-gray-200 rounded-bl-sm border border-white/5 backdrop-blur-sm'
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        {msg.sender === 'bot' && (
                                            <div className="absolute -bottom-4 left-0 text-[10px] text-gray-600 font-mono mt-1">AI-ASSIST</div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-4 rounded-2xl rounded-bl-sm flex gap-2 items-center border border-white/5">
                                        <span className="w-2 h-2 bg-toy-neonBlue rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-toy-neonBlue rounded-full animate-bounce delay-75" />
                                        <span className="w-2 h-2 bg-toy-neonBlue rounded-full animate-bounce delay-150" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-5 bg-black/40 border-t border-white/10">
                            {/* Suggestions Carousel */}
                            {messages.length < 5 && (
                                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2 mask-linear">
                                    {SUGGESTIONS.map((sugg) => (
                                        <button
                                            key={sugg}
                                            onClick={() => handleSend(sugg)}
                                            className="whitespace-nowrap px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold text-gray-300 border border-white/10 transition-colors"
                                        >
                                            {sugg}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-3 relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Enter command..."
                                    className="flex-1 bg-white/5 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-toy-neonBlue border border-white/10 font-mono text-sm"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!inputValue.trim()}
                                    className="px-5 bg-toy-neonBlue hover:bg-white text-black rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center transform active:scale-95"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <div className="text-center mt-3">
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-mono">Powered by ToyVerse AI Core</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
