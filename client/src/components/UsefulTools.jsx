import React from 'react'

const UsefulTools = () => {
    const tools = [
        {
            title: "EMI Calculator",
            description: "Calculate your monthly EMI payments for loans and credit cards.",
            image: "/assets/calculatorcoins.png",
            color: "from-teal-500 to-cyan-600"
        },
        {
            title: "Loan EMI Estimator",
            description: "Estimate your loan EMI based on amount, tenure, and interest rate.",
            image: "/assets/coinStonks.png",
            color: "from-blue-500 to-indigo-600"
        },
        {
            title: "Credit Score Estimator",
            description: "Get an estimate of your credit score based on your financial behavior.",
            image: "/assets/graph+shield.png",
            color: "from-purple-500 to-pink-600"
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

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {tools.map((tool, index) => (
                        <div key={index} className="card group cursor-pointer hover:-translate-y-2">
                            <div className="relative mb-6 rounded-xl overflow-hidden bg-gray-100 h-48 flex items-center justify-center">
                                <img
                                    src={tool.image}
                                    alt={tool.title}
                                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {tool.title}
                            </h3>
                            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                                {tool.description}
                            </p>
                            <button className={`w-full bg-gradient-to-r ${tool.color} text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300`}>
                                Try calculator
                            </button>
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
