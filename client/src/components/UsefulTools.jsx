import React from 'react'
import { Link } from 'react-router-dom'

const UsefulTools = () => {
    const tools = [
        {
            title: "Loan EMI Estimator",
            description: "Estimate your loan EMI based on amount, tenure, and interest rate.",
            image: "/assets/coinStonks.png",
            color: "from-blue-500 to-indigo-600",
            id: "EMI" // Reusing EMI for now as requested by user "based on which calculator"
        },
        {
            title: "SIP Calculator", // Changed title slightly to match
            description: "Calculate how much your investments will grow with SIP.",
            image: "/assets/graph+shield.png",
            color: "from-purple-500 to-pink-600",
            id: "SIP"
        },
        {
            title: "Budget Planner",
            description: "Plan your monthly budget with the 50-30-20 rule.",
            image: "/assets/piggybank.png", // Assuming image exists or keeping previous
            color: "from-green-500 to-emerald-600",
            id: "BUDGET"
        }
    ]

    return (
        <section className="bg-gradient-to-br from-gray-50 to-teal-50/30">
            <div className="section-container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Useful Tools
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Free calculators and tools to plan your finances better
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {tools.map((tool, index) => (
                        <div key={index} className="group relative bg-white rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-row md:flex-col items-center md:items-stretch gap-5 md:gap-0 h-auto md:h-full">

                            {/* Mobile: Small Icon Left | Desktop: Large Image Top */}
                            <div className="w-16 h-16 md:w-full md:h-48 flex-shrink-0 rounded-xl bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center mb-0 md:mb-6 overflow-hidden">
                                <img
                                    src={tool.image}
                                    alt={tool.title}
                                    className="w-10 h-10 md:w-full md:h-full object-contain md:p-8 group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col min-w-0">
                                <h3 className="text-base md:text-xl font-bold text-gray-900 mb-1 md:mb-2 truncate md:whitespace-normal">
                                    {tool.title}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-500 md:mb-6 line-clamp-1 md:line-clamp-3">
                                    {tool.description}
                                </p>

                                {/* Desktop Button (Full) */}
                                <div className="hidden md:block mt-auto">
                                    <Link
                                        to={`/calculators?tab=${tool.id}`}
                                        className={`block w-full text-center bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300`}
                                    >
                                        Try calculator
                                    </Link>
                                </div>
                            </div>

                            {/* Mobile Arrow (Right) */}
                            <Link
                                to={`/calculators?tab=${tool.id}`}
                                className="md:hidden flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="sr-only">Go</span>
                            </Link>

                            {/* Mobile Click Overlay */}
                            <Link to={`/calculators?tab=${tool.id}`} className="absolute inset-0 md:hidden" aria-hidden="true" />
                        </div>
                    ))}
                </div>

                {/* Disclaimer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500 italic max-w-3xl mx-auto">
                        * Results are indicative and for informational purposes only. Actual values may vary based on lender policies and individual circumstances.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default UsefulTools
