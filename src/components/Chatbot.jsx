import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Gamepad2 } from 'lucide-react';
import MagneticButton from './ui/MagneticButton';

const INITIAL_MESSAGES = [
    { id: 1, text: "Hi! I'm ToyBot! 🤖 I love toys!", sender: 'bot' },
    { id: 2, text: "How can I help you today?", sender: 'bot' }
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (text) => {
        const userText = text || inputValue.trim();
        if (!userText) return;

        // Add user message
        setMessages(prev => [...prev, { id: Date.now(), text: userText, sender: 'user' }]);
        setInputValue("");
        setIsTyping(true);

        // Simulate network delay for "thinking"
        setTimeout(() => {
            let botResponse = "Beep boop! I'm still learning. 🧠";
            const lowerText = userText.toLowerCase();

            if (lowerText.includes('joke')) {
                botResponse = JOKES[Math.floor(Math.random() * JOKES.length)];
            } else if (lowerText.includes('track') || lowerText.includes('order')) {
                botResponse = "I can help! What's your order number? (It looks like #12345)";
            } else if (lowerText.includes('best') || lowerText.includes('recommend')) {
                botResponse = "For toddlers, check out the 'Safe & Soft' collection! For older kids, the 'Speed Demon' is totally radical! 🏎️";
            } else if (lowerText.includes('tech') || lowerText.includes('robot')) {
                botResponse = "I LOVE tech! My cousin is a Mars Rover! 🚀";
            } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
                botResponse = "Hello there awesome human! 👋";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
            setIsTyping(false);
        }, 1000);
    };

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
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 bg-gradient-to-r from-toy-blue to-toy-purple rounded-full shadow-[0_0_20px_rgba(188,19,254,0.5)] flex items-center justify-center text-white font-bold border-2 border-white hover:scale-110 transition-transform"
                >
                    {isOpen ? <X size={32} /> : <Gamepad2 size={32} />}
                </MagneticButton>
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 right-6 w-[90vw] md:w-96 h-[500px] bg-gray-900 border border-toy-neonBlue/30 rounded-3xl shadow-2xl z-[100] overflow-hidden flex flex-col backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-toy-blue to-toy-purple p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-toy-purple"><Gamepad2 size={24} /></div>
                            <div>
                                <h3 className="font-display font-bold text-white text-xl">ToyBot</h3>
                                <p className="text-white/80 text-xs flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    Online & Ready to Play!
                                </p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-toy-blue scrollbar-track-transparent">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user'
                                            ? 'bg-toy-neonBlue text-toy-dark rounded-br-none font-bold'
                                            : 'bg-white/10 text-white rounded-bl-none border border-white/5'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
                                        <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-75"></span>
                                        <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-black/20 border-t border-white/10">
                            {messages.length < 5 && (
                                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                                    {SUGGESTIONS.map((sugg) => (
                                        <button
                                            key={sugg}
                                            onClick={() => handleSend(sugg)}
                                            className="whitespace-nowrap px-4 py-2 bg-white/5 rounded-full text-xs font-bold text-toy-neonBlue hover:bg-toy-neonBlue hover:text-toy-dark transition-colors border border-toy-neonBlue/20"
                                        >
                                            {sugg}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask me anything..."
                                    className="flex-1 bg-white/10 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-toy-purple"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!inputValue.trim()}
                                    className="p-3 bg-toy-purple rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
