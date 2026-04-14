import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Heart, Shield, Zap, Lock, CreditCard, X, Sparkles, Loader2, AlertCircle } from "lucide-react";
import api from "../../shared/api/client";
import { useAuth } from "../../context/AuthContext";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function UpgradePage() {
    const { tenant, setTenantData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    // Dynamic Razorpay Script Loading
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleUpgrade = async (planName) => {
        if (loading) return;
        setLoading(true);
        setStatusMessage(null);

        try {
            // 1. Create order on backend
            const orderRes = await api.post("/core/billing/create-order/", { plan_name: planName });
            const orderData = orderRes.data;

            const options = {
                key: orderData.razorpay_key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Temple Management SaaS",
                description: `Upgrade to ${orderData.plan_name}`,
                order_id: orderData.order_id,
                prefill: {
                    name: orderData.prefill_name,
                    email: orderData.prefill_email,
                },
                theme: {
                    color: tenant?.brand_color || "#f97316",
                },
                handler: async (response) => {
                    setLoading(true);
                    try {
                        // 2. Verify payment on backend
                        const verifyRes = await api.post("/core/billing/verify/", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            plan_name: planName
                        });

                        if (verifyRes.data.success) {
                            setStatusMessage({ type: "success", text: verifyRes.data.message });
                            // Update local tenant data to reflect new plan immediately
                            setTenantData({ ...tenant, plan_name: verifyRes.data.new_plan });
                        }
                    } catch (err) {
                        setStatusMessage({ type: "error", text: "Verification failed. Please contact support." });
                    } finally {
                        setLoading(false);
                    }
                },
                modal: {
                    ondismiss: () => setLoading(false)
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment Error:", error);
            setStatusMessage({ type: "error", text: error.response?.data?.error || "Failed to initiate payment." });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 lg:p-10 relative">
            <AnimatePresence>
                {statusMessage && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-24 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border ${
                            statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'
                        }`}
                    >
                        {statusMessage.type === 'success' ? <Sparkles size={20} /> : <AlertCircle size={20} />}
                        <span className="font-bold text-sm tracking-tight">{statusMessage.text}</span>
                        <button onClick={() => setStatusMessage(null)} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-center max-w-2xl mx-auto mb-12"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-bold text-xs tracking-widest uppercase mb-6 border border-orange-100 shadow-sm">
                    <Lock size={14} /> Subscription Registry
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 tracking-tight mb-4">
                    Elevate to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">TempleSaaS PRO</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium">
                    Scale your divine service with automated analytics, digital queue displays, and premium integrations.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full"
            >
                {/* Lite Plan (Default) */}
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-slate-300">
                    <div className="mb-8">
                        <h3 className="text-2xl font-black text-slate-800">Lite {tenant?.plan_name === 'LITE' && <span className="text-emerald-500 font-bold text-xs border border-emerald-100 ml-2 px-2 py-0.5 rounded-lg bg-emerald-50 uppercase tracking-widest">Active</span>}</h3>
                        <p className="text-slate-500 font-medium mt-2">Essential management for local temples.</p>
                        <div className="mt-6 flex items-baseline gap-1">
                            <span className="text-5xl font-black text-slate-800">₹999</span>
                            <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">/ month</span>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        <FeatureItem text="Unlimited Devotee Database" active />
                        <FeatureItem text="Pooja & Seva Bookings" active />
                        <FeatureItem text="Hundi Collection Tracking" active />
                        <FeatureItem text="Basic Inventory Management" active />
                        <FeatureItem text="Advanced Financial Reports" />
                        <FeatureItem text="TV Queue Display Modes" />
                        <FeatureItem text="Webhooks & API Integrations" />
                    </div>

                    <button 
                        disabled={tenant?.plan_name === 'LITE' || loading}
                        onClick={() => handleUpgrade('LITE')}
                        className={`w-full mt-8 py-4 rounded-2xl font-bold tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2 ${
                            tenant?.plan_name === 'LITE' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black'
                        }`}
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {tenant?.plan_name === 'LITE' ? 'Current Plan' : 'Switch to Lite'}
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="bg-gradient-to-b from-orange-600 to-red-700 rounded-[2.5rem] p-1 shadow-2xl shadow-orange-500/30 flex flex-col relative transform md:-translate-y-4 transition-all duration-300 hover:scale-105">
                    <div className="absolute top-0 right-10 transform -translate-y-1/2">
                        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-black text-xs px-4 py-1.5 rounded-full shadow-lg tracking-widest uppercase">
                            Most Powerful
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl rounded-[2.4rem] p-8 h-full border border-white/20 flex flex-col">
                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-white flex items-center gap-3">
                                Temple PRO <Zap size={24} className="text-yellow-400 fill-yellow-400" />
                            </h3>
                            <p className="text-orange-100 font-medium mt-2">Maximum automation for high-traffic temples.</p>
                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-5xl font-black text-white">₹4,999</span>
                                <span className="text-orange-200 font-bold uppercase tracking-widest text-xs">/ month</span>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            <FeatureItem text="Unlimited Devotee Database" active dark />
                            <FeatureItem text="Pooja & Seva Bookings" active dark />
                            <FeatureItem text="Hundi Collection Tracking" active dark />
                            <FeatureItem text="Basic Inventory Management" active dark />
                            <FeatureItem text="Advanced Financial Reports" active dark />
                            <FeatureItem text="TV Queue Display Modes" active dark />
                            <FeatureItem text="Webhooks & API Integrations" active dark />
                        </div>

                        <button 
                            disabled={tenant?.plan_name === 'PRO' || loading}
                            onClick={() => handleUpgrade('PRO')}
                            className={`w-full mt-8 py-4 rounded-2xl font-black tracking-wide shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
                                tenant?.plan_name === 'PRO' ? 'bg-white/20 text-white cursor-not-allowed border border-white/10' : 'bg-white text-orange-600 hover:bg-orange-50'
                            }`}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={20} />}
                            {tenant?.plan_name === 'PRO' ? 'Current Active Plan' : 'Upgrade to PRO Now'}
                        </button>
                    </div>
                </div>
            </motion.div>

            <p className="mt-12 text-sm font-medium text-slate-400 flex items-center gap-2">
                <Shield size={16} /> Encrypted transactions secured by Razorpay Intelligence.
            </p>
        </div>
    );
}

function FeatureItem({ text, active = false, dark = false }) {
    if (!active) {
        return (
            <div className="flex items-center gap-3 opacity-40">
                <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                    <X size={12} className="text-slate-400" />
                </div>
                <span className="text-sm font-semibold text-slate-500 line-through decoration-slate-300">{text}</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${dark ? 'bg-orange-400/30' : 'bg-emerald-100'}`}>
                <Check size={12} className={dark ? 'text-white' : 'text-emerald-600'} strokeWidth={3} />
            </div>
            <span className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-700'}`}>{text}</span>
        </div>
    );
}
