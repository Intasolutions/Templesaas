import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import MarketingLayout from './MarketingLayout';

const PricingPage = () => {
    const navigate = useNavigate();

    const handleSelectPlan = (plan) => {
        navigate(`/register?plan=${plan}&is_trial=true`);
    };

    return (
        <MarketingLayout>
            <section className="pt-32 pb-24 md:pt-48 md:pb-40 bg-cream relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(230,81,0,0.04),transparent)]" />
                
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-primary/10 shadow-sm mb-10">
                        <Sparkles size={16} className="text-primary animate-pulse" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-wood/80">Simple Pricing</span>
                    </div>
                    <h1 className="text-5xl md:text-[84px] font-black leading-[0.95] tracking-tight text-wood mb-8">
                        Fair Prices for <br />
                        <span className="text-primary">Every Temple.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-wood/70 font-medium leading-relaxed mb-24 max-w-2xl mx-auto">
                        Choose the plan that fits your temple's daily needs. No hidden charges, just simple software to manage your sacred traditions.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <PricingCard 
                            title="Lite Plan"
                            price="1,500"
                            desc="Perfect for small community temples with one or two counters."
                            features={[
                                "Pooja Receipts (Print/WhatsApp)",
                                "Simple Devotee Records",
                                "Daily Income Report",
                                "Basic Stock Tracking",
                                "Phone Support"
                            ]}
                            onCta={() => handleSelectPlan('LITE')}
                        />

                        <PricingCard 
                            title="Pro Plan"
                            price="2,500"
                            desc="Best for active temples with many poojas and high devotee traffic."
                            features={[
                                "Everything in Lite Plan",
                                "Hundi Collection Audit",
                                "Star-Based Pooja Timings",
                                "TV Screen Displays",
                                "Automatic WhatsApp Alerts",
                                "E-Prasadam Shipping"
                            ]}
                            isFeatured
                            onCta={() => handleSelectPlan('PRO')}
                        />

                        <PricingCard 
                            title="Board Plan"
                            price="3,000"
                            desc="Complete management for large temple boards and multiple branches."
                            features={[
                                "Everything in Pro Plan",
                                "Temple Asset Registry",
                                "Mass Feeding (Annadhanam)",
                                "Staff Attendance System",
                                "Priority 24/7 Support",
                                "Advanced Accounts Audit"
                            ]}
                            onCta={() => handleSelectPlan('MAX')}
                        />
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
};

function PricingCard({ title, price, desc, features, isFeatured, onCta }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-10 md:p-12 rounded-[2.5rem] text-left transition-all duration-500 border ${
            isFeatured 
            ? 'bg-wood border-wood shadow-2xl scale-105 z-20' 
            : 'bg-white border-wood/5 hover:border-primary/20 z-10'
        }`}>
            <h3 className={`text-xl font-black mb-4 tracking-tight uppercase ${isFeatured ? 'text-primary' : 'text-wood'}`}>{title}</h3>
            
            <div className={`flex items-baseline gap-2 mb-6 ${isFeatured ? 'text-white' : 'text-wood'}`}>
                <span className="text-2xl font-bold opacity-40">₹</span>
                <span className="text-6xl font-black tracking-tighter">{price}</span>
                <span className="text-lg font-bold opacity-30">/mo</span>
            </div>

            <p className={`text-sm font-medium leading-relaxed mb-10 min-h-[50px] ${isFeatured ? 'text-white/60' : 'text-wood/50'}`}>
                {desc}
            </p>

            <div className="space-y-5 mb-12">
                {features.map(f => (
                    <div key={f} className="flex items-start gap-4">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isFeatured ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
                            <Check size={12} strokeWidth={4} />
                        </div>
                        <span className={`text-[14px] font-bold tracking-tight ${isFeatured ? 'text-white/80' : 'text-wood/70'}`}>{f}</span>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <button 
                    onClick={onCta}
                    className={`w-full h-16 rounded-full font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg ${
                        isFeatured 
                        ? 'bg-primary text-white hover:bg-orange-700 shadow-primary/20' 
                        : 'bg-wood text-white hover:bg-black shadow-wood/20'
                    }`}
                >
                    Start 3-Day Trial
                </button>
                <button 
                    onClick={() => window.location.href = `/demo?plan=${title.split(' ')[0].toUpperCase()}`}
                    className={`w-full h-14 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all border ${
                        isFeatured 
                        ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                        : 'bg-wood/5 border-wood/5 text-wood/40 hover:bg-wood/10'
                    }`}
                >
                    Book a Demo
                </button>
            </div>
        </motion.div>
    )
}

export default PricingPage;
