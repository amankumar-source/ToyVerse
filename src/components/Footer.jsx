import { Github, Twitter, Instagram } from 'lucide-react';
import { toast } from './ui/Toast';

// Static decorative data — module-level, never regenerated
const FLOATING_ELEMENTS = [...Array(10)].map((_, i) => ({
    id: i,
    width: Math.random() * 100 + 50,
    height: Math.random() * 100 + 50,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${(Math.random() * 5).toFixed(1)}s`,
    animationDuration: `${(Math.random() * 5 + 5).toFixed(1)}s`,
}));

const EXPLORE_LINKS = [
    { name: 'New Arrivals', target: 'products' },
    { name: 'Best Sellers', target: 'featured' },
    { name: 'Shop by Age', target: 'cat-1' },
    { name: 'Gift Guide', target: 'products' },
];

const SOCIAL_LINKS = [
    { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { Icon: Github, href: 'https://github.com', label: 'GitHub' },
];

const SUPPORT_MESSAGES = {
    'Track Order': '📦 Enter your order ID at support@toyverse.com to track your shipment!',
    'Returns': '🔄 Free returns within 30 days. Email returns@toyverse.com with your order ID.',
    'Shipping Info': '🚚 Free shipping on orders over $200. Standard delivery 3-5 business days.',
    'Contact Us': '💬 Reach us at hello@toyverse.com — we reply within 24 hours!',
};

export default function Footer() {
    return (
        <footer className="bg-indigo-950 text-white pt-20 pb-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-toy-light/10 to-transparent pointer-events-none"></div>

            {/* Floating Elements Background — pure CSS, compositor thread */}
            <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
                {FLOATING_ELEMENTS.map((el) => (
                    <div
                        key={el.id}
                        className="absolute bg-white rounded-full animate-float"
                        style={{
                            width: el.width,
                            height: el.height,
                            left: el.left,
                            top: el.top,
                            animationDelay: el.animationDelay,
                            animationDuration: el.animationDuration,
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
                            {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="p-3 bg-white/10 rounded-full hover:bg-toy-red hover:scale-110 transition-all"
                                >
                                    <Icon className="w-6 h-6" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-6 text-toy-yellow">Explore</h3>
                        <ul className="space-y-4">
                            {EXPLORE_LINKS.map((item) => (
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
                            {Object.keys(SUPPORT_MESSAGES).map((item) => (
                                <li key={item}>
                                    <button
                                        onClick={() => toast(SUPPORT_MESSAGES[item], 'info', 5000)}
                                        className="text-gray-400 hover:text-white hover:translate-x-2 transition-all inline-block text-left"
                                    >
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
                    <p>© 2026 Toyverse. Made with ✨ and React.</p>
                    <div className="flex gap-8">
                        <button
                            onClick={() => toast('🔒 Your privacy matters. We never sell your data. Read our full policy at toyverse.com/privacy', 'info', 5000)}
                            className="hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </button>
                        <button
                            onClick={() => toast('📋 By using ToyVerse you agree to our terms. Full terms at toyverse.com/terms', 'info', 5000)}
                            className="hover:text-white transition-colors"
                        >
                            Terms of Service
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
