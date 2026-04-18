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
    const { tenant, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeRequest, setActiveRequest] = useState(null);
    const [dbPlans, setDbPlans] = useState([]);

    useEffect(() => {
        fetchActiveRequest();
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await api.get('/core/billing/plans/');
            setDbPlans(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchActiveRequest = async () => {
        try {
            const res = await api.get('/core/subscription-requests/');
            const requests = res.data.results || res.data || [];
            // Get the most recent non-paid request
            const pending = requests.find(r => r.status === 'pending' || r.status === 'approved');
            setActiveRequest(pending);
        } catch (err) {
            console.error(err);
        }
    };

    const plans = [
        {
            id: 'LITE',
            name: 'Basic Temple',
            price: 1500,
            icon: ShieldCheck,
            color: 'blue',
            features: ['Digital Receipt Management', 'Devotee Directory', 'Basic Hundi Tracking', 'Email Support', 'Admin Dashboard Access']
        },
        {
            id: 'PRO',
            name: 'Professional Devaswom',
            price: 2500,
            icon: Zap,
            color: 'gold',
            popular: true,
            features: ['Multi-Counter Support', 'Advanced Financial Reports', 'Panchangam Integration', 'SMS & WhatsApp Notifications', 'E-Prasad Shipping Tools', 'Priority Multi-User Access']
        },
        {
            id: 'MAX',
            name: 'Enterprise / Institution',
            price: 3000,
            icon: Gem,
            color: 'slate',
            features: ['Dedicated Support Manager', 'Asset & Inventory Registry', 'Full Audit Logs & History', '24/7 Phone Support', 'Staff Attendance Management', 'Custom Feature Integration']
        }
    ];

    const handleAction = async (plan) => {
        setLoading(true);
        try {
            if (!activeRequest || activeRequest.status === 'rejected') {
                const dbPlan = dbPlans.find(p => p.name === plan.id);
                if (!dbPlan) throw new Error("Plan not found in registry");

                await api.post('/core/subscription-requests/', {
                    plan: dbPlan.id,
                    amount: dbPlan.amount_inr,
                    billing_cycle: 'monthly'
                });
                alert("Request Sent! The SaaS owner will verify your temple shortly.");
                fetchActiveRequest();
                refreshUser();
            } else if (activeRequest.status === 'approved') {
                const res = await api.post('/core/billing/create-order/', { plan_name: plan.id });
                const options = {
                    key: res.data.razorpay_key,
                    amount: res.data.amount,
                    currency: res.data.currency,
                    name: "TempleSaaS",
                    description: `Payment for ${plan.name}`,
                    order_id: res.data.order_id,
                    handler: async (response) => {
                        try {
                            await api.post('/core/billing/verify/', {
                                ...response,
                                plan_name: plan.id
                            });
                            alert("Payment Successful! Your plan is now active.");
                            window.location.reload();
                        } catch (err) {
                            alert("Payment verification failed.");
                        }
                    },
                    prefill: {
                        name: res.data.prefill_name,
                        email: res.data.prefill_email,
                    },
                    theme: { color: "#6366f1" }
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            }
        } catch (err) {
            console.error(err);
            alert("Action failed. Please contact support.");
        } finally {
            setLoading(false);
        }
    };

    const trialDaysLeft = tenant?.trial_ends_at 
    ? Math.max(0, Math.ceil((new Date(tenant.trial_ends_at) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow-900/10">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Billing Command</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Manage lifecycle states and resource allocation</p>
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-10 group-hover:scale-105 transition-transform duration-700">
                    <Award size={120} />
                </div>
                
                <div className="flex items-center gap-6 relative z-10">
                    <div className="h-16 w-16 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-200 shadow-inner">
                        <Star size={32} className="text-primary fill-primary/20" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                           <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Plan: {tenant?.plan_name || 'Free Trial'}</h2>
                           {tenant?.status === 'trial' && (
                             <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-[8px] font-black text-amber-600 uppercase tracking-widest border border-amber-100">Trial Protocol</span>
                           )}
                           {tenant?.status === 'pending_approval' && (
                             <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-[8px] font-black text-blue-600 uppercase tracking-widest border border-blue-100 animate-pulse">Pending Review</span>
                           )}
                           {tenant?.status === 'approved' && (
                             <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-[8px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100">Approved</span>
                           )}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                            <Clock size={14} className="text-primary" /> 
                            {tenant?.status === 'trial' ? `Logic Cycle: ${trialDaysLeft} Solar Days Remaining` : `Lifecycle State: ${tenant?.status?.replace('_', ' ').toUpperCase()}`}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end relative z-10 text-right">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-3">Operational Integrity</p>
                    <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                        <CheckCircle2 size={14} /> System Verified
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, idx) => {
                    const isCurrent = tenant?.plan_name === plan.id || (tenant?.plan_name === 'N/A' && plan.id === 'FREE');
                    const isRequested = activeRequest?.plan_name === plan.id;
                    const canPay = activeRequest?.status === 'approved' && isRequested;
                    const isPending = activeRequest?.status === 'pending' && isRequested;

                    return (
                        <div key={idx} className={`bg-white rounded-[2.5rem] p-10 border transition-all duration-300 relative flex flex-col ${plan.popular ? 'border-primary/20 shadow-2xl shadow-primary/5 bg-slate-50/20' : 'border-slate-100 shadow-sm hover:shadow-xl'}`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/40">
                                    Omega Standard
                                </div>
                            )}

                            <div className="flex-1 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${plan.color === 'gold' ? 'bg-primary' : 'bg-slate-900'}`}>
                                        <plan.icon size={22} />
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-baseline justify-end gap-1">
                                            <span className="text-xs font-black text-slate-900">₹</span>
                                            <span className="text-3xl font-black text-slate-900 tracking-tighter">{plan.price.toLocaleString()}</span>
                                        </div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Solar Cycle</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">{plan.name}</h3>
                                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mt-3">{plan.id === 'LITE' ? 'Standard Protocol' : plan.id === 'PRO' ? 'High Capacity Node' : 'Complete Architecture'}</p>
                                </div>

                                <ul className="space-y-4 pt-2">
                                    {plan.features.map((feature, fidx) => (
                                        <li key={fidx} className="flex items-start gap-3 text-[11px] font-bold text-slate-600">
                                            <div className="h-4 w-4 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5"><Check size={10} className="text-emerald-500" /></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-10">
                                <button 
                                    onClick={() => handleAction(plan)}
                                    disabled={loading || isCurrent || isPending}
                                    className={`w-full h-14 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-sm
                                        ${isCurrent ? 'bg-slate-50 text-slate-300 cursor-default' : 
                                          canPay ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-600/20' :
                                          isPending ? 'bg-slate-100 text-slate-400' :
                                          plan.popular ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 border border-slate-100 hover:border-primary hover:text-primary'}
                                    `}
                                >
                                    {isCurrent ? 'Protocol Active' : 
                                     isPending ? 'Under Review' : 
                                     canPay ? 'Finalize Payment' :
                                     loading ? 'Processing...' : 'Request Protocol Access'}
                                    {!isCurrent && !isPending && !loading && <ArrowRight size={14} />}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="pt-12 border-t border-slate-50 flex flex-col items-center gap-8 text-center">
                <div className="flex items-center gap-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-5" />
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                    <Lock size={12} className="text-emerald-400" /> Secure Encryption Layer Active
                </div>
            </div>
        </div>
    );
}
