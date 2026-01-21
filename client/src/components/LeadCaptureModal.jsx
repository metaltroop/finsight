import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomDropdown from './CustomDropdown';

const LeadCaptureModal = ({ isOpen, onClose, contextData }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        city: '',
        income: '',
        consent: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = { ...formData };
            // Append context if available
            if (contextData) {
                payload.calculatorData = contextData;
            }

            const res = await fetch('http://localhost:3000/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                setIsSuccess(true);
            } else {
                alert(data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to connect');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
                >
                    {isSuccess ? (
                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Details Sent!</h3>
                            <p className="text-gray-500 mb-8">Our expert will call you shortly to discuss your plan.</p>
                            <button onClick={() => { setIsSuccess(false); onClose(); }} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
                                Close
                            </button>
                        </div>
                    ) : (
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Get Expert Advice</h3>
                                    <p className="text-sm text-gray-500">Free consultation based on your results</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                                    X
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Name</label>
                                    <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-teal-500 transition-colors" placeholder="Your Name" />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Mobile</label>
                                    <input required type="tel" pattern="[0-9]{10}" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-teal-500 transition-colors" placeholder="10-digit Number" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700">City</label>
                                        <input required name="city" value={formData.city} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-teal-500 transition-colors" placeholder="City" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Income</label>
                                        <CustomDropdown
                                            options={[
                                                { value: "0-25k", label: "0-25k" },
                                                { value: "25k-50k", label: "25k-50k" },
                                                { value: "50k-1L", label: "50k-1L" },
                                                { value: "1L+", label: "1L+" }
                                            ]}
                                            value={formData.income}
                                            onChange={(e) => handleChange({ target: { name: 'income', value: e.target.value } })}
                                            placeholder="Select"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                    <input type="checkbox" required checked={formData.consent} onChange={handleChange} className="mt-1" />
                                    <p className="text-xs text-gray-500 leading-snug">
                                        I authorize Finsight to contact me regarding my financial query.
                                    </p>
                                </div>

                                <button disabled={isSubmitting} className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-700/20 flex justify-center items-center gap-2">
                                    {isSubmitting ? 'Sending...' : 'Request Call Back'}
                                </button>
                            </form>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LeadCaptureModal;
