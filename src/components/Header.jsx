import { useCallback, useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import MagneticButton from './ui/MagneticButton';
import InteractiveText from './ui/InteractiveText';

// Nav items defined outside the component — stable reference
const NAV_ITEMS = [
    { name: 'Age 3-5', target: 'cat-1' },
    { name: 'Age 6-9', target: 'cat-2' },
    { name: 'Age 10-14', target: 'cat-3' },
    { name: 'Arcade', target: 'games' },
    { name: 'Stories', target: 'stories' },
];

export default function Header() {
    const cartCount = useStore((state) => state.cart.length);
    const toggleCart = useStore((state) => state.toggleCart);
    const [menuOpen, setMenuOpen] = useState(false);

    const scrollTo = useCallback((target) => {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false); // close menu after navigation
    }, []);

    return (
        <>
            <header className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center pointer-events-none">
                <div className="pointer-events-auto cursor-pointer group">
                    <InteractiveText
                        text="TOYVERSE"
                        className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-toy-red to-toy-blue group-hover:scale-105 transition-transform"
                    />
                </div>

                <nav className="pointer-events-auto hidden md:flex gap-8 bg-white/80 backdrop-blur-md px-8 py-3 rounded-full shadow-lg border border-white/20">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => scrollTo(item.target)}
                            className="font-medium text-toy-dark hover:text-toy-purple transition-colors relative group overflow-hidden"
                        >
                            <InteractiveText text={item.name} />
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-toy-purple transition-all duration-300 group-hover:w-full"></span>
                        </button>
                    ))}
                </nav>

                <div className="pointer-events-auto flex items-center gap-4">
                    <MagneticButton onClick={toggleCart} className="bg-white p-3 rounded-full shadow-lg">
                        <ShoppingCart className="w-6 h-6 text-toy-dark" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-toy-red text-white text-xs font-bold flex items-center justify-center rounded-full animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </MagneticButton>
                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden bg-white p-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-label="Toggle navigation menu"
                    >
                        {menuOpen ? <X className="w-6 h-6 text-toy-dark" /> : <Menu className="w-6 h-6 text-toy-dark" />}
                    </button>
                </div>
            </header>

            {/* Mobile slide-down nav menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-24 left-4 right-4 z-40 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-6 md:hidden"
                    >
                        <nav className="flex flex-col gap-2">
                            {NAV_ITEMS.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => scrollTo(item.target)}
                                    className="text-left px-5 py-4 rounded-2xl font-bold text-toy-dark hover:bg-toy-purple hover:text-white transition-all text-lg"
                                >
                                    {item.name}
                                </button>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop to close menu on outside tap */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-30 md:hidden"
                        onClick={() => setMenuOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
