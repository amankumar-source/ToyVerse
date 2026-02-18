import { useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { X, Minus, Plus, Trash2, Rocket, Gift, ChevronRight } from 'lucide-react';
import SmartImage from './ui/SmartImage';
import { gsap } from 'gsap';
import { AnimatePresence, motion } from 'framer-motion';

export default function Cart() {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity } = useStore();
    const cartRef = useRef(null);
    const overlayRef = useRef(null);

    const total = cart.reduce((acc, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return acc + price * (item.qty || 1);
    }, 0).toFixed(2);

    // Gamification Logic
    const nextLevel = 200;
    const progress = Math.min((total / nextLevel) * 100, 100);
    const level = Math.floor(total / 200) + 1;

    useEffect(() => {
        if (isCartOpen) {
            gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, pointerEvents: 'auto' });
            gsap.to(cartRef.current, { x: '0%', duration: 0.6, ease: 'expo.out' });
        } else {
            gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, pointerEvents: 'none' });
            gsap.to(cartRef.current, { x: '100%', duration: 0.4, ease: 'power2.in' });
        }
    }, [isCartOpen]);

    return (
        <>
            {/* Overlay with Blur */}
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9990] opacity-0 pointer-events-none transition-colors duration-500"
                onClick={toggleCart}
            />

            {/* Cart Drawer - Glassmorphism & Neon */}
            <div
                ref={cartRef}
                className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-gray-900/90 backdrop-blur-3xl border-l border-white/10 z-[9991] transform translate-x-full shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
            >
                {/* Neon Glow Line */}
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-toy-neonBlue to-transparent opacity-50" />

                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/5 to-transparent relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl font-display font-black text-white tracking-tight uppercase" style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
                            Command Deck
                        </h2>
                        <div className="flex items-center gap-2 text-toy-neonBlue mt-1 font-mono text-sm tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-toy-neonBlue animate-pulse" />
                            LEVEL {level} EXPLORER
                        </div>
                    </div>
                    <button
                        onClick={toggleCart}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all hover:rotate-90 text-white border border-white/10 relative z-10 group"
                    >
                        <X className="w-6 h-6 group-hover:text-toy-red transition-colors" />
                    </button>

                    {/* Header Background Shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-toy-blue/20 to-transparent skew-x-12 -translate-x-full animate-shine opacity-30" />
                </div>

                {/* Gamification Bar */}
                <div className="px-8 py-6 bg-black/40 border-b border-white/5">
                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-3 font-mono tracking-wide">
                        <span className="text-white">XP: <span className="text-toy-green">${total}</span></span>
                        <span>NEXT: ${level * 200}</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden relative shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-toy-blue via-toy-purple to-toy-neonBlue relative"
                        >
                            <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                        </motion.div>
                    </div>
                    <p className="text-xs text-gray-300 mt-3 flex items-center gap-2 font-medium">
                        <Gift className={`w-4 h-4 ${progress >= 100 ? 'text-toy-green' : 'text-gray-500'}`} />
                        {progress >= 100 ? (
                            <span className="text-toy-green font-bold drop-shadow-[0_0_8px_rgba(0,255,100,0.5)]">Mission Accomplished! Free Shipping Active.</span>
                        ) : (
                            <span>Add <span className="text-white font-bold">${(nextLevel - (total % 200)).toFixed(2)}</span> to unlock <span className="text-toy-neonBlue">Hyper-Jump Shipping</span></span>
                        )}
                    </p>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <AnimatePresence mode="popLayout">
                        {cart.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60"
                            >
                                <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center border border-white/10 shadow-2xl relative">
                                    <div className="absolute inset-0 rounded-full bg-toy-neonBlue/10 blur-xl animate-pulse" />
                                    <Rocket className="w-12 h-12 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-display text-white mb-2">Void Detected</p>
                                    <p className="text-gray-400 max-w-[200px] mx-auto text-sm">Your cargo hold is empty, Captain.</p>
                                </div>
                                <button
                                    onClick={toggleCart}
                                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/10 transition-all hover:scale-105 flex items-center gap-2"
                                >
                                    Initiate Supply Run <ChevronRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ) : (
                            cart.map((item) => (
                                <motion.div
                                    key={item.cartId}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="group relative bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 hover:border-toy-neonBlue/30 transition-all duration-300"
                                >
                                    <div className="flex gap-5">
                                        <div className={`w-24 h-24 rounded-xl ${item.color?.includes('bg-') ? item.color : 'bg-gray-800'} flex-shrink-0 relative overflow-hidden shadow-lg group-hover:shadow-toy-neonBlue/20 transition-all`}>
                                            <SmartImage src={item.image} alt={item.name} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500" containerClassName="w-full h-full" />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start gap-4">
                                                <h3 className="font-bold text-white text-lg leading-tight group-hover:text-toy-neonBlue transition-colors">{item.name}</h3>
                                                <button
                                                    onClick={() => removeFromCart(item.cartId)}
                                                    className="w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-toy-red text-gray-400 hover:text-white rounded-lg transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end mt-2">
                                                <div className="font-mono text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{item.price}</div>

                                                <div className="flex items-center gap-1 bg-black/60 rounded-full p-1 border border-white/10">
                                                    <button
                                                        onClick={() => updateQuantity(item.cartId, (item.qty || 1) - 1)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 text-white transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-bold text-white w-8 text-center font-mono">{item.qty || 1}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.cartId, (item.qty || 1) + 1)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 text-white transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer UI */}
                {cart.length > 0 && (
                    <div className="p-8 bg-black/80 backdrop-blur-md border-t border-white/10 space-y-6 relative z-10">
                        {/* Glow Effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-toy-neonPurple to-transparent opacity-50" />

                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Subtotal</span>
                                <span>${total}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-white">Total Output</span>
                                <span className="text-3xl font-display font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">${total}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => alert(`Initiating Warp Drive with ${cart.length} items! (Checkout Demo)`)}
                            className="w-full py-4 bg-gradient-to-r from-toy-blue via-toy-purple to-toy-pink text-white rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(124,58,237,0.4)] flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center gap-2 tracking-wide uppercase">
                                Engage Warp Drive <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
