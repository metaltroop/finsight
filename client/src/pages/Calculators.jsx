import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '../components/ui/Slider';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { Calculator, TrendingUp, PiggyBank, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

import LeadCaptureModal from '../components/LeadCaptureModal';

export default function Calculators() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, loading, logout } = useAuth();

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalContext, setModalContext] = useState(null);

    // Get mode from URL or default to EMI
    const paramMode = searchParams.get('tab');
    const [mode, setMode] = useState(paramMode || 'EMI');

    const openLeadModal = (context) => {
        setModalContext(context);
        setShowModal(true);
    };

    // Update URL when mode changes
    const handleModeChange = (newMode) => {
        setMode(newMode);
        setSearchParams({ tab: newMode });
    }

    // Redirect to full login page with return url
    const handleLoginRedirect = () => {
        navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }

    // Sync state if URL changes externally
    React.useEffect(() => {
        if (paramMode && paramMode !== mode) {
            setMode(paramMode);
        }
    }, [paramMode]);

    // Gate logic
    const isLocked = !user;

    return (
        <section className="pt-32 pb-24 bg-gray-50 min-h-screen relative">
            <LeadCaptureModal isOpen={showModal} onClose={() => setShowModal(false)} contextData={modalContext} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
                        Financial <span className="text-teal-500">Playground</span>
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Simulate your financial future. Calculate EMIs, SIP wealth, and manage your budget in real-time.
                    </p>

                    {/* Authenticated User Profile Display */}
                    {user && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-3 mt-4 bg-white p-2 pr-6 rounded-full shadow-sm w-fit mx-auto border border-gray-100"
                        >
                            <img
                                src={user.avatar || "https://ui-avatars.com/api/?name=" + user.name}
                                alt={user.name}
                                className="w-10 h-10 rounded-full border-2 border-teal-100"
                            />
                            <div className="text-left">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Planning as</p>
                                <p className="text-sm font-bold text-gray-800 leading-none">{user.name}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="ml-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Sign Out"
                            >
                                <LogOut size={16} />
                            </button>
                        </motion.div>
                    )}

                    {/* Mode Switcher */}
                    <div className="inline-flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 mt-8">
                        <ModeButton active={mode === 'EMI'} onClick={() => handleModeChange('EMI')} icon={<Calculator size={18} />} label="Loan EMI" />
                        <ModeButton active={mode === 'SIP'} onClick={() => handleModeChange('SIP')} icon={<TrendingUp size={18} />} label="SIP Wealth" />
                        <ModeButton active={mode === 'BUDGET'} onClick={() => handleModeChange('BUDGET')} icon={<PiggyBank size={18} />} label="Budget" />
                    </div>
                </div>

                {/* Main Calculator Area */}
                <div className="max-w-5xl mx-auto relative">

                    {/* Gate Overlay */}
                    {isLocked && !loading && (
                        <div className="absolute inset-0 z-20 backdrop-blur-md bg-white/30 flex items-center justify-center rounded-3xl border border-white/50">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md mx-4 border border-gray-100"
                            >
                                <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Lock size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Unlock Calculators</h3>
                                <p className="text-gray-500 mb-8">
                                    Log in to access these premium financial tools and save your scenarios.
                                </p>
                                <button
                                    onClick={handleLoginRedirect}
                                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <Lock size={18} />
                                    Sign in / Sign up to Unlock
                                </button>
                                <p className="mt-4 text-xs text-gray-400">
                                    Or fill the "Get Started" form on home page.
                                </p>
                            </motion.div>
                        </div>
                    )}

                    <div className={cn("transition-all duration-300", isLocked ? "blur-sm pointer-events-none select-none opacity-50" : "")}>
                        <AnimatePresence mode="wait">
                            {mode === 'EMI' && <EMICalculator key="emi" openModal={openLeadModal} />}
                            {mode === 'SIP' && <SIPCalculator key="sip" openModal={openLeadModal} />}
                            {mode === 'BUDGET' && <BudgetCalculator key="budget" openModal={openLeadModal} />}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ModeButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                active ? "bg-teal-500 text-white shadow-md shadow-teal-500/20" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            )}
        >
            {icon}
            {label}
        </button>
    )
}

