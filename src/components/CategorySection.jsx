import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmartImage from './ui/SmartImage';

const categories = [
    {
        id: 1,
        title: "Toddlers (3-5)",
        desc: "Soft, safe, and sensory-rich toys for little explorers.",
        image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        color: "bg-toy-yellow",
        textColor: "text-toy-dark"
    },
    {
        id: 2,
        title: "Kids (6-9)",
        desc: "Action figures, creative kits, and endless adventures.",
        image: "https://images.unsplash.com/photo-1558877385-81a1c7e67d72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        color: "bg-toy-blue",
        textColor: "text-white"
    },
    {
        id: 3,
        title: "Pre-Teens (10-14)",
        desc: "Complex builds, tech toys, and strategy games.",
        image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        color: "bg-toy-purple",
        textColor: "text-white"
    }
];

export default function CategorySection() {
    const containerRef = useRef(null);
    const elementsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            elementsRef.current.forEach((el, index) => {
                if (!el) return;

                gsap.fromTo(el,
                    {
                        opacity: 0,
                        y: 100,
                        rotation: index % 2 === 0 ? -10 : 10
                    },
                    {
                        opacity: 1,
                        y: 0,
                        rotation: 0,
                        duration: 1,
                        ease: "back.out(1.2)",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 80%",
                            end: "top 30%",
                            scrub: 1,
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-20 relative overflow-hidden bg-gradient-to-b from-pink-300 to-purple-200">
            <div className="container mx-auto px-4">
                <h2 className="text-5xl md:text-7xl font-display text-center mb-20 text-toy-purple">
                    Shop by Logic
                </h2>

                <div className="space-y-32">
                    {categories.map((cat, index) => (
                        <div
                            key={cat.id}
                            id={`cat-${cat.id}`}
                            ref={el => elementsRef.current[index] = el}
                            className={`flex flex-col md:flex-row items-center gap-10 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                        >
                            <div className="w-full md:w-1/2 relative group">
                                <div className={`absolute inset-0 ${cat.color} rounded-3xl transform rotate-6 scale-95 opacity-50 group-hover:rotate-12 transition-transform duration-500`}></div>
                                <div className={`absolute inset-0 ${cat.color} rounded-3xl transform -rotate-3 scale-95 opacity-50 group-hover:-rotate-6 transition-transform duration-500`}></div>
                                <SmartImage
                                    src={cat.image}
                                    alt={cat.title}
                                    className="relative z-10 w-full h-[400px] object-cover rounded-3xl shadow-2xl transform transition-transform duration-500 hover:scale-105"
                                    containerClassName="relative z-10 w-full h-[400px] rounded-3xl"
                                />
                            </div>

                            <div className="w-full md:w-1/2 text-center md:text-left">
                                <h3 className={`text-4xl md:text-6xl font-black mb-4 ${cat.textColor === 'text-white' ? 'text-toy-purple' : 'text-toy-red'}`}>
                                    {cat.title}
                                </h3>
                                <p className="text-xl md:text-2xl text-gray-600 mb-8 font-medium">
                                    {cat.desc}
                                </p>
                                <button
                                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-3 bg-toy-dark text-white rounded-full font-bold text-lg hover:bg-toy-blue transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Explore Collection
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
