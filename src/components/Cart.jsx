import { useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { X, Minus, Plus, Trash2, Rocket, Gift } from 'lucide-react';
import SmartImage from './ui/SmartImage';
import { gsap } from 'gsap';
import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

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
            gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
            gsap.to(cartRef.current, { x: '0%', duration: 0.5, ease: 'power4.out' });
        } else {
            gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, pointerEvents: 'none' });
            gsap.to(cartRef.current, { x: '100%', duration: 0.5, ease: 'power4.in' });
        }
    }, [isCartOpen]);

    return (
        <>
            {/* Overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990] opacity-0 pointer-events-none"
                onClick={toggleCart}
            />

            {/* Cart Drawer */}
            <div
                ref={cartRef}
                className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-gray-900 border-l border-toy-neonBlue z-[9991] transform translate-x-full shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gray-800/50">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-white">Space Cart</h2>
                        <p className="text-toy-neonBlue text-sm">Level {level} Explorer</p>
                    </div>
                    <button
                        onClick={toggleCart}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Bar (Gamification) */}
                <div className="px-6 py-4 bg-gray-900">
                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                        <span>Current XP: ${total}</span>
                        <span>Next Level: ${level * 200}</span>
                    </div>
                    <div className="h-4 bg-gray-700 rounded-full overflow-hidden relative">
                        <div
                            className="h-full bg-gradient-to-r from-toy-red via-toy-neonPurple to-toy-neonBlue transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full animate-progress-shimmer" />
                    </div>
                    <p className="text-xs text-toy-yellow mt-2 flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        {progress >= 100 ? "Level Complete! Free Shipping Unlocked!" : `Add $${(nextLevel - (total % 200)).toFixed(2)} to unlock free shipping!`}
                    </p>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <AnimatePresence>
                        {cart.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center space-y-4"
                            >
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
                                    <Rocket className="w-10 h-10 text-gray-600" />
                                </div>
                                <p className="text-xl text-gray-400 font-medium">Your gravity well is empty.</p>
                                <button
                                    onClick={toggleCart}
                                    className="px-6 py-2 bg-toy-neonBlue text-black font-bold rounded-full hover:scale-105 transition-transform"
                                >
                                    Start Exploring
                                </button>
                            </motion.div>
                        ) : (
                            cart.map((item) => (
                                <motion.div
                                    key={item.cartId}
                                    layout
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-toy-neonPurple/50 transition-colors group"
                                >
                                    <div className={`w-20 h-20 rounded-lg ${item.color && item.color.includes('bg-') ? item.color : 'bg-gray-800'} flex items-center justify-center relative overflow-hidden`}>
                                        {item.image ? (
                                            <SmartImage src={item.image} alt={item.name} className="w-full h-full object-cover" containerClassName="w-full h-full" />
                                        ) : (
                                            <Rocket className="text-white/20 w-8 h-8" />
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-white text-lg leading-tight">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item.cartId)}
                                                className="text-gray-500 hover:text-toy-red transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <p className="font-bold text-toy-neonBlue">{item.price}</p>
                                            <div className="flex items-center gap-3 bg-gray-800 rounded-full px-2 py-1">
                                                <button
                                                    onClick={() => updateQuantity(item.cartId, (item.qty || 1) - 1)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-sm font-bold text-white w-4 text-center">{item.qty || 1}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.cartId, (item.qty || 1) + 1)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="p-6 bg-gray-900 border-t border-white/10 space-y-4">
                        <div className="flex justify-between items-center text-xl font-bold text-white">
                            <span>Total</span>
                            <span className="text-toy-green animate-pulse">${total}</span>
                        </div>
                        <button
                            onClick={() => alert(`Initiating Warp Drive with ${cart.length} items! (Checkout Demo)`)}
                            className="w-full py-4 bg-gradient-to-r from-toy-neonBlue to-toy-neonPurple text-white rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(188,19,254,0.5)] flex items-center justify-center gap-2 relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Warp to Checkout <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
