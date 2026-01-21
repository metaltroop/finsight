import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LoadPullEffect from '../components/LoadPullEffect'
import ScrollScale from '../components/ScrollScale'
import ReactMarkdown from 'react-markdown'
import { guides } from '../data/guides'

const GuidePost = () => {
    const { id } = useParams() // This is actually the SLUG now based on routes
    const navigate = useNavigate()
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedGuides, setRelatedGuides] = useState([]);

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [id])

    useEffect(() => {
        const fetchGuide = async () => {
            try {
                // 1. Try fetching from API
                const res = await fetch(`http://localhost:3000/api/blogs/${id}`);

                if (res.ok) {
                    const data = await res.json();
                    setGuide(data);
                } else {
                    // 2. If API fails, check static guides
                    const staticGuide = guides.find(g => g.id === id || g.slug === id);
                    if (staticGuide) {
                        setGuide({
                            ...staticGuide,
                            excerpt: staticGuide.subtitle,
                            createdAt: staticGuide.date || new Date().toISOString(),
                            author: { name: 'Finsight Team' },
                            // Static guides use a 'content' array structure, so we might need to adapt it
                            // OR we can just render it differently. 
                            // For simplicity, let's normalize it to string if possible, or handle it in render.
                            // But wait, the component expects 'content' to be markdown string for ReactMarkdown.
                            // The static guides have an array of objects ({type, text, items}). 
                            // We should convert that array to markdown string here.
                            content: staticGuide.content && Array.isArray(staticGuide.content)
                                ? staticGuide.content.map(block => {
                                    if (block.type === 'heading') return `## ${block.text}`;
                                    if (block.type === 'list') return block.items.map(item => `- ${item}`).join('\n');
                                    return block.text;
                                }).join('\n\n')
                                : staticGuide.content
                        });
                    } else {
                        throw new Error('Blog not found');
                    }
                }

                // Fetch popular/related guides for sidebar
                const relatedRes = await fetch('http://localhost:3000/api/blogs?popular=true');
                if (relatedRes.ok) {
                    const relatedData = await relatedRes.json();
                    setRelatedGuides(relatedData.filter(g => g.slug !== id && g.id !== id).slice(0, 3));
                }

            } catch (error) {
                console.error(error);
                // Fallback for related if API fails completely
                setRelatedGuides(guides.filter(g => g.id !== id).slice(0, 3));
            } finally {
                setLoading(false);
            }
        }
        fetchGuide();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        )
    }

    if (!guide) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Guide Not Found</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="text-teal-600 hover:text-teal-700 font-semibold"
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
                <div className={`bg-gradient-to-r from-teal-800 to-emerald-900 text-white pt-20 pb-20 relative overflow-hidden`}>
                    {/* Decorative Background Image */}
                    <div className="absolute inset-0 opacity-20">
                        <img src={guide.coverImage || 'https://placehold.co/1200x600/e2e8f0/1e293b?text=Finsight+Guide'} alt="Cover" className="w-full h-full object-cover blur-sm" />
                    </div>

                    <div className="section-container relative z-10">
                        <Link to="/" className="inline-block text-white/80 hover:text-white mb-6 font-medium">
                            ← Back to Home
                        </Link>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl">📝</span>
                            <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                                Guide
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            {guide.title}
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
                            {guide.excerpt}
                        </p>
                        <div className="flex items-center gap-6 mt-8 text-sm font-medium text-white/80">
                            <span>{guide.createdAt?.includes(',') ? guide.createdAt : new Date(guide.createdAt).toLocaleDateString()}</span>
                            {guide.readTime && (
                                <>
                                    <span>•</span>
                                    <span>{guide.readTime}</span>
                                </>
                            )}
                            <span>•</span>
                            <span>{guide.author?.name || 'Admin'}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="section-container -mt-10 relative z-10">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Article */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 md:p-12 prose prose-lg prose-teal max-w-none">
                            {/* Smart Content Rendering: HTML (new) or Markdown (old) */}
                            {/<[a-z][\s\S]*>/i.test(guide.content) ? (
                                <div
                                    className="rich-text-content"
                                    dangerouslySetInnerHTML={{ __html: guide.content }}
                                />
                            ) : (
                                <ReactMarkdown>{guide.content}</ReactMarkdown>
                            )}

                            {/* Styles for HTML content to match Markdown prose */}
                            <style>{`
                                .rich-text-content h1 { font-size: 2.25em; font-weight: 800; margin-bottom: 0.8em; color: #111827; }
                                .rich-text-content h2 { font-size: 1.5em; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.8em; color: #1f2937; }
                                .rich-text-content p { margin-bottom: 1.25em; line-height: 1.8; color: #374151; }
                                .rich-text-content ul { list-style-type: disc; padding-left: 1.6em; margin-bottom: 1.25em; }
                                .rich-text-content ol { list-style-type: decimal; padding-left: 1.6em; margin-bottom: 1.25em; }
                                .rich-text-content li { margin-bottom: 0.5em; }
                                .rich-text-content blockquote { border-left: 4px solid #0d9488; padding-left: 1em; margin-left: 0; color: #4b5563; font-style: italic; }
                                .rich-text-content a { color: #0d9488; text-decoration: underline; font-weight: 500; }
                                .rich-text-content code { background-color: #f3f4f6; padding: 0.2em 0.4em; border-radius: 0.25em; font-family: monospace; font-size: 0.9em; }
                                .rich-text-content img { border-radius: 0.75rem; margin: 2rem 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); width: 100%; }
                            `}</style>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">
                                    Popular Curations
                                </h3>
                                <div className="space-y-6">
                                    {relatedGuides.map(related => (
                                        <Link
                                            key={related.id}
                                            to={`/guide/${related.slug || related.id}`}
                                            className="group block"
                                        >
                                            <div className="flex gap-4">
                                                <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                                    💡
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2">
                                                        {related.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {related.createdAt?.includes(',') ? related.createdAt : new Date(related.createdAt || Date.now()).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    {relatedGuides.length === 0 && <p className="text-sm text-gray-400">No other curated guides yet.</p>}
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
