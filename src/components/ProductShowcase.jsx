import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useStore } from '../store/useStore';

import SmartImage from './ui/SmartImage';
import TiltCard from './ui/TiltCard';
import MagneticButton from './ui/MagneticButton';

const products = [
    { id: 1, name: 'Robo-Pup 3000', price: '$49.99', category: 'Action', image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', color: 'shadow-toy-neonBlue' },
    { id: 2, name: 'Cosmic Racer', price: '$29.99', category: 'Vehicles', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', color: 'shadow-toy-red' },
    { id: 3, name: 'Magic Castle', price: '$89.99', category: 'Building', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', color: 'shadow-toy-neonPurple' },
    { id: 4, name: 'Build-A-Bot', price: '$59.99', category: 'Education', image: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', color: 'shadow-toy-yellow' },
    { id: 5, name: 'Speed Demon R1', price: '$129.99', category: 'Vehicles', image: 'https://images.unsplash.com/photo-1508898578281-774ac4893c0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', color: 'shadow-toy-red' },
    { id: 6, name: 'Cyber Truck X', price: '$89.99', category: 'Vehicles', image: 'https://images.unsplash.com/photo-1552069334-a2da13e8d03c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', color: 'shadow-gray-400' },
    { id: 7, name: 'Sky Phantom Drone', price: '$199.99', category: 'RC', image: 'https://images.unsplash.com/photo-1506947411487-a56738267384?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', color: 'shadow-toy-neonBlue' },
    { id: 8, name: 'Turbo Jet 500', price: '$149.99', category: 'Vehicles', image: 'https://images.unsplash.com/photo-1559633006-696cd8498263?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', color: 'shadow-toy-neonPurple' },
];

const categories = ['All', 'Vehicles', 'Action', 'Building', 'RC', 'Education'];

const ProductCard = ({ product }) => {
    const addToCart = useStore((state) => state.addToCart);


    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="p-4"
        >
            <TiltCard className={`group relative bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-lg ${product.color}`}>
                <div className="relative h-64 overflow-hidden">
                    <SmartImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                    {/* Floating Price Tag */}
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-white font-bold shadow-lg transform translate-z-10 group-hover:bg-toy-neonBlue group-hover:text-black transition-colors">
                        {product.price}
                    </div>
                </div>

                <div className="p-6 relative z-10 transform translate-z-20">
                    <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-toy-neonBlue transition-colors">{product.name}</h3>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">{product.category}</span>
                        <MagneticButton
                            onClick={() => addToCart(product)}
                            className="px-6 py-2 bg-toy-red text-white font-bold rounded-full shadow-lg"
                        >
                            Add +
                        </MagneticButton>
                    </div>
                </div>
            </TiltCard>
        </motion.div>
    );
};

export default function ProductShowcase() {
    const [filter, setFilter] = useState('All');
    const filteredProducts = filter === 'All' ? products : products.filter(p => p.category === filter);

    return (
        <section id="products" className="py-20 bg-gradient-to-b from-pink-100 to-purple-100 relative z-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-7xl font-display text-toy-purple mb-4 animate-pulse">
                        Toy Explorer
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover the latest tech-infused toys from our universe.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full font-bold text-lg transition-all border border-white/10 ${filter === cat
                                ? 'bg-toy-purple text-white shadow-[0_0_15px_#bc13fe] scale-110'
                                : 'bg-white text-gray-500 hover:text-toy-purple hover:bg-white/80 border-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
