import React from 'react'
import { Link } from 'react-router-dom'
import MagneticCard from './MagneticCard'
import ScrollScale from './ScrollScale'
import { guides } from '../data/guides'

const PopularRightNow = () => {
    return (
        <section className="bg-white">
            <div className="section-container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Popular Right Now
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Expert guides to help you make informed financial decisions
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {guides.map((guide, index) => (
                        <Link key={index} to={`/guide/${guide.id}`} className="h-full block">
                            <ScrollScale className="h-full">
                                <MagneticCard className="card h-full group cursor-pointer hover:shadow-2xl border border-transparent hover:border-teal-100 flex flex-col justify-between">
                                    <div>
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${guide.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                                            <span className="text-3xl">{guide.icon}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                                            {guide.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                            {guide.subtitle}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                        <span className="text-xs font-medium text-gray-400">{guide.readTime}</span>
                                        <span className="text-primary-600 font-bold text-sm flex items-center gap-1">
                                            Read guide
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </span>
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

export default PopularRightNow
