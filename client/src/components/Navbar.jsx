import React, { useState, useEffect } from 'react'
import { Link as ScrollLink } from 'react-scroll'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { LogIn, User } from 'lucide-react'

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const isHome = location.pathname === '/'

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Home', to: 'hero', homeOnly: true },
        { name: 'Guides', to: 'popular', homeOnly: true },
        { name: 'Tools', to: 'tools', homeOnly: false },
        { name: 'Comparisons', to: 'compare', homeOnly: true },
        { name: 'Get Started', to: 'lead-form', homeOnly: true, highlight: true }
    ]

    const handleNavClick = (to) => {
        if (!isHome) {
            navigate('/')
            // Wait for navigation and then scroll
            setTimeout(() => {
                const element = document.getElementById(to)
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                }
            }, 100)
        }
        setIsMobileMenuOpen(false)
    }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHome ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-3'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <span className="text-xl font-bold">F</span>
                    </div>
                    <span className={`text-2xl font-bold tracking-tight ${isScrolled || !isHome ? 'text-gray-900' : 'text-gray-900'}`}>
                        Finsight
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        isHome ? (
                            <ScrollLink
                                key={link.name}
                                to={link.to}
                                spy={true}
                                smooth={true}
                                offset={-80}
                                duration={500}
                                className={`cursor-pointer font-medium transition-colors ${link.highlight ? 'bg-primary-600 text-white px-6 py-2.5 rounded-full hover:bg-primary-700 shadow-md hover:shadow-lg' : 'text-gray-600 hover:text-primary-600'}`}
                            >
                                {link.name}
                            </ScrollLink>
                        ) : (
                            <Link
                                key={link.name}
                                to="/"
                                onClick={() => handleNavClick(link.to)}
                                className={`font-medium transition-colors ${link.highlight ? 'bg-primary-600 text-white px-6 py-2.5 rounded-full hover:bg-primary-700 shadow-md hover:shadow-lg' : 'text-gray-600 hover:text-primary-600'}`}
                            >
                                {link.name}
                            </Link>
                        )
                    ))}
                    {user && (
                        <div className="flex items-center gap-4 ml-2 border-l pl-6 border-gray-200">
                            <span className="text-sm font-bold text-gray-900 truncate max-w-[100px] hidden lg:block">Hey, {user.name.split(' ')[0]}</span>
                            <button
                                onClick={logout}
                                className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-gray-600"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                isHome ? (
                                    <ScrollLink
                                        key={link.name}
                                        to={link.to}
                                        spy={true}
                                        smooth={true}
                                        offset={-80}
                                        duration={500}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`text-lg font-medium ${link.highlight ? 'text-primary-600' : 'text-gray-600'}`}
                                    >
                                        {link.name}
                                    </ScrollLink>
                                ) : (
                                    <Link
                                        key={link.name}
                                        to="/"
                                        onClick={() => handleNavClick(link.to)}
                                        className={`text-lg font-medium ${link.highlight ? 'text-primary-600' : 'text-gray-600'}`}
                                    >
                                        {link.name}
                                    </Link>
                                )
                            ))}
                            {user ? (
                                <button onClick={logout} className="text-lg font-medium text-red-500 text-left">
                                    Sign Out
                                </button>
                            ) : (
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-teal-600">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar
