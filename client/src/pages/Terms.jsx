import React from 'react';
import { motion } from 'framer-motion';

const TermsConditions = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>

                <div className="prose prose-teal max-w-none text-gray-600 space-y-6">
                    <p>Last updated: December 27, 2025</p>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                        <p>By accessing and using Finsight ("we", "us", "our"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Use of Services</h2>
                        <p>Our website provides financial calculators, informational content, and connection services to financial institutions. The information provided is for educational purposes only and does not constitute financial advice.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Responsibilities</h2>
                        <p>You agree to provide accurate and complete information when using our calculators or lead forms. You are responsible for maintaining the confidentiality of your account login details (OTP/Password).</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Intellectual Property</h2>
                        <p>All content, features, and functionality of Finsight are owned by us and are protected by Indian and international copyright, trademark, and other intellectual property laws.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Disclaimer</h2>
                        <p>Finsight is not a lender or financial advisor. We do not guarantee approval for any loan or financial product. Decisions are at the sole discretion of our partner institutions.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Limitation of Liability</h2>
                        <p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default TermsConditions;