// Custom Hook for Auto-Save
function useAutoSave(type, inputData, resultData) {
    const dataRef = React.useRef({ inputData, resultData });
    const initialRef = React.useRef(JSON.stringify({ inputData, resultData }));

    React.useEffect(() => {
        dataRef.current = { inputData, resultData };
    }, [inputData, resultData]);

    React.useEffect(() => {
        return () => {
            const currentDataStr = JSON.stringify(dataRef.current);
            if (currentDataStr !== initialRef.current) {
                const { inputData, resultData } = dataRef.current;
                fetch('http://localhost:3000/api/calculators', {
                    method: 'POST',
                    keepalive: true,
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ type, inputData, resultData })
                }).catch(e => console.error('[AutoSave] Failed', e));
            }
        };
    }, []);
}


function EMICalculator({ openModal }) {
    const [amount, setAmount] = useState(5000000);
    const [rate, setRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);

    const calculateEMI = () => {
        const r = rate / 12 / 100;
        const n = tenure * 12;
        const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        return Math.round(emi);
    }

    const emi = calculateEMI();
    const totalPayment = emi * tenure * 12;
    const totalInterest = totalPayment - amount;

    useAutoSave('EMI', { amount, rate, tenure }, { emi, totalInterest, totalPayment });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-12 gap-8"
        >
            <Card className="md:col-span-7 p-8 space-y-8">
                <Slider label="Loan Amount" value={amount} min={100000} max={20000000} step={50000} onChange={setAmount} formatValue={(v) => `₹ ${(v / 100000).toFixed(1)} L`} />
                <Slider label="Interest Rate (%)" value={rate} min={1} max={15} step={0.1} onChange={setRate} formatValue={(v) => `${v}%`} />
                <Slider label="Tenure (Years)" value={tenure} min={1} max={30} onChange={setTenure} formatValue={(v) => `${v} Yrs`} />
            </Card>

            <div className="md:col-span-5 space-y-6">
                <Card className="p-8 bg-gray-900 text-white border-none shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                    <div className="relative z-10 text-center space-y-2">
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Monthly EMI</p>
                        <div className="text-5xl font-bold tracking-tight text-white mb-2">
                            ₹{emi.toLocaleString('en-IN')}
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-800 space-y-4">
                        <div className="flex justify-between text-sm"><span className="text-gray-400">Principal</span><span className="font-medium text-gray-200">₹ {amount.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-400">Total Interest</span><span className="font-medium text-teal-400">₹ {totalInterest.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-400">Total Payable</span><span className="font-medium text-white">₹ {totalPayment.toLocaleString('en-IN')}</span></div>
                    </div>

                    <button
                        onClick={() => openModal({ type: 'EMI', inputData: { amount, rate, tenure }, resultData: { emi, totalInterest, totalPayment } })}
                        className="w-full mt-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2"
                    >
                        <span>📞</span> Talk to Loan Expert
                    </button>
                </Card>
            </div>
        </motion.div>
    )
}

