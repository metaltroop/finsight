import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

                <div className="prose prose-teal max-w-none text-gray-600 space-y-6">
                    <p>Last updated: December 27, 2025</p>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us when you fill out forms, register for an account, or use our calculators. This includes:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Contact details (Name, Email, Mobile Number, City)</li>
                            <li>Financial information (Income Range, Exact Income)</li>
                            <li>Calculated data (EMI inputs, Investment goals)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Provide personalized financial insights and offers.</li>
                            <li>Connect you with partner banks and NBFCs for loan/investment eligibility.</li>
                            <li>Send you promotional communications (only with your explicit consent).</li>
                            <li>Improve our website and services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Sharing and Disclosure</h2>
                        <p>We may share your information with:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Partner Financial Institutions:</strong> To check your eligibility for products you express interest in.</li>
                            <li><strong>Service Providers:</strong> Who assist us in operating our website and conducting our business.</li>
                            <li><strong>Compliance:</strong> As required by law or to protect our rights.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Security</h2>
                        <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at support@finsight.com.</p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default PrivacyPolicy;
