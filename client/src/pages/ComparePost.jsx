import React, { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { comparisons } from '../data/comparisons'
import LoadPullEffect from '../components/LoadPullEffect'

const ComparePost = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const data = comparisons.find(c => c.id === id)

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [id])

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Comparison Not Found</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="text-primary-600 hover:text-primary-700 font-semibold"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <LoadPullEffect interval={5000}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen bg-gray-50"
            >
                {/* Header */}
                <div className={`bg-gradient-to-r ${data.color} text-white pt-20 pb-20 relative overflow-hidden`}>
                    {/* Decorative Background Image */}
                    <div
                        className="absolute right-0 top-0 h-full w-1/3 opacity-15 md:opacity-25 pointer-events-none"
                        style={{
                            maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)',
                            WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)',
                        }}
                    >
                        <img
                            src={data.image}
                            alt="Finance decoration"
                            className="w-full h-full object-contain object-center scale-125 blur-[2px]"
                        />
                    </div>

                    <div className="section-container relative z-10">
                        <Link to="/" className="inline-block text-white/80 hover:text-white mb-6 font-medium">
                            ← Back to Home
                        </Link>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                                Comparison
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                            {data.title}
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
                            {data.subtitle}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-6">
                            {data.tags.map((tag, idx) => (
                                <span key={idx} className="text-sm bg-white/10 text-white px-3 py-1 rounded-full border border-white/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="section-container -mt-10 relative z-10">
                    {/* Intro Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">At a Glance</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            {data.intro}
                        </p>
                    </div>

                    {/* Comparison Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {data.sections.map((section, idx) => (
                            <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
                                <div className={`p-6 bg-gray-50 border-b border-gray-100`}>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h3>
                                    <p className="text-gray-600 text-sm">{section.description}</p>
                                </div>
                                <div className="p-6 flex-grow">
                                    <h4 className="font-semibold text-green-600 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Pros
                                    </h4>
                                    <ul className="space-y-3 mb-8">
                                        {section.pros.map((pro, i) => (
                                            <li key={i} className="flex gap-3 text-gray-600 text-sm">
                                                <span className="text-green-500 mt-1">•</span>
                                                {pro}
                                            </li>
                                        ))}
                                    </ul>

                                    <h4 className="font-semibold text-red-600 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Cons
                                    </h4>
                                    <ul className="space-y-3">
                                        {section.cons.map((con, i) => (
                                            <li key={i} className="flex gap-3 text-gray-600 text-sm">
                                                <span className="text-red-500 mt-1">•</span>
                                                {con}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Verdict */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 md:p-12 text-center text-white">
                        <h2 className="text-3xl font-bold mb-6">The Verdict</h2>
                        <p className="text-xl leading-relaxed md:max-w-3xl mx-auto">
                            {/* Render simple markdown bolding manually since we know the structure */}
                            {data.verdict.split('**').map((part, i) =>
                                i % 2 === 1 ? <strong key={i} className="text-teal-400">{part}</strong> : part
                            )}
                        </p>
                    </div>

                    {/* Other Comparisons */}
                    <div className="mt-16">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8">Other Comparisons</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {comparisons.filter(c => c.id !== id).map(other => (
                                <Link key={other.id} to={`/compare/${other.id}`} className="group block">
                                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${other.color} flex items-center justify-center text-white font-bold text-xl`}>VS</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{other.title}</h4>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{other.subtitle}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </LoadPullEffect>
    )
}

export default ComparePost
