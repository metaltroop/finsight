import React, { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { guides } from '../data/guides'
import LoadPullEffect from '../components/LoadPullEffect'

const GuidePost = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const guide = guides.find(g => g.id === id)

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [id])

    if (!guide) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Guide Not Found</h2>
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

    // Get other guides for "Related Guides" section
    const relatedGuides = guides.filter(g => g.id !== id).slice(0, 3)

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
                <div className={`bg-gradient-to-r ${guide.color} text-white pt-20 pb-20 relative overflow-hidden`}>
                    {/* Decorative Background Image */}
                    <div
                        className="absolute right-0 top-0 h-full w-1/3 opacity-15 md:opacity-25 pointer-events-none"
                        style={{
                            maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)',
                            WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)',
                        }}
                    >
                        <img
                            src="/assets/coinStonks.png"
                            alt="Finance decoration"
                            className="w-full h-full object-cover object-left blur-[2px]"
                        />
                    </div>

                    <div className="section-container relative z-10">
                        <Link to="/" className="inline-block text-white/80 hover:text-white mb-6 font-medium">
                            ← Back to Home
                        </Link>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl">{guide.icon}</span>
                            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                                Guide
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            {guide.title}
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
                            {guide.subtitle}
                        </p>
                        <div className="flex items-center gap-6 mt-8 text-sm font-medium text-white/80">
                            <span>{guide.date}</span>
                            <span>•</span>
                            <span>{guide.readTime}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="section-container -mt-10 relative z-10">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Article */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 md:p-12">
                            {guide.content.map((block, index) => {
                                switch (block.type) {
                                    case 'heading':
                                        return (
                                            <h2 key={index} className="text-2xl font-bold text-gray-900 mt-10 mb-6 first:mt-0">
                                                {block.text}
                                            </h2>
                                        )
                                    case 'paragraph':
                                        return (
                                            <p key={index} className="text-gray-700 text-lg leading-relaxed mb-6">
                                                {block.text}
                                            </p>
                                        )
                                    case 'list':
                                        return (
                                            <ul key={index} className="space-y-4 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                                {block.items.map((item, i) => {
                                                    // Handle bold text in markdown style **text**
                                                    const parts = item.split('**')
                                                    return (
                                                        <li key={i} className="flex gap-3 text-gray-700">
                                                            <span className="text-primary-500 mt-1.5">•</span>
                                                            <span>
                                                                {parts.map((part, j) =>
                                                                    j % 2 === 1 ? <strong key={j} className="text-gray-900">{part}</strong> : part
                                                                )}
                                                            </span>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        )
                                    default:
                                        return null
                                }
                            })}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">
                                    Related Guides
                                </h3>
                                <div className="space-y-6">
                                    {relatedGuides.map(related => (
                                        <Link
                                            key={related.id}
                                            to={`/guide/${related.id}`}
                                            className="group block"
                                        >
                                            <div className="flex gap-4">
                                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${related.color} flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                                    {related.icon}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                                                        {related.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {related.readTime}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </LoadPullEffect>
    )
}

export default GuidePost
