import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { Wallet, ChevronRight } from 'lucide-react';

const INCOME_RANGES = [
    "Below ₹5 Lakhs",
    "₹5 - ₹10 Lakhs",
    "₹10 - ₹15 Lakhs",
    "₹15 - ₹25 Lakhs",
    "₹25 - ₹50 Lakhs",
    "Above ₹50 Lakhs"
];

export const ProfileCompletionModal = () => {
    const { user, updateProfile } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [incomeRange, setIncomeRange] = useState('');
    const [exactIncome, setExactIncome] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Trigger if user is logged in BUT has no incomeRange set
        if (user && !user.incomeRange) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile({ incomeRange, exactIncome });
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
                >
                    <div className="bg-teal-600 p-6 text-white text-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold">Complete Your Profile</h2>
                        <p className="text-teal-100 mt-2 text-sm">Help us personalize your financial insights.</p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Income Range Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700">
                                    Annual Income Range <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {INCOME_RANGES.map((range) => (
                                        <button
                                            key={range}
                                            type="button"
                                            onClick={() => setIncomeRange(range)}
                                            className={cn(
                                                "py-3 px-4 rounded-xl text-sm font-medium border transition-all text-left",
                                                incomeRange === range
                                                    ? "border-teal-500 bg-teal-50 text-teal-700 ring-1 ring-teal-500"
                                                    : "border-gray-200 hover:border-teal-200 hover:bg-gray-50 text-gray-600"
                                            )}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Exact Income (Optional) */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex justify-between">
                                    <span>Exact Annual Income</span>
                                    <span className="text-gray-400 font-normal italic">Optional</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                                    <input
                                        type="number"
                                        value={exactIncome}
                                        onChange={(e) => setExactIncome(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                                        placeholder="e.g. 1200000"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!incomeRange || loading}
                                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {loading ? 'Saving...' : 'Continue to Dashboard'}
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
