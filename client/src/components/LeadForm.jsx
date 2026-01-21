import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CustomDropdown from './CustomDropdown'

const LeadForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        email: '',
        city: '',
        income: '',
        consent: false
    })

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const validate = (name, value) => {
        let error = ''
        switch (name) {
            case 'fullName':
                if (value.trim().length < 3) error = 'Name must be at least 3 characters'
                break
            case 'mobile':
                if (!/^[0-9]{10}$/.test(value)) error = 'Enter a valid 10-digit mobile number'
                break
            case 'email':
                if (!/\S+@\S+\.\S+/.test(value)) error = 'Enter a valid email address'
                break
            case 'city':
                if (value.trim().length < 2) error = 'Enter your city'
                break
            case 'income':
                if (!value) error = 'Select your income range'
                break
            default:
                break
        }
        return error
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        const val = type === 'checkbox' ? checked : value
        setFormData(prev => ({
            ...prev,
            [name]: val
        }))

        // Real-time validation
        const error = validate(name, val)
        setErrors(prev => ({
            ...prev,
            [name]: error
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Final validation check
        const newErrors = {}
        Object.keys(formData).forEach(key => {
            if (key !== 'consent') {
                const error = validate(key, formData[key])
                if (error) newErrors[key] = error
            }
        })

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('http://localhost:3000/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (response.ok) {
                setIsSuccess(true)
                setFormData({
                    fullName: '',
                    mobile: '',
                    email: '',
                    city: '',
                    income: '',
                    consent: false
                })
            } else {
                console.error('Submission failed:', data.message)
                // Optionally set a global error state here to show to user
                alert(data.message || 'Something went wrong. Please try again.')
            }
        } catch (error) {
            console.error('Network error:', error)
            alert('Failed to connect to server. Please try again later.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="section-container text-center py-20"
            >
                <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg mx-auto border border-teal-100">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Received!</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        One of our experts will contact you shortly with the best financial offers.
                    </p>
                    <button
                        onClick={() => setIsSuccess(false)}
                        className="btn-primary"
                    >
                        Back to Home
                    </button>
                </div>
            </motion.div>
        )
    }

    return (
        <section className="py-20 lg:py-28 bg-gray-50 relative overflow-hidden" id="get-started">
            <div className="section-container relative z-10">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 items-start">

                    {/* Left Card - Image & Text */}
                    <div className="lg:col-span-2 relative min-h-[400px] h-full rounded-3xl overflow-hidden shadow-2xl group">
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src="/assets/financial_growth_tablet.png"
                                alt="Financial Growth"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white mb-10 z-10">
                            <h3 className="text-3xl font-bold mb-3 leading-tight">
                                Smarter decisions, <br />
                                <span className="text-teal-400">Better future.</span>
                            </h3>
                            <p className="text-gray-200 text-sm leading-relaxed mb-6">
                                Join thousands of Indians who are taking control of their financial destiny with Finsight.
                            </p>

                            {/* Trust Indicators */}
                            <div className="flex items-center gap-4 text-xs font-medium text-white/80">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Data Secure
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    No Spam
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Card - Form */}
                    <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 relative">
                        <div className="mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Get Started Today
                            </h2>
                            <p className="text-gray-500">
                                Fill in your details to receive personalized offers.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                                {/* Full Name */}
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-xl transition-all outline-none bg-gray-50 focus:bg-white ${errors.fullName ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:ring-primary-100 focus:border-primary-500'}`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fullName}</p>}
                                </div>

                                {/* Mobile Number */}
                                <div>
                                    <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Mobile Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-xl transition-all outline-none bg-gray-50 focus:bg-white ${errors.mobile ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:ring-primary-100 focus:border-primary-500'}`}
                                        placeholder="10-digit mobile number"
                                    />
                                    {errors.mobile && <p className="text-red-500 text-xs mt-1 font-medium">{errors.mobile}</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-xl transition-all outline-none bg-gray-50 focus:bg-white ${errors.email ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:ring-primary-100 focus:border-primary-500'}`}
                                        placeholder="your.email@example.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                                </div>

                                {/* City */}
                                <div>
                                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-xl transition-all outline-none bg-gray-50 focus:bg-white ${errors.city ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:ring-primary-100 focus:border-primary-500'}`}
                                        placeholder="Your city"
                                    />
                                    {errors.city && <p className="text-red-500 text-xs mt-1 font-medium">{errors.city}</p>}
                                </div>
                            </div>

                            {/* Income Range */}
                            <div>
                                <label htmlFor="income" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Monthly Income Range *
                                </label>
                                <CustomDropdown
                                    options={[
                                        { value: "0-25k", label: "₹0 - ₹25,000" },
                                        { value: "25k-50k", label: "₹25,000 - ₹50,000" },
                                        { value: "50k-1L", label: "₹50,000 - ₹1,00,000" },
                                        { value: "1L-2L", label: "₹1,00,000 - ₹2,00,000" },
                                        { value: "2L+", label: "₹2,00,000+" }
                                    ]}
                                    value={formData.income}
                                    onChange={(e) => handleChange({ target: { name: 'income', value: e.target.value } })}
                                    placeholder="Select income range"
                                    error={errors.income}
                                />
                            </div>

                            {/* Consent */}
                            <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="consent"
                                        required
                                        checked={formData.consent}
                                        onChange={handleChange}
                                        className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                                    />
                                    <span className="text-xs text-gray-600 leading-relaxed">
                                        I agree to the <a href="/terms" target="_blank" className="text-primary-600 font-semibold hover:underline">Terms</a> & <a href="/privacy" target="_blank" className="text-primary-600 font-semibold hover:underline">Privacy Policy</a> and authorize Finsight to share my details with partner banks/NBFCs and receive promotional communications.
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full btn-primary text-lg py-4 relative overflow-hidden group shadow-lg shadow-primary-600/20"
                                disabled={!formData.consent || isSubmitting}
                            >
                                <span className={isSubmitting ? 'opacity-0' : 'opacity-100 transition-opacity flex items-center justify-center gap-2'}>
                                    {isSubmitting ? 'Processing...' : (
                                        <>
                                            Find Best Offers
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </>
                                    )}
                                </span>
                                {isSubmitting && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LeadForm