function SIPCalculator({ openModal }) {
    const [monthly, setMonthly] = useState(10000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(15);

    const calculateSIP = () => {
        const i = rate / 12 / 100;
        const n = years * 12;
        const maturity = monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        return Math.round(maturity);
    }
    const totalInvested = monthly * years * 12;
    const maturityValue = calculateSIP();
    const wealthGained = maturityValue - totalInvested;

    useAutoSave('SIP', { monthly, rate, years }, { maturityValue, totalInvested, wealthGained });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-12 gap-8"
        >
            <Card className="md:col-span-7 p-8 space-y-8">
                <Slider label="Monthly Investment" value={monthly} min={500} max={200000} step={500} onChange={setMonthly} formatValue={(v) => `₹ ${v.toLocaleString('en-IN')}`} />
                <Slider label="Expected Return (%)" value={rate} min={1} max={30} step={0.5} onChange={setRate} formatValue={(v) => `${v}%`} />
                <Slider label="Time Period (Years)" value={years} min={1} max={40} onChange={setYears} formatValue={(v) => `${v} Yrs`} />
            </Card>

            <div className="md:col-span-5 space-y-6">
                <Card className="p-8 bg-teal-600 text-white border-none shadow-xl relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />
                    <div className="relative z-10 text-center space-y-2">
                        <p className="text-teal-100 text-sm font-bold uppercase tracking-widest">Wealth Created</p>
                        <div className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                            ₹ {(maturityValue / 10000000).toFixed(2)} Cr
                        </div>
                        <div className="text-sm text-teal-100">₹ {maturityValue.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-teal-500 space-y-4">
                        <div className="flex justify-between text-sm"><span className="text-teal-100">Invested</span><span className="font-medium text-white">₹ {totalInvested.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-teal-100">Returns</span><span className="font-medium text-white">₹ {wealthGained.toLocaleString('en-IN')}</span></div>
                    </div>

                    <button
                        onClick={() => openModal({ type: 'SIP', inputData: { monthly, rate, years }, resultData: { maturityValue, totalInvested, wealthGained } })}
                        className="w-full mt-6 py-3 bg-white text-teal-700 font-bold rounded-xl transition-all hover:bg-teal-50 shadow-lg shadow-teal-900/10 flex items-center justify-center gap-2"
                    >
                        <span>📈</span> Plan Investment
                    </button>
                </Card>
            </div>
        </motion.div>
    )
}

function BudgetCalculator({ openModal }) {
    const [income, setIncome] = useState(75000);
    const [needsPercent, setNeedsPercent] = useState(50);
    const [wantsPercent, setWantsPercent] = useState(30);
    const [savingsPercent, setSavingsPercent] = useState(20);

    const needs = Math.round(income * (needsPercent / 100));
    const wants = Math.round(income * (wantsPercent / 100));
    const savings = Math.round(income * (savingsPercent / 100));

    const total = needsPercent + wantsPercent + savingsPercent;
    const needsWidth = (needsPercent / total) * 100;
    const wantsWidth = (wantsPercent / total) * 100;
    const savingsWidth = (savingsPercent / total) * 100;

    useAutoSave('BUDGET', { income, needsPercent, wantsPercent, savingsPercent }, { needs, wants, savings });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-12 gap-8"
        >
            <Card className="md:col-span-7 p-8 space-y-8">
                <Slider label="Monthly Income" value={income} min={10000} max={500000} step={5000} onChange={setIncome} formatValue={(v) => `₹ ${v.toLocaleString('en-IN')}`} />
                <div className="space-y-6">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Customize Split</h4>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-teal-500" /><span className="text-sm font-medium w-16">Needs</span><input type="range" min={0} max={100} value={needsPercent} onChange={(e) => setNeedsPercent(Number(e.target.value))} className="flex-1 accent-teal-500" /><span className="text-sm font-bold text-teal-600 w-10 text-right">{needsPercent}%</span></div>
                        <div className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-indigo-500" /><span className="text-sm font-medium w-16">Wants</span><input type="range" min={0} max={100} value={wantsPercent} onChange={(e) => setWantsPercent(Number(e.target.value))} className="flex-1 accent-indigo-500" /><span className="text-sm font-bold text-indigo-600 w-10 text-right">{wantsPercent}%</span></div>
                        <div className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-sm font-medium w-16">Savings</span><input type="range" min={0} max={100} value={savingsPercent} onChange={(e) => setSavingsPercent(Number(e.target.value))} className="flex-1 accent-green-500" /><span className="text-sm font-bold text-green-600 w-10 text-right">{savingsPercent}%</span></div>
                    </div>
                </div>
            </Card>

            <div className="md:col-span-5 space-y-6">
                <Card className="p-8 border-gray-200 shadow-xl">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Breakdown</h3>
                    <div className="flex h-4 rounded-full overflow-hidden mb-8 bg-gray-100">
                        <div className="bg-teal-500" style={{ width: `${needsWidth}%` }} />
                        <div className="bg-indigo-500" style={{ width: `${wantsWidth}%` }} />
                        <div className="bg-green-500" style={{ width: `${savingsWidth}%` }} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-teal-50 p-3 rounded-lg"><span className="text-teal-700 font-medium text-sm">Needs</span><span className="font-bold text-teal-800">₹{needs.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between items-center bg-indigo-50 p-3 rounded-lg"><span className="text-indigo-700 font-medium text-sm">Wants</span><span className="font-bold text-indigo-800">₹{wants.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg"><span className="text-green-700 font-medium text-sm">Savings</span><span className="font-bold text-green-800">₹{savings.toLocaleString('en-IN')}</span></div>
                    </div>

                    <button
                        onClick={() => openModal({ type: 'BUDGET', inputData: { income, needsPercent, wantsPercent, savingsPercent }, resultData: { needs, wants, savings } })}
                        className="w-full mt-6 py-3 bg-gray-900 text-white font-bold rounded-xl transition-all hover:bg-gray-800 shadow-lg flex items-center justify-center gap-2"
                    >
                        <span>📝</span> Analyze My Budget
                    </button>
                </Card>
            </div>
        </motion.div>
    )
}
