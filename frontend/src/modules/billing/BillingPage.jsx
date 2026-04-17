import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    CreditCard, 
    ShieldCheck, 
    Zap, 
    Gem, 
    CheckCircle2, 
    Clock, 
    ArrowRight,
    Star,
    Award,
    Shield,
    Check,
    Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../shared/api/client';

export default function BillingPage() {
    const { tenant } = useAuth();
    const [loading, setLoading] = useState(false);

    const plans = [
        {
            id: 'LITE',
            name: 'Basic Temple',
            price: 1500,
            icon: ShieldCheck,
            color: 'blue',
            features: [
                'Digital Receipt Management',
                'Devotee Directory',
                'Basic Hundi Tracking',
                'Email Support',
                'Admin Dashboard Access'
            ]
        },
        {
            id: 'PRO',
            name: 'Professional Devaswom',
            price: 2500,
            icon: Zap,
            color: 'gold',
            popular: true,
            features: [
                'Multi-Counter Support',
                'Advanced Financial Reports',
                'Panchangam Integration',
                'SMS & WhatsApp Notifications',
                'E-Prasad Shipping Tools',
                'Priority Multi-User Access'
            ]
        },
        {
            id: 'MAX',
            name: 'Enterprise / Institution',
            price: 3000,
            icon: Gem,
            color: 'slate',
            features: [
                'Dedicated Support Manager',
                'Asset & Inventory Registry',
                'Full Audit Logs & History',
                '24/7 Phone Support',
                'Staff Attendance Management',
                'Custom Feature Integration'
            ]
        }
    ];

    const handleUpgrade = async (planName) => {
        setLoading(true);
        try {
            const res = await api.post('/billing/create-subscription/', { plan_name: planName });
            const { checkout_url } = res.data;
            if (checkout_url) {
                window.location.href = checkout_url;
            }
        } catch (err) {
            console.error("Upgrade failed:", err);
            alert("Failed to initialize checkout. Please contact support.");
        } finally {
            setLoading(false);
        }
    };

    const trialDaysLeft = tenant?.trial_ends_at 
    ? Math.max(0, Math.ceil((new Date(tenant.trial_ends_at) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow-900/10">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Billing & Plans</h1>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                            Manage your subscription and upgrade your temple management capabilities
                        </p>
                    </div>
                </div>
            </header>

            {/* Current Status Card */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-10 group-hover:scale-105 transition-transform duration-700">
                    <Award size={120} />
                </div>
                
                <div className="flex items-center gap-6 relative z-10">
                    <div className="h-16 w-16 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-200 shadow-inner">
                        <Star size={32} className="text-primary fill-[var(--primary)]/20" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                           <h2 className="text-xl font-bold text-slate-900">Plan: {tenant?.plan_name || 'Free Trial'}</h2>
                           {tenant?.is_trial && (
                             <span className="px-2 py-0.5 rounded-full bg-amber-50 text-[10px] font-bold text-amber-600 uppercase tracking-wider border border-amber-100">Trial Period</span>
                           )}
                        </div>
                        <p className="text-xs font-medium text-slate-400 mt-1.5 flex items-center gap-2">
                            <Clock size={14} /> 
                            {tenant?.is_trial ? `You have ${trialDaysLeft} days remaining in your free trial.` : 'Your subscription is active and up to date.'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end relative z-10 text-right">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">Subscription Health</p>
                    <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                        <CheckCircle2 size={14} /> Fully Operational
                    </div>
                </div>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, idx) => (
                    <div 
                        key={idx} 
                        className={`bg-white rounded-2xl p-8 border hover:border-primary/30 transition-all duration-300 relative flex flex-col
                            ${plan.popular ? 'border-primary/20 shadow-xl shadow-yellow-900/5 bg-slate-50/20' : 'border-slate-100 shadow-sm'}
                        `}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                                Most Preferred
                            </div>
                        )}

                        <div className="flex-1 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-md
                                    ${plan.color === 'gold' ? 'bg-primary' : 'bg-slate-900'}
                                `}>
                                    <plan.icon size={22} />
                                </div>
                                <div className="text-right">
                                    <div className="flex items-baseline justify-end gap-1">
                                        <span className="text-sm font-bold text-slate-900">₹</span>
                                        <span className="text-3xl font-bold text-slate-900">{plan.price.toLocaleString()}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">per month</p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">
                                    {plan.id === 'LITE' ? 'Perfect for small temples' : plan.id === 'PRO' ? 'Ideal for major Devaswoms' : 'Advanced Institutional Grade'}
                                </p>
                            </div>

                            <ul className="space-y-4 pt-2">
                                {plan.features.map((feature, fidx) => (
                                    <li key={fidx} className="flex items-start gap-3 text-xs font-semibold text-slate-600">
                                        <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-10">
                            <button 
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={loading || tenant?.plan_name === plan.id}
                                className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm
                                    ${tenant?.plan_name === plan.id 
                                        ? 'bg-slate-100 text-slate-400 cursor-default shadow-none' 
                                        : plan.popular 
                                            ? 'bg-slate-900 text-white hover:bg-slate-800' 
                                            : 'bg-white text-slate-900 border border-slate-200 hover:border-primary hover:text-primary'
                                    }
                                `}
                            >
                                {tenant?.plan_name === plan.id 
                                    ? 'Current Plan' 
                                    : loading ? 'Initializing...' : 'Choose Plan'
                                }
                                {tenant?.plan_name !== plan.id && !loading && <ArrowRight size={14} />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="pt-10 border-t border-slate-100 flex flex-col items-center gap-8 text-center">
                <div className="flex items-center gap-10 opacity-40 grayscale hover:grayscale-0 transition-opacity">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" className="h-6" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    <Lock size={12} className="text-emerald-500" /> Secure SSL Encryption Active
                </div>
            </div>
        </div>
    );
}
