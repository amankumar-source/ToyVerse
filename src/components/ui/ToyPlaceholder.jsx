import { motion } from 'framer-motion';

export default function ToyPlaceholder({ className }) {
    return (
        <div className={`relative w-full h-full bg-toy-dark flex items-center justify-center overflow-hidden ${className}`}>
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative z-10 flex flex-col items-center"
            >
                {/* Robot Head */}
                <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="20" width="60" height="50" rx="10" fill="#2A2A2A" stroke="#00f3ff" strokeWidth="2" />
                    <circle cx="35" cy="40" r="5" fill="#00f3ff">
                        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="65" cy="40" r="5" fill="#00f3ff">
                        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" delay="1s" />
                    </circle>
                    <path d="M40 55 Q50 65 60 55" stroke="#bc13fe" strokeWidth="2" strokeLinecap="round" />
                    <rect x="45" y="10" width="10" height="10" fill="#bc13fe">
                        <animateTransform attributeName="transform" type="translate" values="0 0; 0 -5; 0 0" dur="1s" repeatCount="indefinite" />
                    </rect>
                    <line x1="10" y1="45" x2="20" y2="45" stroke="#ff0055" strokeWidth="2" />
                    <line x1="80" y1="45" x2="90" y2="45" stroke="#ff0055" strokeWidth="2" />
                </svg>

                <p className="mt-2 text-toy-neonBlue font-display text-sm tracking-widest text-center">
                    CLASSIFIED<br />
                    <span className="text-gray-500 text-xs font-sans">Visual Incoming</span>
                </p>
            </motion.div>

            {/* Background elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 w-2 h-2 bg-toy-red rounded-full animate-ping" />
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-toy-yellow rounded-full animate-pulse" />
            </div>
        </div>
    );
}
