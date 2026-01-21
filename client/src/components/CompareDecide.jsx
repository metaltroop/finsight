import React from 'react'
import { Link } from 'react-router-dom'
import { comparisons } from '../data/comparisons'

const CompareDecide = () => {
    return (
        <section className="bg-white py-12 md:py-20">
            <div className="section-container">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Compare & Decide
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Make informed choices with side-by-side comparisons
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {comparisons.map((comparison, index) => (
                        <Link key={index} to={`/compare/${comparison.id}`} className="block group">
                            <div className="relative bg-white rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-300 flex flex-row md:flex-col items-center md:items-stretch gap-5 md:gap-0 h-auto md:h-full">

                                {/* Mobile: Thumbnail Left | Desktop: Large Image Top */}
                                <div className="w-20 h-20 md:w-full md:h-48 flex-shrink-0 rounded-xl bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center mb-0 md:mb-6 overflow-hidden">
                                    <img
                                        src={comparison.image}
                                        alt={comparison.title}
                                        className="w-12 h-12 md:w-full md:h-full object-contain md:p-8 group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col min-w-0">
                                    <h3 className="text-base md:text-xl font-bold text-gray-900 mb-1 md:mb-3 group-hover:text-teal-700 transition-colors truncate md:whitespace-normal">
                                        {comparison.title}
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-600 md:mb-4 line-clamp-2 leading-relaxed">
                                        {comparison.description || comparison.subtitle}
                                    </p>

                                    {/* Desktop Tags */}
                                    <div className="hidden md:flex flex-wrap gap-2 mb-4 mt-auto">
                                        {comparison.tags.map((tag, idx) => (
                                            <span key={idx} className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-medium border border-teal-100">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Desktop Button */}
                                    <div className="hidden md:block pt-4 border-t border-gray-100 mt-auto">
                                        <span className="text-teal-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                            See comparison
                                            <span>→</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Mobile Arrow */}
                                <div className="md:hidden flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CompareDecide
