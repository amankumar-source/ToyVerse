import { Github, Twitter, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <footer className="bg-indigo-950 text-white pt-20 pb-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-toy-light/10 to-transparent pointer-events-none"></div>

            {/* Floating Elements Background */}
            <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: Math.random() * 100 + 50,
                            height: Math.random() * 100 + 50,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -50, 0],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-2">
                        <h2 className="text-4xl font-display font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-toy-blue to-toy-purple inline-block">
                            TOYVERSE
                        </h2>
                        <p className="text-xl text-gray-400 max-w-md mb-8">
                            We believe in the power of play to inspire, educate, and bring joy to the universe. Every toy tells a story.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Instagram, Github].map((Icon, i) => (
                                <a key={i} href="#" className="p-3 bg-white/10 rounded-full hover:bg-toy-red hover:scale-110 transition-all">
                                    <Icon className="w-6 h-6" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-6 text-toy-yellow">Explore</h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'New Arrivals', target: 'products' },
                                { name: 'Best Sellers', target: 'featured' }, // Assumption: FeaturedToys section has id='featured'
                                { name: 'Shop by Age', target: 'cat-1' },
                                { name: 'Gift Guide', target: 'products' }
                            ].map(item => (
                                <li key={item.name}>
                                    <button
                                        onClick={() => document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth' })}
                                        className="text-gray-400 hover:text-white hover:translate-x-2 transition-all inline-block text-left"
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-6 text-toy-blue">Support</h3>
                        <ul className="space-y-4">
                            {['Track Order', 'Returns', 'Shipping Info', 'Contact Us'].map(item => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-white hover:translate-x-2 transition-all inline-block">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
                    <p>© 2026 Toyverse. Made with ✨ and React.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
