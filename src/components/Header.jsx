import { ShoppingCart, Menu } from 'lucide-react';
import { useStore } from '../store/useStore';
import MagneticButton from './ui/MagneticButton';
import InteractiveText from './ui/InteractiveText';

export default function Header() {
    const { cart, toggleCart } = useStore();

    return (
        <header className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center pointer-events-none">
            <div className="pointer-events-auto cursor-pointer group">
                <InteractiveText
                    text="TOYVERSE"
                    className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-toy-red to-toy-blue group-hover:scale-105 transition-transform"
                />
            </div>

            <nav className="pointer-events-auto hidden md:flex gap-8 bg-white/80 backdrop-blur-md px-8 py-3 rounded-full shadow-lg border border-white/20">
                {[
                    { name: 'Age 3-5', target: 'cat-1' },
                    { name: 'Age 6-9', target: 'cat-2' },
                    { name: 'Age 10-14', target: 'cat-3' },
                    { name: 'Arcade', target: 'games' },
                    { name: 'Stories', target: 'stories' }
                ].map((item) => (
                    <button
                        key={item.name}
                        onClick={() => document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth' })}
                        className="font-medium text-toy-dark hover:text-toy-purple transition-colors relative group overflow-hidden"
                    >
                        <InteractiveText text={item.name} />
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-toy-purple transition-all duration-300 group-hover:w-full"></span>
                    </button>
                ))}
            </nav>

            <div className="pointer-events-auto flex items-center gap-4">
                <MagneticButton
                    onClick={toggleCart}
                    className="bg-white p-3 rounded-full shadow-lg"
                >
                    <ShoppingCart className="w-6 h-6 text-toy-dark" />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-toy-red text-white text-xs font-bold flex items-center justify-center rounded-full animate-bounce">
                            {cart.length}
                        </span>
                    )}
                </MagneticButton>
                <button className="md:hidden bg-white p-3 rounded-full shadow-lg hover:scale-105 active:scale-95">
                    <Menu className="w-6 h-6 text-toy-dark" />
                </button>
            </div>
        </header>
    );
}
