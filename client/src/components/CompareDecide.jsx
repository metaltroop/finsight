import React from 'react'
import { Link } from 'react-router-dom'
import MagneticCard from './MagneticCard'
import ScrollScale from './ScrollScale'
import { comparisons } from '../data/comparisons'

const CompareDecide = () => {
    return (
        <section className="bg-white">
            <div className="section-container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Compare & Decide
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Make informed choices with side-by-side comparisons
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {comparisons.map((comparison, index) => (
                        <Link key={index} to={`/compare/${comparison.id}`} className="h-full block">
                            <ScrollScale className="h-full">
                                <MagneticCard className="card h-full group cursor-pointer hover:shadow-2xl border border-transparent hover:border-blue-100 flex flex-col justify-between">
                                    <div>
                                        <div className="relative mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-teal-50 to-blue-50 h-40 flex items-center justify-center">
                                            <img
                                                src={comparison.image}
                                                alt={comparison.title}
                                                className="h-full w-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
                                            {comparison.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                            {comparison.description || comparison.subtitle}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {comparison.tags.map((tag, idx) => (
                                                <span key={idx} className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-medium border border-teal-100">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 mt-auto">
                                        <button className="text-primary-600 font-semibold text-sm group-hover:text-primary-700 flex items-center gap-1">
                                            See comparison
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </button>
                                    </div>
                                </MagneticCard>
                            </ScrollScale>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CompareDecide
