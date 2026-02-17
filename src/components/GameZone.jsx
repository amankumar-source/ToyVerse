import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToyCarRunner from './games/ToyCarRunner';
import CatchTheToys from './games/CatchTheToys';

export default function GameZone() {
    const [activeGame, setActiveGame] = useState('runner');

    return (
        <section id="games" className="py-20 bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-10 left-10 w-96 h-96 bg-toy-neonPurple rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-toy-neonBlue rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-5xl md:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-r from-toy-neonBlue to-toy-neonPurple mb-4">
                        Arcade Zone
                    </h2>
                    <p className="text-xl text-gray-300">Play to unlock exclusive discounts!</p>
                </div>

                {/* Game Switcher */}
                <div className="flex justify-center gap-6 mb-12">
                    <button
                        onClick={() => setActiveGame('runner')}
                        className={`px-6 py-3 rounded-full font-bold text-lg transition-all ${activeGame === 'runner' ? 'bg-toy-neonPurple text-white shadow-[0_0_20px_#bc13fe]' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                    >
                        Neon Racer
                    </button>
                    <button
                        onClick={() => setActiveGame('catcher')}
                        className={`px-6 py-3 rounded-full font-bold text-lg transition-all ${activeGame === 'catcher' ? 'bg-toy-neonBlue text-black shadow-[0_0_20px_#00f3ff]' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                    >
                        Toy Catcher
                    </button>
                </div>

                {/* Game Display */}
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeGame}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeGame === 'runner' ? <ToyCarRunner /> : <CatchTheToys />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
