import React from 'react'

const LeadAction = () => {
    return (
        <section className="bg-gradient-to-br from-teal-600 to-blue-600 text-white relative overflow-hidden py-16 lg:py-0">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="section-container relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Image (Top on mobile) */}
                    <div className="relative order-1 lg:order-2">
                        <img
                            src="/assets/graph+shield.png"
                            alt="Verified partners"
                            className="w-full h-48 md:h-64 lg:h-auto object-contain drop-shadow-2xl mx-auto"
                        />
                    </div>

                    {/* Content (Bottom on mobile) */}
                    <div className="space-y-6 order-2 lg:order-1 text-center lg:text-left">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                            Check eligibility with our verified partners
                        </h2>
                        <p className="text-lg md:text-xl text-teal-50 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Compare offers from RBI-regulated banks and NBFCs. Get personalized recommendations based on your profile.
                        </p>

                        {/* Features */}
                        <div className="space-y-4 pt-4 text-left max-w-lg mx-auto lg:mx-0">
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-teal-200 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h4 className="font-semibold text-lg">Instant eligibility check</h4>
                                    <p className="text-teal-100 text-sm">Know your chances in under 2 minutes</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-teal-200 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h4 className="font-semibold text-lg">Compare multiple offers</h4>
                                    <p className="text-teal-100 text-sm">See options from 20+ trusted partners</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-teal-200 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h4 className="font-semibold text-lg">No impact on credit score</h4>
                                    <p className="text-teal-100 text-sm">Soft inquiry only - safe and secure</p>
                                </div>
                            </div>
                        </div>

                        <button className="bg-white text-primary-600 font-bold py-4 px-10 rounded-lg hover:bg-teal-50 transition-all duration-300 shadow-lg hover:shadow-xl mt-6 group inline-flex items-center gap-2">
                            Check eligibility
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LeadAction
