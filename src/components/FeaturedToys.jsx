
import { useStore } from '../store/useStore';
import SmartImage from './ui/SmartImage';
import TiltCard from './ui/TiltCard';
import MagneticButton from './ui/MagneticButton';

const FEATURED_CARS = [
    {
        id: 'car-1',
        name: 'Speed Demon R1',
        description: 'Aerodynamic perfection. 0-60 in 2.5s (scale speed).',
        price: '$129.99',
        image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        color: 'from-red-600 to-orange-500'
    },
    {
        id: 'car-2',
        name: 'Cyber Truck X',
        description: 'Indestructible alloy frame. Future-proof design.',
        price: '$149.99',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        color: 'from-gray-700 to-gray-900'
    }
];

export default function FeaturedToys() {
    const addToCart = useStore(state => state.addToCart);

    return (
        <section id="featured" className="py-24 bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 relative overflow-hidden z-10">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-900 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-toy-neonBlue font-bold tracking-widest uppercase mb-4 block">Premium Collection</span>
                    <h2 className="text-5xl md:text-7xl font-display text-white mb-6">
                        Realistic Rides
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {FEATURED_CARS.map((car) => (
                        <TiltCard key={car.id} className="relative group perspective-1000">
                            <div className={`relative h-[500px] w-full bg-gradient-to-br ${car.color} rounded-3xl p-8 transform transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10`}>
                                {/* Image Background Layer */}
                                <div className="absolute inset-0 z-0">
                                    <SmartImage
                                        src={car.image}
                                        alt={car.name}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                                        containerClassName="w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                                </div>

                                <div className="absolute top-0 right-0 p-6 opacity-30 text-9xl font-black text-white select-none z-0">
                                    0{car.id.split('-')[1]}
                                </div>

                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-4xl font-display font-black text-white mb-2 italic tracking-tighter drop-shadow-lg">{car.name}</h3>
                                        <p className="text-white/90 font-medium max-w-[80%] drop-shadow-md text-lg">{car.description}</p>
                                    </div>

                                    {/* Spacer to push content to edges */}
                                    <div className="flex-grow" />

                                    <div className="flex justify-between items-end">
                                        <div className="text-3xl font-bold text-white">{car.price}</div>
                                        <MagneticButton
                                            onClick={() => addToCart({ ...car, category: 'Vehicles' })}
                                            className="bg-white text-toy-dark px-8 py-3 rounded-full font-bold shadow-lg"
                                        >
                                            RACE NOW
                                        </MagneticButton>
                                    </div>
                                </div>
                            </div>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
