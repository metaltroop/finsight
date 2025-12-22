import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSuccess(true)
            console.log('Form submitted:', formData)
        }, 1500)
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
        <section className="bg-gray-50 py-16 md:py-24">
            <div className="section-container">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Get Started Today
                        </h2>
                        <p className="text-lg text-gray-600">
                            Fill in your details to receive personalized offers from our partners
                        </p>
                    </div>

                    <div className="card shadow-2xl border border-gray-100 bg-white p-6 md:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg transition-all outline-none ${errors.fullName ? 'border-red-500 focus:ring-red-100' : 'border-gray-300 focus:ring-primary-100 focus:border-primary-500'}`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fullName}</p>}
                                </div>

                                {/* Mobile Number */}
                                <div>
                                    <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mobile Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg transition-all outline-none ${errors.mobile ? 'border-red-500 focus:ring-red-100' : 'border-gray-300 focus:ring-primary-100 focus:border-primary-500'}`}
                                        placeholder="10-digit mobile number"
                                    />
                                    {errors.mobile && <p className="text-red-500 text-xs mt-1 font-medium">{errors.mobile}</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg transition-all outline-none ${errors.email ? 'border-red-500 focus:ring-red-100' : 'border-gray-300 focus:ring-primary-100 focus:border-primary-500'}`}
                                        placeholder="your.email@example.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                                </div>

                                {/* City */}
                                <div>
                                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg transition-all outline-none ${errors.city ? 'border-red-500 focus:ring-red-100' : 'border-gray-300 focus:ring-primary-100 focus:border-primary-500'}`}
                                        placeholder="Your city"
                                    />
                                    {errors.city && <p className="text-red-500 text-xs mt-1 font-medium">{errors.city}</p>}
                                </div>
                            </div>

                            {/* Income Range */}
                            <div>
                                <label htmlFor="income" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Monthly Income Range *
                                </label>
                                <select
                                    id="income"
                                    name="income"
                                    value={formData.income}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg transition-all outline-none bg-white ${errors.income ? 'border-red-500' : 'border-gray-300 focus:border-primary-500'}`}
                                >
                                    <option value="">Select income range</option>
                                    <option value="0-25k">₹0 - ₹25,000</option>
                                    <option value="25k-50k">₹25,000 - ₹50,000</option>
                                    <option value="50k-1L">₹50,000 - ₹1,00,000</option>
                                    <option value="1L-2L">₹1,00,000 - ₹2,00,000</option>
                                    <option value="2L+">₹2,00,000+</option>
                                </select>
                                {errors.income && <p className="text-red-500 text-xs mt-1 font-medium">{errors.income}</p>}
                            </div>

                            {/* Consent */}
                            <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-5">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="consent"
                                        required
                                        checked={formData.consent}
                                        onChange={handleChange}
                                        className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600 leading-relaxed">
                                        I agree to the{' '}
                                        <a href="#" className="text-primary-600 font-semibold hover:underline">
                                            Terms & Conditions
                                        </a>
                                        {' '}and{' '}
                                        <a href="#" className="text-primary-600 font-semibold hover:underline">
                                            Privacy Policy
                                        </a>
                                        {' '}and authorize Finsight to share my details with partner banks/NBFCs for eligibility checks.
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full btn-primary text-lg py-4 relative overflow-hidden group"
                                disabled={!formData.consent || isSubmitting}
                            >
                                <span className={isSubmitting ? 'opacity-0' : 'opacity-100 transition-opacity'}>
                                    {isSubmitting ? 'Processing...' : 'Continue to partner →'}
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

                            {/* Security Note */}
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <span>Your data is encrypted and secure</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LeadForm
