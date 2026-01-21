import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { guides } from '../data/guides'
import { useGlobal } from '../context/GlobalContext'

const PopularRightNow = () => {
    const { popularGuides } = useGlobal();
    const scrollRef = useRef(null);
    const isHovered = useRef(false);

    // Combine: API blogs first, then static guides
    const hybridFeed = [
        ...popularGuides,
        ...guides.filter(g => !popularGuides.some(p => p.id === g.id))
    ];

    // Duplicate for seamless loop
    const doubleFeed = [...hybridFeed, ...hybridFeed];

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationFrameId;

        const scroll = () => {
            if (scrollContainer && !isHovered.current) {
                // If we've scrolled past the first set, reset instantly to 0
                // (Since the sets are identical, this is invisible)
                if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += 0.8; // Adjust speed (pixels per frame)
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationFrameId);
    }, [hybridFeed]); // Re-run if data changes

    return (
        <section className="bg-white py-14 overflow-hidden">
            <div className="section-container relative">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Popular Right Now
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Currated financial wisdom and trending updates.
                    </p>
                </div>

                {/* Horizontal Scroll Container */}
                <div
                    ref={scrollRef}
                    onMouseEnter={() => isHovered.current = true}
                    onMouseLeave={() => isHovered.current = false}
                    onTouchStart={() => isHovered.current = true}
                    onTouchEnd={() => isHovered.current = false}
                    className="flex overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide gap-4 md:gap-6"
                >
                    {doubleFeed.map((guide, index) => (
                        <div key={`${guide.id}-${index}`} className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[350px]">
                            <Link to={`/guide/${guide.slug || guide.id}`} className="h-full block group">
                                <div className="h-[380px] md:h-[420px] cursor-pointer group-hover:-translate-y-1 transition-transform duration-300 flex flex-col overflow-hidden bg-white rounded-3xl shadow-sm group-hover:shadow-xl border border-gray-100">
                                    {/* Top Image Section */}
                                    <div className="h-48 overflow-hidden relative bg-gray-50">
                                        <img
                                            src={guide.coverImage || 'https://placehold.co/600x400/f1f5f9/94a3b8?text=Finsight'}
                                            alt={guide.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Subtle overlay for white images if needed, mostly transparent */}
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Icon Badge - Floating on image seam */}
                                        <div className="absolute bottom-4 left-6 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-lg z-10 border border-white/50">
                                            {guide.icon || '📄'}
                                        </div>
                                    </div>

                                    {/* Bottom Content Section */}
                                    <div className="p-6 flex-1 flex flex-col bg-white">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-teal-600 transition-colors line-clamp-2">
                                            {guide.title}
                                        </h3>

                                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                                            {guide.excerpt || guide.subtitle}
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                                {guide.readTime || new Date(guide.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>

                                            <span className="text-teal-600 text-sm font-bold flex items-center gap-1 group/btn">
                                                Read
                                                <svg className="w-4 h-4 transform transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Visual hint for scrolling if needed */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none bg-gradient-to-l from-white to-transparent w-24 h-full md:block hidden" />
            </div>
            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    )
}

export default PopularRightNow
