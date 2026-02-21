import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ScrollTrigger is registered once at app entry (main.jsx)

export default function StorySection() {
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);
    const toysRef = useRef([]);
    const tweensRef = useRef([]);

    const scrollToProducts = useCallback(() => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        const pin = gsap.fromTo(sectionRef.current, {
            translateX: 0
        }, {
            translateX: "-200vw",
            ease: "none",
            duration: 1,
            scrollTrigger: {
                trigger: triggerRef.current,
                start: "top top",
                end: "2000 top",
                scrub: 0.6,
                pin: true,
            }
        });

        tweensRef.current = [pin];

        toysRef.current.forEach((toy, i) => {
            if (!toy) return;
            const tween = gsap.to(toy, {
                x: (i + 1) * 100,
                rotation: 360,
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top top",
                    end: "2000 top",
                    scrub: 1 + i * 0.5,
                }
            });
            tweensRef.current.push(tween);
        });

        return () => {
            tweensRef.current.forEach((t) => t.kill());
            tweensRef.current = [];
        };
    }, []);

    return (
        <section id="stories" ref={triggerRef} className="scroll-section-outer overflow-hidden">
            <div ref={sectionRef} className="scroll-section-inner h-screen w-[300vw] flex relative bg-toy-dark text-white">

                {/* Panel 1 */}
                <div className="w-screen h-full flex flex-col justify-center items-center relative p-20 bg-gradient-to-br from-yellow-200 to-orange-200 text-toy-dark">
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl opacity-50 animate-pulse"></div>
                    <h2 className="text-8xl font-display font-bold mb-8 relative z-10 text-orange-600">Our Story</h2>
                    <p className="text-2xl max-w-2xl text-center relative z-10 font-medium">
                        It started with a spark of imagination. In a world where gravity is optional...
                    </p>
                    <div
                        ref={(el) => toysRef.current[0] = el}
                        className="absolute top-1/4 right-1/4 w-24 h-24 bg-toy-purple rounded-lg transform rotate-12 shadow-xl"
                    ></div>
                </div>

                {/* Panel 2 */}
                <div className="w-screen h-full flex flex-col justify-center items-center relative bg-gradient-to-br from-green-200 to-teal-200 p-20 text-toy-dark">
                    <h2 className="text-8xl font-display font-bold mb-8 text-toy-purple relative z-10">Crafted with Joy</h2>
                    <p className="text-2xl max-w-2xl text-center relative z-10 font-medium">
                        Every toy is designed to bring a smile, crafted with pixel-perfect precision and love.
                    </p>
                    <div
                        ref={(el) => toysRef.current[1] = el}
                        className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-pink-400 rounded-full shadow-xl"
                    ></div>
                </div>

                {/* Panel 3 */}
                <div className="w-screen h-full flex flex-col justify-center items-center relative bg-gradient-to-br from-blue-200 to-indigo-200 p-20 text-toy-dark">
                    <h2 className="text-8xl font-display font-bold mb-8 text-toy-red relative z-10">Join the Fun</h2>
                    {/* ✅ Functional: scrolls to the products section */}
                    <button
                        onClick={scrollToProducts}
                        className="px-10 py-5 bg-white text-toy-dark text-2xl font-bold rounded-full shadow-2xl hover:scale-110 hover:bg-toy-yellow transition-all active:scale-95"
                    >
                        Start Playing Now
                    </button>
                    <div
                        ref={(el) => toysRef.current[2] = el}
                        className="absolute top-1/3 right-1/3 w-16 h-16 bg-toy-yellow rounded-full star-shape"
                    ></div>
                </div>

            </div>
        </section>
    );
}
